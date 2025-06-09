# CORS Troubleshooting Guide

## Changes Made to Fix CORS Issues

### Problem
CORS errors when frontend (`http://localhost:4200`) tries to connect to hosted API (`https://todo.pastpaperportal.co.za`). The error showed "no response headers at all" which indicates the request wasn't reaching the .NET application properly.

### Root Causes Identified

1. **Multiple CORS Policy Conflicts**: The original `Program.cs` had:
   - Two separate `builder.Services.AddCors()` calls
   - Two separate `app.UseCors()` calls with different policy names
   - This created conflicts and unpredictable behavior

2. **Missing `AllowCredentials()`**: 
   - Frontend uses `withCredentials: true` for cookie-based authentication
   - Backend CORS policy must include `AllowCredentials()` to support this
   - Without this, the browser blocks the request

3. **Wrong Frontend API URL**:
   - Environment files were pointing to `http://localhost:5079` and `/api`
   - Should point to `https://todo.pastpaperportal.co.za`

### Solutions Applied

#### 1. Backend Changes (`Program.cs`)

**Before:**
```csharp
// Multiple conflicting CORS policies
builder.Services.AddCors(options => {
    options.AddPolicy("AllowLocalhost", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
              // Missing .AllowCredentials()
    });
});

// ... later ...

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngularDevelopmentServer", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
              // Missing .AllowCredentials()
    });
});

// Multiple CORS middleware applications
app.UseCors("AllowAngularDevelopmentServer");
// ... other middleware ...
app.UseCors("AllowLocalhost");
```

**After:**
```csharp
// Single, comprehensive CORS policy
var localFrontendOrigin = "http://localhost:4200";
var productionFrontendOrigin = "https://todo.pastpaperportal.co.za";

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(localFrontendOrigin, productionFrontendOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Essential for cookie-based auth
    });
});

// Single CORS middleware application in correct order
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
```

#### 2. Frontend Changes

**Environment Files Updated:**
```typescript
// frontend/src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://todo.pastpaperportal.co.za'  // Changed from localhost:5079
};

// frontend/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://todo.pastpaperportal.co.za'  // Changed from '/api'
};
```

### Key CORS Requirements for Cookie-Based Authentication

1. **Frontend must use `withCredentials: true`** ✅ (Already implemented in auth.interceptor.ts)
2. **Backend must use `AllowCredentials()`** ✅ (Now implemented)
3. **Cannot use wildcard origins (`*`) with credentials** ✅ (Using specific origins)
4. **Must specify exact origins** ✅ (Both localhost and production domain)
5. **Correct middleware order** ✅ (Routing → CORS → Auth)

### Testing Steps

1. **Redeploy Backend**: The `Program.cs` changes need to be deployed to your server
2. **Restart Frontend**: Run `ng serve` to pick up environment changes
3. **Test Login Flow**: Try logging in from `http://localhost:4200`
4. **Check Browser Network Tab**: Should now see proper CORS headers in response

### Expected Headers After Fix

When the fix is working, you should see these headers in the browser's Network tab:

```
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, etc.
```

### Additional Debugging

If issues persist after these changes:

1. **Check Nginx Logs on Server**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

2. **Check .NET Application Logs**:
   ```bash
   sudo journalctl -f -u todo-api
   ```

3. **Test Direct API Call**: Use curl to test if the API responds:
   ```bash
   curl -X OPTIONS https://todo.pastpaperportal.co.za/auth/login \
        -H "Origin: http://localhost:4200" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -v
   ```

### Potential Nginx Issues

If the problem persists, the Nginx configuration in `start.sh` might need adjustment. The current config has a nested `location /` block that could be problematic:

```nginx
# Current (potentially problematic)
location / {
    proxy_pass http://localhost:5000;
    # ... headers ...
    location / {  # This nested block is unusual
        proxy_pass http://localhost:5000;
        proxy_set_header Origin $http_origin;
        proxy_buffering off;
    }
}

# Should be simplified to:
location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Next Steps

1. Deploy the backend changes
2. Test the frontend
3. If still having issues, check server logs as outlined above
4. Consider simplifying the Nginx config if necessary
