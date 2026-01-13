@echo off
echo Starting Deployment to GitHub Pages...
echo.
call npm run deploy
echo.
if %ERRORLEVEL% EQU 0 (
    echo Deployment process finished successfully!
) else (
    echo Deployment failed with error code %ERRORLEVEL%
)
pause
