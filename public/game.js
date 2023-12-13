window.addEventListener('load', () => {	
	
	const overworld = new Overworld({
		element: document.getElementById('game-container')
	})

	overworld.init();
	const socket = io(`http://localhost:4000`);
	socket.on("connect", () => {
		console.log(socket.id, 'Socket id');
	});
	
} )