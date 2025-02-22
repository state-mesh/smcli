#!/bin/sh
{
    set -e
    SUDO=''
    if [ "$(id -u)" != "0" ]; then
      SUDO='sudo'
      echo "This script requires superuser access to install apt packages."
      echo "You will be prompted for your password by sudo."
      # clear any previous sudo permission
      sudo -k
    fi

    # run inside sudo
    $SUDO sh <<SCRIPT
  set -ex

  # if apt-transport-https is not installed, clear out old sources, update, then install apt-transport-https
  dpkg -s apt-transport-https 1>/dev/null 2>/dev/null || \
    (echo "" > /etc/apt/sources.list.d/smcli.list \
      && apt-get update \
      && apt-get install -y apt-transport-https curl)

  # add StateMesh CLI repository to apt
  echo "deb [signed-by=/usr/share/keyrings/smcli.gpg] http://smcli.s3-website.eu-central-1.amazonaws.com/release-1/ squeeze main" > /etc/apt/sources.list.d/smcli.list

  # install StateMesh CLI's release key for package verification
  curl http://smcli.s3-website.eu-central-1.amazonaws.com/release.key | gpg --dearmor -o /usr/share/keyrings/smcli.gpg

  (dpkg -s smcli 1>/dev/null 2>/dev/null && (apt-get remove -y smcli || true)) || true

  apt-get update || true

  echo "Installing StateMesh CLI"
  apt install -y smcli

SCRIPT
  # test the CLI
  LOCATION=$(which smcli)
  echo "StateMesh CLI installed to $LOCATION"
  smcli version
}
