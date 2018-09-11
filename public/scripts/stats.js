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

var chartData = []; 
var ttlsData = [];

var width = 700,
    barHeight = 25;

var x = d3.scaleLinear()
    .range([0, 200]);

var chart = d3.select("#bar-chart")
    .attr("width", width);

function onError() {
	alert("Oops, something went wrong, or not.");
}

function arrayify(rawForms, forms){
	rawForms.forEach(form => forms.push([form.id, form.title, form.status]));
}

// we need the index of the first unshown form with the given total earnings. this will be crucial if there are several forms with the same total.
function findForm(total) {
	for (let i = 0; i < chartData.length; i ++) {
		if ((chartData[i].status == 0) && (parseFloat(chartData[i].total) == total)) {
			chartData[i].status = 1;
			return i;
		}
	}
}

function updateGraph() {
	ttlsData = ttlsData.sort(function(a,b) { return a-b; });
	console.log(d3.max(ttlsData));
	x.domain([0, d3.max(ttlsData)]);
	chart.attr("height", barHeight * ttlsData.length);
	
	var bar = chart.selectAll("g")
    	.data(ttlsData)
    .enter().append("g")
    	.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  	bar.append("rect")
    	.attr("width", x)
    	.attr("height", barHeight - 4);

  	bar.append("text")
      	.attr("x", function(d) { return x(d)+3; })
      	.attr("y", barHeight / 2)
      	.attr("dy", ".35em")
		.text( function(d) { return chartData[findForm(d)].name; });
}

function addFormToTable(form, total, currency){
	// we need 2 seperate arrays for data. first array only consists of the total earnings, so that we can sort our data.
	// second array has the info to be shown for each form. status is -1 if the form is not shown yet. more detail can be found in "findForm(total)".
	table.innerHTML +=
			`<tr>
			<td scope="row"><a href="/form/${form[0]}">${form[1]}</a></td> 
			<td>${form[2] == "ENABLED" ? "yes" : "no"}</td>
			<td>${total} ${currency}</td>
			</tr>`;
	setTimeout(() => {updateGraph()}, 300);
}

function getTotalEarned(form, qid){
	JF.getFormSubmissions(form[0], function(res){
		let grandTotal = 0.00;
		let currency = JSON.parse(res[0].answers[qid].answer.paymentArray).currency;
		for (var i=0; i<res.length; i++) {
			if (res[i].answers && res[i].answers[qid].answer){
				grandTotal += parseFloat(JSON.parse(res[i].answers[qid].answer.paymentArray).total);
			}
		}
		ttlsData.push(grandTotal);
		chartData.push({status: 0, name: form[1], total: grandTotal, currency: currency});
		addFormToTable(form, grandTotal.toFixed(2), currency);
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
