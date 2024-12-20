@echo off

echo Updating IT Dashboard to the latest version...

@echo on
set PATH=%PATH%;C:\Program Files\Git\bin
git checkout previous-version || goto :error
pause
git pull origin main || goto :error
pause
git checkout main || goto :error
pause
pause
git pull origin develop || goto :error
@echo off

echo.
echo Done.
echo If anything catches on fire, run "Revert update.bat".
echo.
echo Press any key to exit...
pause > nul
goto :EOF

:error
@echo off
echo.
echo An error occurred.
echo Press any key to exit...
pause > nul
goto :EOF

:EOF