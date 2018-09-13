"use strict";

const allForms = JSON.parse(window.localStorage.getItem('paymentForms'));
var header = document.querySelector("#form-info");
var formInfo;

function setForm(formID) {
	for (let i = 0; i < allForms.length; i++) {
		if (allForms[i].id == formID) {
			formInfo= allForms[i];
			return formInfo;
		}
	}
	return false;
}

function editHeader() {
	var title = document.createElement('h2');
	title.innerHTML = `Statistics for your form: <i><a href="https://jotform.com/${formInfo.id}">${formInfo.name}</a></i>`;
	header.appendChild(title);
	var total = document.createElement('p');
	total.innerHTML = `Total earnings from this form: ${formInfo.total.toFixed(2)} ${formInfo.currency}`;
	header.appendChild(total);
	var status = document.createElement('p');
	status.innerHTML = `${ formInfo.status == 'ENABLED' ? 'This form is still accepting submissions.' : 'This form is not accepting submissions.'}`
	header.appendChild(status);
	var sublink = document.createElement('p');
	sublink.innerHTML = `<a href = "https://jotform.com/submissions/${formInfo.id}">Click here</a> to view this form's submissions on JotForm.`;
	header.appendChild(sublink);
}

function getFormQuestions(formID, apiKey) {
	axios.get('https://api.jotform.com/form/' + formID + '/questions?apiKey=' + apiKey)
		.then(function (response) {
    		console.log(response);
  		})
  		.catch(function (error) {
    		console.log(error);
  		})
}

