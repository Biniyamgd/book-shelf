const rateLimiter = require('express-rate-limit');

 const rateLimit = rateLimiter({
    windowMs:1*60*1000,
    max:5,
    message:"Too many Comments. please try again"
})

function csp(req, res, next){
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://www.google.com/recaptcha/;");
    next();
}

module.exports={rateLimit,csp}