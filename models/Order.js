const db = require('../database/db');

class Order{
    static creatOrder(){
        db.query(`create table if not exists orders(id int auto_increment primary key, user_id int not null, book_id int not null, foreign key (user_id) references user(id) on delete cascade, foreign key (book_id) references book(id), status enum('pending','completed') default 'pending')`, (err,result)=>{
            if(err) console.log(err)
        });
    }

    static async getOrder(userid){
        this.creatOrder();
        return new Promise((resolve,reject)=>{db.query(`select orders.id as order_id, book.name, book.author, book.price from orders join book on orders.book_id=book.id where orders.user_id = ?`,[userid],(err,result)=>{
                if(err){
                    console.log(userid);
                    reject(err)
                }
                resolve(result);
            })
        })
    }

    static async getCompleted(userid){
        this.creatOrder();
        return new Promise((resolve,reject)=>{db.query(`select * from orders where user_id = ?, status = ?`,[userid,"completed"],(err,result)=>{
            if(err) console.log(err)
            resolve(result);
        })
        })
    }

    static completeOrder(userid){
        db.query('update orders set status = ? where user_id = ?',["completed",userid],(err,result)=>{
            if(err) console.log(err)
        });
    }

    static insertOrder(bookid, userid){
        db.query(`insert into orders(book_id, user_id, status) values(?,?,?)`,[bookid, userid, "pending"], (err, result)=>{
            if(err) console.log(err)
        });
    }

    static deleteOrder(userid,bookid){
        db.query(`delete from orders where user_id = ?, book_id = ?, status = ?`,[userid,bookid,"pending"],(err,result)=>{
            if(err) console.log(err)
        })
    }

    static cancelOrder(userid){
        db.query(`delete from orders where user_id = ?, status = ?`,[userid,"pending"],(err, result)=>{
            if(err) console.log(err)
        });
    }

}

module.exports = Order;