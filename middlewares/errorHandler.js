module.exports=(err,req,res,next)=>{
 const statusCode = err.statusCode || 500;
    switch (statusCode){
        case 400:
            res.status(400).json({title:"Verfication Error", message:err.message, stackTrace:err.stack});
            break;
        case 401:
            res.status(401).json({title:"UnAuthorized User", message:err.message, stackTrace:err.stack});
            break;
        case 403:
            res.status(403).json({title:"Forbidden", message:err.message, stackTrace:err.stack});
            break;
        case 404:
            res.status(404).json({title:"Page not Found", message:err.message, stackTrace:err.stack});
            break;
        case 500:
            res.status(500).json({title:"Server Error", message:err.message, stackTrace:err.stack});
            break;
        default:
            console.log("all things are fine");
            next();
            break;
    }
}



