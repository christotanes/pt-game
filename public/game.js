window.addEventListener('load', () => {
	
	const overworld = new Overworld({
		element: document.getElementById('game-container')
	})

	overworld.init();
} )