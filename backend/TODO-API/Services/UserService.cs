using TODO_API.Models;
using TODO_API.Repositories;
using Microsoft.AspNetCore.DataProtection;
using OtpNet;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using TODO_API.Common;
using System.Text;
using System.Security.Cryptography;
using BCrypt.Net;
using System.Text.Json;

namespace TODO_API.Services;

public enum RegistrationResult
{
    Success,
    UsernameAlreadyTaken,
    InvalidPassword,
    DatabaseError,
    UnknownError
}

public enum LoginResult
{
    Success,
    UsernameDoesNotExist,
    IncorrectPassword,
    OtpFailed,
    DatabaseError,
    UnknownError
}

public class UserService(TodoContext dbContext, IDataProtectionProvider provider)
{
    private readonly IDataProtectionProvider _provider = provider;


    private readonly TodoContext _todoContext = dbContext;


    private User? GetUser(string username)
    {
        return dbContext.Users.Include(u => u.refreshTokens).FirstOrDefault(u => u.Username == username);
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
        var user = _todoContext.Users.FirstOrDefault(x => x.Username == username);
        if (user == null)
        {
            throw new Exception("Attempt to create jwt for non-existent user.");
        }
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

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
            user.refreshTokens.Add(new RefreshToken { RefreshTokenHash = refreshTokenHash, ExpiresAt = DateTime.Now.AddDays(85).ToUniversalTime(), User = user });
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
        var user = _todoContext.Users.Include(u => u.refreshTokens).FirstOrDefault(u => u.Id.ToString() == jwtToken.Subject.ToString());
        var matchedToken = user?.refreshTokens.Where(encryptedToken => BCrypt.Net.BCrypt.Verify(refreshToken, encryptedToken.RefreshTokenHash)).FirstOrDefault();

        if (user == null || matchedToken == null || matchedToken?.ExpiresAt <= DateTime.UtcNow)
        {
            // something is not lekka
            return null;
        }

        // this is a valid refresh token so refresh the token
        return CreateJwt(user.Username);
    }

    public RegistrationResult RegisterUser(string username, string password, string firstName, string lastName, out OtpUri? otpUri)
    {
        // Ensure the username is not already in use
        if (_todoContext.Users.Any(u => u.Username == username))
        {
            otpUri = null;
            return RegistrationResult.UsernameAlreadyTaken;
        }

        if (!IsPasswordStrongEnough(password))
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
            otpUri = new OtpUri(OtpType.Totp, totpSecretKey, "TODO-APP");
        }
        catch (DbUpdateException exception)
        {
            // this should be logged with a logger
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

    private static bool IsPasswordStrongEnough(string password)
    {
        return password.Length >= 8 &&
               password.Any(char.IsUpper) &&
               password.Any(char.IsLower) &&
               password.Any(char.IsDigit);
    }
}
