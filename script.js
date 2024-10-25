/**
 * Use a chrome extension to run this script on https://bluesky.app/
 * 
 * Example extention: 
 * User JavaScript and CSS 
 * https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en
 * 
 *
 * It will check for videos every [timeBetweenChecks] milliseconds.
 *
 * Video elements will be given new events to behave like you would expect. Click to unmute the autoplaying video.
 *
 * The bluesky video wrapper will be hidden via CSS
 *
 * Your volume preference will be saved to localStorage if allowed by the browser and applied to each video when played.
 *
 */

var timeBetweenChecks = 2000;

var canUseLocalStorage = !!window.localStorage;

var defaultVolume = canUseLocalStorage
	? window.localStorage.getItem('_BLUESKY_VIDEO_VOLUME') || 0.5
	: 0.5;

function beginCheckingForVideos() {
	setInterval(checkForVideos, timeBetweenChecks);
}

function checkForVideos() {
	var videos = Array.from(
		document.querySelectorAll('figure video:not(.video-has-been-fixed)')
	);
	videos.forEach((x) => {
		var videoWrapper = x.parentElement.nextSibling;
		if (videoWrapper) {
			videoWrapper.style.display = 'none';
		}
		x.playsInline = false;
		x.controls = true;
		x.volume = defaultVolume;

		if (!x.classList.contains('video-has-been-fixed')) {
			x.firstPlay = true;
			x.addEventListener('click', () => onVideoClick(x));
			x.addEventListener('volumechange', () => onVideoVolumeChange(x));
		}

		x.classList.add('video-has-been-fixed');
	});
}

function onVideoClick(video) {
	if (video.muted && !video.paused && video.firstPlay) {
		video.volume = defaultVolume;
		video.muted = false;
		setTimeout(function () {
			video.play();
		}, 10);
	}
	video.firstPlay = false;
}

function onVideoVolumeChange(video) {
	if (canUseLocalStorage) {
		var volume =
			(video.volume != undefined && video.volume != null) ? video.volume : 0.5;
		if (volume) {
			defaultVolume = volume;
			localStorage.setItem('_BLUESKY_VIDEO_VOLUME', defaultVolume);
		}
	}
}

beginCheckingForVideos();
