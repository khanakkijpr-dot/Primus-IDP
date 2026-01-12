# ===========================================
# Primus IDP - Windows Deployment Script
# ===========================================
# PowerShell script for Windows deployment to VPS

param(
    [Parameter(Mandatory = $false)]
    [string]$Domain = "primusidp.net",
    
    [Parameter(Mandatory = $false)]
    [string]$Email = "admin@primusidp.net",
    
    [Parameter(Mandatory = $false)]
    [string]$VpsHost,
    
    [Parameter(Mandatory = $false)]
    [string]$VpsUser = "root"
)

Write-Host "🚀 Primus IDP Windows Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check for SSH
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ SSH not found. Please install OpenSSH." -ForegroundColor Red
    exit 1
}

if (-not $VpsHost) {
    $VpsHost = Read-Host "Enter your VPS IP or hostname"
}

Write-Host ""
Write-Host "📦 Deployment Configuration:" -ForegroundColor Yellow
Write-Host "   Domain: $Domain"
Write-Host "   Email: $Email"
Write-Host "   VPS: $VpsUser@$VpsHost"
Write-Host ""

$confirm = Read-Host "Continue with deployment? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Generate passwords
$postgresPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
$redisPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
$secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object { [char]$_ })

Write-Host ""
Write-Host "🔐 Generated Credentials (SAVE THESE!):" -ForegroundColor Green
Write-Host "   PostgreSQL: $postgresPassword"
Write-Host "   Redis: $redisPassword"
Write-Host "   Secret Key: $secretKey"
Write-Host ""

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow

$tempDir = Join-Path $env:TEMP "primus-deploy"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy necessary files
Copy-Item -Path "docker-compose.prod.yml" -Destination $tempDir
Copy-Item -Path "primus_idp_backend" -Destination $tempDir -Recurse
Copy-Item -Path "primus_idp_web" -Destination $tempDir -Recurse
Copy-Item -Path "scripts/deploy.sh" -Destination $tempDir

# Create .env file
@"
DOMAIN=$Domain
ACME_EMAIL=$Email
POSTGRES_USER=primus
POSTGRES_PASSWORD=$postgresPassword
POSTGRES_DB=primus_idp
REDIS_PASSWORD=$redisPassword
SECRET_KEY=$secretKey
"@ | Out-File -FilePath (Join-Path $tempDir ".env") -Encoding utf8

# Create archive
$archivePath = Join-Path $env:TEMP "primus-deploy.tar.gz"
Write-Host "📦 Creating archive..." -ForegroundColor Yellow

Push-Location $tempDir
tar -czf $archivePath *
Pop-Location

# Upload to VPS
Write-Host "📤 Uploading to VPS..." -ForegroundColor Yellow
scp $archivePath "${VpsUser}@${VpsHost}:/tmp/"

# Deploy on VPS
Write-Host "🚀 Deploying on VPS..." -ForegroundColor Yellow
$deployScript = @"
cd /opt
rm -rf primus-idp
mkdir -p primus-idp
cd primus-idp
tar -xzf /tmp/primus-deploy.tar.gz
chmod +x deploy.sh
./deploy.sh
"@

ssh "${VpsUser}@${VpsHost}" $deployScript

# Cleanup
Remove-Item -Force $archivePath
Remove-Item -Recurse -Force $tempDir

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "🌐 Frontend: https://$Domain" -ForegroundColor Cyan
Write-Host "🔧 API Docs: https://api.$Domain/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "👤 Default Admin:" -ForegroundColor Yellow
Write-Host "   Email: admin@$Domain"
Write-Host "   Password: PrimusAdmin2024!"
Write-Host ""
Write-Host "⚠️  IMPORTANT: Change the admin password immediately!" -ForegroundColor Red
