const db = require('../database/db');
const jwt = require('jsonwebtoken');
const argon = require('argon2');
const cookies = require('cookie');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const {argon2id} = require("argon2");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{user:process.env.EMAIL_USER, pass:process.env.APP_PASSWORD}
});

//transporter.verify((err, success)=>{
//
//    if(err){
//        console.log(err)
//    }
//    if(success){
//        console.log("Ready for message");
//    }
//    });

class UserController{

    static async authenticateUser(req,res){
        const { email, password} = req.body;
         if( !email || !password  ){
             return res.json({
                 error:"All fields are needed to be filled"
             })
         }
        const DBuser = await User.getUser(email);
        if(!DBuser){
           return res.json({error:"Email not found. please insert the correct Email."});
        }
      const verified = await argon.verify(DBuser.password,req.body.password,{
          type:argon.argon2id,
          memoryCost:2**10,
          timeCost:3,
          parallelism:2
      });
      if(!verified){
          return res.json({error:"invalid password. please insert the correct password."});
      }
//      console.log(DBuser);
      const auth_user = {id :DBuser.id, name:`${DBuser.name}`, email:`${DBuser.email}`}
      const accessToken = jwt.sign(auth_user,process.env.SECRET_KEY);
      res.setHeader('Set-Cookie',cookies.serialize('token',accessToken,{
          httpOnly:true,
          secure:false,
          maxAge:3600,
          path:'/'
      }))
      res.redirect('/dashboard');
    }

    static async createUser(req,res){
        const {name, email, password, confpass} = req.body;
       console.log(name, email ,password ,confpass);
        if(!name || !email || !password  || !confpass){
            return res.json({
                error:"All fields are needed to be filled"
            })
        }
        else if(password!==confpass){
            return res.json({
                error:"passwords don't match"
            });
        }

        else{
        let usertable = 'user';
        User.checkuser(usertable);
        const hashed = await argon.hash(password,{
            type:argon.argon2id,
            memoryCost: 2**10,
            timeCost:3,
            parallelism:2
        })
        const DBuser = await User.postUser(usertable,name, email, hashed);
        console.log(DBuser);
        const auth_user = {id :DBuser.id, name:`${DBuser.name}`, email:`${DBuser.email}`}
        const accessToken = jwt.sign(auth_user,process.env.SECRET_KEY);
        res.setHeader('Set-Cookie',cookies.serialize("token",accessToken,{
            httpOnly:true,
            secure:false,
            path:'/',
            maxAge:3600
        }))
        res.redirect('/dashboard');
        }
         }

    static updateUser(req,res){

    }

    static deleteuser(req,res){
        const email = req.user.email;
        User.deleteUser(email);
        res.setHeader('Set-Cookie',cookies.serialize('token',"",{
            httpOnly:true,
            secure:false,
            path:'/',
            maxAge:0
        }))
        res.redirect('/login');
    }

static async forgot(req,res){


    const { email } = req.body;
    const user = await  User.getUser(email);

    if(!user){
       return res.status(401).json({message:"Email not found"});
    }
    const postuser = {id :user.id, name:`${user.name}`, email:`${user.email}`}
    const verifytoken = jwt.sign(postuser,process.env.SECRET_KEY);
    const resetExpiry= new Date(Date.now() + 15 * 60* 1000);
    User.updateReset(verifytoken, resetExpiry,email);
    const resetLink = `${process.env.CLIENT_URL}/reset_password?token=${verifytoken}`;
    try{
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Password Reset",
        html:`<p style="display:flex;">click<a href="${resetLink}" style="text-decoration:none;display:flex;width:max-content;padding:8px 13px;border-radius:6px;;background-color:orange;">Here</a> to reset your password</p>`
    });

    res.json({message:"Link sent Successfully. Go check your Email."});
    }
    catch(e){
        res.status(500).json({message:"server error"});
    }
}

static async resetPassword(req,res){
    const {password, token,  conf_pass} = req.body;
    if(!password || !conf_pass){
        return res.status(403).json({message:"Please fill the fields"});
    }
    if(password !== conf_pass){
        return res.status(403).json({message:"passwords do not match...."})
    }
    const finalPass= await argon.hash(password,{
        type: argon2id,
        memoryCost: 2**10,
        timeCost: 3,
        parallelism: 2
    })
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
     let email=decoded.email;
    User.updatePasw(email,finalPass);
    res.status(200).redirect('/login');

}

    static logout(req,res){
        res.setHeader('Set-Cookie',cookies.serialize('token',"",{
            httpOnly:true,
            secure:false,
            path:'/',
            maxAge:0
        }))
        res.redirect('/login');
    }

}


module.exports= UserController;