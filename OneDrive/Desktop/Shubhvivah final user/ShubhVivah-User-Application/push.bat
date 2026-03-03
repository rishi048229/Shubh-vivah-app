@echo off
set "S=/"
set "U=rishi048229"
set "URL=https:%%S%%%%S%%github.com%%S%%U%%S%%Shubh-vivah-app.git"
git remote add origin %%URL%%
git remote set-url origin %%URL%%
git checkout -b robin-backend || git checkout robin-backend
git add .
git commit -m "Pushing code to robin-backend branch"
git push -u origin robin-backend
