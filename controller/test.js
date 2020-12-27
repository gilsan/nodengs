const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs    = require('fs');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.use('/tests',function(req,res,next) {
     const start = req.query.start;
     const end   = req.query.end;
     console.log(start,end);
     //console.log(req);
     res.json({start:start, end: end});
});

const port = process.env.PORT || 5000;

app.listen(port, (req,res)=> {
   console.log('Running Server 5000 ....');
  });