using System.ComponentModel.DataAnnotations;

namespace TODO_API.Common;
public static class RequestValidator
{
    public static List<ValidationResult>? Validate(Object model)
    {
        ArgumentNullException.ThrowIfNull(model);
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(model);

        if (Validator.TryValidateObject(model, validationContext, validationResults, true))
        {
            return null;
        }

        return validationResults;
    }

    public static bool IsPasswordStrongEnough(string password)
    {
        return password.Length >= 8 &&
               password.Any(char.IsUpper) &&
               password.Any(char.IsLower) &&
               password.Any(char.IsDigit);
    }
}