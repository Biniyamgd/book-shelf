const db = require('../database/db');

class Book {
    static async getBook(){
        return new Promise((resolve,reject)=>{db.query(`select * from book`,(err,result)=>{
            if(err) console.log(err)
            resolve(result);
        })});
    }

    static checkBook(){
        db.query(`show tables like 'book'`,(err,result)=>{
            if(err){
                console.log('some internal Error');
            }
            if(result.length==0){
               db.query(`create table book (id int auto_increment primary key, name varchar(40) not null, author varchar(40) not null,price decimal(5,2) not null, date_created datetime default current_timestamp, rate int default 0, review int default 0, rate_count int default 0)`,(err,result)=>{
                   if(err){
                       console.log(err);
                   }
               })
            }
        })
    }

    static async getSingle(id){
        this.checkBook();
            return new Promise((resolve,reject)=>{db.query(`select * from book where id=?`,[id],(err,result)=>{
            if(err) console.log(err);
            resolve(result[0])
        })
    });
    }

    static async getSpecificBook(specific){
        this.checkBook();
        return new Promise((resolve,reject)=>{db.query(`select * from book order by ${specific} desc limit 4`,(err,result)=>{
            if(err) console.log(err);
            resolve(result);
        })});
    }

    static postBook(book){
     let rebook = {};
        db.query(`insert into book set ?`, book ,(err,result)=>{
            if(err) console.log(err);
            rebook=result;
        });
        return rebook;
    }

    static deleteBook(id){
        db.query(`delete from book where id= ? limit 1`,[id],(err,result)=>{
            if(err) console.log(err);
        });
    }

    static updateRate(newrate, bookid,userid){
        this.createRating();
        db.query(`update book set rate = ((rate * rate_count) + ?)/(rate_count+1), rate_count =  rate_count + 1 where id = ?`,[newrate,bookid],(err,result)=>{
           if(err) console.log(err);
        });
        this.Rate(userid,bookid);
    }

    static updateReview(bookid){
        db.query(`update book set review = review + 1 where id = ?`,[bookid],(err,result)=>{
           if(err) console.log(err);
        });
    }

    static createRating(){
        db.query('create table if not exists rate (id int auto_increment primary key, user_id not null, book_id not null, unique (userid, book_id), foreign key (user_id) references  user(id) on delete cascade, foreign key (book_id) references book(id) on delete cascade)',
        (err,result)=>{
                if(err) console.log(err);
            });
    }
    static async checkRate(user){
        return new promise((resolve,reject)=>{db.query('select * from where user_id = ? limit 1',[user.id],(err,result)=>{
            if(err) console.log(err);
            resolve(result);
        })})
    }


    static Rate(user,book){
        this.createRating();
        const rate={user_id:user, book_id:book};
        db.query('insert into rate set ?',rate,(err,result)=>{
            if(err) console.log(err);
        })
    }

}


module.exports = Book;