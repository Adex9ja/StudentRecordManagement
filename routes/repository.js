
var pg = require('pg');
var path = require('path');

var conString = "postgres://yqfrgfwebgjeby:0b40cae17f0905ff8080cd0b4985b2bb8fab9a10fa6776cb77ae270204acf549@ec2-50-17-201-204.compute-1.amazonaws.com:5432/dbr7k1utsb8hb3";

exports.index = function(req, res){
    res.render('index');
};
exports.add = function(req, res){
    res.render('addstudent', {message : null});
};



exports.list = function(req, res){
  pg.connect(conString, function (err, con, done) {

       
     con.query('SELECT * FROM student',function(err,rows)     {
        console.log(rows);
            
        if(err)
           console.log("Error Selecting : %s ",err );
        else{
          res.send(JSON.parse(JSON.stringify(rows.rows)));
        }        
                           
        });       
    });
  
};

exports.edit = function(req, res){
  var id = req.body.id; 
  
  pg.connect(conString, function (err, con, done) {
    var sql = 'SELECT * FROM student WHERE id = ' + id;
     con.query(sql,function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            else
              res.render('viewstudent',{page_title:"View Student",data: rows.rows});                           
         });
                 
    }); 
};
exports.viewedit = function(req, res){
  var id = req.body.id; 
  var msg = req.body.message;
  
  pg.connect(conString, function (err, con, done) {
    var sql = 'SELECT * FROM student WHERE id = ' + id;
     con.query(sql,function(err,rows)
        {
            
            if(err)
               res.redirect('index');
            else
              res.render('updatestudent',{ message : msg, data : rows.rows});                           
         });
                 
    }); 
};
/*Save the Student*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));    
    
    pg.connect(conString, function (err, con, done) {
        
        var data = {            
            sname    : input.sname,
            fname : input.fname,
            phoneno   : input.phoneno,
            email   : input.email, 
            address   : input.address, 
            gender   : input.gender        
        };
        var sql ="INSERT INTO student (id,sname,fname,phoneno,email,address,gender) values( DEFAULT,'"+input.sname+"', '"+input.fname +"','"+input.phoneno+"', '"+input.email+"','"+input.address+"', '"+input.gender +"')";
        var query = con.query(sql, function(err, rows)
        {
  
         if (err){
            console.log(err);
            res.render('addstudent',{message:"Error inserting record"});
         }
         else
            res.render('addstudent',{message:"Record Inserted Successfully!"});       
        });
        
    
    });
};/*Save edited Student*/
exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.body.id;
    
    pg.connect(conString, function (err, con, done) {
        
        var data = {
            sname    : input.sname,
            fname : input.fname,
            phoneno   : input.phoneno,
            email   : input.email, 
            address   : input.address, 
            gender   : input.gender ,
            id :   id       
        };
        var sql = "UPDATE student set sname = '"+input.sname+"', fname = '"+input.fname+"',phoneno = '"+input.phoneno+"',email = '"+input.email+"', address = '"+input.address+"' , gender = '"+input.gender+"'  WHERE id = " + id;
        con.query(sql, function(err, rows)
        {
  
        req.body.id = id;
        if (err){
          console.log(err);
          req.body.message = "Error occur!";
          return exports.viewedit(req, res);
        }          
        else{
          req.body.message = "Record Updated Successfully!";
          return exports.viewedit(req, res); 
         }           
         
          
        });
    
    });
};



exports.delete_student = function(req,res){
     var id = req.body.id;    
     pg.connect(conString, function (err, con, done) {
        var sql = "DELETE FROM student  WHERE id = " + id;
        con.query(sql, function(err, rows)
        {
            
        if (err){
          console.log(err);
          res.send("Error occur while deleting...Student might not exist!");
        }            
         else
            res.send("00"); 
             
        });
        
     });
};