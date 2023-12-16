class Player{
	constructor(config) {
		this.ctx = config.canvas
		this.socket = config.socket
		// this.player = config.id
		this.width = 32;
		this.height = 64;
		this.x = 96;
		this.y = 576;
		this.imgSrcX = 0;
		this.imgSrcY = 0;
		this.speed = 0;
		this.playerImageTileSource = './assets/person/male_player_1.png';
		this.isLoaded = false;
		this.playerImage = new Image();
		this.keys = config.keys;
		this.direction = config.direction;
		this.animation = []
	}

	// Add randomizer here
	update(objects){
		// console.log('keys from Player.js: ', this.keys)
		this.keys.forEach(key => {
			let newX = this.x;
			let newY = this.y;

			// assign new coordinates per key
			if (key === "ArrowUp") newY -= 1 * 2;
			if (key === "ArrowDown") newY += 1 * 2;
			if (key === "ArrowLeft") newX -= 1 * 2;
			if (key === "ArrowRight") newX += 1 * 2;
			
			// check if new coordinates intersects with walls from the objects
			let collision = objects.some(wall => {
				return newX <= wall.x + wall.width &&
					newX + this.width >= wall.x &&
					newY <= wall.y + wall.height &&
					newY + this.height >= wall.y
			})

			// updating position if collision === false, no movement if collision === true
			if (!collision) {
				this.x = newX;
				this.y = newY;
			}
		});

		this.renderPlayer();
	}

	renderPlayer() {
		if (!this.isLoaded) return;

		this.ctx.save();
		this.ctx.drawImage(
			this.playerImage,
			this.imgSrcX, this.imgSrcY, this.width, this.height,
			this.x, this.y, this.width, this.height
		)

		this.ctx.restore();
	}

	init() {
		this.playerImage.onload = () => {
			this.isLoaded = true;
			this.renderPlayer();
		}
		this.playerImage.src = this.playerImageTileSource
	}
}