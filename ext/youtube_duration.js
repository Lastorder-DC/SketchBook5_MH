/*
* @file youtube_duration.js
* @brief This script is used to add the ability to click on the time in the comment and move to that time in the YouTube video.
* @date 2024-06-06
* @version 1.0.0
* @contact https://xeplus.io or cloud@xeplus.io
* @note This script is used in the XpressEngine and Rhymix.
* @license MIT License
*/

'use strict';
var ytplayer;
var seconds = 0;
var tmpIframe = null;
function onYouTubeIframeAPIReady() {
	ytplayer = new YT.Player('player', {
			playerVars: {
				rel:0,
				playsinline: 1,
				},
			events: {
				'onReady': onPlayerReady
			}
		});
}

function onPlayerReady(event) {
    // event.target.playVideo();
}

function ytseek(sec,e){
    if(ytplayer){
			try{
				ytplayer.seekTo(sec, true);
			}catch(e){
				tmpIframe.src = tmpIframe.src + "&start="+sec;
				console.log(tmpIframe.src);
			}

			if(typeof edYoutubeFloat == 'function'){
				edYoutubeFloat(e);
			}else{
				tmpIframe.scrollIntoView();
			}

    }
}

function hmsToSecondsOnly(str) {
	var p = str.split(':'),	s = 0, m = 1;

	while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
	}

	return s;
}

document.addEventListener("DOMContentLoaded", function(){

	var youtube_dected = false;
	var tmpFrameLoad = false;
	var idStartsWith = "document_";
	var ditems = document.querySelectorAll(`[class^=${idStartsWith}]`);
	var starisEditorExist = false;
	var tmpIconYoutue = "";
	if(typeof edYoutubeFloat == 'function'){
		starisEditorExist = false;
		tmpIconYoutue = '<img src="'+default_url+'modules/z_editor/tpl/images/youtube.svg">';
	}
	ditems.forEach(function(doc_item,index,arr2) {

		if(doc_item.classList.contains('xe_content') === true){
			tmpIframe = doc_item.getElementsByTagName('iframe')[0];
			if(tmpIframe.src.indexOf("youtube.com") != -1){
				tmpIframe.setAttribute('id','player');
				youtube_dected = true;
				if(tmpIframe.src.indexOf("enablejsapi") == -1){
					tmpIframe.onload = tmpIframeLoad;
					tmpFrameLoad = true;
					tmpIframe.src = tmpIframe.src + "?enablejsapi=1";

				}
				return false;
			}
			return;
		}
	});

	var idStartsWith = "comment_"
	var citems = document.querySelectorAll(`[id^=${idStartsWith}]`);
	var youtube_duration_alive = false;
	if(youtube_dected === true){
	citems.forEach(function(cmt_item,index,arr2) {
			var tmp_content_obj = cmt_item.getElementsByClassName("xe_content")[0];
			var tmp_content = tmp_content_obj.innerHTML;
			var globalResult = tmp_content.match(/([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))?/gm);

			if(globalResult != null){
				for (var i = 0; i < globalResult.length; i++) {
					var tmp = globalResult[i];
					if(tmp.indexOf(":") == -1) continue;
					youtube_duration_alive = true;
					var tmp_seconds = hmsToSecondsOnly(tmp);
					var tmp_seconds_str = tmp_seconds.toString();
					tmp_content = tmp_content.replace(tmp,`<span class="youtube_duration" data-seconds="${tmp_seconds_str}" title="${tmp} 이동">${tmpIconYoutue} ${tmp}</span>`);
				}

				tmp_content_obj.innerHTML = tmp_content;
				var ytdElements = document.getElementsByClassName("youtube_duration");

				for (var i = 0; i < ytdElements.length; i++) {
					var tmpElement = ytdElements[i];
					tmpElement.addEventListener('click', youTubeSeek, false);
					tmpElement.style.color = "green";
					tmpElement.style.cursor = "pointer";
				}
			}
		});
	}

	if(youtube_duration_alive === true && youtube_dected === true || tmpFrameLoad === false){
		playerApiLoad();
	}
});

function playerApiLoad(){
		var doc_head = document.getElementsByTagName('head')[0];
		var ytb_api_js = document.createElement('script');
		ytb_api_js.type= 'text/javascript';
		ytb_api_js.src = 'https://www.youtube.com/player_api';
		doc_head.appendChild(ytb_api_js);
}

function youTubeSeek(event) {
	var seconds = this.getAttribute("data-seconds");
	ytseek(seconds,event);
}

function tmpIframeLoad(event){
	setTimeout(() => {
		playerApiLoad();
	}, 500);
}
