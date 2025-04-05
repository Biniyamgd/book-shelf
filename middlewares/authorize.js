const cookie = require('cookie');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req,res,next)=>{
  const cookies = cookie.parse(req.headers.cookie || "").token;
    if(!cookies){
        return res.redirect('/login');
    }
    jwt.verify(cookies,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.redirect('/login');
        }
        req.user=decoded;
        next();
    })
}