var moves;
var noEquipmentExercises;

$(document).ready(function(){

  $.ajax({
   method:"Get",
   url: "https://wger.de/api/v2/exercise/?limit=349", //my api key fe637184d6483dfedd86b92c8cbacad3a943afba
   dataType: "json",

  success: function ajaxSucess(data){ 

    noEquipmentExercises = data.results.filter(function(result) {

  // check whether result.equipment corresponds to not needing equipment.
  // 7 refers to no body, language 2 is English
    //this returns 14 results, as an array of Objects
    return (result.equipment.indexOf(7) > -1  && result.language === 2 );

    });

//https://developerdan77.wordpress.com/2011/10/14/dynamically-populate-a-select-element-from-json-data-with-jquery/
 //option ID was changed to option value, so the data from noEquip. is stored with a key value  
    $.each(noEquipmentExercises, function(key, val){
      $('.mainList').append('<option value="' + key + '">' + val.name + '</option>');

    });

  },
   error: function ajaxError(){
      console.log("nope");
      }

  });

$('#routine').addClass('yo');
  var count = 0;

  $('form').on('submit', function(e){
    e.preventDefault(); 
    moves = [$('#firstMove').val(), $('#secondMove').val(), $('#thirdMove').val(), $('#fourthMove').val()];
    $('#workout').addClass('yo').fadeOut(1000,function(){
      changeInfo();
  //store input vals into array
   // changeInfo();
    $('#routine').removeClass('yo');
    $('#routine').append("<br><button id='reset'>Reset</button>").css('align', 'center');
      $('#reset').click(function(){window.location.reload();}); 
   });
  });

  function changeExerciseText(num){

    var exercise = noEquipmentExercises[moves[num]];
    $('#moveName').text(exercise.name).hide().fadeIn(2500);
    $('#moveDescription').html(exercise.description).hide().fadeIn(2500); 
  }

  function timer(startCount,cb){
    var timer = setInterval(function(){
      $('#timer').text(startCount);
      startCount--;
      if(startCount < 1){
          $('#audio')[0].play();

      }
     
      if(startCount < 0){
          clearInterval(timer);
          $('#timer').text('');
          count++;
          cb();
      } 
    },1000);
  }

  function changeInfo(){  
    if(count < moves.length){
          // $('#audio').on("canplay", function() {
          //   $('#audio')[0].play();
          // });
        changeExerciseText(count);
        timer(2,changeInfo);
    }
    if(count === 4){
      $('#moveName').text('');
      $('#moveDescription').text('');
      $('#complete').html('<h1>Workout Complete!</h1>').fadeIn(2500); 
      $('body').sparkle({color: "rainbow",
  count: 3000,
  overlap: 0,
  speed: 1,
  minSize: 4,
  maxSize: 7,
  direction: "both",});
    }
  }

  
});