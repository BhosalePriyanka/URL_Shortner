require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const dns = require('dns');
const urlparser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

//middleware 
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



//schema 
const Schema = mongoose.Schema
const userSchema = new Schema({
  url:{
        type:String,
       
    },
    short_url:{
        type:Number
    }
})
let URL = mongoose.model('Freecodecamp', userSchema)
mongoose.connect(process.env.MONGO_URL)

app.post('/api/shorturl',(req,res)=>{
  const url = req.body.url
  //varify submitted url
  const checkaddress = dns.lookup(urlparser.parse(url).hostname,
  async(err,address) => {
    if(!address){
      res.json({error : "Invalid Url"})
    }
    else{
      let shortUrl = Math.floor(Math.random() * 100000);
      const postURL  = await URL.create({url,short_url:shortUrl})
      res.json({original_url : url,short_url:shortUrl})
    }
  })
})


// get
// Waiting:When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
app.get('/api/shorturl/:short_url', async(req,res)=>{
  const shortURL = req.params.short_url
  const urldoc = await URL.findOne({short_url:shortURL})
  console.log(urldoc)
res.redirect(urldoc.url)

})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
