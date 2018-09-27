"use strict";

// stored forms array
const allForms = JSON.parse(window.localStorage.getItem('paymentForms'));
// form info div
var header = document.querySelector("#form-info");
// rendered page's form
var formInfo = [];
// submissions of the form
var submissions = [];
// html table
var table = document.querySelector('#inner-table');
// huge product array
var productData = [];
// form index of formInfo in allForms
var formIndex;
// keep up with updated t
var t = 0;
// total vs submissions time line chart
var timeArray = [];
// product vs submissions time line chart data
var productTimes = [];

// sets up formID 
function setForm(formID) {
	for (let i = 0; i < allForms.length; i++) {
		if (allForms[i].id == formID) {
			formInfo = allForms[i];
			formIndex = i;
			return formInfo;
		}
	}
	return false;
}
// edits the page content 
function editHeader(t) {
	header.innerHTML ='';
	var title = document.createElement('h2');
	title.innerHTML = `Statistics for your form: <i><a href="https://jotform.com/${formInfo.id}">${formInfo.name}</a></i>`;
	header.appendChild(title);
	var total = document.createElement('p');
	// if t is zero, it's the first call, otherwise it's an update call
	if (t) {
		total.innerHTML = `Total earnings from this ${formInfo.type} form: ${t.toFixed(2)} ${formInfo.currency}`;
		allForms[formIndex].total = t;
		window.localStorage.setItem('paymentForms', JSON.stringify(allForms));
	}
	else {
		total.innerHTML = `Total earnings from this ${formInfo.type} form: ${formInfo.total.toFixed(2)} ${formInfo.currency}`;
	}
	header.appendChild(total);
	var status = document.createElement('p');
	status.innerHTML = `All payments on this form is made via ${formInfo.gateway}. Currently, this form is ${formInfo.status == 'ENABLED' ? 'still' : 'not'} accepting payments.`
	header.appendChild(status);
	var sublink = document.createElement('p');
	sublink.innerHTML = `<a href = "https://jotform.com/submissions/${formInfo.id}">Click here</a> to view this form's submissions on JotForm.`;
	header.appendChild(sublink);
}
// sorter for the html table, to sort the form by each field if asked
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


