const Book = require('../models/Book');

class BookController{
    static rate(req,res){
        Book.updateRate(req.body.rate,1,5);
        res.redirect('/review');
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