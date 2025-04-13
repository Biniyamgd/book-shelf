const express = require('express');
const PageController = require('../controllers/pageController');
const UserController = require('../controllers/userController');
const BookController = require('../controllers/bookController')
const middleware = require('../middlewares/authorize');
const route = express.Router();

route.get('/login', PageController.login);
route.get('/signup',PageController.register);
route.post('/register',UserController.createUser);
route.get('/dashboard',middleware ,PageController.dashboard);
route.post('/authenticate',UserController.authenticateUser);
route.get('/book/1',middleware,PageController.review);
route.get('/category',PageController.category);
route.get('/list',PageController.list);
route.get('/about',PageController.about);
route.get('/forgot-pass',PageController.forgot);
route.post('/mypass-forgot',UserController.forgot);
route.get('/reset_password',PageController.resetpage);
route.post('/reset-password',UserController.resetPassword);
route.post('/rate',BookController.rate);
route.post('/order/add',middleware, BookController.addOrder);
route.post('/order/delete',middleware, BookController.deleteOrder);
route.get('/orders/partial',middleware,BookController.orderPartials);
route.all('*',(req,res)=>{
    throw Object.assign(new Error("I Don't Know"), { statusCode: 404 });
})
module.exports= route;

