window.addEventListener('load', () => {	
	const socket = io(`localhost:4000`);

	const canvas = document.getElementById('game-container');
	const ctx = canvas.getContext("2d");
	canvas.width = 768;
	canvas.height = 640;
	let keys = [];
	let walls = [];
	let overworld, player;

	const inputHandler = new InputHandler({
		keys: keys
	});

	socket.on("mapData", (mapData) => {
		overworld = new Overworld({
			map: mapData,
			// room: mapData.tsjRoomBuilder,
			// interior: mapData.tsjInterior,
			canvas: ctx
		})
		console.log('mapdata data on client: ', mapData)
		overworld.init();
		animate(16);
	})

	socket.on("connect", () => {
		player = new Player({
			canvas: ctx,
			id: socket.id,
			keys: keys
		})
		player.init();
		// console.log(socket.id, 'Socket id and new Player Id');
	});

	
	let lastTime = 0

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		// console.log("from game.js animate:", keys)
		// console.log('Animation loop deltaTime: ', deltaTime.toFixed(2))
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		if (overworld.isLoaded) {
			// console.log(overworld.map)
			overworld.renderMap(overworld.map);
		}
		if (player.isLoaded) {
				player.renderPlayer(overworld.walls);
		}
		
		requestAnimationFrame(animate);
		
	}
})