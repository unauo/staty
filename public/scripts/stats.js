'use strict';

// obvious.
var apiKey;

//all control_gateway fields available on JotForm.
var gateways = [ 'control_square', 'control_paypal', 'control_wepay', 'control_authnet', 'control_echeck', 'control_stripe',
'control_stripeACH', 'control_sofort', 'control_moneris', 'control_payu', 'control_pagseguro', 'control_bluesnap',
'control_paymentwall', 'control_payment', 'control_paypalexpress', 'control_paypalpro', 'control_payjunction', 'control_chargify',
'control_bluepay', 'control_braintree', 'control_2co', 'control_cardconnect', 'control_worldpay', 'control_worldpayus',
'control_eway', 'control_firstdata', 'control_paysafe', 'control_skrill', 'control_gocardless', 'control_clickbank', 'control_onebip' ];

// temporary location for forms.
var forms = [];
// html table.
var table = document.querySelector('#inner-table');
// data for our charts, also the data to be stored.
var chartData = []; 
// seperate important data arrays for different charts.
var ttlsData = [];
var gtwysData = [];
var typsData = [];

// some svg-d3 variables
var width = 800;
var barHeight = 50;
var x = d3.scaleLinear()
    .range([1, 500]);
var chart = d3.select('#bar-chart')
    .attr('width', width);

// to change inbetween graphs, we need to clean up the svg.
var toClean = document.querySelector("svg");

// we need a general alert function, because, because.
function onError() {
	alert('Oops, something went wrong, or not.');
}
// we also have a sorter for the html table, to sort the form by each field if asked.
function sortText(n) {
	var table, rows, switching, i, x, y, shouldSwitch, direction, switchcount = 0;
	var ints = [0,1,2,3,4,5,6,7,8,9];
	table = document.querySelector("#inner-table");
	switching = true;
	direction = "asc"; 

	while (switching) {
		switching = false;
		rows = table.rows;

		for (i = 0; i < (rows.length) - 1; i++) {
	  		shouldSwitch = false;
	  		x = rows[i].getElementsByTagName("td")[n].innerHTML;
	 		y = rows[i + 1].getElementsByTagName("td")[n].innerHTML;

	  		if (direction == "asc") {
	  			if (x[0] === "<" && x[30] === ">") {
			  			if (x.slice(31).toLowerCase() > y.slice(31).toLowerCase()) {
				  		shouldSwitch = true;
				  		break;
					}
		  		}
		  		else if (x == "yes" || x == "no") {
					if (x.toLowerCase() > y.toLowerCase()) {
				  		shouldSwitch = true;
				  		break;
		  			}
				}
		  		else if (parseFloat(x.split(" ")[0]) > (parseFloat(y.split(" ")[0]))){
		  			shouldSwitch = true;
		  			break;
		  		}
		  		else if ( !(ints.includes(parseFloat(x.split("")[0]))) && (x.toLowerCase() > y.toLowerCase()) ){
		  			shouldSwitch = true;
		  			break;
		  		}
		  	} 
		  	else if (direction == "desc") {
		  		if (x[0] === "<" && x[30] === ">") {
			  			if (x.slice(31).toLowerCase() < y.slice(31).toLowerCase()) {
				  		shouldSwitch = true;
				  		break;
					}
		  		}
		  		else if (x == "yes" || x == "no") {
		  			if (x.toLowerCase() < y.toLowerCase()) {
				  		shouldSwitch = true;
				  		break;
		  			}
				}
		  		else if (parseFloat(x.split(" ")[0]) < (parseFloat(y.split(" ")[0]))){
		  			shouldSwitch = true;
		  			break;
		  		}
		  		else if ( !(ints.includes(parseFloat(x.split("")[0]))) && (x.toLowerCase() < y.toLowerCase()) ){
		  			shouldSwitch = true;
		  			break;
		  		}
		  	}
		}
		if (shouldSwitch) {
		  	rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		  	switching = true;
		  	switchcount ++; 
		} 
		else {
		  	if (switchcount == 0 && direction == "asc") {
				direction = "desc";
				switching = true;
		  	}
		}
  	}
}



// we need to add the type to the "typsData" array.
function addType(type) {
	for (let i = 0; i < typsData.length; i++){
		if (typsData[i].name == type) {
			(typsData[i].value)++;
			return;
		}
	}
	let obj = {
		name: type,
		value: 1
	}
	typsData.push(obj);
}
// we need a switch-case for finding commercial name for a given control_gateway value.
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
// we need to add the gateway to the "gtwysData" array.
function addGateway(gateway) {
	for (let i = 0; i < gtwysData.length; i++){
		if (gtwysData[i].name == gateway) {
			(gtwysData[i].value)++;
			return;
		}
	}
	let obj = {
		name: gateway,
		value: 1
	}
	gtwysData.push(obj);
}



