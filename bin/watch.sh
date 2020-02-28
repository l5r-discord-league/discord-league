#!/bin/bash -e

rm -rf dist

npx tsc --watch > /dev/null &

until [ -f dist/src/index.js ]; do sleep 1; done

npx nodemon --watch dist dist/src/index.js
