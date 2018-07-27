#!/bin/bash

while getopts d: OPT
do
  case $OPT in
    "d" ) DIR="$OPTARG" ;;
    *   ) echo "Usage: $0 [-d DIRNAME]" 1>&2
          exit 1 ;;
  esac
done

cp -r src package.json yarn.lock .gitignore postcss.config.js webpack.config.base.js webpack.config.js $DIR
