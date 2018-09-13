'use strict';

var apiKey;
var types = [
'control_square',
'control_paypal',
'control_wepay',
'control_authnet',
'control_echeck',
'control_stripe',
'control_stripeACH',
'control_sofort',
'control_moneris',
'control_payu',
'control_pagseguro',
'control_bluesnap',
'control_paymentwall',
'control_payment',
'control_paypalexpress',
'control_paypalpro',
'control_payjunction',
'control_chargify',
'control_bluepay',
'control_braintree',
'control_2co',
'control_cardconnect',
'control_worldpay',
'control_worldpayus',
'control_eway',
'control_firstdata',
'control_paysafe',
'control_skrill',
'control_gocardless',
'control_clickbank',
'control_onebip'
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
    .range([1, 400]);

var chart = d3.select('#bar-chart')
    .attr('width', width);

function onError() {
	alert('Oops, something went wrong, or not.');
}

function findGateway(control) {
	let gateway;
	switch(control) {
		case('control_square'):
			gateway = 'Square';
			break;
		case('control_paypal'):
			gateway = 'PayPal';
			break;
		case('control_wepay'):
			gateway = 'WePay';
			break;
		case('control_authnet'):
			gateway = 'Authorize.Net';
			break;
		case('control_echeck'):
			gateway = 'eCheck';
			break;
		case('control_stripe'):
			gateway = 'Stripe';
			break;
		case('control_stripeACH'):
			gateway = 'Stripe ACH';
			break;
		case('control_sofort'):
			gateway = 'SOFORT';
			break;
		case('control_moneris'):
			gateway = 'Moneris';
			break;
		case('control_payu'):
			gateway = 'PayU';
			break;
		case('control_pagseguro'):
			gateway = 'PagSeguro';
			break;
		case('control_bluesnap'):
			gateway = 'BlueSnap';
			break;
		case('control_paymentwall'):
			gateway = 'Paymentwall';
			break;
		case('control_paypalexpress'):
			gateway = 'PayPal Express';
			break;
		case('control_paypalpro'):
			gateway = 'PayPal Pro';
			break;
		case('control_payjunction'):
			gateway = 'PayJunction';
			break;
		case('control_chargify'):
			gateway = 'Chargify';
			break;
		case('control_bluepay'):
			gateway = 'BluePay';
			break;
		case('control_braintree'):
			gateway = 'Braintree';
			break;
		case('control_2co'):
			gateway = '2Checkout';
			break;
		case('control_cardconnect'):
			gateway = 'CardConnect';
			break;
		case('control_worldpay'):
			gateway = 'Worldpay';
			break;
		case('control_worldpayus'):
			gateway = 'Worldpay US';
			break;
		case('control_eway'):
			gateway = 'eWAY';
			break;
		case('control_firstdata'):
			gateway = 'First Data';
			break;
		case('control_paysafe'):
			gateway = 'Paysafe';
			break;
		case('control_skrill'):
			gateway = 'Skrill';
			break;
		case('control_gocardless'):
			gateway = 'GoCardless';
			break;
		case('control_clickbank'):
			gateway = 'Clickbank';
			break;
		case('control_onebip'):
			gateway = 'Onebip';
			break;
		default: 
			gateway = 'Purchase Order';
	}
	return gateway;
}

function arrayify(rawForms, forms) {
	rawForms.forEach(form => forms.push([form.id, form.title, form.status]));
}

// we need the index of the first unshown form with the given total earnings. this will be crucial if there are several forms with the same total.
function findForm(total) {
	for (let i = 0; i < chartData.length; i ++) {
		if ((chartData[i].isShown == 0) && (parseFloat(chartData[i].total) == total)) {
			chartData[i].isShown = 1;
			return i;
		}
	}
}

function updateGraph() {
	ttlsData = ttlsData.sort(function(a,b) { return b-a; });
	x.domain([0, d3.max(ttlsData)]);
	chart.attr('height', barHeight * ttlsData.length + 20);
	
	var bar = chart.selectAll('g')
    	.data(ttlsData)
    .enter().append('g')
    	.attr('transform', function(d, i) { return 'translate(5,' + (i * barHeight + 5) + ')'; });

  	bar.append('rect')
    	.attr('width', x)
    	.attr('height', barHeight - 4);

  	bar.append('text')
      	.attr('x', function(d) { return x(d)+3; })
      	.attr('y', barHeight / 2)
      	.attr('dy', '.20em')
		.text( function(d) { 
			let i = findForm(d);
			return chartData[i].name + ' (' + (chartData[i].total).toFixed(2) + ' ' + chartData[i].currency + ')'; 
		});

	chart.append('g')
      	.attr('class', 'axis axis-x')
      	.attr('transform', 'translate( 5,' + (ttlsData.length * barHeight + 2) + ')')
      	.call(d3.axisBottom(x).tickFormat(function(d){ return d;}));

    window.localStorage.setItem('paymentForms', JSON.stringify(chartData));
}

function addFormToTable(form, total, currency) {
	// we need 2 seperate arrays for data. first array only consists of the total earnings, so that we can sort our data.
	// second array has the info to be shown for each form. isShown is 0 if the form is not shown yet. more detail can be found in 'findForm(total)'.
	table.innerHTML +=
			`<tr>
			<td scope='row'><a href='/form/${form[0]}'>${form[1]}</a></td> 
			<td>${form[2] == 'ENABLED' ? 'yes' : 'no'}</td>
			<td>${total} ${currency}</td>
			<td>${form[5]}</td>
			<td>${findGateway(form[4])}</td>
			</tr>`;
	setTimeout(() => {updateGraph()}, 300);
}

function getTotalEarned(form, qid) {
	JF.getFormSubmissions(form[0], function(res){
		let grandTotal = 0.00;
		let currency = JSON.parse(res[0].answers[qid].answer.paymentArray).currency;
		for (var i=0; i<res.length; i++) {
			if (res[i].answers && res[i].answers[qid].answer){
				grandTotal += parseFloat(JSON.parse(res[i].answers[qid].answer.paymentArray).total);
			}
		}
		ttlsData.push(grandTotal);
		chartData.push({isShown: 0, name: form[1], total: grandTotal, currency: currency, status: form[2], question: qid, id: form[0], control: form[4], paymentType: form[5]});
		addFormToTable(form, grandTotal.toFixed(2), currency)
	}, onError);
}

function isPayment(form) {
	if (form[2] == 'DELETED') return false;
	let questions = [];
	JF.getFormQuestions(form[0],function(res) {
		questions = res;
		for (var i=1; questions[i]; i++) {
			if (types.includes(questions[i].type)) {
				form[3] = true;
				form.push(questions[i].type);
				form.push(questions[i].paymentType);
				getTotalEarned(form, i);
				break;
			}
		}
	}, onError);
	return false;
}



window.addEventListener('load', function() {	
	// initialize API key
	apiKey = window.localStorage.getItem('apiKey');
	if (!apiKey) window.alert('You are not logged in, please navigate to home for logging in first.');
	JF.initialize({apiKey:apiKey});
	// get forms and check if they are payment forms
	JF.getForms(function(res){rawForms = res;
		arrayify(rawForms,forms);
		forms.forEach(form => form.push(isPayment(form)));
	},onError);

});
