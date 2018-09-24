node ./src/download.js
node ./src/convert.js
cd .. 
git add .
git commit -m "auto-update"
git push origin master
git status

