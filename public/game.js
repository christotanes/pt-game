window.addEventListener('load', () => {	
	const socket = io(`localhost:4000`);

	const canvas = document.getElementById('game-container');
	const ctx = canvas.getContext("2d");
	canvas.width = 768;
	canvas.height = 640;
	let keys = [];
	let walls = [];
	let overworld;
	let otherPlayers = {};

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
		// console.log('mapdata data on client: ', mapData)
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
		}
	});

	socket.on("playerDisconnected", (data) => {
    if (otherPlayers[data.playerId]) {
        delete otherPlayers[data.playerId];
    }
	});
	
	const player = new Player({
		canvas: ctx,
		keys: keys
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
			otherPlayer.renderPlayer(walls); // Pass walls or the relevant objects for collision
		}

		if (player.isLoaded) {
			player.renderPlayer(overworld.walls);
			socket.emit('playerPos', {
				playerId: socket.id,
				playerPosX: player.x,
				playerPosY: player.y
			})
		}

		requestAnimationFrame(animate);
		
	}
})