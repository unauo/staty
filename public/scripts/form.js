"use strict";

// stored forms array
const allForms = JSON.parse(window.localStorage.getItem('paymentForms'));
// form info div
var header = document.querySelector("#form-info");
// rendered page's form
var formInfo;
// submissions of the form
var submissions = [];
// html table
var table = document.querySelector('#inner-table');

// sets up formID 
function setForm(formID) {
	for (let i = 0; i < allForms.length; i++) {
		if (allForms[i].id == formID) {
			formInfo = allForms[i];
			return formInfo;
		}
	}
	return false;
}

// edits the page content 
function editHeader() {
	var title = document.createElement('h2');
	title.innerHTML = `Statistics for your form: <i><a href="https://jotform.com/${formInfo.id}">${formInfo.name}</a></i>`;
	header.appendChild(title);
	var total = document.createElement('p');
	total.innerHTML = `Total earnings from this ${formInfo.type} form: ${formInfo.total.toFixed(2)} ${formInfo.currency}`;
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

// creates an array with submission info then calls tableify for each submission
function arrayify(answers, name, email, control) {
	for (let i = 0; answers[i]; i++) {
		let obj = {
			id: answers[i].id,
			time: answers[i].created_at,
			name: answers[i].answers[name] && answers[i].answers[name].prettyFormat,
			email: answers[i].answers[email] && answers[i].answers[email].answer,
			payment: JSON.parse(answers[i].answers[control].answer.paymentArray),
		};
		submissions.push(obj);
	}
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
    			alert('oops, something went wrong!');
    			return;
    		}
    		axios.get('https://api.jotform.com/form/' + formID + '/questions?apiKey=' + apiKey)
    			.then(function(res) {
    				if (response.data.responseCode != 200) {
		    			alert('oops, something went wrong!');
		    			return;
    				}
    				for (let i = 1; res.data.content[i]; i++){
    					if (res.data.content[i].type == 'control_email') email = i;
    					else if (res.data.content[i].type == 'control_fullname') name = i;
    					else if (res.data.content[i].type == formInfo.control) control = i;
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
		</tr>
	`;
}










