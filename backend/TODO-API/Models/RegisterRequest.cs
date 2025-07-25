namespace TODO_API.Models;
using System.ComponentModel.DataAnnotations;
public class RegisterUserRequest
{
    [Required(ErrorMessage = "Username is required.")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(50, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 50 characters.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required.")]
    [StringLength(255, MinimumLength = 1, ErrorMessage = "First name must be between 1 and 50 characters.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required.")]
    [StringLength(255, MinimumLength = 1, ErrorMessage = "Last name must be between 1 and 50 characters.")]
    public string LastName { get; set; } = string.Empty;
}
