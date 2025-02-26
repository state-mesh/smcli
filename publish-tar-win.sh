#!/bin/bash

npm run build

# Pack tarballs
oclif pack tarballs

# Pack binaries for Windoze
# Install dependencies first:
#brew install nsis
#brew install p7zip
oclif pack win

aws s3 sync ./dist s3://smcli.bin

exit

