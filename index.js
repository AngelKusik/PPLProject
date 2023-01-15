// Author: Angelica Kusik
// Date: October 12, 2022
//Last Updated: October 31, 2022

//global variable
//if user has a session, save it on a global variable
session = JSON.parse(sessionStorage.getItem("current_session"));

//Check if user has a session, if not create one
if (!(sessionStorage.current_session)){
  //create a session and set the status of all videos in all pages to no:
  const json =  JSON.stringify({
    "index.html": "NO",
    "scenario1.html": "NO",
    "scenario1_feedback_A.html": "NO",
    "scenario1_feedback_B.html": "NO",
    "scenario2.html": "NO",
    "scenario2_feedback_A.html": "NO",
    "scenario2_feedback_B.html": "NO",
    "scenario3.html": "NO",
    "scenario3_feedback_A.html": "NO",
    "scenario3_feedback_B.html": "NO",
    "scenario1_completed": "NO",
    "scenario2_completed": "NO",
    "scenario3_completed": "NO"

  });

  //set the session
  sessionStorage.setItem("current_session", json);

  //parse the current session into an obj and save it on a variable
  session = JSON.parse(sessionStorage.getItem("current_session"));


  //console.log(sessionStorage.getItem("current_session")); //test
 
}
else {
  //if user has a session, check if they watched the page's video, if so, enable buttons
  //Note: Buttons are disabled by default, so if user refresh page, even with the status set 
  //to "YES", the buttons will be disabled.
  var current_page = get_page_pathname();


  if (session[current_page] == 'YES'){
    //if user didn't watch the video, disable the buttons
    enable_buttons(current_page);
  }

  //check if user completed the scenarios

  //Check if scenario 1 is completed (intro video, scenario video, and one of the feedback videos watched == completed)
  if(session["index.html"] == 'YES' && session["scenario1.html"] == 'YES' && session["scenario1_feedback_A.html"] == 'YES')
  {
    //set scenario 1 to completed
    session["scenario1_completed"] = 'YES';
    //after updating the json, use it to update the value on the session
    sessionStorage.setItem("current_session", JSON.stringify(session));

    //Add completed class to the button to give the user a visual cue that the scenario was completed
    $("#index > div .button:first").addClass("completed");
    $("#index > div .button:first label").append('✔️');

  }

  if(session["index.html"] == 'YES' && session["scenario2.html"] == 'YES' && session["scenario2_feedback_A.html"] == 'YES')
  {
    //set scenario 2 to completed
    session["scenario2_completed"] = 'YES';
    //after updating the json, use it to update the value on the session
    sessionStorage.setItem("current_session", JSON.stringify(session));

    //Add the completed class to the button to give the user a visual cue that the scenario was completed
    $("#index > div .button:odd").addClass("completed");
    $("#index > div .button:odd label").append('✔️');
    
  }

  if(session["index.html"] == 'YES' && session["scenario3.html"] == 'YES' && session["scenario3_feedback_A.html"] == 'YES')
  {
    //set scenario 3 to completed
    session["scenario3_completed"] = 'YES';
    //after updating the json, use it to update the value on the session
    sessionStorage.setItem("current_session", JSON.stringify(session));

    //Add completed class to the button to give the user a visual cue that the scenario was completed
    $("#index > div .button:last").addClass("completed");
    $("#index > div .button:last label").append('✔️');

  }

  //Check if all 3 scenarios were completed
  if(session["scenario1_completed"] == 'YES' && session["scenario2_completed"] == 'YES' && session["scenario3_completed"] == 'YES')
  {
    //if so display congratulations message
    $(document).ready(function(){
      // Show the Modal on load
      $("#congratulationsModal").modal("show");
    });
  }
}

//When the user finish watching the entire video, set the session to YES and enabled the buttons

$('video').bind("ended", function(e) {

  //get the current page pathname
  watched_video = get_page_pathname();

  //set the status of the video on the current page to 'YES' on the json obj
  session[watched_video] = 'YES';
  //after updating the json, use it to update the values on the session
  sessionStorage.setItem("current_session", JSON.stringify(session));
 
  //Call enable button function
  enable_buttons(watched_video);
  //Call the unlock_feedback function, if the user watched one of the feedback
  //videos from a scenario, it will unlock the buttons on the second feedback page of
  //the same scenario.
  unlock_feedback(watched_video); 

});

