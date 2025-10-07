# Test Authentication Endpoints

Write-Host "=== Testing Authentication Endpoints ===" -ForegroundColor Green

# Test 1: Register a new user
Write-Host "`n1. Testing User Registration..." -ForegroundColor Yellow
$registerData = @{
    fullName = "John Doe"
    email = "john.doe@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:5050/api/v1/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "Registration Status: $($registerResponse.StatusCode)" -ForegroundColor Green
    $registerResult = $registerResponse.Content | ConvertFrom-Json
    Write-Host "Registration Response: $($registerResult.message)"
    
    if ($registerResult.success) {
        $nextAuthSecret = $registerResult.data.nextAuthSecret
        Write-Host "NextAuth Secret: $nextAuthSecret" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Registration Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody" -ForegroundColor Red
    }
}

# Test 2: Login user
Write-Host "`n2. Testing User Login..." -ForegroundColor Yellow
$loginData = @{
    email = "john.doe@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5050/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "Login Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    Write-Host "Login Response: $($loginResult.message)"
    
    if ($loginResult.success) {
        $nextAuthSecret = $loginResult.data.nextAuthSecret
        Write-Host "NextAuth Secret: $nextAuthSecret" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Login Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody" -ForegroundColor Red
    }
}

# Test 3: Validate session
Write-Host "`n3. Testing Session Validation..." -ForegroundColor Yellow
if ($nextAuthSecret) {
    $sessionData = @{
        nextAuthSecret = $nextAuthSecret
    } | ConvertTo-Json

    try {
        $sessionResponse = Invoke-WebRequest -Uri "http://localhost:5050/api/v1/auth/validate-session" -Method POST -Body $sessionData -ContentType "application/json"
        Write-Host "Session Validation Status: $($sessionResponse.StatusCode)" -ForegroundColor Green
        $sessionResult = $sessionResponse.Content | ConvertFrom-Json
        Write-Host "Session Validation Response: $($sessionResult.message)"
    } catch {
        Write-Host "Session Validation Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error Response: $responseBody" -ForegroundColor Red
        }
    }
}

# Test 4: Get current user profile
Write-Host "`n4. Testing Get Current User..." -ForegroundColor Yellow
if ($nextAuthSecret) {
    try {
        $headers = @{
            "x-nextauth-secret" = $nextAuthSecret
        }
        $profileResponse = Invoke-WebRequest -Uri "http://localhost:5050/api/v1/auth/me" -Method GET -Headers $headers
        Write-Host "Profile Status: $($profileResponse.StatusCode)" -ForegroundColor Green
        $profileResult = $profileResponse.Content | ConvertFrom-Json
        Write-Host "Profile Response: $($profileResult.message)"
    } catch {
        Write-Host "Profile Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error Response: $responseBody" -ForegroundColor Red
        }
    }
}

# Test 5: Google OAuth login
Write-Host "`n5. Testing Google OAuth Login..." -ForegroundColor Yellow
$googleData = @{
    email = "jane.doe@gmail.com"
    fullName = "Jane Doe"
    providerId = "google_123456789"
    avatarUrl = "https://example.com/avatar.jpg"
} | ConvertTo-Json

try {
    $googleResponse = Invoke-WebRequest -Uri "http://localhost:5050/api/v1/auth/google-login" -Method POST -Body $googleData -ContentType "application/json"
    Write-Host "Google Login Status: $($googleResponse.StatusCode)" -ForegroundColor Green
    $googleResult = $googleResponse.Content | ConvertFrom-Json
    Write-Host "Google Login Response: $($googleResult.message)"
} catch {
    Write-Host "Google Login Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Authentication Tests Complete ===" -ForegroundColor Green


