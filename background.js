console.log("Background JS has loaded");
/*
Everything starts with the click on BrowserAction.
*/

var player = {
	active: false,
	tab_id: 0,
	active_url: ""
};

//********************************************************************************
// EVERYTHING starts with the user clicking on the BrowserAction button
chrome.browserAction.onClicked.addListener(function(){
	/*
		1.when player is not active, first time player load
		2.when player already active, either toggle or player active tab change
	*/

	//1.player not active
	if(!player.active) {
		//console.log("First time player load()");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			player.active = true;
			player.tab_id = tabs[0].id;
			player.active_url = tabs[0].url;
			chrome.tabs.sendMessage(player.tab_id, {task:"loadPlayer"});
		});
	}
	//2.player active
	else { 
		/*
			1.toggle condition, hide/show the music player
			2.active tab change 
		*/
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			//1.toggle condition
			if(tabs[0].id == player.tab_id) {
				console.log("toggle player message sent");
				chrome.tabs.sendMessage(tabs[0].id, {task:"togglePlayer"})
			}
			//2.active tab change
			else {  
				/*
					1.close the previous running music player
					2.load the music player in this new tab
				*/
				//1.
				chrome.tabs.sendMessage(player.tab_id, {task:"closePlayer"});
				//2.
				player.tab_id = tabs[0].id;
				player.active_url = tabs[0].url;
				chrome.tabs.sendMessage(player.tab_id, {task:"loadPlayer"});
			}
		});
	}
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "checkRefreshState") {
		console.log("Message received to check refresh state for Tab");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			if(player.active) {
				if(tabs[0].id == player.tab_id)
					sendResponse({refreshState: true});
				else {
					sendResponse({refreshState: false});	
				}
			}
			else {
				sendResponse({refreshState: false});
			}
		});
	}
	return true;
});
//Remember to use 'return true' https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent


/*
Whenever the ACTIVE TAB is updated, send message to content_script to change state
of the player.
*/
chrome.tabs.onUpdated.addListener( //whenever any of the tab is updated
  function(tabId, changeInfo, tab) {
  	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		//console.log("tabs[0] " + tabs[0].id);
  		//console.log("tab" + player_tab_id);
  		if(tabs[0].id == player.tab_id && tabs[0].url != player.active_url) { //if the updated tabID matches the player_tab_id
  			console.log("Active player Tab updated");
  			chrome.tabs.sendMessage(player.tab_id, {task:"playerTabUpdated"});
  		}
  	});
  }
);

// listens for getCurrentTabID task and sends the current tab ID
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	/*NOT needed*/
	if(message.task == "getCurrentTabId") {
		console.log("Message <content.js> getCurrentTabId");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			sendResponse({activeTabId: tabs[0].id});
		});		
	}
	return true;
});

// listens for getPlayerTabId task and sends player.tab_id
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	/*NOT needed*/
	if(message.task == "getPlayerTabId") {
		console.log("Message <content.js> getPlayerTabId");
		sendResponse({playerTabId: player.tab_id});
	}
	return true;
});

// listens for getCurrentTabUrl task and sends current tab Url
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if(message.task == "getCurrentTabUrl") {
		console.log("Message <content.js> getCurrentTabUrl");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			sendResponse({activeTabId: tabs[0].url});
		});		
	}
	return true;
});