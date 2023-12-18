window.addEventListener('load', () => {	
	const socket = io(`localhost:4000`);

	const canvas = document.getElementById('game-container');
	const ctx = canvas.getContext("2d");
	canvas.width = 768;
	canvas.height = 640;
	let overworld;
	let otherPlayers = {};

	const inputHandler = new InputHandler({});
	inputHandler.init();

	socket.on("mapData", (mapData) => {
		overworld = new Overworld({
			map: mapData,
			canvas: ctx
		})

		overworld.init();
		animate(16);
	})

	socket.on("otherPlayers", (data) => {
		if (data.playerId !== socket.id) {
			if (!otherPlayers[data.playerId]) {
				otherPlayers[data.playerId] = new Player({
					canvas: ctx,
					id: data.playerId,
					keys: []
				});
				otherPlayers[data.playerId].init();
			}
			otherPlayers[data.playerId].x = data.playerPosX;
			otherPlayers[data.playerId].y = data.playerPosY;
			otherPlayers[data.playerId].direction = data.playerState;
			otherPlayers[data.playerId].imgSrcX = data.playerImgSrcX;
			otherPlayers[data.playerId].imgSrcY = data.playerImgSrcY;
			otherPlayers[data.playerId].speed = data.playerSpeed;
		}
	});

	socket.on("playerDisconnected", (data) => {
    if (otherPlayers[data.playerId]) {
        delete otherPlayers[data.playerId];
    }
	});
	
	const player = new Player({
		canvas: ctx,
		keys: inputHandler.keys,
		direction: inputHandler.direction
	})

	socket.on("connect", () => {
		console.log(socket.id);
		player.init();
	})

	let lastTime = 0

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		if (overworld.isLoaded) {
			overworld.renderMap(overworld.map);
		}

		for (let playerId in otherPlayers) {
			const otherPlayer = otherPlayers[playerId];
			otherPlayer.update(overworld.walls); // Pass walls or the relevant objects for collision
		}

		if (player.isLoaded) {
			player.update(overworld.walls);
			socket.emit('playerPos', {
				playerId: socket.id,
				playerPosX: player.x,
				playerPosY: player.y,
				playerState: player.direction,
				playerImgSrcX: player.imgSrcX,
				playerImgSrcY: player.imgSrcY,
				playerSpeed: player.speed
			})
		}
		// console.log(deltaTime)
		requestAnimationFrame(animate);
		
	}
})