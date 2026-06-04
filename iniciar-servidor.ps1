# ══════════════════════════════════════════════════════════════════
# ARRANQUE DEL SERVIDOR — GestiónFinanciera IES Cantillana
# Doble clic o ejecutar desde PowerShell normal (sin admin)
# ══════════════════════════════════════════════════════════════════

$puerto = 8788
$directorio = "C:\Users\anton\gestion-financiera-ies-cantillana"

Clear-Host
Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║       GestiónFinanciera · IES Cantillana                ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Obtener IP WiFi ────────────────────────────────────────────────
$ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"
}
$ipWifi = ($ips | Where-Object { $_.InterfaceAlias -like "*Wi*" } | Select-Object -First 1).IPAddress
if (-not $ipWifi) {
    $ipWifi = ($ips | Select-Object -First 1).IPAddress
}
if (-not $ipWifi) { $ipWifi = "localhost" }

# ── Comprobar firewall ─────────────────────────────────────────────
$regla = Get-NetFirewallRule -DisplayName "GestionFinanciera-8788" -ErrorAction SilentlyContinue
if (-not $regla) {
    Write-Host "  ⚠  El puerto 8788 no está abierto en el firewall." -ForegroundColor Yellow
    Write-Host "     Ejecuta 'setup-red-centro.ps1' como Administrador primero." -ForegroundColor Yellow
    Write-Host ""
}

# ── Mostrar URLs ───────────────────────────────────────────────────
Write-Host "  Servidor iniciando en el puerto $puerto..." -ForegroundColor White
Write-Host ""
Write-Host "  ┌─ ACCESO DESDE ESTE ORDENADOR ──────────────────────────┐" -ForegroundColor DarkGray
Write-Host "     http://localhost:$puerto" -ForegroundColor White
Write-Host "  └────────────────────────────────────────────────────────┘" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  ┌─ ACCESO DESDE LOS ALUMNOS (WiFi del centro) ───────────┐" -ForegroundColor Green
Write-Host "     http://$($ipWifi):$puerto" -ForegroundColor Yellow
Write-Host "  └────────────────────────────────────────────────────────┘" -ForegroundColor Green
Write-Host ""
Write-Host "  ℹ  Escribe esta URL en la pizarra para que los alumnos" -ForegroundColor DarkGray
Write-Host "     la introduzcan en su navegador (Chrome recomendado)." -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Pulsa Ctrl+C para detener el servidor." -ForegroundColor DarkGray
Write-Host "  ──────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# ── Iniciar servidor ───────────────────────────────────────────────
Set-Location $directorio
python -m http.server $puerto --bind 0.0.0.0
