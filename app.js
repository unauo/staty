"use strict";

var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('public')); 

app.get('/', function(req, res){
	res.render('index');
});
app.get('/myforms', function(req, res){
	res.render('myforms');
});
app.get('/form/:id', function(req, res){
	res.render('form', {id: req.params.id});
});

app.listen(3000);