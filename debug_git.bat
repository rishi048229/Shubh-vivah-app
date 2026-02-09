@echo off
cd /d "%~dp0"
echo STARTING DEBUG > debug_log.txt
echo Checking Git version... >> debug_log.txt
git --version >> debug_log.txt 2>&1
echo Checking Status... >> debug_log.txt
git status >> debug_log.txt 2>&1
echo Listing files... >> debug_log.txt
dir >> debug_log.txt 2>&1
echo DONE >> debug_log.txt
