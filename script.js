var moves;
var noEquipmentExercises;

$(document).ready(function(){

 if(localStorage.getItem('key')){
      noEquipmentExercises = JSON.parse(localStorage.getItem('key'));
 }else{
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

 //set up cache
    localStorage.setItem('key', JSON.stringify(noEquipmentExercises));
      

  },
  error: function ajaxError(){
    console.log("nope");
   }

  });
 }

//this is repeated because the ajax call is asynchronous and will not 
//reach the each and will return undefined
 $.each(noEquipmentExercises, function(key, val){
 $('.mainList').append('<option value="' + key + '">' + val.name + '</option>');
 });

 $('#routine').addClass('hide');
  var count = 0;

 $('form').on('submit', function(e){
  e.preventDefault(); 
//sets it to pushups if nothing is entered
  if( !$('.mainList').val() ) {
    $('.mainList').val("9");
    }
  moves = [$('#firstMove').val(), $('#secondMove').val(), $('#thirdMove').val(), $('#fourthMove').val()];
    

  $('#workout').addClass('hide').fadeOut(1000,function(){
    changeInfo();
  //store input vals into array
  // changeInfo();
  $('#routine').removeClass('hide');
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
      changeExerciseText(count);
      timer(60,changeInfo);
    }
    if(count === 4){
      $('#moveName').text('');
      $('#moveDescription').text('');
      $('#complete').html('<h1>Workout Complete!</h1>').fadeIn(2500); 
      $('body').sparkle({
        color: "rainbow",
        count: 5000,
        overlap: 0,
        speed: 2,
        minSize: 4,
        maxSize: 7,
        direction: "both",});
    }
  }

  
});