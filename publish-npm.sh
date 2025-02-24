#!/bin/bash

# Uncomment for build
#npm run build
#oclif pack deb

# Change the name manually to statemeshcli and revert it back to smcli after script run
npm version major
npm publish --access=public

exit