// given the products array, parses and creates the "product(count)" string
function stringifyProducts(productsArray) {
	let productString = '';
	for (let i = 0; productsArray[i]; i++){
		if (i != 0) productString+= ', ';
		productString += productsArray[i].name + '(' + productsArray[i].y + ')';
	}
	return productString;
}
//given each submission's answer field, parses and extracts product name & count array, increments productData and adds the submission to productTimes
function getProductCount(answer, time) {
	let products = [];
	for (let i = 0; answer[i]; i++) {
		if (JSON.parse(answer[i]).name) {
			let count;
			if (JSON.parse(answer[i]).options[0] && JSON.parse(answer[i]).options[0].selected) {
				count = parseFloat(JSON.parse(answer[i]).options[0].selected);
			}
			else count = 1;
			let obj = {
				name: JSON.parse(answer[i]).name,
				y: count
			}
			products.push(obj);
			let newArr = [time, count];
			let found = 0;
			for (let j = 0; productData[j]; j++) {
				if (obj.name == productData[j].name) {
					found = 1;
					productData[j].y += count;
					charter(productData);
					for (let k = 0; productTimes[k]; k++) {
						if (productTimes[k].name == obj.name) {
							productTimes[k].data.push(newArr);
							productTimes[k].data.sort((a,b) => a[0] - b[0]);
							productLineCharter(productTimes);
						}
					}
				}
			}
			// new array = [submissionTime, count]
			
			// if product is not in productData array, we create a new product object and push it.
			if (!found) {
				let newObj = {
					name: JSON.parse(answer[i]).name,
					y: count
				} 
				productData.push(newObj);
				charter(productData);
				let newSeriesObj = {
					name: JSON.parse(answer[i]).name,
					data: [newArr]
				}
				productTimes.push(newSeriesObj);
				productLineCharter(productTimes);
			}
		}
	}
	return products;
}
// creates an array with submission info then calls tableify for each submission
function arrayify(answers, name, email, control) {
	for (let i = 0; answers[i]; i++) {
		let products = getProductCount(answers[i].answers[control].answer, Date.parse(answers[i].created_at));
		let obj = {
			id: answers[i].id,
			time: answers[i].created_at,
			name: answers[i].answers[name] && answers[i].answers[name].prettyFormat,
			email: answers[i].answers[email] && answers[i].answers[email].answer,
			payment: JSON.parse(answers[i].answers[control].answer.paymentArray),
			answer: answers[i].answers[control].answer,
			products: products
		};
		t += JSON.parse(obj.payment.total);
		submissions.push(obj);
		timeArray.push([Date.parse(obj.time), parseFloat(obj.payment.total)]);

	}
	if (t != formInfo.total) editHeader(t);
	submissions.forEach(item => tableify(item));
}
// axios request for submissions
function getFormSubmissions(formID, apiKey) {
	let email = -1;
	let name = -1;
	let control;
	axios.get('https://api.jotform.com/form/' + formID + '/submissions?apiKey=' + apiKey)
		.then(function (response) {
    		if (response.data.responseCode != 200) {
    			throw new Error('oops, something went wrong!');
    			return;
    		}
    		axios.get('https://api.jotform.com/form/' + formID + '/questions?apiKey=' + apiKey)
    			.then(function(res) {
    				if (res.data.responseCode != 200) {
		    			throw new Error('oops, something went wrong!');
		    			return;
    				}
    				let responses = Object.keys(res.data.content).map(i => res.data.content[i]);
    				for (let i = 1; responses[i]; i++){
    					if (responses[i].type == 'control_email') email = responses[i].qid;
    					else if (responses[i].type == 'control_fullname') name = responses[i].qid;
    					else if (responses[i].type == formInfo.control) control = responses[i].qid;
    				}
    				arrayify(response.data.content, name, email, control);
    			})
  		});
}
// html table creator
function tableify(item) {
	table.innerHTML +=`
		<tr>
		<td>${!item.name ? '-' : item.name}</td> 
		<td>${!item.email ? '-' : item.email}</td>
		<td>${item.payment.total + ' ' + item.payment.currency}</td>
		<td>${stringifyProducts(item.products)}</td>
		</tr>
	`;
	sortText(2);
	timeArray.sort((a,b) => a[0] - b[0]);
	lineCharter(timeArray);
}

// decider function to chart the data as bar or pie
function charter(data) {
	if (data.length < 10) pieCharter(data);
	else barCharter(data);
}

// creates the piechart of products
function pieCharter(data){
	var clear = document.querySelector('#product-chart');
	clear.innerHTML = '';
	var pieColors = (function () {
	  	var colors = [];
	    var base = '#fa8900';
	    var i;
		for (i = 0; i < data.length; i++) {
		    colors.push(Highcharts.Color(base).brighten((2*i - 3) / 7).get());
	  	}
	  	return colors;
	}());

	Highcharts.chart('product-chart', {
  		chart: {
  			backgroundColor: '#212529',
	    	plotBackgroundColor: '#212529',
	    	plotBorderWidth: null,
	    	plotShadow: false,
	    	type: 'pie'
  		},
  		title: {
    		text: 'products',
    		style: { "color": "#ffffff" }
  		},
  		tooltip: {
    		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  		},
  		plotOptions: {
    		pie: {
      			allowPointSelect: true,
      			cursor: 'pointer',
      			colors: pieColors,
      			dataLabels: {
        			enabled: true,
        			format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
        			distance: -50,
	        		filter: {
	          			property: 'percentage',
	          			operator: '>',
	          			value: 3
	        		}
      			}
    		}
  		},
	  	series: [{
		    name: 'share',
		    data: data,
  		}]
	});
}

