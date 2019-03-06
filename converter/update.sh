node ./src/download.js
node ./src/convert.js
cd .. 
git add .
git status
git commit -m "auto-update"
git push origin master

