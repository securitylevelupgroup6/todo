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
        }else{
            return validationResults;
        }
    }
}