const express = require('express')
const mongoose =require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()


//import User
const users = require('./routes/api/users')
//import uploadphoto
const uploadphoto = require('./routes/api/uploadphoto')

//DB config
const db = require("./config/keys").mongoURI

// bodyparser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



//Connect
mongoose.connect(db)
        .then(()=>console.log('mongoosedb connected'))
        .catch(err=> console.log(err));

//passport init
app.use(passport.initialize())

require('./config/passport')(passport)
// app.get('/' ,(req,res)=>{
//   res.send('hi f')
// })

app.use('/api/users',users)
app.use('/api/uploadphoto', uploadphoto)


const port = process.env.PORT || 5000;

app.listen(port,() =>{
  console.log(`server ${port}`)
})