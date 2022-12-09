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
	botMessage = 'Ask me a Question';
	botMessageFlask = "";
	botMessageRasa = "";
	probabilityFlask = 0;

	if (userMessage.length == 0) {
		return;
	}
	
	showUserMessage($('#msg_input').val());
	async function sendMessageFlask() {
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
			botMessageFlask = data['message'];
			probabilityFlask = data['probability'];
		});
	}
    async function sendMessageRasa() {
        const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ sender: "test_user", message: userMessage }),
        });
        response.json().then((data) => {
            console.log('1 ' + data[0]);
            botMessageRasa = data[0].text;
        });
    }
	
    data1 = sendMessageFlask();
    data2 = sendMessageRasa();

    $('#msg_input').val('');

    document.getElementById('qq').style.visibility = "visible";
    setTimeout(function () {
		
        document.getElementById('qq').style.visibility = "hidden";
    }, 5000)
    // show bot message
    setTimeout(function () {
		botMessage = botMessageRasa
		if(probabilityFlask > 0.25){
			botMessage = botMessageFlask;
		}
        showBotMessage(botMessage);
    }, 5000);
});

$('#sum_button').on('click', function (e) {
	document.getElementById("msg_input").value = document.getElementById("msg_input").value + "\\sum_{}^{}";
})

$('#sub_button').on('click', function (e) {
	document.getElementById("msg_input").value = document.getElementById("msg_input").value + "_{}";
})

$('#super_button').on('click', function (e) {
	document.getElementById("msg_input").value = document.getElementById("msg_input").value + "^{}";
})

$('#fraction_button').on('click', function (e) {
	document.getElementById("msg_input").value = document.getElementById("msg_input").value + "\\frac{}{}";
})

$('#log_button').on('click', function (e) {
	document.getElementById("msg_input").value = document.getElementById("msg_input").value + "\\log ";
})

$('#bigO_button').on('click', function (e) {
	document.getElementById("msg_input").value = document.getElementById("msg_input").value + "O\\left (  \\right )";
})
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
$(window).on('load', function () {
	showBotMessage('Hi! I am Temoc.');
});
