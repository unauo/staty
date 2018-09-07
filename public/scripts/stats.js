"use strict";

var apiKey;
var types = [
"control_square",
"control_paypal",
"control_wepay",
"control_authnet",
"control_echeck",
"control_stripe",
"control_stripeACH",
"control_sofort",
"control_moneris",
"control_payu",
"control_pagseguro",
"control_bluesnap",
"control_paymentwall",
"control_payment",
"control_paypalexpress",
"control_paypalpro",
"control_payjunction",
"control_chargify",
"control_bluepay",
"control_braintree",
"control_2co",
"control_cardconnect",
"control_worldpay",
"control_worldpayus",
"control_eway",
"control_firstdata",
"control_paysafe",
"control_skrill",
"control_gocardless",
"control_clickbank",
"control_onebip"
];
var rawForms = [];
var forms = [];
var table = document.querySelector('#inner-table');
var bestForm = [0,[]];
var best = document.querySelector('#best-form');



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
			if (types.includes(questions[i].type)) {
				form[3] = true;
				getTotalEarned(form, i);
			}
		}
	}, onError);
	return false;
}

function addFormToList(form, total){
	table.innerHTML +=
			`<tr>
			<td scope="row"><a href="/form/${form[0]}">${form[1]}</a></td> 
			<td>${form[2] == "ENABLED" ? "yes" : "no"}</td>
			<td>${total}</td>
			</tr>`;
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
