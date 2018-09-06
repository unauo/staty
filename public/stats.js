"use strict";

var apiKey;
var rawForms = [];
var forms = [];
var list = document.querySelector('#forms');

function onError() {
	alert("Oops, something went wrong. Please try to log in again.");
}

function arrayify(rawForms, forms){
	rawForms.forEach(form => forms.push([form.id, form.title, form.status]));
}

function isPayment(form) {
	if (form[2] == "DELETED") return false;
	let questions = [];
	JF.getFormQuestions(form[0],function (data) {
		questions = data;
		for (var i=1; questions[i]; i++) {
			if (questions[i].type == "control_payment") {
				form[3] = true;
				addFormToList(form, list);
			}
		}
	}, onError);
	return false;
}

function addFormToList(form, list){
	list.innerHTML +=`<li><a href="https://form.jotform.com/${form[0]}">${form[1]}</a></li>`;
}

window.addEventListener("load", function(){	
	// initialize API key
	apiKey = localStorage.getItem('apiKey');
	if (!apiKey) window.alert("You are not logged in, please navigate to home for logging in first.");
	JF.initialize({apiKey:apiKey});
	// get forms and check if they are payment forms
	JF.getForms(function(res){rawForms = res;
		arrayify(rawForms,forms);
		forms.forEach(form => form.push(isPayment(form)));
	},onError);

});
