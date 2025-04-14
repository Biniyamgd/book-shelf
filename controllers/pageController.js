const Book = require('../models/Book');
const Order= require('../models/Order');
class PageController {

    static async dashboard(req,res){
        const topRated =await Book.getSpecificBook('rate');
        const trending =await Book.getSpecificBook('review');
        const orders =await Order.getOrder(req.user.id);
        console.log(req.user);
        const user = req.user;
       res.render('page/dashboard',{ user,topRated,trending, orders});
     }

     static list(req,res){
         const allBooks = Book.getBook();
         const user = req.user;
         res.render('page/list',{user,allBooks});
     }

     static order(req,res){
         const orders = Order.getOrder(req.user.id);
         res.render('page/order',{orders});
     }

     static login(req,res){
         res.render('auth/login');
     }

     static register(req,res){
         res.render('auth/register');
     }

     static review(req,res){
         const book = Book.getSingle(req.params.id);
         Book.updateReview(req.params.id);
         const user = req.user;
         res.json({message:"successfully reviewed"})
     }


     static category(req, res){
         res.render('page/category');
     }

     static about(req,res){
         res.render('page/about');
     }

     static forgot(req, res){
         res.render('auth/forgot-pass');
     }

     static resetpage(req,res){
         res.render('auth/reset-password');
     }

}


module.exports = PageController;