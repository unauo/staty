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

function getTotalEarned(form, qid){
	JF.getFormSubmissions(form[0], function(res){
		let grandTotal = 0.00;
		for (var i=0; i<res.length; i++) {
			console.log(res);
			if (res[i].answers && res[i].answers[qid].answer){
				grandTotal += parseFloat(JSON.parse(res[i].answers[qid].answer.paymentArray).total);
			}
		}
		addFormToList(form, grandTotal.toFixed(2));
	}, onError)
}

function isPayment(form) {
	if (form[2] == "DELETED") return false;
	let questions = [];
	JF.getFormQuestions(form[0],function(res) {
		questions = res;
		for (var i=1; questions[i]; i++) {
			if (questions[i].type == "control_payment") {
				form[3] = true;
				getTotalEarned(form, i);
			}
		}
	}, onError);
	return false;
}

function addFormToList(form, total){
	list.innerHTML +=`<li><a href="/form/${form[0]}">${form[1]}:  </a>This form earned you ${total}!</li>`;
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
