window.addEventListener('DOMContentLoaded', () => {
	const audio = document.getElementById('music')
	const progressBox = document.getElementById('progressBox')
	const progress = document.getElementById('progress')
	const back = document.getElementById('back')
	const playOrPause = document.getElementById('playOrPause')

	audio.volume = '0.65'



	// 更新进度条
	audio.addEventListener('timeupdate', updateProgress)
	function updateProgress() {
		var value = audio.currentTime / audio.duration
		progress.style.width = value * 100 + '%'
	}



	// 点击进度条跳到指定点播放
	progressBox.onmousedown = function (event) {
		if (!audio.paused || audio.currentTime != 0) {
			var pgsWidth = parseFloat(window.getComputedStyle(progressBox, null).width.replace('px', ''));
			var rate = event.offsetX / pgsWidth;
			audio.currentTime = audio.duration * rate;
			updateProgress(audio);
		}
	}



	// 重新开始播放
	back.onmousedown = function () {
		audio.currentTime = 0
		updateProgress(audio);
	}



	// 暂停 / 播放
	playOrPause.onmousedown = function (e) {
		if (audio.paused) {
			audio.play();
			playOrPause.innerHTML = '<i>&#xe890;</i>'
		} else {
			audio.pause();
			playOrPause.innerHTML = '<i>&#xe74f;</i>'
		}
	}



	const volumeBox = document.getElementById('volumeBox')
	const volume = document.getElementById('volume')
	const volumePoint = document.getElementById('volume-point')
	const volumeValue = document.getElementById('volume-value')
	volumeBox.onmouseover = function() {
		volume.style.display = 'block'
		volumeValue.innerHTML = parseInt(audio.volume * 100) + ''
		volumePoint.style.top = parseInt((1 - audio.volume) * 100) + '%'
	}
	volume.onmouseleave = function() {
		volume.style.display = 'none'
	}



	// 点击控制音量
	volume.onmousedown = function(event) {
		if (!audio.paused || audio.currentTime != 0) {
			var rate = event.offsetY / 100;
			audio.volume = 1 - rate;
			console.log(audio.volume)
			volumeValue.innerHTML = parseInt((1 - rate) * 100) + ''
			volumePoint.style.top = parseInt(rate * 100) + '%'
		}
	}
})