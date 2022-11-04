/**
 * Returns the current datetime for the message creation.
 */
function getCurrentTimestamp() {
	return new Date();
}

questionType = 0

/**
 * Renders a message on the chat screen based on the given arguments.
 * This is called from the `showUserMessage` and `showBotMessage`.
 */
function renderMessageToScreen(args) {
	// local variables
	let displayDate = (args.time || getCurrentTimestamp()).toLocaleString('en-IN', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});
	let messagesContainer = $('.messages');

	// init element
	let message = $(`
	<li class="message ${args.message_side}">
		<div class="avatar"></div>
		<div class="text_wrapper">
			<div class="text">${args.text}</div>
			<div class="timestamp">${displayDate}</div>
		</div>
	</li>
	`);

	// add to parent
	messagesContainer.append(message);

	// animations
	setTimeout(function () {
		message.addClass('appeared');
	}, 0);
	messagesContainer.animate({ scrollTop: messagesContainer.prop('scrollHeight') }, 300);
}

/**
 * Displays the user message on the chat screen. This is the right side message.
 */
function showUserMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'right',
	});
}

/**
 * Displays the chatbot message on the chat screen. This is the left side message.
 */
function showBotMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'left',
	});
}

/**
 * Get input from user and show it on screen on button click.
 */
$('#send_button').on('click', function (e) {
	// get and show message and reset input
	userMessage = $('#msg_input').val().trim();
	botMessage = 'Type Class or Material';

	if (userMessage.length == 0) {
		return;
	}
	
	showUserMessage($('#msg_input').val());

	if(questionType == 0){
		if(userMessage == "Class") {
			questionType = 1
			botMessage = "Enter a question"
		} else if(userMessage == "Material") {
			questionType = 2
			botMessage = "Enter a question"
		}
		
		$('#msg_input').val('');

		// show bot message
		setTimeout(function () {
			showBotMessage(botMessage);
		}, 200);
	} else if(questionType == 1) {
		async function sendMessage() {
			const response = await fetch('http://127.0.0.1:5000/postClassMessage', {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ message: userMessage }),
			});
			response.json().then((data) => {
				console.log('1 ' + data['message']);
				botMessage = data['message'];
			});
		}
	
		data = sendMessage();
	
		$('#msg_input').val('');
		questionType = 0;
		// show bot message
		setTimeout(function () {
			showBotMessage(botMessage);
			botMessage = 'Type Class or Material'
			showBotMessage(botMessage);
		}, 2000);
	} else if(questionType == 2){
		async function sendMessage() {
			const response = await fetch('http://127.0.0.1:5000/postMaterialMessage', {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({ message: userMessage }),
			});
			response.json().then((data) => {
				console.log('1 ' + data['message']);
				botMessage = data['message'];
			});
		}
	
		data = sendMessage();
	
		$('#msg_input').val('');
		questionType = 0;
		// show bot message
		setTimeout(function () {
			showBotMessage(botMessage);
			botMessage = 'Type Class or Material'
			showBotMessage(botMessage);
		}, 5000);
	}
});

/**
 * Returns a random string. Just to specify bot message to the user.
 */
function randomstring(length = 20) {
	let output = '';

	// magic function
	var randomchar = function () {
		var n = Math.floor(Math.random() * 62);
		if (n < 10) return n;
		if (n < 36) return String.fromCharCode(n + 55);
		return String.fromCharCode(n + 61);
	};

	while (output.length < length) output += randomchar();
	return output;
}

/**
 * Set initial bot message to the screen for the user.
 */
$(window).on('load', function () {
	showBotMessage('Hello there! Type Class or Material.');
});
