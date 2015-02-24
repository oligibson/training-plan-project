'use strict';

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('L6ejXRbcxPz57P8Qq3boAw');

/**
* Sends an email to the user
*/
function sendEmail() {
	var template_name = "notification";
	var template_content = [];
	var message = {
	    "subject": "Welcome to Training App",
	    "from_email": "oli@oligibson.com",
	    "from_name": "Oli Gibson",
	    "to": [{
	            "email": "oligibson1@gmail.com",
	            "name": "Oli Gibson",
	            "type": "to"
	        }],
	    "headers": {
	        "Reply-To": "oli@oligibson.com"
	    },
	    "track_opens": null,
	    "track_clicks": null
	};

	mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message}, function(result) {
	    console.log(result);
	    /*
	    [{
	            "email": "recipient.email@example.com",
	            "status": "sent",
	            "reject_reason": "hard-bounce",
	            "_id": "abc123abc123abc123abc123abc123"
	        }]
	    */
	}, function(e) {
	    // Mandrill returns the error as an object with name and message keys
	    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
}

exports.sendEmail = sendEmail;