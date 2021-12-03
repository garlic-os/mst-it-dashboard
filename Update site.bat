@echo off

echo Updating IT Dashboard to the latest version...

@echo on
set PATH=%PATH%;C:\Program Files\Git\bin
git checkout previous-version
git pull origin main
git checkout main
git pull origin develop
@echo off

echo.
echo Done.
echo If anything catches on fire, run "Revert update.bat".
echo.
echo Press any key to exit...
pause > nul
