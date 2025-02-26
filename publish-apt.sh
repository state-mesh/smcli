#!/bin/bash

npm run build

oclif pack deb

aptly publish drop squeeze s3:smcli:release-1
aptly repo drop smcli-release

aptly repo create -distribution=squeeze -component=main smcli-release
aptly repo add smcli-release ./dist/deb/
aptly publish repo smcli-release s3:smcli:release-1
gpg --export --armor > ./apt/release.key

aws s3 sync ./apt s3://smcli/

exit

