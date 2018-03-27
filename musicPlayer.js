/*
The player is only for repeating songs, saving them in localStorage or navigating
through playlists and history and starred.
For playing and pausing songs, use the default youtube buttons for play and pause.
There are 2 player states:
1.(not saved state) This state is for videos that are not in local storage. If the
	video currently in webpage is not in localStorage, this player is loaded. It
	gives you two buttons: repeat the video with default time or setTime and repeat.
	Only the video thumbnail and its title is shown. When any one of the buttons is
	clicked, player state 2 is loaded.
	CONTAINS buttons repeat and setTime.
2. (saved state) This state is for videos that already present in localStorage. 

Get URL of webpage from 
Identify the video in the webpage, get title, thumbnail, 
*/


console.log("YRP Popup.js has loaded!!");

var video_detail = {
	url: "",
	repeats: 0,
	title: "",
	playlist: "",
	starred: false,
	startTime: 0,
	endTime: 0
};



/*
//scrap the video element from webpage
var vid = document.getElementsByTagName('video');
var vid_length = vid[0].duration;


video_detail.url = 
video_detail.title = document.querySelector('h1.title').innerText;*/



// sets listener to openModal button for click action
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("openModal").addEventListener("click", popupModal);
});

//local storage
chrome.storage.local.get("count", function(data) {
    
});

chrome.storage.local.get("title", function(data){
	var txt = data.title;
	console.log("The "+ txt);
	var title1 = document.getElementById("txt");
	title1.textContent = txt;
});


function popupModal() {
	console.log("openModal button clicked!");
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){ 
    	//console.log("Reached");
    	chrome.tabs.sendMessage(tabs[0].id, {task: "setTimeModal"});
   });
}

/*

var url = data.count;
console.log(url);
var videoid = data.count.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
if(videoid != null) {
	console.log("video id = ",videoid[1]);
} else { 
    console.log("The youtube url is not valid.");
}
var src1 ="https://i1.ytimg.com/vi/"+videoid[1]+"/default.jpg";
console.log(src1);
var img1 = document.getElementById("mimg");
img1.src = src1;
*/