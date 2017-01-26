//example deleted user has been removed due to api issue with returning erroneous stream request response for deleted users
var users = ["ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "freecodecamp"];
var api = {
  base: "https://wind-bow.gomix.me/twitch-api/",
  channel: "channels/",
  stream: "streams/",
  callback: "?callback=?"
};

$(document).ready(function() {
  getChannelData(); //loads twitch users
  $("#all-streamers").on("click", function() { //displays all streamers
    $(".online, .offline").removeClass("hidden");
  });
  $("#online-streamers").on("click", function() { //hides offline streamers
    $(".offline").addClass("hidden");
    $(".online").removeClass("hidden");
  });
  $("#offline-streamers").on("click", function() { //hides online streamers
    $(".online").addClass("hidden");
    $(".offline").removeClass("hidden");
  });
  $("#add-user").on("click", function() { //adds twitch username to user list and displays their status/channel info
    addUser();
  });
  $("#remove-user").on("click", function() { //removes twitch username from user list and removes their status/channel info
    removeUser();
  });
  $("#refresh-streamers").on("click", function() { //refreshes streamer list
    getChannelData();
  });
});

function addUser() { //I will possibly change this function to use regular expression for case insensitivity
  var x = document.getElementById("user-box").value;
  if (users.indexOf(x) < 0) {
    users.push(x);
  }
  getChannelData();
  document.getElementById("user-box").value="";
}

function removeUser() {  //I will possibly change this function to use regular expression for case insensitivity
  var x = document.getElementById("user-box").value;
  
  for (var i = 0; i < users.length; i++) {
    if (x === users[i]) {
      users.splice(i, 1);
    }
  }
  getChannelData();
  document.getElementById("user-box").value="";
}

function getChannelData() {
  $("#stream-container").html(""); //solves duplication of status/channel issue
  users.forEach(function(user) {
    $.getJSON(api.base + api.stream + user + api.callback, function(data) { //checks online/offline status
      var streamGame;
      var streamStatus;
      if (data.stream === null) {
        streamGame = "Offline";
        streamStatus = "offline";
      } else if (data.stream === undefined) {
        streamGame = user + "'s account has been deleted";
        streamStatus = "offline";
      } else {
        streamGame = data.stream.channel.status;
        streamStatus = "online";
      }
      $.getJSON(api.base + api.channel + user + api.callback, function(data) { //gets and displays channel info
        var link = data.url;
        var logo = data.logo;
        var displayName = data.display_name;
        html = '<div class=" row streamer ' + streamStatus + '"><div class="col-xs-2 col-sm-2" id="streamLogo"><a href="' + link + '" target="_blank"><img class="streamerLogo" src="' + logo + '"></a></div><div class="col-xs-10 col-sm-3" id="name"><a href="' + link + '" target="_blank">' + displayName + '</a></div><div class="col-xs-10 col-sm-7" id="streaming"><a href="' + link + '" target="_blank"><em>' + streamGame + '<em></a></div></div>';
        if (streamStatus === "online") {
          $("#stream-container").prepend(html); //online users are displayed above
        } else {
          $("#stream-container").append(html); //offline users are displayed below
        }
      }); //getJSON request 2
    }); //getJSON request 1
  }); //forEach
}


