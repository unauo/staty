var apiKey;
window.addEventListener("load", function(){		
	apiKey = localStorage.getItem('apiKey');
	if (!apiKey) window.alert("You are not logged in, please navigate to home for logging in first.");
});
