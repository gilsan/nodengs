
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs    = require('fs');

const port = process.env.PORT || 5000;

const app = express();


app.use('/tests', function(req, res, next) {
    console.log('Time: %d', Date.now());
    console.log(req);
    // const start = req.query.start;
    // const end  = req.query.end;
	// res.json({start: start, end: end});
    res.json({"test": "ok"});
    next();
  });


app.listen(port, (req,res)=> {
   console.log('Running Server 5000 ....');
  });