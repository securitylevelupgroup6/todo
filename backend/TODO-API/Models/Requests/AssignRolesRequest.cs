namespace TODO_API.Models.Requests;
public class AssignRolesRequest
{
    public List<int> RoleIds { get; set; } = new();
}
