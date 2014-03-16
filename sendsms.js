debug = 0; // Debug 0 works as normal. Debug 1 disables POST. Debug 2 disables POST and prefills values.

api_url = "http://textbelt.com/text";
$(document).ready(function() {

	// In DEBUG mode, the actual POST request won't be sent, and dummy data fills in the fields.
	if(debug == 2){
		$("#message").text("test v"+Math.round(Date.now()/1000%1000,0));
		$("#message").css("opacity","1");
		$("#number").val("9785052128");
	}

	// Check validation on each keystroke.
	number_validated = false;
	message_validated = false;
	$("input").keyup(function(event) {
		// Validate number...
		number_validated = false;
		number = $("#number").val();
		if(number != ''){
			if( (/^[0-9 +()-.]+$/.test(number)) ){ //regex checks if number consists of only digits, spaces, and +()-.
				number = number.replace(/[^0-9]/g,'')	
				$("#number").css("border","none");
				if(number[0] == 1){ // if number has a leading 1, remove it. 
					number = number.slice(1);
				}
				if(number.length == 10){ //make sure number is the right length.
					number_validated = true;
				}
				else if(number.length > 10){ //number is too long.
					$("#number").css("border","yellow solid thin");
				}
			}
			else{
				$("#number").css("border","yellow solid thin");
			}
		}

		// Validate message...
		message_validated = false;
		message = $("#message").val();
		if(typeof message !== "undefined"){
			if(message.length > 0){
				message_validated = true;
			}
		}

		// If input is valid, underline Send button.
		if(message_validated & number_validated){
			$("#button").css("text-decoration","underline");
			console.log(message+' -> '+number+" is valid. "+debug);			
		}
		else{
			$("#button").css("text-decoration","none");
			console.log(message+' -> '+number+" is not yet valid. "+debug);			
		}

		// If user hits [enter], it will click submit.
	    if (event.which == 13) {
	        $("#button").click();
	    }
	});

	// $("input").focus(function() {
	// 	$(this).css('border','none');
	// });

	// When submit button is pressed...
	$("#button").click(function() {
		// Collect inputs...
		console.log("User clicked submit.");
		message = $("#message").val();
		number = $("#number").val().replace(/[^0-9]/g,'');
		if(number[0] == 1){ // if number has a leading 1, remove it. 
			number = number.slice(1);
		}

		// What to do on successful POST:
		function onSuccess(info){
			console.log(message+" -> "+number+":"+JSON.stringify(info));
			// And inform user of success.
			$("#message").replaceWith("<span class=\"sentence\">\""+message+"\"</span>");
			$("#number").replaceWith("<span class=\"sentence\">"+number+".</span>");
			$("#button").replaceWith("<span class=\"sentence\">Texted</span>");
			$("h1").text("");
			$("#container").after("<h1><a href=\"\"> Another?</a></h1>");
		}

		if(message_validated && number_validated){
			if(debug > 0){
				onSuccess('DEBUG MODE '+debug);
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
		else if(message_validated && !number_validated){
			$("#number").css("border","yellow solid thin");
		}
		else if(!message_validated && number_validated){
			$("#message").css("border","yellow solid thin");
		}
		else{
			$("#message").css("border","yellow solid thin");
			$("#number").css("border","yellow solid thin");
			console.log(message+" -> "+number+" did not pass validation.")
		}
	});
});