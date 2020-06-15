var accessToken = "22b6d67f63b14a23a47a87f1c684a8ca";
var baseUrl = "https://api.api.ai/v2/";
var temp;
var synth ;
$(document).ready(function () {
  var back = ["#3961a0", "#7748a2", "#3e848e", "#349696", "#429e79"];
  var rand = back[Math.floor(Math.random() * back.length)];
  $('body').css('background',rand);
})
$(document).ready(function() {
    window.speechSynthesis.cancel();
    $("#input").keypress(function(event) {
        window.speechSynthesis.cancel();
        if (event.which == 13) {
            event.preventDefault();
            send();
        }
    });
    $("#rec").on("click", function(event) {
        window.speechSynthesis.cancel();
        switchRecognition();
    });
});
var recognition;
function startRecognition() {
    recognition = new webkitSpeechRecognition();
	recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = function(event) {
	updateRec();
    };
    recognition.onresult = function(event) {
	recognition.onend = null;
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function() {
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}
function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}
function setInput(text) {
    $("#input").val(text);
    send();
}
function updateRec() {
	// change button text
    $("#rec").html(recognition ? "<i class='material-icons'>mic_off</i>" : "<i class='material-icons'>mic</i>");
}

// function send() {
//     var text = $("#input").val();
//     $.ajax({
//         type: "POST",
//         url: baseUrl + "query?v=20150910",
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         headers: {
//             "Authorization": "Bearer " + accessToken
//         },
//         data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
//         success: function(data) {
//             setResponse(JSON.stringify(data, undefined, 2));
//         },
//         error: function() {
//             setResponse("Error in communicating with the server.");
//         }
//     });
// }
function send(val) {
//$("#response").text(val);
var url = $("#input").val();
url = url.split(' ').join('+');
url = "https://api.duckduckgo.com/?q="+url+"&ia=answer&format=json";
var obj = JSON.parse(val);
var response = obj.result.fulfillment.messages[0].speech;//testo a capo  //obj.result.fulfillment.speech;
if (response == "empty"){
	$.getJSON(url, function(abc) {
		var text2 = abc.Answer;
        var text = abc.Abstract;
        if(text !== ""){
            $("#response").html(text);
		}else if(text2 !== ""){
            $("#response").html(text2);
		}else{
            $("#response").html("Sorry, I could not answer that.");
		}
		temp = "";
		if(temp!== $("#response").text()){
			respond();
			temp = $("#response").text();
		}
    });
}else if(response == "calc"){
    calculate();
    if(temp!== $("#response").text()){
        respond();
        temp = $("#response").text();
    }
}else
    $("#response").html(response);
    if(temp!== $("#response").text()){
		respond();
		temp = $("#response").text();
	}
}
function respond() {
        var fin = $("#response").text();
        var voices = window.speechSynthesis.getVoices();
		var msg = new SpeechSynthesisUtterance(fin);
        msg.voice = voices[1];
        window.speechSynthesis.speak(msg);
}
function calculate() {
    var str = $('#input').val();
    var final = eval(str);
    $("#response").html("The answer is " + final + ".");
}
