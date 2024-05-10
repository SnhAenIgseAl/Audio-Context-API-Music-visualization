window.addEventListener("DOMContentLoaded", () => {



	const file = this.document.querySelector('#musicFile')
	const myAudio = document.querySelector('#music')

	let canvas = document.getElementById("cas")
	let canvasCtx = canvas.getContext("2d")



	// 获取上传的音频
	file.addEventListener('change', (e) => {
		let fl = file.files[0];
		let url = URL.createObjectURL(fl);
		myAudio.src = url;

		// 获取上传音频的基本信息
		jsmediatags.read(fl, {
			onSuccess: (tag) => {
				console.log(tag.tags)

				const songImg = document.querySelector('#songImg')
				const songName = document.querySelector('#songName')
				const author = document.querySelector('#author')

				if (tag.tags.picture) {
					songImg.style.opacity = '1';
					songImg.src = URL.createObjectURL(new Blob([new Uint8Array(tag.tags.picture.data).buffer]))
				} else {
					songImg.style.opacity = '0';
					songImg.src = ''
				}
				songName.innerHTML = tag.tags.title || '获取失败'
				author.innerHTML = tag.tags.artist || ''
			},
			onError: (err) => {
				console.log(err)
			}
		}, false)
	})



	// 开始播放时
	myAudio.addEventListener('play', () => {

		let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		const source = audioCtx.createMediaElementSource(myAudio);

		let width = cas.width
		let height = cas.height

		let analyser = audioCtx.createAnalyser()
		console.log(analyser)
		analyser.fftSize = 512

		let bufferLength = analyser.frequencyBinCount
		console.log(bufferLength)
		let dataArray = new Uint8Array(bufferLength)
		console.log(dataArray)

		source.connect(analyser)
		analyser.connect(audioCtx.destination)

		// 绘制频谱
		draw()
		// 碎片下落
		fallOff()

		function draw() {
			canvasCtx.clearRect(0, 0, width, height);
			drawVisual = requestAnimationFrame(draw);

			analyser.getByteFrequencyData(dataArray);

			let barHeight;

			draw2()

			/**
			 * 顺序绘制
			 */
			function draw1() {
				let stride = 1		// 步幅
				let x = 5			// 绘制的起始位置
				for (let i = 0; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 800
					drawRect(x, -10, -5, barHeight, '#fff')
					if (x >= width) break;
					x = x + 15;
				}
			}


			/**
			 * 高低音绘制
			 */
			function draw2() {
				/** 
				 * 低音部分
				 */
				let stride = 1		// 步幅
				let x = 5			// 绘制的起始位置
				for (let i = 0; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 800
					drawRect(x, -10, -5, barHeight, '#fff')
					if (x >= width / 2 - 30) break
					x = x + 30;
				}
				x = width + 5
				for (let i = 0; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 800
					drawRect(x, -10, -5, barHeight, '#fff')
					if (x <= width / 2 + 30) break
					x = x - 30;
				}

				/**
				 * 高音部分
				 */
				stride = 1
				x = 20
				for (let i = 128; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 700
					drawRect(x, -10, -5, barHeight, '#fff')
					if (x >= width / 2 - 30) break
					x = x + 30;
				}
				x = width - 10
				for (let i = 128; i <= dataArray.length; i += stride) {
					barHeight = dataArray[i] * 6 - 700
					drawRect(x, -10, -5, barHeight, '#fff')
					if (x <= width / 2 + 30) break
					x = x - 30;
				}
			}
		}



		/**
		 * 封装的绘制矩形函数，带阴影效果
		 * @param {*} x1 横坐标1
		 * @param {*} y1 纵坐标1
		 * @param {*} x2 横坐标2
		 * @param {*} y2 纵坐标2
		 * @param {*} color 矩形及阴影颜色
		 */
		function drawRect(x1, y1, x2, y2, color) {
			canvasCtx.shadowOffsetX = 0;
			canvasCtx.shadowOffsetY = 0;
			canvasCtx.shadowColor = color;
			canvasCtx.shadowBlur = 20;
			canvasCtx.fillStyle = color
			canvasCtx.fillRect(x1, y1, x2, y2);
			canvasCtx.shadowBlur = 10;
			canvasCtx.fillRect(x1, y1, x2, y2);
			canvasCtx.shadowBlur = 5;
			canvasCtx.fillRect(x1, y1, x2, y2);
		}



		/**
		 * 碎片下落
		 */
		function fallOff() {
			setInterval(() => {
				const musicAnimate = document.getElementById('music-animate')
				var li = document.createElement('li')

				li.innerHTML = '△'
				li.style.fontSize = Math.random() * 18 + 12 + 'px'
				li.style.filter = 'blur(' + Math.random() * 5 + 'px)'
				li.style.left = Math.random() * 100 + '%'
				li.style.top = '-10%'
				li.style.opacity = parseInt(Math.random() * 10) / 10 + ''
				li.style.transform = 'rotateZ(60deg)'

				musicAnimate.appendChild(li)

				var timer = setInterval(() => {

					let height = parseInt(li.style.top)
					height += 1
					li.style.top = height + '%'

					if (parseInt(li.style.top) >= 100) {
						clearInterval(timer)
						li.parentNode.removeChild(li)
					}
				}, 50)
			}, 200)
		}
	})
})
