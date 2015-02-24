'use strict';

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('L6ejXRbcxPz57P8Qq3boAw');

/**
* Sends an email to the user
*/
function sendEmail(template, subject, user, content) {
	var template_name = template;
	var template_content = content || [];
	var message = {
	    "subject": subject,
	    "from_email": "oli@oligibson.com",
	    "from_name": "Oli Gibson",
	    "to": [{
	            "email": user.email,
	            "name": user.fname + " " + user.lname,
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