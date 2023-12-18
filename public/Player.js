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
		this.speed = 2;
		this.playerImageTileSource = './assets/person/male_player_1.png';
		this.isLoaded = false;
		this.playerImage = new Image();
		this.keys = config.keys;
		this.direction = config.direction;
		this.animationTime = this.width * 3;
	}

	animateImgSrc(newTile) {
		if (newTile % 16 === 0) {
			if (this.imgSrcX === this.animationTime) {
				this.imgSrcX = 0;
			} else {
				this.imgSrcX += 1 * this.width;
			}
		}
	}
	
	// Add randomizer here
	update(objects){
		if (this.direction[0] === "Up") this.imgSrcY = 3 * this.height;
		if (this.direction[0] === "Down" || this.direction[0] === "") this.imgSrcY = 0 * this.height;
		if (this.direction[0] === "Left") this.imgSrcY = 1 * this.height;
		if (this.direction[0] === "Right") this.imgSrcY = 2 * this.height;

		// console.log('keys from Player.js: ', this.keys)
		this.keys.forEach(key => {
			let newX = this.x;
			let newY = this.y;

			// assign new coordinates per key
			if (key === "Up") {
				newY -= 1 * this.speed;
				this.animateImgSrc(newY);
			};
			if (key === "Down") {
				newY += 1 * this.speed;
				this.animateImgSrc(newY);
			};
			if (key === "Left") {
				newX -= 1 * this.speed;
				this.animateImgSrc(newX);
			};
			if (key === "Right") {
				newX += 1 * this.speed;
				this.animateImgSrc(newX);
			};

			// check if new coordinates intersects with walls from the objects
			let collision = objects.some(wall => {
				return newX <= wall.x + wall.width &&
					newX + this.width >= wall.x &&
					newY <= wall.y + wall.height &&
					newY + this.height >= wall.y
			})

			// updating position if collision === false, no movement if collision === true
			if (collision) {
				this.imgSrcX = 0;
			}
			
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