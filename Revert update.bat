@echo off

echo Reverting update...

@echo on
set PATH=%PATH%;C:\Program Files\Git\bin
git checkout previous-version
@echo off

echo.
echo Done.
echo Press any key to exit...
pause > nul
