var express = require('express');
var http = require('http');
var path = require('path');

//load students route
var students = require('./routes/repository'); 
var app = express();

app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', students.index);
app.get('/addstudent', students.add);
app.get('/students/view', students.index); 
app.get('/students/viewedit', students.index); 

app.post('/students', students.list);
app.post('/students/add', students.save);
app.post('/students/delete', students.delete_student);
app.post('/students/view', students.edit); 
app.post('/students/viewedit', students.viewedit); 
app.post('/students/update',students.save_edit);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});