using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OtpNet;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TODO_API.Common;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Repositories;

namespace TODO_API.Services;

public class UserService(TodoContext dbContext, IDataProtectionProvider provider)
{
    private readonly IDataProtectionProvider _provider = provider;


    private readonly TodoContext _todoContext = dbContext;

    public User? GetUser(string username)
    {
        return dbContext.Users.Include(u => u.RefreshTokens).Include(u => u.UserRoles).ThenInclude(ur => ur.Role).FirstOrDefault(u => u.Username == username);
    }

    public LoginResult ValidateUserCredentials(string username, string password, string otp, out string? refreshToken)
    {
        var user = GetUser(username);
        if (user == null)
        {
            refreshToken = null;
            return LoginResult.UsernameDoesNotExist;
        }

        if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            refreshToken = null;
            return LoginResult.IncorrectPassword;
        }

        var decryptedOtpSecret = _provider.CreateProtector("TotpSecrets").Unprotect(user.TwoFactorKey);
        var totp = new Totp(Base32Encoding.ToBytes(decryptedOtpSecret));
        if (!totp.VerifyTotp(otp, out long timestep))
        {
            refreshToken = null;
            return LoginResult.OtpFailed;
        }

        // Create a refresh token for the user
        refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var refreshTokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);
        if (!AddRefreshToken(user, refreshTokenHash))
        {
            return LoginResult.UnknownError;
        }
        return LoginResult.Success;
    }

    public string CreateJwt(string username)
    {
        var user = GetUser(username) ?? throw new UserNotFoundException();
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };
        var roleClaims = user.UserRoles
        .Select(ur => new Claim(ClaimTypes.Role, ur.Role.Name));
        claims = [.. claims, .. roleClaims];

        var token = new JwtSecurityToken(
            issuer: EnvironmentConfiguration.JwtIssuer,
            audience: EnvironmentConfiguration.JwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(EnvironmentConfiguration.JwtKey)), SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private bool AddRefreshToken(User user, string refreshTokenHash)
    {
        try
        {
            user.RefreshTokens.Add(new RefreshToken { RefreshTokenHash = refreshTokenHash, ExpiresAt = DateTime.Now.AddDays(85).ToUniversalTime(), User = user, Revoked = false });
            _todoContext.SaveChanges();
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }

    public string? RefreshAccessToken(string jwt, string refreshToken)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(jwt);

        // get the user from the jwt
        var user = _todoContext.Users.Include(u => u.RefreshTokens).FirstOrDefault(u => u.Id.ToString() == jwtToken.Subject.ToString());
        var matchedToken = user?.RefreshTokens.Where(encryptedToken => BCrypt.Net.BCrypt.Verify(refreshToken, encryptedToken.RefreshTokenHash) && !encryptedToken.Revoked).FirstOrDefault();

        if (user == null || matchedToken == null || matchedToken?.ExpiresAt <= DateTime.UtcNow)
        {
            // someone is using an expired/revoked refresh token or the user does not have any refresh tokens at all, definitely do not refresh the token!
            return null;
        }

        // this is a valid refresh token so refresh the token
        return CreateJwt(user.Username);
    }

    public ResetPasswordResult ResetPassword(PasswordResetRequest request)
    {
        var user = _todoContext.Users.FirstOrDefault(u => u.Id == request.UserId);
        if (user == null)
        {
            return ResetPasswordResult.UserDoesNotExist;
        }

        if (!RequestValidator.IsPasswordStrongEnough(request.NewPassword))
        {
            return ResetPasswordResult.InvalidPassword;
        }

        user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        try
        {
            _todoContext.SaveChanges();
        }
        catch (DbUpdateException ex)
        {
            Console.WriteLine(ex);
            return ResetPasswordResult.DatabaseError;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return ResetPasswordResult.UnknownError;
        }
        return ResetPasswordResult.Success;
    }


    public void AddRoles(string username, List<int> roleIds)
    {
        User user = GetUser(username) ?? throw new UserNotFoundException();
        roleIds.ForEach(rid =>
        {
            if (!user.UserRoles.Any(ur => ur.RoleId == rid))
            {
                // only add the role if it doesn't exist already
                user.UserRoles.Add(new UserRole { RoleId = rid, UserId = user.Id });
                _todoContext.SaveChanges();
            }
        });
    }

    public bool Logout(string jwt, string refreshToken)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(jwt);

        var user = _todoContext.Users.Include(u => u.RefreshTokens).FirstOrDefault(u => u.Id.ToString() == jwtToken.Subject.ToString());

        // this is the refresh token that the user is currently logged in with
        var matchedToken = user?.RefreshTokens.Where(encryptedToken => BCrypt.Net.BCrypt.Verify(refreshToken, encryptedToken.RefreshTokenHash) && !encryptedToken.Revoked).FirstOrDefault();
        if (matchedToken == null || user == null)
        {
            return false;
        }

        // revoke the token
        matchedToken.Revoked = true;
        _todoContext.SaveChanges();
        return true;
    }

    public RegistrationResult RegisterUser(string username, string password, string firstName, string lastName, out OtpUri? otpUri)
    {
        // Ensure the username is not already in use
        if (_todoContext.Users.Any(u => u.Username == username))
        {
            otpUri = null;
            return RegistrationResult.UsernameAlreadyTaken;
        }

        if (!RequestValidator.IsPasswordStrongEnough(password))
        {
            otpUri = null;
            return RegistrationResult.InvalidPassword;
        }
        try
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            var totpSecretKey = Base32Encoding.ToString(KeyGeneration.GenerateRandomKey(20));
            var encryptedSecret = _provider.CreateProtector("TotpSecrets").Protect(totpSecretKey);

            User user = new() { FirstName = firstName, LastName = lastName, Password = passwordHash, TwoFactorKey = encryptedSecret, Username = username };
            _todoContext.Users.Add(user);
            _todoContext.SaveChanges();

            // TODO: Uncomment this before demo!!!!!!!
            // Role role = _todoContext.Roles.FirstOrDefault(r => r.Name == "USER") ?? throw new RoleNotFoundException();
            // UserRole defaultRole = new() { RoleId = role.Id, UserId = user.Id };
            // user.UserRoles = [defaultRole];

            Role userRole = _todoContext.Roles.FirstOrDefault(r => r.Name == Roles.USER) ?? throw new RoleNotFoundException();
            Role adminRole = _todoContext.Roles.FirstOrDefault(r => r.Name == Roles.ADMIN) ?? throw new RoleNotFoundException();
            Role tlRole = _todoContext.Roles.FirstOrDefault(r => r.Name == Roles.TEAMLEAD) ?? throw new RoleNotFoundException();

            UserRole URole = new() { RoleId = userRole.Id, UserId = user.Id };
            UserRole ARole = new() { RoleId = adminRole.Id, UserId = user.Id };
            UserRole TLRole = new() { RoleId = tlRole.Id, UserId = user.Id };

            user.UserRoles = [URole, ARole, TLRole];

            _todoContext.SaveChanges();

            otpUri = new OtpUri(OtpType.Totp, totpSecretKey, "TODO-APP");
        }
        catch (DbUpdateException exception)
        {
            Console.WriteLine(exception.StackTrace);
            otpUri = null;
            return RegistrationResult.DatabaseError;
        }
        catch (Exception e)
        {
            Console.WriteLine(e.StackTrace);
            otpUri = null;
            return RegistrationResult.UnknownError;
        }
        return RegistrationResult.Success;
    }

    public List<string> GetRoles(string jwt)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(jwt);
        var user = _todoContext.Users.Include(u => u.UserRoles).ThenInclude(ur=>ur.Role).FirstOrDefault(u => u.Id.ToString() == jwtToken.Subject.ToString()) ?? throw new UserNotFoundException();
        return [.. user.UserRoles.Select(ur => ur.Role.Name)];
    }
}
