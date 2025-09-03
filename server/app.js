require('dotenv').config()
const express = require('express')
const router = require('./routes')
const app = express()
const cors = require('cors')
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',  // or whatever your React dev URL is
    credentials: true,                // if you need cookies or auth headers
  }));
 
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
  
app.use(router)
app.listen(port,() => {
    console.log('I am listening')
})
module.exports = app