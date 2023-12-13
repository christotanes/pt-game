window.addEventListener('load', () => {	
	const socket = io(`localhost:4000`);
	socket.on("connect", () => {
		console.log(socket.id, 'Socket id');
	});

	const overworld = new Overworld({
		element: document.getElementById('game-container'),
		socket: socket
	})

	overworld.init();

})