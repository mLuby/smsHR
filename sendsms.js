debug = true;
api_url = "http://textbelt.com/text";
$(document).ready(function() {
	if(debug){
		$("input#message").val("test v"+Math.round(Date.now()/1000%1000,0));
		$("input#number").val("9785052128");
	}
	// When submit button is pressed...
	$("#button").click(function() {
		// Collect inputs...
		console.log("User clicked submit.");
		message = $("input#message").val();
		number = $("input#number").val();
		// Validate values...
		validated = true;
		if(message.length == 0){
			validated = false;
			$('input#message').attr("placeholder","Type your message here.");
			$("input#message").css("border","thin solid red");
		}
		if(number.length == 0){
			$('input#number').attr("placeholder","Enter receipient's cell number here.");
			validated = false;
			$("input#number").css("border","thin solid red");
		}
		else if(number.length < 10){
			$('input#number').attr("placeholder","Improper cell number format.");
			validated = false;
			$("input#number").css("border","thin solid red");
		}
		if(validated){
			// POST to the API...
			$.ajax({
				type: "POST",
				url: api_url,
				data: "&number="+number+"&message="+message,
				success: function(info) {
					console.log(message+" -> "+number+":"+JSON.stringify(info));
					// And inform user of success.
					$("#send").text("Successfully texted");
					$("input#message").replaceWith("<span class=\"send_sentence\">\""+message+"\"</span>");
					$("input#number").replaceWith("<span class=\"send_sentence\">"+number+".</span>");
					$("#button").remove();
					$(".send_sentence").css("color", "green");
				},
				error: function(info) {
					// Or log error if POST fails.
					console.log('Ajax POST failed:'+JSON.stringify(info));
				}
			});
		}
	});
});