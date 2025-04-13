const Book = require('../models/Book');
const Order = require('../models/Order');

class BookController{
    static rate(req,res){
        Book.updateRate(req.body.rate,1,5);
        res.redirect('/review');
    }

     static async addOrder(req, res){
         try{
             const insert= await Order.insertOrder(req.body.book_id, req.user.id);
             if(insert.result){
                 return res.status(200).json({message:insert.result});
             }
            res.json(insert.message);
        }
          catch (err){
            console.error(err);
            res.status(500).json({ error: 'Something went wrong.' });
        }
     }

     static async orderPartials(req,res){
         const order = await Order.getOrder(req.user.id);
         return res.render('partials/cart',{orders:order});
     }

     static async deleteOrder(req, res){
    Order.deleteOrder(req.body.order_id);
    res.redirect('/dashboard');

      }
    static delete(req,res){
        Book.deleteBook(req.user.id);
        res.redirect('/list');
    }

    static postBook(req,res){
        let book={name:`${req.body.name}`, author:`${req.body.author}`, date_created:`${req.body.date}`};
         book = Book.postBook(book);
        res.redirect(`/review/`+book.id);
    }

    static comment(req, res){

    }

}


module.exports= BookController;