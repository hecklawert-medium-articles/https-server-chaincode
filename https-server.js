/*
*    @author      Hëck Lawert
*    @github      https://github.com/hecklawert
*    @date        22/08/2020
*    @description Simple HTTPs Server
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');
const express = require('express');
var https = require('https');
const fs = require('fs');


let Chaincode = class {

  // The Init method is called when the Smart Contract 'httpsserver' is instantiated by the blockchain network
  async Init(stub) {
    console.info('=========== Instantiated HTTPs Server chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'htttpsserver'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }  

  async startServer(stub){
    let port = 8443;
    let key =  fs.readFileSync('./certs/private-key.pem', 'utf8');
    let cert = fs.readFileSync('./certs/public-cert.pem', 'utf8');
    let credentials = { key, cert };

    let app = express();
    var httpsServer = https.createServer(credentials, app);
    
    httpsServer.listen(port);

    console.log(`\n\n--> NodeJS Express listening at port: ${port}...try <<container_name>>/hellotls and enjoy!`);

    app.get('/hellotls', (req, res) => {
      console.log('entering in hellotls...');
      const result = { message: 'Hello world express with https!'};
      console.log(`--> result: ${JSON.stringify(result)}`);
      res.send(result);
    });
  }
};

shim.start(new Chaincode());
