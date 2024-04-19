#!/bin/sh
source /home/admin/.bash_profile
nvm use v16
npm install --legacy-peer-deps
npm list
npm run build
