const Order = require('../database/db');

module.exports= async (req,res,next)=>{
try{
const orders = await getOrder(req.user.id);
req.orders=orders;
next();
} 
catch(err){
    console.log(err);
    next(err);
}
}