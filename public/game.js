window.addEventListener('load', () => {	
	const socket = io(`localhost:4000`);

	const canvas = document.getElementById('game-container');
	const ctx = canvas.getContext("2d");
	canvas.width = 768;
	canvas.height = 640;

	let overworld, player;

	socket.on("tmjMapData", (tmjMapData) => {
		overworld = new Overworld({
			map: tmjMapData,
			canvas: ctx
		})
		overworld.init();
		animate(0)
	})

	socket.on("connect", () => {
		player = new Player({
			canvas: ctx,
			id: socket.id
		})
		player.init();
		// console.log(socket.id, 'Socket id and new Player Id');
	});

	
	let lastTime = 0
	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		// console.log('Animation loop deltaTime: ', deltaTime.toFixed(2))
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		if (overworld.isLoaded) {
			// console.log(overworld.map)
			overworld.renderMap(overworld.map);
		}
		if (player.isLoaded) {
				player.renderPlayer();
		}
		requestAnimationFrame(animate);
		
	}

	// setTimeout(() => {
	// 	animate(0)
	// }, 1000);
})