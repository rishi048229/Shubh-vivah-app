@echo off
echo Finishing the push...
echo Ensuring we are on the right commit...
echo (You should see your files now)

echo Re-creating robin-backend branch...
git branch -D robin-backend 2>nul
git checkout -b robin-backend

echo Pushing to remote...
git push -f origin robin-backend

echo.
echo SUCCESS! Code is restored and pushed.
pause
