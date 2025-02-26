#!/bin/bash
# Change the name manually to statemeshcli and revert it back to smcli after script run

npm run build

npm version major
npm publish --access=public

exit