//console.log(session); //Test


//BUTTONS:
//Makes the divs that contain the radio buttons clickable, so the user can click the 
//radio button by clicking on the div (card)
$("div .button").on("click", function(e) {
  current_page = get_page_pathname();
  //if the user watched the video on the current page
  if (session[current_page] == "YES") 
  {
    //Get the button that was clicked
    radio_btn = $(this).find('input[type=radio]');
    $(radio_btn).prop("checked", true);

    //Get the id of the button that was clicked and use it to redirect
    //the user to the correspondent page
    button_clicked = $(radio_btn).attr("id");
    redirect(button_clicked);

  }
  else {
    alert("You must watch the video to unlock the buttons!");
  }

});

// FOOTER
//Dinamically getting the value of "year" for the footer
$('#year').text(new Date().getFullYear());

//FUNCTIONS

function get_page_pathname() {
  //returns an array containing all the parts of the pathname  
  var pathname = window.location.pathname.toString().split('/'); 

  //get the last element in the array, which is the page's name
  var array_lenght = pathname.length;
  var page_name = pathname[array_lenght -1];

  return page_name;
}

function enable_buttons(page) {
  //disable the buttons accordingly 
  switch (page) {
    case "index.html":
      //disable button
      $("input[name=choose_scenario]").attr("disabled", false);
      //remove the disabled-effect class from the buttons
      $("#index > div .button").removeClass("disabled-effect");
      //remove the locked emoji from the buttons
      $("#index > div .button:first label").html("<strong>Scenario 1:</strong> Writing Secondary Journalism");
      $("#index > div .button:odd label").html('<strong>Scenario 2:</strong> Dealing with Bias');
      $("#index > div .button:last label").html('<strong>Scenario 3:</strong> Fake News');
      break;
    case "scenario1.html":
      $("input[name=choose_answer_scenario1]").attr("disabled", false);
      $("#scenario1 > div .button").removeClass("disabled-effect");
      //remove the locked emoji from the buttons
      $("#scenario1 > div .button:first label").html("<strong>A:</strong> You write a “synopsis” of this great article that you found; after all, it has all the information you need, and you don’t want to risk using information from sources that you don’t trust.");
      $("#scenario1 > div .button:last label").html("<strong>B:</strong> You use this great article that you found as one of your sources, but since you can’t find more reliable information about the movie, you write a listicle of the top 5 roles that the star of the film has played so you can stay on topic but write something original.");
      break;
    case "scenario2.html":
      $("input[name=choose_answer_scenario2]").attr("disabled", false);
      $("#scenario2 > div .button").removeClass("disabled-effect");
      //remove the locked emoji from the buttons
      $("#scenario2 > div .button:first label").html("<strong>A:</strong> You write a review only saying good things about the restaurant to convince people to check it out, but you have an honest conversation with your friend pointing out all the problems you have seen and asking him to fix them – after all, you have been friends for so long and you want him to succeed.");
      $("#scenario2 > div .button:last label").html("<strong>B:</strong>	You write an objective review describing your experience at the restaurant, including the good and the bad, hoping that people will give it a chance, but first you tell your friend the things you think he can improve on so when the review is published, and people start coming in, he can impress them – after all, you have been friends for so long and you want him to succeed.");
      break;
    case "scenario3.html":
      $("input[name=choose_answer_scenario3]").attr("disabled", false);
      $("#scenario3 > div .button").removeClass("disabled-effect");
      //remove the locked emoji from the buttons
      $("#scenario3 > div .button:first label").html("<strong>A:</strong>	You write the piece; after all, you have the picture as evidence, and it’s an excellent opportunity for the magazine to get tons of views.");
      $("#scenario3 > div .button:last label").html("<strong>B:</strong>	You wait until you have the chance to do some further investigation and proof, but it might cost you the opportunity to publish it first.");
      break; 
    case "scenario1_feedback_A.html":
    case "scenario1_feedback_B.html":
      $("input[name=feedback_scenario1_A]").attr("disabled", false);
      $("#scenario1_f_A > div .button").removeClass("disabled-effect");
      $("input[name=feedback_scenario1_B]").attr("disabled", false);
      $("#scenario1_f_B > div .button").removeClass("disabled-effect");

      //remove the locked emoji from the buttons
      $("#scenario1_f_A > div .button:first label").html("Go back to the Home page to start next scenario.");
      $("#scenario1_f_A > div .button:last label").html("Go back to Scenario 1.");
      $("#scenario1_f_B > div .button:first label").html("Go back to the Home page to start next scenario.");
      $("#scenario1_f_B > div .button:last label").html("Go back to Scenario 1.");
      break;
    case "scenario2_feedback_A.html":
    case "scenario2_feedback_B.html":
      $("input[name=feedback_scenario2_A]").attr("disabled", false);
      $("#scenario2_f_A > div .button").removeClass("disabled-effect");
      $("input[name=feedback_scenario2_B]").attr("disabled", false);
      $("#scenario2_f_B > div .button").removeClass("disabled-effect");

      //remove the locked emoji from the buttons
      $("#scenario2_f_A > div .button:first label").html("Go back to the Home page to start next scenario.");
      $("#scenario2_f_A > div .button:last label").html("Go back to Scenario 2.");
      $("#scenario2_f_B > div .button:first label").html("Go back to the Home page to start next scenario.");
      $("#scenario2_f_B > div .button:last label").html("Go back to Scenario 2.");
      break;
    case "scenario3_feedback_A.html":
    case "scenario3_feedback_B.html":
      $("input[name=feedback_scenario3_A]").attr("disabled", false);
      $("#scenario3_f_A > div .button").removeClass("disabled-effect");
      $("input[name=feedback_scenario3_B]").attr("disabled", false);
      $("#scenario3_f_B > div .button").removeClass("disabled-effect");

      //remove the locked emoji from the buttons
      $("#scenario3_f_A > div .button:first label").html("Go back to the Home page to start next scenario.");
      $("#scenario3_f_A > div .button:last label").html("Go back to Scenario 3.");
      $("#scenario3_f_B > div .button:first label").html("Go back to the Home page to start next scenario.");
      $("#scenario3_f_B > div .button:last label").html("Go back to Scenario 3.");
      break; 

    default: console.log();
  }
}