// creates the barchart of products 
function barCharter(data){
	var clear = document.querySelector('#product-chart');
	clear.innerHTML = '';
	Highcharts.chart('product-chart', {
  		chart: {
    		type: 'bar',
    		backgroundColor: '#212529',
		    plotBackgroundColor: '#212529',
		    colorAxis: { 
		    	gridLineColor: '#eadbcc',
		    	labels: { 
		    		style: { "color": "#dddddd" }
		    	}
			}
  		},
  		title: {
    		text: 'products',
    		style: { "color": "#ffffff" }
  		},
  		plotOptions: {
  			bar: {
  				pointStart: 1
  			}
  		},
 		yAxis: {
    		min: 0,
    		title: {
      			text: 'count'
    		},
    		gridLineColor: '#666666',
    		allowDecimals: false
  		},
  		xAxis:{
  			min: 1
  		},
  		legend: {
    		enabled: false
  		},
  		tooltip: {
    		pointFormat: 'count: <b>{point.y:.0f} </b>'
  		},
  		series: [{
    		name: 'count',
    		data: data,
    		color: '#fa8900',
    		dataLabels: {
      			enabled: true,
      			color: '#ffffff',
      			align: 'right',
      			format: '{point.name}', 
      			y: 10, // 10 pixels down from the top
      			style: {
			        fontSize: '13px',
			        fontFamily: 'Verdana, sans-serif'
      			}
    		}
  		}]
	});
}

// creates the linechart for payment/time graph 
function lineCharter(data) {
	var clear = document.querySelector('#line-chart');
	clear.innerHTML = '';
    Highcharts.chart('line-chart', {
      	chart: {
	        zoomType: 'x',
	        backgroundColor: '#212529',
		    plotBackgroundColor: '#212529',
		    colorAxis: { 
		    	gridLineColor: '#eadbcc',
		    	labels: { 
		    		style: { "color": "#dddddd" }
		    	}
			}
      	},
	    title: {
	        text: 'payments over time',
	        style: { "color": "#ffffff" }
      	},
      	subtitle: {
        	text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
        	style: { "color": "#cccccc" }
      	},
	    xAxis: {
	        type: 'datetime',
	        gridLineColor: '#222222'
	    },
	    yAxis: {
	    	gridLineColor: '#666666',
	        title: {
	          	text: 'payment amount',
	          	style: { "color": "#cccccc" }
	        }
	    },
	    legend: {
	        enabled: false,
	    },
	    plotOptions: {
	        area: {
	        	fillColor: {
	            	linearGradient: {
			            x1: 0,
			            y1: 0,
			            x2: 0,
			            y2: 1
	            	},
	            	stops: [
	              		[0, '#fa8900'],
	              		[1, Highcharts.Color('#fa8900').setOpacity(0).get('rgba')]
	            	]
	          	},
	          	marker: {
	            	radius: 2
	          	},
	          	lineWidth: 1,
          		states: {
            		hover: {
              			lineWidth: 1
            		}
          		},
	          	threshold: null
	        }
	    },
	    series: [{
	    	color: '#fa8900',
	        type: 'area',
	        name: 'payment',
	        data: data
	    }]
    });
}

function productLineCharter(data) {
	var clear = document.querySelector('#product-line-chart');
	clear.innerHTML = '';
	var lineColors = (function () {
	  	var colors = [];
	    var base = '#fa8900';
	    var i;
		for (i = 0; i < data.length; i++) {
		    colors.push(Highcharts.Color(base).brighten((2*i - 3) / 7).get());
	  	}
	  	return colors;
	}());
	Highcharts.chart('product-line-chart', {
  		chart: {
    		type: 'spline',
    		zoomType: 'x',
	        backgroundColor: '#212529',
		    plotBackgroundColor: '#212529',
		    colorAxis: { 
		    	gridLineColor: '#eadbcc',
		    	labels: { 
		    		style: { "color": "#dddddd" }
		    	}
			}
		},
		title: {
    		text: 'product purchases over time',
    		style: { "color": "#ffffff" }
  		},
		xAxis: {
			type: 'datetime',
  		},
  		yAxis: {
    		title: {
      			text: 'product count',
      			style: { "color": "#cccccc" }
    		},
    		min: 0,
    		gridLineColor: '#666666',
    		allowDecimals: false
  		},
  		legend: {
	        itemStyle: { "color": "#ffffff" }
	    },
  		tooltip: {
    		headerFormat: '<b>{series.name}</b><br>',
    		pointFormat: 'count: {point.y:.0f}'
  		},
  		plotOptions: {
    		spline: {
      			marker: {
        			enabled: true
      			}
    		}
  		},
  		colors: lineColors,
		series: JSON.parse(JSON.stringify(data))
	});
}





