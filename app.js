var express = require('express');
var app = express();

app.set('view engine', 'ejs');


app.get('/', function(req, res){
	//	res.send('this is the homepage');
	res.sendFile(__dirname + '/htmls/index.html');
});
app.get('/stats', function(req, res){
	//	res.send('this is the homepage');
	res.sendFile(__dirname + '/htmls/stats.html');
});
app.get('/about', function(req, res){
	//	res.send('this is the homepage');
	res.sendFile(__dirname + '/htmls/about.html');
});
app.get('/feedback', function(req, res){
	//	res.send('this is the homepage');
	res.sendFile(__dirname + '/htmls/feedback.html');
});
app.use(express.static('public')); 

app.listen(3000);