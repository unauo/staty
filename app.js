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
app.use( function(req, res) {
    res.status(404).render('404', {title: "Oops!"});
});

app.listen(3000);