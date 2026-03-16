@echo off
echo PUSH_START > push_status.log
git push origin robin-backend >> push_status.log 2>&1
if %errorlevel% neq 0 (
  echo PUSH_FAILED_TRYING_FORCE >> push_status.log
  git push -f origin robin-backend >> push_status.log 2>&1
)
echo PUSH_DONE >> push_status.log