function set_button_to_pressed(page) {
  //disable the buttons accordingly 
  switch (page) {
    case "index.html":
      $("#index > div .button").addClass("pressed");
      break;
    case "scenario1.html":
      $("#scenario1 > div .button").addClass("pressed");
      break;
    case "scenario2.html":
      $("#scenario2 > div .button").addClass("pressed");
      break;
    case "scenario3.html":
      $("#scenario3 > div .button").addClass("pressed");
      break; 
    case "scenario1_feedback_A.html":
      $("#scenario1_f_A > div .button").addClass("pressed");
      break;
    case "scenario1_feedback_B.html":
      $("#scenario1_f_B > div .button").addClass("pressed");
      break;
    case "scenario2_feedback_A.html":
      $("#scenario2_f_A > div .button").addClass("pressed");
      break;
    case "scenario2_feedback_B.html":
      $("#scenario2_f_B > div .button").addClass("pressed");
        break;
    case "scenario3_feedback_A.html":
      $("#scenario3_f_A > div .button").addClass("pressed");
      break;
    case "scenario3_feedback_B.html":
      $("#scenario3_f_B > div .button").addClass("pressed");
        break;   

    default: console.log();
  }
}

//redirect() 
//Description: Takes as a parameter the id of the button the user clicked and redirect the user to 
//the correspondent page.
//Here we are using replace() to prevent user to go back to previous page using the browser navigation
function redirect(destination) {
  switch (destination) {
    case "home":
      location.replace("index.html") //Can use assign() instead of replace to enable user to go back to previous page using browser navigation
      break;
    case "scenario1":
      location.replace("scenario1.html") 
      break;
    case "scenario2":
      location.replace("scenario2.html")
      break;
    case "scenario3":
      location.replace("scenario3.html")  
      break; 
    case "1_alternative_A":
      location.replace("scenario1_feedback_A.html")
      break;
    case "1_alternative_B":
      location.replace("scenario1_feedback_B.html")  
      break;
    case "2_alternative_A":
      location.replace("scenario2_feedback_A.html")
      break;
    case "2_alternative_B":
      location.replace("scenario2_feedback_B.html")  
      break;  
    case "3_alternative_A":
      location.replace("scenario3_feedback_A.html")
      break;
    case "3_alternative_B":
      location.replace("scenario3_feedback_B.html")  
      break;     

    default: console.log();
  }
}

