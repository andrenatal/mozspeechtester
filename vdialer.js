

var speakbtn = document.querySelector("#speak");
var sayaudio = document.querySelector("#say");
var recognizing = false;
var final_transcript = "";
var sr = new SpeechRecognition();

document.querySelector("#listening").style.display = 'none';
//document.querySelector("#lblstatus").style.display = 'none';


buildAppsGrammar();


function startengines(){
    var grammar = "#JSGF v1.0; grammar fxosVoiceCommands; " +
            //TIMER
        "<timer> = establecer un temporizador para [( <hours> horas )] [and] [ (<minutes> | <extended>)  minutes] ; <hours> = uno | dos | tres | cuatro | cinco | seix | siete | ocho | nueve | diez | once | doce | trece | catorce | quince | dieciséis | diecisiete | dieciocho | diecinueve | veinte | veinte uno | veinte dos | veinte tres; <minutes> = uno | dos | tres | cuatro | cinco | seix | siete | ocho | nueve | diez | once | doce | trece | catorce | quince | dieciseis | diecisiete | dieciocho | diecinueve; <extended> = <extended_0> [<extended_1>]; <extended_0> = veinte | treinta | cuarenta | cincuenta ; <extended_1> = uno | dos | tres | cuatro | cinco | seix | siete | ocho | nueve  ;" +

            // ALARM
        "<alarm> = establecer un alarma para [( <hours_alarm> )]  [ e (<minutes> | <extended>)] [da] ( manana | noche | tarde )  ; <hours_alarm> =    uno | dos | tres | cuatro | cinco | seix | siete | ocho | nueve | diez | once | doce ;" +

            // APP
        "<app> = phone | contacts | "+appsGrammar+";" +

            //CONTACT
        "<contact> = " + contactsGrammar + ";  public <simple> = arrancar <app> | llamar <contact> | <timer> | <alarm>  ;"

    console.log(grammar);

    sr = new SpeechRecognition();
    var sgl = new SpeechGrammarList();
    sgl.addFromString(grammar ,1);
    //sr.grammars = sgl;
    changelabel("Push the microphone and say any app or contact name");
}

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
    sr.start(); // Validation of sr.grammars occurs here
    sr.onresult = function(event)
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

