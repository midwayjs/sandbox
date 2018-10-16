#!/bin/bash
set -e
lerna run cov
cwd=`pwd`
if [ -d "${cwd}/.nyc_output" ]; then
  rm -rf "${cwd}/.nyc_output"
fi
mkdir "${cwd}/.nyc_output"
cp -r ./packages/*/.nyc_output/* $cwd/.nyc_output/ || true
cp -r ./packages/*/node_modules/.nyc_output/* $cwd/.nyc_output/ || true
./node_modules/.bin/nyc report

