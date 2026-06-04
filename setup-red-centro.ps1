# ══════════════════════════════════════════════════════════════════
# CONFIGURACIÓN ACCESO RED WIFI DEL CENTRO — GestiónFinanciera
# Ejecutar UNA SOLA VEZ como Administrador
# Clic derecho → "Ejecutar con PowerShell como administrador"
# ══════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "  GestiónFinanciera IES Cantillana — Configuración de red" -ForegroundColor Cyan
Write-Host "  ─────────────────────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""

# ── 1. Regla firewall puerto 8788 ──────────────────────────────────
$regla = Get-NetFirewallRule -DisplayName "GestionFinanciera-8788" -ErrorAction SilentlyContinue
if ($regla) {
    Write-Host "  ✓ Regla de firewall ya existente para puerto 8788" -ForegroundColor Green
} else {
    New-NetFirewallRule `
        -DisplayName "GestionFinanciera-8788" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 8788 `
        -Action Allow `
        -Profile Private,Domain `
        -Description "Servidor HTTP Gestion Financiera IES Cantillana - acceso WiFi del centro" | Out-Null
    Write-Host "  ✓ Regla de firewall creada para puerto 8788" -ForegroundColor Green
}

# ── 2. Verificar Python disponible ────────────────────────────────
try {
    $pyver = python --version 2>&1
    Write-Host "  ✓ Python disponible: $pyver" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python no encontrado. Instala Python 3 desde python.org" -ForegroundColor Red
}

# ── 3. Mostrar IP actual ───────────────────────────────────────────
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"
} | Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "  ║  Configuración completada.                           ║" -ForegroundColor Yellow
Write-Host "  ║  URL para los alumnos:                               ║" -ForegroundColor Yellow
Write-Host "  ║                                                      ║" -ForegroundColor Yellow
Write-Host "  ║    http://$($ip):8788                      " -ForegroundColor White -NoNewline; Write-Host "          ║" -ForegroundColor Yellow
Write-Host "  ║                                                      ║" -ForegroundColor Yellow
Write-Host "  ║  Usa 'iniciar-servidor.ps1' para arrancar la app.   ║" -ForegroundColor Yellow
Write-Host "  ╚══════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Presiona Enter para cerrar..." -ForegroundColor DarkGray
Read-Host
