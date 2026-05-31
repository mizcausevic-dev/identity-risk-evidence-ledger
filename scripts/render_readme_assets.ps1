$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $graphics.DrawString("Identity Risk Evidence Ledger", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.FillEllipse($altAccentBrush, 114, $y + 12, 10, 10)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof-v2.png") `
    -Title "Overview proof" `
    -Subtitle "Board-ready identity exposure, evidence quality, and diligence posture in one executive control surface." `
    -Bullets @(
        "Privileged access, guest exposure, service-account drift, and review coverage stay visible together.",
        "Exposed-account counts roll up into one board-facing score before the trust story drifts.",
        "Every lane stays tied to an operator-safe memo packet."
    )

New-ProofImage -Path (Join-Path $screenshots "02-identity-lane-proof-v2.png") `
    -Title "Identity lane" `
    -Subtitle "Each lane keeps owner, exposure focus, status, and next action visible." `
    -Bullets @(
        "Privileged, guest, service-account, and board-evidence lanes stay separated cleanly.",
        "Current posture remains readable at a glance.",
        "Next actions stay executive-safe and audit-readable."
    )

New-ProofImage -Path (Join-Path $screenshots "03-risk-evidence-proof-v2.png") `
    -Title "Risk evidence" `
    -Subtitle "Findings tie severity, evidence family, owner, and executive impact into one scoring view." `
    -Bullets @(
        "High-severity identity findings surface first.",
        "Leaders can tie risk back to privileged access, guest exposure, and service-account posture quickly.",
        "The scorecard is grounded in real executive-intelligence and identity-governance primitives."
    )

New-ProofImage -Path (Join-Path $screenshots "04-board-memo-proof-v2.png") `
    -Title "Board memo" `
    -Subtitle "Packets tie score, evidence, blocker, owner, and board-story timing together." `
    -Bullets @(
        "Top blockers, next control call, and executive timing stay visible.",
        "Red and yellow posture remains easy to scan.",
        "The system is shaped for board-ready identity, diligence, and trust proof."
    )
