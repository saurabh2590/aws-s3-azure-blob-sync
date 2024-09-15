#!/bin/bash
echo "Preparing node modules layer"
cd layers/node/nodejs
. ~/.nvm/nvm.sh
nvm use
npm i
