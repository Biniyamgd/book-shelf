class Comment {
    static createComment(){
        db.query(`create table if not exists comment(id int auto_increment primary key,user_id not null, comment text not null, created timestamp current_timestamp, foreign key (user_id) references user(id))`,(err,result)=>{
            if(err) console.log(err)
        });
    }

    static async getComment(){
        return new Promise((resolve,reject)=>{db.query(`select * from comment`,(err, result)=>{
            if(err) console.log(err)
            resolve(result)
        })
        });
    }

    static insertComment(text, userid){
        db.query(`insert into comment(text,user_id) values(?, ?)`,[text,userid],(err,result)=>{
            if(err) console.log(err)
        });
    }

    static updateComment(text,userid){
        db.query(`update comment set text=? where user_id=?`,[text,userid],(err, result)=>{
            if(err) console.log(err)
        });
    }
}