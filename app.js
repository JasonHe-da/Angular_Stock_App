// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict'; 
// [START gae_node_request_example]
import express from 'express';
import cors from 'cors';
// const express = require('express');
const app = express();
// const cors = require('cors');

app.use(cors());
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fetch from 'node-fetch';
const API_KEY = "c94ij42ad3if4j50t1r0";
app.use(express.static(__dirname + '/HW8-frontend/dist/hw8-frontend'));

app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname));
  res.sendFile(`${__dirname}/HW8-frontend/dist/hw8-frontend/index.html`);
});

app.get('/search/home', (req, res) => {
  //res.sendFile(path.join(__dirname));
  res.sendFile(`${__dirname}/HW8-frontend/dist/hw8-frontend/index.html`);
});
app.get('/watchlist', (req, res) => {
  //res.sendFile(path.join(__dirname));
  res.sendFile(`${__dirname}/HW8-frontend/dist/hw8-frontend/index.html`);
});
app.get('/portfolio', (req, res) => {
  //res.sendFile(path.join(__dirname));
  res.sendFile(`${__dirname}/HW8-frontend/dist/hw8-frontend/index.html`);
});
app.get('/search/:id', (req, res) => {
  //res.sendFile(path.join(__dirname));
  res.sendFile(`${__dirname}/HW8-frontend/dist/hw8-frontend/index.html`);
});

app.get('/search/profile/:id', async (req, res) => {
  // res.status(200).send(req.params.id).end();
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${req.params.id}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    //console.log("RESPONSE: ", response);
    res.json(response);
});
 app.get('/search/autocomplete/:id', async (req, res) => {
  const url = `https://finnhub.io/api/v1/search?q=${req.params.id}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    //console.log("RESPONSE: ", response);
    res.json(response);
 });
 app.get('/search/autocomplete/', async (req, res) => {
   console.log(res);
  res.json('empty')
 });

 app.get('/search/candle/:id/:timestamp', async (req, res) => {
  const text_result = req.params.id.toUpperCase();
  const time_dae = parseInt(req.params.timestamp);
  let past_time = parseInt(time_dae - (60*60*6));
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${text_result}&resolution=${5}&from=${past_time}&to=${time_dae}&token=${API_KEY}`;
  //console.log(url);
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    res.json(response);
 });

 app.get('/search/history/:id/:timestamp', async (req, res) => {
  const text_result = req.params.id.toUpperCase();
  var time_dae = parseInt(req.params.timestamp);
  var date = new Date(time_dae);
  date.setFullYear(date.getFullYear()-2);
  date = Math.floor(date/1000);
  time_dae = Math.floor(time_dae/1000);
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${text_result}&resolution=D&from=${date}&to=${time_dae}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    //console.log("RESPONSE: ", response);
    res.json(response);
 });
 

 app.get('/search/recommendation/:id', async (req, res) => {
  const text_result = req.params.id.toUpperCase();
  const url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${text_result}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    //console.log("RESPONSE: ", response);
    res.json(response);
 });

 app.get('/search/social/:id', async (req, res) => {
  const text_result = req.params.id.toUpperCase();
  const url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${text_result}&from=2022-01-01&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    res.json(response);
 });

 app.get('/search/peers/:id', async (req, res) => {
  const text_result = req.params.id.toUpperCase();
  const url = `https://finnhub.io/api/v1/stock/peers?symbol=${text_result}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    //console.log("RESPONSE: ", response);
    res.json(response);
 });

 app.get('/search/earnings/:id', async (req, res) => {
  const text_result = req.params.id.toUpperCase();
  const url = `https://finnhub.io/api/v1/stock/earnings?symbol=${text_result}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    //console.log("RESPONSE: ", response);
    res.json(response);
 });

app.get('/search/quote/:id', async (req, res) => {
  const text_result = req.params.id.toUpperCase();
  const url = `https://finnhub.io/api/v1/quote?symbol=${text_result}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    //console.log("RESPONSE: ", response);
    res.json(response);
 });

 app.get('/search/news/:id', async (req, res) => {
  var now_time = new Date();
  var now_time_date = now_time.getDate();
  var now_time_date_temp = "";
  if(now_time_date<10){
    now_time_date_temp = "0" + now_time_date.toString();
  }else{
    now_time_date_temp = now_time_date;
  }
  var now_time_month = now_time.getMonth()+1;
  var now_time_month_temp = "";
  if(now_time_month<10){
    now_time_month_temp = "0" + now_time_month.toString();
  }else{
    now_time_month_temp = now_time_month;
  }

  var past_time_date = now_time.getDate();
  var past_time_date_temp = "";
  if(past_time_date<10){
    past_time_date_temp = "0" + past_time_date.toString();
  }else{
    past_time_date_temp = past_time_date;
  }
  var past_time_month = now_time.getMonth();
  var past_time_month_temp = "";
  if(past_time_month<10){
    past_time_month_temp = "0" + past_time_month.toString();
  }else{
    past_time_month_temp = past_time_month;
  }
  var now_date = now_time.getFullYear() + "-" + now_time_month_temp + "-" + now_time_date_temp;
  var past_date = now_time.getFullYear() + "-" + past_time_month_temp + "-" + past_time_date_temp;
  // console.log(now_date, past_date);
  const text_result = req.params.id.toUpperCase();
  const url = `https://finnhub.io/api/v1/company-news?symbol=${text_result}&from=${past_date}&to=${now_date}&token=${API_KEY}`;
  const options = {
    "method": "GET",
  };
  const response = await fetch(url,options)
    .then(res => res.json())
    .catch(e => {
      console.error({
        "message":"oh error",
        error: e,
      });
    });
    // console.log("RESPONSE: ", response);
    res.json(response);
 });
// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]
// export default ;
// module.exports = app;
