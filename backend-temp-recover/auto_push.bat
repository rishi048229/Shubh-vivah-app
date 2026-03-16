@echo off
cd /d "%~dp0"
echo ========================================== > auto_push_log.txt
echo STARTING AUTO PUSH >> auto_push_log.txt
date /t >> auto_push_log.txt
time /t >> auto_push_log.txt

echo [ACTION] Checking Git Status... >> auto_push_log.txt
git status >> auto_push_log.txt 2>&1

echo [ACTION] Creating/Switching Branch... >> auto_push_log.txt
git checkout -B robin-backend >> auto_push_log.txt 2>&1

echo [ACTION] Adding Files... >> auto_push_log.txt
git add . >> auto_push_log.txt 2>&1

echo [ACTION] Committing... >> auto_push_log.txt
git commit -m "Agent Auto-Push: Saving all changes" >> auto_push_log.txt 2>&1

echo [ACTION] Pushing... >> auto_push_log.txt
git push -u origin robin-backend >> auto_push_log.txt 2>&1

echo FINISHED >> auto_push_log.txt
echo ========================================== >> auto_push_log.txt
