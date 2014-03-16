debug = 1; // Debug 0 works as normal. Debug 1 disables POST. Debug 2 disables POST and prefills values.

api_url = "http://textbelt.com/text";
$(document).ready(function() {
	// In DEBUG mode, the actual POST request won't be sent, and dummy data fills in the fields.
	if(debug == 2){
		$("#message").text("test v"+Math.round(Date.now()/1000%1000,0));
		$("#message").css("opacity","1");
		$("#number").val("9785052128");
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

	// Remove and replace #message placeholder text.
	empty_message = true;
	$('#message').focus(function(){
		if($('#message').text() == "[your message]"){
			$('#message').text("");
			$('#message').click().click();
		}
		$('#message').css('opacity','1');
		$('#message').css('border','1px thin yellow');
	});
	$('#message').blur(function(){
		if($('#message').text() == ""){
			$('#message').text("[your message]");
			$('#message').css('opacity','.5');
		}
	});

	// When submit button is pressed...
	$("#button").click(function() {
		// Collect inputs...
		console.log("User clicked submit.");
		message = $("#message").text();
		number = $("#number").val();

		// Validate message...
		message_validated = false;
		if(message.length > 0 & message != "[your message]"){
			message_validated = true;
		}
		else{
			$("#message").css("border","yellow solid thin");		
		}

		// Validate number...
		number_validated = false;
		if( !(/^[0-9 +()-.]+$/.test(number)) ){ //regex checks if number consists of only digits, spaces, and +()-.
		}
		number = number.replace(/[^0-9]/g,'')
		if(number.length == 10){
			// $('input#number').attr("placeholder","Improper cell number format.");
			number_validated = true;
		}
		else if(number.length == 11 && number[0] == 1){ // if number has a leading 1, remove it. 
			number = number.slice(1);
			number_validated = true;
		}
		else{
			// $('input#number').attr("placeholder","Improper cell number format.");
			$("#number").css("border","yellow solid thin");
		}

		// if any chararacters other than integers and "+()-. " exist in number, ask user for proper formatting.
		// else if after stripping all non-numeric characters from number, there are fewer than 10 characters, complain.
		// else validate number.

		// What to do on successful POST:
		function onSuccess(info){
			console.log(message+" -> "+number+":"+JSON.stringify(info));
			// And inform user of success.
			$("#message").replaceWith("<span class=\"sentence\">\""+message+"\"</span>");
			$("#number").replaceWith("<span class=\"sentence\">"+number+".</span>");
			$("#button").replaceWith("<span class=\"sentence\">Texted</span>");
			$("h1").remove();
			$("#container").after("<h1><a href=\"\">Another?</a></h1>");
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
		else{
			console.log("Inputs did not pass validation.")
		}
	});
});