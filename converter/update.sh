#!/usr/bin/env sh
git pull
node ./src/download.js
node ./src/convert.js
cd ..
git add .
git status
git commit -am "auto-update"
git push origin master
