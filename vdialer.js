

var speakbtn = document.querySelector("#speak");
var sayaudio = document.querySelector("#say");
var recognizing = false;

document.querySelector("#listening").style.display = 'none';
//document.querySelector("#lblstatus").style.display = 'none';


var speechrecognitionlist = new SpeechGrammarList();
speechrecognitionlist.addFromString  ( "  #JSGF V1.0; grammar test; public <simple> =    拨 电话 给 老婆 | 今天 天气 如何 | 我 有 多少 简讯 | 发 简讯 给 小明 说 我 晚点 到 | 手机 还 剩 多少 电量 ; ", 1 );     
var recognition = new SpeechRecognition();     

console.log("speakbtn");

speakbtn.onclick = function () 
{ 
  recognizing = true;
  say("How can I help you?","say"); 
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

          changelabel(interim_transcript);
          console.log("interim_transcript");


          if (interim_transcript.indexOf('天气') > -1)
          {
            say("台北今天是晴天，气温是摄氏二十五度","weather");
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';            
            document.querySelector("#battery").style.display = 'none';                        

            document.querySelector("#weather").style.display = 'block'; 

          }

         if (interim_transcript.indexOf('多少 简讯') > -1)
          {
            say("你有三封简讯和二十则未读邮件","message"); 
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';            
            document.querySelector("#battery").style.display = 'none';                        

            document.querySelector("#messages").style.display = 'block'; 

          }

         if (interim_transcript.indexOf('发 简讯') > -1)
          {
            say("好的，正在发送简讯给小明说你晚点到","text"); 
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';            
            document.querySelector("#battery").style.display = 'none';                        

            document.querySelector("#text").style.display = 'block';            

          }   

         if (interim_transcript.indexOf('电量') > -1)
          {
            say("手机电量还剩百分之七十五","battery"); 
            document.querySelector("#weather").style.display = 'none';
            document.querySelector("#messages").style.display = 'none';
            document.querySelector("#tel").style.display = 'none';
            document.querySelector("#fox").style.display = 'none';
            document.querySelector("#text").style.display = 'none';            
            document.querySelector("#battery").style.display = 'none';                        

            document.querySelector("#battery").style.display = 'block'; 

          }          

          if (interim_transcript.indexOf('电话') > -1)
          {
            say("好的，拨电话给老婆中","wife");

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
    };
}

function say(phrase,file)
{
    changelabel(phrase);
    /*
    urlaudio =  file + ".ogg";
 //   sayaudio.setAttribute("src","http://speechan.cloudapp.net/weblayer/synth.ashx?lng=en&msg=" + phrase); 

    setTimeout(function(){      

   var e = document.createElement("audio");
    e.src = urlaudio;
    e.setAttribute("autoplay", "true");
    //e.currentTime = 0;
    e.addEventListener("ended", onendspeak);


     }, 500);
*/
 

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

