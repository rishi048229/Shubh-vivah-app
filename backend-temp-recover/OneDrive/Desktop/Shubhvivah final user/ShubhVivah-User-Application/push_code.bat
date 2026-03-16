@echo off
echo Starting git push... > log.txt
git remote add origin https://github.com/rishi048229/Shubh-vivah-app.git >> log.txt 2>&1
git remote set-url origin https://github.com/rishi048229/Shubh-vivah-app.git >> log.txt 2>&1
git checkout -b robin-backend >> log.txt 2>&1 || git checkout robin-backend >> log.txt 2>&1
git add . >> log.txt 2>&1
git commit -m "Pushing code to robin-backend branch" >> log.txt 2>&1
git push -u origin robin-backend >> log.txt 2>&1
echo Done. >> log.txt
