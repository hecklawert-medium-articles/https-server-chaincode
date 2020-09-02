#!/bin/bash

export PORT="8443"
export KEY=`cat ./certs/private-key.pem`
export CERT=`cat ./certs/public-cert.pem`

node https-server.js