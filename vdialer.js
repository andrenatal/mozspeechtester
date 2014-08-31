

var speakbtn = document.querySelector("#speak");

speakbtn.onclick = function () {

    var speechrecognitionlist = new SpeechGrammarList();
    var recognition = new SpeechRecognition();     
    speechrecognitionlist.addFromString  ( "#JSGF V1.0; grammar test; public <simple> =  john murphy | chris lee | andre natal  ; ", 1 );     
    recognition.grammars = speechrecognitionlist;                    
    recognition.start();


    recognition.onresult = function(event) {

      console.log("recognition.onresult called");

      var interim_transcript = '';
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

      console.log("interim:  " + interim_transcript);
      console.log("final:    " + final_transcript);
      
      var allContacts = navigator.mozContacts.getAll({sortBy: "familyName", sortOrder: "descending"});

      allContacts.onsuccess = function(event) {
        var cursor = event.target;
        if (cursor.result) {
          console.log("Found from all contacts: " + cursor.result.givenName[0] );
          call('011999192783');
          cursor.continue();
        } else {
          console.log("No more contacts");
        }
      };

      allContacts.onerror = function() {
        console.warn("Something went terribly wrong! :(");
      };
    };
  
}


function call(number)
{
      // Telephony object
    var tel = navigator.mozTelephony;
    // Place a call
    var telCall = tel.dial(number);  
    telCall.onactive = function(e) {
        window.console.log('Connected!');
    }
    telCall.ondisconnected = function(e) {
        window.console.log('Disconnected!');
        // update call history
    }
    telCall.onerror = function(e) {
        window.console.error(e);
    }

}
