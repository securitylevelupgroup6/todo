using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OtpNet;
using TODO_API.Common;
using TODO_API.Models;
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
        .WithTags("Login");

        endpoints.MapGet("/auth/refresh", RefreshHandler)
        .WithName("Refresh Token")
        .WithTags("Refresh");

        endpoints.MapGet("/auth/logout", LogoutUserHandler)
        .WithName("Logout")
        .WithTags("Logout");

        endpoints.MapGet("auth/protected", ProtectedHandler);

        endpoints.MapGet("auth/authorized", AuthorizedHandler);

        return endpoints;
    }


    [Authorize]
    public static IResult ProtectedHandler()
    {
        return Results.Ok("this is a authenticated endpoint");
    }

    [Authorize(Roles = "USER")]
    public static IResult AuthorizedHandler()
    {
        return Results.Ok("This is an authorized endpoint");
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
            return Results.Ok();
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