// we fire this function to create the "types" bar chart.
function typesCharter() {
	toClean.innerHTML = "";
	typsData = [];
	chartData.forEach(form => addType(form.type));
	typsData = typsData.sort(function(a,b) { return b.value-a.value; });
	x.domain([0, d3.max(typsData, function(d) { return d.value; })]);
	chart.attr('height', barHeight * typsData.length + 20);
	
	var bar = chart.selectAll('g')
    	.data(typsData)
    .enter().append('g')
    	.attr('transform', function(d, i) { return 'translate(5,' + (i * barHeight + 5) + ')'; });

  	bar.append('rect')
    	.attr('width', function(d) { return x(d.value); })
    	.attr('height', barHeight - 4);

  	bar.append('text')
      	.attr('x', function(d) { return x(d.value)+3; })
      	.attr('y', barHeight / 2)
      	.attr('dy', '.20em')
		.text( function(d) { return d.name; });

	chart.append('g')
      	.attr('class', 'axis axis-x')
      	.attr('transform', 'translate( 5,' + (typsData.length * barHeight + 2) + ')')
      	.call(d3.axisBottom(x).tickFormat(function(d){ return d;}));
}
// we fire this function to create the "gateways" bar chart.
function gatewaysCharter() {
	toClean.innerHTML = "";
	gtwysData = [];
	chartData.forEach(form => addGateway(form.gateway));
	gtwysData = gtwysData.sort(function(a,b) { return b.value-a.value; });
	x.domain([0, d3.max(gtwysData, function(d) { return d.value; })]);
	chart.attr('height', barHeight * gtwysData.length + 20);
	
	var bar = chart.selectAll('g')
    	.data(gtwysData)
    .enter().append('g')
    	.attr('transform', function(d, i) { return 'translate(5,' + (i * barHeight + 5) + ')'; });

  	bar.append('rect')
    	.attr('width', function(d) { return x(d.value); })
    	.attr('height', barHeight - 4);

  	bar.append('text')
      	.attr('x', function(d) { return x(d.value)+3; })
      	.attr('y', barHeight / 2)
      	.attr('dy', '.20em')
		.text( function(d) { return d.name; });

	chart.append('g')
      	.attr('class', 'axis axis-x')
      	.attr('transform', 'translate( 5,' + (gtwysData.length * barHeight + 2) + ')')
      	.call(d3.axisBottom(x).tickFormat(function(d){ return d;}));
}
// we fire this function to create the "earnings" bar chart.
function earningsCharter() {
	toClean.innerHTML = "";
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
			chartData[i].isShown = 0;
			return chartData[i].name + ' (' + (chartData[i].total).toFixed(2) + ' ' + chartData[i].currency + ')'; 
		});

	chart.append('g')
      	.attr('class', 'axis axis-x')
      	.attr('transform', 'translate( 5,' + (ttlsData.length * barHeight + 2) + ')')
      	.call(d3.axisBottom(x).tickFormat(function(d){ return d;}));
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
// we need a function to add forms to html table as they are loaded.
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
	// update local storage everytime a new form arrives. we need to store the forms for individual pages.
	window.localStorage.setItem('paymentForms', JSON.stringify(chartData));
}
// we need to fetch the payments for each form, while also fetching the currency of each. then we call addFormToTable() to add each form to html table.
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
		chartData.push({isShown: 0, name: form[1], total: grandTotal, currency: currency, status: form[2], question: qid, id: form[0], gateway: findGateway(form[4]), type: form[5], control: form[4]});
		addFormToTable(form, grandTotal.toFixed(2), currency);
	}, onError);
}
// by fetching all questions, we check if the form has any control_gateway field, meaning it is a payment form of some sort.
function isPayment(form) {
	if (form[2] == 'DELETED') return false;
	let questions = [];
	JF.getFormQuestions(form[0],function(res) {
		questions = res;
		for (var i=1; questions[i]; i++) {
			if (gateways.includes(questions[i].type)) {
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
	if (!apiKey) window.alert('You are not logged in, please login first.');
	JF.initialize({apiKey:apiKey});
	// get forms and check if they are payment forms
	JF.getForms(function(res){
		res.forEach(form => forms.push([form.id, form.title, form.status]));
		forms.forEach(form => form.push(isPayment(form)));
	},onError);

});
