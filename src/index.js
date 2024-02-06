//Beta version 1.0.1 of WDTP...

import { fixClient } from "./fixClient";
import { SignTrade, tradeListener, checkNetworkStatus } from "./web3";
import express from "express";
const bodyParser = require("body-parser");
import { ExeTrade, registerTrade } from "./db/db";
const mongoose = require("mongoose");
import { router } from "./routes/routes";
import e from "express";
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');
const crypto = require('crypto');
const fetch = require('node-fetch');

require("dotenv").config();
let counter = 0;
let Approvedclients = [];



Errorlogger('Init');
WSSserver();
tradeListener(Approvedclients);
function WSSserver() {
  try {
    const server = https.createServer({
      cert: fs.readFileSync(__dirname + '/certificates/cert.pem'),
      key: fs.readFileSync(__dirname + '/certificates/key.pem')
    });
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
      ws.id__ = stringToHash(ws.toString());
      console.log('Client connected');
      InitClient(ws);
    });
    server.listen(process.env.WSPORT, () => {
      console.log('Server started on port 8000');
    });
  } catch (error) {
    Errorlogger(error.message);
  }
}




const ip = require("ip");
const ipAddress = ip.address();

mongoose.connect(process.env.DBKEY, { useNewUrlParser: true })
  .then(() => {
    const envport = process.env.SERVERPORT;
    const app = express();

    app.use(router);

    const options = {
      cert: fs.readFileSync(__dirname + '/certificates/cert.pem'),
      key: fs.readFileSync(__dirname + '/certificates/key.pem')
    };

    const server = https.createServer(options, app);

    server.listen(envport, function () {
      console.log(`The SERVER HAS STARTED ON PORT: ${envport}`);
      console.log(ipAddress);
      w3Engine();
      fixClient(registerTrade);
    });

    server.on("error", function (err) {
      console.log(err);
      process.once("SIGUSR2", function () {
        process.kill(process.pid, "SIGUSR2");
      });
      process.on("SIGINT", function () {
        // This is only called on Ctrl+C, not restart
        process.kill(process.pid, "SIGINT");
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

process.on('uncaughtException', function (err) {
  Errorlogger(err.message);
  console.log("...");
});

process.on('TypeError', function (err) {
  Errorlogger(err.message);
  console.log("...");
});



//-----------functions--------
const updateSpeed = 1000;
async function w3Engine() {
  await checkNetworkStatus();
  let e = await ExeTrade();
  // console.log(e);
  setTimeout(() => { w3Engine(); }, updateSpeed);
}
//---------functions--------
//---------ExecutionBlock------
//---------ExecutionBlock------



async function msgHandler(msg, ws) {
  console.log('got msg: ', msg);
  if (checkClient(ws)) {
    switch (msg.messageType) {
      case 'auth': {
        ws.send(JSON.stringify({ messageType: 'auth', message: 'Already approved' }));
        break;
      }
      case 'tokenInfo': {
        console.log('Needs to send token Information');
        break;
      }
      case 'signOrder': {
        try {
          testvar = await Price_conversion(msg.message);
          console.log('Warning Finish');
          console.log(testvar);
          if (inf != undefined) {
            let res = await SignTrade(testvar);
            ws.send(JSON.stringify({ messageType: 'signOrder', message: res }));
          } else {
            ws.send(JSON.stringify({ messageType: 'log', message: 'Failed!' }));
          }
        } catch (error) {
          ws.send(JSON.stringify({ messageType: 'signOrder', message: { status: 'Failed', orderId: msg.message.orderId } }));
        }
        break;
      }
      case 'keepalive': {
        try {
          ws.send(JSON.stringify({ messageType: 'keepalive', message: msg.message }));
        }
        catch (error) {
          ws.send(JSON.stringify({ messageType: 'keepalive', message: 'error' }));
        }
        break;
      }
      default:
        ws.send(JSON.stringify({ messageType: 'log', message: 'Invalid request!' }));
        break;
    }
  } else {
    switch (msg.messageType) {
      case 'auth': {
        if (msg.message == process.env.CTID) {
          Approvedclients.push(ws);
          // wsClients.push(ws);
          ws.send(JSON.stringify({ messageType: 'auth', message: 'Approved' }));
          return;
        } else {
          console.log('!Client Fired.');
          ws.send(JSON.stringify({ messageType: 'auth', message: 'Invalid key' }));
          ws.close();
        }
        break;
      }
      default:
        console.log('!Client Fired.');
        ws.send(JSON.stringify({ messageType: 'log', message: 'Unauthorized connection' }));
        ws.close();
        break;
    }
  }
}



function InitClient(ws) {
  ws.send(JSON.stringify({ messageType: 'log', message: '4NX server v1.17.0' }));
  ws.send(JSON.stringify({ messageType: 'log', message: 'Please provide connection key in order to use the service.' }));
  ws.on('message', (message) => {
    if (isJSON(message)) {
      let msg = JSON.parse(message);
      msgHandler(msg, ws);
    } else {
      ws.send(JSON.stringify({ messageType: 'log', message: 'Please use Valid Format for interaction.' }));
      ws.close();
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    removeClient(ws); //Remove from array...
  });
}



function checkClient(ws) {
  let res = false;
  Approvedclients.forEach(ws => {
    if (ws.id__.toString() == ws.id__.toString()) {
      res = true;
    }
  });
  return res;
}



function removeClient(ws) {
  for (let i = 0; i < Approvedclients.length; i++) {
    if (Approvedclients[i].id__.toString() == ws.id__.toString()) {
      Approvedclients.splice(i, 1);
    }
  }
}



function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function Errorlogger(error) {
  if (counter == 0) {
    fs.writeFile(__dirname + '/logs/logs.txt', 'Application Error Logs \n\n\n', function (err) {
      if (err) throw err;
      console.log('Logs cleaned.');
    });
  } else {
    fs.appendFile((__dirname + '/logs/logs.txt'), `${counter}: ` + error + '\n', function (err) {
      if (err) console.log('Unable to write error on file and the error is : ', err.message);
      console.log('Data appended to file.');
    });
  }
  counter++;
  console.log(error);
}



function stringToHash(str) {
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  return hash;
}



async function Price_conversion(inf) {
  try {
    console.log('Warning Start ', inf);
    const response = await fetch(process.env.PriceEndPoint);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Assuming the response is in JSON format
    let Instrument, symbol, lastUpdateTime, bid, ask;

    switch (inf.quoteAsset) {
      case 'USD':
        console.log('--X--');
        break; // No conversion needed
      case 'EUR':
      case 'GBP':
      case 'CAD':
      case 'JPY':
      case 'CHF':
        Instrument = data.find(item => item.symbol === `${inf.quoteAsset}USD`);
        if (Instrument) {
          ({ symbol, lastUpdateTime, bid, ask } = Instrument);
          const SendingTimeStamp = Date.now(); // Assuming you need the current timestamp
          if (SendingTimeStamp - lastUpdateTime <= 10000) {
            const askValue = parseFloat(ask);
            const infPriceValue = parseFloat(inf.price);
            if (!isNaN(askValue) && !isNaN(infPriceValue)) {
              inf.price = (askValue * infPriceValue).toString();
              console.log("Updated inf.price:", inf.price); // Correct placement to log the updated price
            } else {
              console.log("Invalid numeric values for 'ask' or 'inf.price'.");
              return undefined;
            }
          } else {
            console.log('Expired Price');
            return undefined;
          }
        } else {
          console.log(`No instrument found for ${inf.quoteAsset}`);
          return undefined;
        }
        break;
      default:
        console.log(`Unsupported quoteAsset: ${inf.quoteAsset}`);
        return undefined;
    }
    console.log(inf);
    return inf; // Return the possibly updated inf object
  } catch (error) {
    console.error('Fetch error:', error);
    return undefined;
  }
}


