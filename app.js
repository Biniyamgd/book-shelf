const express = require('express');
const router = require('./routes/web');
require('dotenv').config();
require('express-async-errors');
const errHandler = require('./middlewares/errorHandler');

const app = express();
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/',router);
app.use(errHandler);

const port = process.env.PORT || 3000;

app.listen(port,()=>{console.log(`the server is connected successfully by port ${port}`)});