function unlock_feedback(watched_video) {
  switch (watched_video) {
    case "scenario1_feedback_A.html":
      //set the status of feedback B to YES as well to unlock the buttons
      session["scenario1_feedback_B.html"] = 'YES';
      //after updating the json, use it to update the values on the session
      sessionStorage.setItem("current_session", JSON.stringify(session));
      break;
    case "scenario1_feedback_B.html":
      session["scenario1_feedback_A.html"] = 'YES';
      sessionStorage.setItem("current_session", JSON.stringify(session));
      break;
    case "scenario2_feedback_A.html":
      session["scenario2_feedback_B.html"] = 'YES';
      sessionStorage.setItem("current_session", JSON.stringify(session));
      break;
    case "scenario2_feedback_B.html":
      session["scenario2_feedback_A.html"] = 'YES';
      sessionStorage.setItem("current_session", JSON.stringify(session));
      break; 
    case "scenario3_feedback_A.html":
      session["scenario3_feedback_B.html"] = 'YES';
      sessionStorage.setItem("current_session", JSON.stringify(session));
      break;
    case "scenario3_feedback_B.html":
      session["scenario3_feedback_A.html"] = 'YES';
      sessionStorage.setItem("current_session", JSON.stringify(session));
      break;

    default: console.log();
  }
}

// function disable_buttons(page) {
//   //disable the buttons accordingly 
//   switch (page) {
//     case "index.html":
//       //disable button
//       $("input[name=choose_scenario]").attr("disabled", true);
//       //add the disabled-effect class to the button
//       $("#index > div .button").addClass("disabled-effect");
//       break;
//     case "scenario1.html":
//       $("input[name=choose_answer_scenario1]").attr("disabled", true);
//       $("#scenario1 > div .button").addClass("disabled-effect");
//       break;
//     case "scenario2.html":
//       $("input[name=choose_answer_scenario2]").attr("disabled", true);
//       $("#scenario2 > div .button").addClass("disabled-effect");
//       break;
//     case "scenario3.html":
//       $("input[name=choose_answer_scenario3]").attr("disabled", true);
//       $("#scenario3 > div .button").addClass("disabled-effect");
//       break; 
//     case "scenario1_feedback_A.html":
//       $("input[name=feedback_scenario1_A]").attr("disabled", true);
//       $("#scenario1_f_A > div .button").addClass("disabled-effect");
//       break;
//     case "scenario1_feedback_B.html":
//       $("input[name=feedback_scenario1_B]").attr("disabled", true);
//       $("#scenario1_f_B > div .button").addClass("disabled-effect");
//       break;
//     case "scenario2_feedback_A.html":
//       $("input[name=feedback_scenario2_A]").attr("disabled", true);
//       $("#scenario2_f_A > div .button").addClass("disabled-effect");
//       break;
//     case "scenario2_feedback_B.html":
//       $("input[name=feedback_scenario2_B]").attr("disabled", true);
//       $("#scenario2_f_B > div .button").addClass("disabled-effect");
//         break;
//     case "scenario3_feedback_A.html":
//       $("input[name=feedback_scenario3_A]").attr("disabled", true);
//       $("#scenario3_f_A > div .button").addClass("disabled-effect");
//       break;
//     case "scenario3_feedback_B.html":
//       $("input[name=feedback_scenario3_B]").attr("disabled", true);
//       $("#scenario3_f_B > div .button").addClass("disabled-effect");
//         break;   

//     default: console.log();
//   }
// }

  



