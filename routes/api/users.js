// login & register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const keys =require('../../config/keys')
const passport = require('passport')
// $route GET api/users/test
// @desc 
// @access public
router.get("/test" , (req,res)=>{
  res.json( {msg:'login works'} )
})

//post register
router.post("/register" ,(req,res)=>{
  //console.log(req.body)

  //查詢EMAIL重複
  User.findOne({email:req.body.email})
      .then((user) =>{
          if(user){
            return res.status(400).json({email:'有此email'})
          }else{
            const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const newsUser = new User({
              name :req.body.name,
              email:req.body.email,
              avatar,
              password:req.body.password
          })
          bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(newsUser.password, salt, (err, hash)=> {
                  // Store hash in your password DB.
                  if(err) throw err;
                  newsUser.password = hash

                  newsUser.save()
                          .then(user => res.json(user))
                          .catch(err=>console.log(err))
              });
          });
      }
  })
})

// POST Login
// @desc token jwt passport
// @access public
router.post("/login" ,(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
      .then(user=>{
        if(!user){
          return res.status(404).json({email:'用戶不存在'})
        }

        //密碼匹配
        bcrypt.compare(password, user.password)
              .then(isMatch =>{
                if(isMatch){
                  const rule = {id:user.id , nams:user.name};
                  jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                    if(err) throw err;
                    res.json({
                      success:true,
                      token:"Bearer "+token
                    })
                  })
                  // res.json({msg:'success'})
                }else{
                  return res.status(400).json({password:'密碼錯誤'})
                }
                
              })
        
  })
})

// get api/users/current
// @desc return current user
// @access private
router.get('/current', passport.authenticate("jwt",{session:false}) ,(req,res)=>{
  res.json({
    id:req.user.id,
    name:req.user.name,
    email:req.user.email
  })
})
module.exports = router;