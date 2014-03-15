debug = false;

api_url = "http://textbelt.com/text";
$(document).ready(function() {
	// In DEBUG mode, the actual POST request won't be sent, and dummy data fills in the fields.
	if(debug){
		$("input#message").val("test v"+Math.round(Date.now()/1000%1000,0));
		$("input#number").val("9785052128");
	}

	// // Create a breakpoint for small window sizes.
	// if( $(window).width() <= 980 ){
	// 	$("h1").text($(window).width());
	// 	$("input#message").after("<br />");		
	// }

	// If user hits [enter], it will click submit.
	$("input").keypress(function(event) {
	    if (event.which == 13) {
	        // event.preventDefault();
	        $("#button").click();
	    }
	});

	// When submit button is pressed...
	$("#button").click(function() {
		// Collect inputs...
		console.log("User clicked submit.");
		message = $("input#message").val();
		number = $("input#number").val();
		// Validate message...
		message_validated = false;
		if(message.length > 0){
			message_validated = true;
		}
		else{
			// $('input#message').attr("placeholder","Type your message here.");
			$("input#message").css("border","thin solid red");		
		}
		// Validate message...
		number_validated = false;
		if( !(/^[0-9 +()-.]+$/.test(number)) ){ //regex checks if number consists of only digits, spaces, and +()-.
			console.log(number);
		}
		console.log('old number: '+number);
		number = number.replace(/[^0-9]/g,'')
		console.log('new number: '+number);
		if(number.length == 10){
			// $('input#number').attr("placeholder","Improper cell number format.");
			number_validated = true;
			$("input#number").css("border","thin solid red");
		}
		else if(number.length == 11 && number[0] == 1){ // if number has a leading 1, remove it. 
			number = number.slice(1);
			number_validated = true;
			console.log('number w/o leading 1: '+number);
		}
		else{
			// $('input#number').attr("placeholder","Improper cell number format.");
			$("input#number").css("border","thin solid red");
		}

		// if any chararacters other than integers and "+()-. " exist in number, ask user for proper formatting.
		// else if after stripping all non-numeric characters from number, there are fewer than 10 characters, complain.
		// else validate number.

		// What to do on successful POST:
		function onSuccess(info){
			console.log(message+" -> "+number+":"+JSON.stringify(info));
			// And inform user of success.
			$("#send").text("Successfully texted");
			$("input#message").replaceWith("<span class=\"sentence\">\""+message+"\"</span>");
			$("input#number").replaceWith("<span class=\"sentence\">"+number+".</span>");
			$("#button").replaceWith("<span class=\"sentence\">Texted</span>");
			$('h1').replaceWith("<h1>Sent SMS. <a href=\"\">Another?</a></h1>");
		}

		if(message_validated && number_validated){
			if(debug){
				onSuccess('DEBUG MODE');
			}
			else{
				// POST to the API...
				$.ajax({
					type: "POST",
					url: api_url,
					data: "&number="+number+"&message="+message,
					success: function(info) {
						onSuccess(info);
					},
					error: function(info) {
						// Or log error if POST fails.
						console.log('Ajax POST failed:'+JSON.stringify(info));
					}
				});
			}
		}
		else{
			console.log("Inputs did not pass validation.")
		}
	});
});