@echo off
echo STARTING PUSH PROCESS > push_log.txt
echo --------------------------------------------------- >> push_log.txt

echo [DEBUG] Current Status: >> push_log.txt
git status >> push_log.txt 2>&1

echo [DEBUG] Remotes: >> push_log.txt
git remote -v >> push_log.txt 2>&1

echo. >> push_log.txt
echo [ACTION] Checking out robin-backend branch... >> push_log.txt
git checkout -B robin-backend >> push_log.txt 2>&1

echo. >> push_log.txt
echo [ACTION] Adding all files... >> push_log.txt
git add . >> push_log.txt 2>&1

echo. >> push_log.txt
echo [ACTION] Committing... >> push_log.txt
git commit -m "Saving work to robin-backend" >> push_log.txt 2>&1

echo. >> push_log.txt
echo [ACTION] Pushing to origin... >> push_log.txt
git push -u origin robin-backend >> push_log.txt 2>&1

echo. >> push_log.txt
echo FINISHED >> push_log.txt
