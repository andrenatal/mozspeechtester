

var speakbtn = document.querySelector("#speak");
var sayaudio = document.querySelector("#say");
var recognizing = false;
var final_transcript = "";

document.querySelector("#listening").style.display = 'none';
//document.querySelector("#lblstatus").style.display = 'none';


var speechrecognitionlist = new SpeechGrammarList();
speechrecognitionlist.addFromString  ( " #JSGF V1.0; grammar test; <numbers> = oh | zero | one | two | three | four | five | six | seven | eight | nine; public <final_digits> = <numbers>+;", 1 );
var recognition = new SpeechRecognition();

console.log("speakbtn");

speakbtn.onclick = function ()
{
  recognizing = true;
  say("How can I help you?");
}


function onendspeak()
{
    if (!recognizing)
    {
        return;
    }
    changelabel("Listening...");
    document.querySelector("#fox").style.display = 'none';
    document.querySelector("#listening").style.display = 'block';
    document.querySelector("#lblstatus").style.display = 'block';

    document.querySelector("#weather").style.display = 'none';
    document.querySelector("#messages").style.display = 'none';
    document.querySelector("#tel").style.display = 'none';
    document.querySelector("#fox").style.display = 'none';
    document.querySelector("#text").style.display = 'none';
    document.querySelector("#battery").style.display = 'none';

    console.log('starting')
    recognition.start();
    recognition.onresult = function(event)
    {
          recognizing = false;
          document.querySelector("#listening").style.display = 'none';

          var final_transcript = '';
          var score = '';

          // Assemble the transcript from the array of results
          for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                  console.log("recognition.onresult : isFinal");
                  final_transcript += event.results[i][0].transcript;
              } else {
                  console.log("recognition.onresult : not isFinal");
                  interim_transcript += event.results[i][0].transcript;
                  score = event.results[i][0].confidence;
              }
          }

          changelabel(final_transcript);
          console.log("interim_transcript: " + final_transcript);

/*
          if (final_transcript.indexOf('weather') > -1)
          {
            say("Today it is 75 degrees and sunny in Mountain View");
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';
            document.querySelector("#battery").style.display = 'none';

            document.querySelector("#weather").style.display = 'block';

          }

         if (final_transcript.indexOf('messages') > -1)
          {
            say("You have 3 texts and 20 unread emails.");
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';
            document.querySelector("#battery").style.display = 'none';

            document.querySelector("#messages").style.display = 'block';

          }

         if (final_transcript.indexOf('text') > -1)
          {
            say("Ok. I am texting Josh saying you are late");
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';
            document.querySelector("#battery").style.display = 'none';

            document.querySelector("#text").style.display = 'block';

          }

         if (final_transcript.indexOf('battery') > -1)
          {
            say("I still have 75 percent of battery remaining.");
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';
            document.querySelector("#battery").style.display = 'none';

            document.querySelector("#battery").style.display = 'block';

          }

          if (final_transcript.indexOf('call') > -1)
          {
            say("Ok. I am calling Samanta.")

            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';
            document.querySelector("#battery").style.display = 'none';

            document.querySelector("#tel").style.display = 'block';

            setTimeout(function(){

                searchcontact("Samanta");

             }, 5000);


          }
          */
    };
}

function say(phrase)
{
    changelabel(phrase);


       setTimeout(function() {
      var speechSynthesisUtterance = new SpeechSynthesisUtterance(phrase);
      // XXX: Language should be detected based on system language.
      speechSynthesisUtterance.lang = 'en';
      speechSynthesisUtterance.addEventListener('end', (function() {
        // Enable the speak button.
        //this.setSpeakButtonState(false);
        onendspeak();
        // If we're waiting for a command, start listening.
        if (aIsWaitingForCommandResponse) {
          this.listen();
        }
      }).bind(this));
      speechSynthesis.speak(speechSynthesisUtterance);
    }.bind(this),
    100);




}


function searchcontact(name)
{
      var allContacts = navigator.mozContacts.getAll({sortBy: "familyName", sortOrder: "descending"});
      allContacts.onsuccess = function(event) {
        var cursor = event.target;
        if (cursor.result) {
          console.log("Found from all contacts: " + cursor.result.name[0]  + " tel: " + cursor.result.tel[0].value );

          if (cursor.result.name[0].toLowerCase() == name)
          {
            console.log("achou " + cursor.result.name[0].toLowerCase() + " " + cursor.result.tel[0].value );
            call(cursor.result.tel[0].value);
          }
          cursor.continue();
        } else {
          console.log("No more contacts");
        }
      };

      allContacts.onerror = function() {
        console.warn("Something went terribly wrong! :(");
      };

}



function call(number)
{
      // Telephony object
    var tel = navigator.mozTelephony;
    // Place a call
    var telCall = tel.dial(number);
    telCall.onactive = function(e) {
        changelabel("");
        window.console.log('Connected!');
    }
    telCall.ondisconnected = function(e) {
        changelabel("");
        window.console.log('Disconnected!');
        // update call history
    }
    telCall.onerror = function(e) {
        changelabel("");
        window.console.error(e);
    }
}

function changelabel(str){
  document.querySelector("#lblstatus").style.display = 'block';
  document.querySelector("#lblstatus").innerHTML = str;
}

