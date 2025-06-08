using Microsoft.AspNetCore.SignalR;
using TODO_API.Models;

namespace TODO_API.Common;

public static class Roles
{
    public const string ADMIN = "ADMIN";
    public const string TEAMLEAD = "TEAM_LEAD";
    public const string USER = "USER";

    public static List<string> GetRoles()
    {
        return [ADMIN, TEAMLEAD, USER];
    }
}

public class States
{
    public const string CREATED = "CREATED";
    public const string COMPLETED = "COMPLETED";
    public const string INPROGRESS = "IN_PROGRESS";

    public static List<string> GetStates()
    {
        return [CREATED, COMPLETED, INPROGRESS];
    }
}