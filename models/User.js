const db = require('../database/db');
const jwt = require('jsonwebtoken');
const argon = require('argon2');
const cookies = require('cookie')
const {argon2id} = require("argon2");

class User{
    static async getUser(email){
        return (new Promise((resolve,reject)=>{db.query(`select * from user where email = ? limit 1`,[email],(err,result)=>{
                if(err){
                    return res.send('there is no user associated with the email');
                }
                resolve(result[0]);
            });
        }));
    }

 static checkuser(usertable){
     db.query(`SHOW TABLES LIKE '${usertable}'`,(err,result)=>{
         if(err){
             console.log(err);
         }
         if(result.length===0){
             db.query(`create table ${usertable} (id int auto_increment primary key, name varchar(20) unique not null,email varchar(100) unique not null, password varchar(255) not null, imageURL varchar(255), resetToken varchar(255),resetExpiry datetime)`)
         }
     });
 }

 static async postUser(usertable, name, email, password){
     db.query(`insert into ${usertable} set ?`,{name:`${name}`,email:`${email}`,password:`${password}`},(err,result)=>{
         if(err){
             console.log(err);
         }
     });
//     console.log(email);
//     console.log(this.getUser(`${email}`));
try{
    const user = await this.getUser(email);
    if(!user){
        throw new Error('user not found');
    }
    console.log(user);
    return user;
}
catch(e){
    console.log(e);
    return null;
}
 }

 static deleteUser(email){
     db.query(`delete from user where email= ? limit 1`,[email],(err,result)=>{
         if(err){
             console.log(err);
             return res.send('Internal server problem....')
         }
     });
 }

 static updateReset(verifytoken, resetExpiry, email){
     db.query(`update user set resetToken = ?, resetExpiry = ? where email = ?`, [verifytoken, resetExpiry,email], (err, result)=>{
         if(err){
             console.log(err);
         }
     })
 }

 static updatePasw(email, password){
     db.query(`update user set password= ? where email=?`,[password, email], (err, result)=>{
         if(err){
             console.log("error in the database query");
         }
     })
 }

}

module.exports= User;