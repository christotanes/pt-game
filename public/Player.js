class Player{
	constructor(config) {
		this.ctx = config.canvas
		this.player = config.id
		this.width = 32;
		this.height = 64;
		this.x = 96;
		this.y = 576;
		this.speed = 0;
		this.playerImageTileSource = './assets/person/idle_32x32_2.png';
		this.isLoaded = false;
		this.playerImage = new Image();
		this.keys = config.keys
	}

	// Add randomizer here

	renderPlayer() {
		if (!this.isLoaded) return;
		console.log('keys from Player.js: ', this.keys)
		this.keys.forEach(key => {
			if (key === "ArrowUp") this.y -= 1 * 2;
			if (key === "ArrowDown") this.y += 1 * 2;
			if (key === "ArrowLeft") this.x -= 1 * 2;
			if (key === "ArrowRight") this.x += 1 * 2;
		});

		this.ctx.save();
		this.ctx.drawImage(
			this.playerImage,
			96, 0, this.width, this.height,
			this.x, this.y, this.width, this.height
		)

	this.ctx.restore();
		// console.log(player.src, 'renderPlayer player.src')
	}

	init() {
		this.playerImage.onload = () => {
			this.isLoaded = true;
			this.renderPlayer();
		}
		this.playerImage.src = this.playerImageTileSource
	}
}