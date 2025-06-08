using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OtpNet;
using TODO_API.Common;
using TODO_API.Models;
using TODO_API.Models.Requests;
using TODO_API.Services;
namespace TODO_API.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder AddAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/auth/register", RegisterUserHandler)
        .WithName("Register User")
        .WithTags("Register");

        endpoints.MapPost("/auth/login", LoginUserHandler)
        .WithName("Login User")
        .WithTags("Login")
        .Produces(StatusCodes.Status200OK, typeof(UserRecord));
        

        endpoints.MapGet("/auth/refresh", RefreshHandler)
        .WithName("Refresh Token")
        .WithTags("Refresh");

        endpoints.MapGet("/auth/logout", LogoutUserHandler)
        .WithName("Logout")
        .WithTags("Logout");

        endpoints.MapPut("/auth/password-reset", PasswordResetHandler)
        .WithName("Password Reset")
        .WithTags("PasswordReset");

        return endpoints;
    }

    public static IResult RefreshHandler(HttpContext http, UserService userService, HttpResponse response)
    {
        var jwt = http.Request.Cookies["access_token"];
        var refreshToken = http.Request.Cookies["refresh_token"];
        if (jwt == null || refreshToken == null)
        {
            return Results.BadRequest("No refresh token and/or existing jwt");
        }

        var newToken = userService.RefreshAccessToken(jwt, refreshToken);
        if (newToken == null)
        {
            // the token was not refreshed for whatever reason, delete the cookies since they have to login again now
            response.Cookies.Delete("access_token");
            response.Cookies.Delete("refresh_token");
            return Results.Unauthorized();
        }
        else
        {
            response.Cookies.Append("access_token", newToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(85)
            });
            return Results.Ok();
        }
    }

    public static IResult LoginUserHandler([FromBody] LoginRequest loginUserRequest, HttpContext http, UserService userService)
    {
        var errorResults = RequestValidator.Validate(loginUserRequest);
        if (errorResults != null)
        {
            return Results.BadRequest(new { Errors = errorResults });
        }

        var loginResult = userService.ValidateUserCredentials(loginUserRequest.Username, loginUserRequest.Password, loginUserRequest.Otp, out string? refreshToken);
        if (loginResult == LoginResult.Success && refreshToken != null)
        {
            var jwt = userService.CreateJwt(loginUserRequest.Username);
            http.Response.Cookies.Append("access_token", jwt, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(85)
            });

            http.Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(85)
            });
            var user = userService.GetUser(loginUserRequest.Username);
            if (user == null) {
                return Results.InternalServerError();
            }
            var userRecord = new UserRecord(user.Id, user.Username, user.FirstName, user.LastName, [.. user.UserRoles.Select(x => x.Role.Name)]);
            return Results.Ok(userRecord);
        }

        return loginResult switch
        {
            LoginResult.UnknownError => Results.InternalServerError(),
            _ => Results.Unauthorized(),
        };
    }


    public static IResult LogoutUserHandler(HttpContext http, UserService userService)
    {
        
        var jwt = http.Request.Cookies["access_token"];
        var refreshToken = http.Request.Cookies["refresh_token"];
        if (jwt == null || refreshToken == null)
        {
            return Results.BadRequest("No refresh token and/or existing jwt");
        }

        if (userService.Logout(jwt, refreshToken))
        {
            http.Response.Cookies.Delete("access_token");
            http.Response.Cookies.Delete("refresh_token");
            return Results.Ok();
        }
        else
        {
            return Results.Unauthorized();
        }
    }

    [Authorize(Roles = Roles.ADMIN)]
    public static IResult PasswordResetHandler([FromBody] PasswordResetRequest request, UserService userService)
    {
        var result = userService.ResetPassword(request);
        // TODO add logging for the database error and the unknown error case
        return result switch
        {
            ResetPasswordResult.Success => Results.Ok(),
            ResetPasswordResult.UserDoesNotExist => Results.BadRequest(new { Error = "The user provided does not exist." }),
            ResetPasswordResult.InvalidPassword => Results.BadRequest(new { Error = "The password provided is not strong enough." }),
            _ => Results.InternalServerError(),
        };
    }

    public static IResult RegisterUserHandler([FromBody] RegisterUserRequest request, UserService userService)
    {
        var errorResults = RequestValidator.Validate(request);
        if (errorResults != null)
        {
            return Results.BadRequest(new { Errors = errorResults });
        }

        var result = userService.RegisterUser(request.Username, request.Password, request.FirstName, request.LastName, out OtpUri? otpUri);
        return result switch
        {
            RegistrationResult.Success => Results.Ok(new { OtpUri = otpUri?.ToString() }),
            RegistrationResult.UsernameAlreadyTaken => Results.Conflict(new { Error = "Username already taken." }),
            RegistrationResult.InvalidPassword => Results.BadRequest(new { Error = "Invalid password." }),
            _ => Results.InternalServerError("Something went wrong while trying to register."),
        };
    }
}

