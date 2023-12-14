class Player{
	constructor(config) {
		this.ctx = config.canvas
		this.player = config.id
		this.width = 32;
		this.height = 64
		this.xColumn = 3;
		this.yRow = 9;
		this.speed = 0;
		this.playerImageTileSource = './assets/person/idle_32x32_2.png'
		this.isLoaded = false;
		this.playerImage = new Image()
	}

	// Add randomizer here

	renderPlayer() {
		if (!this.isLoaded) return;

		this.ctx.save();
		this.startX = this.xColumn * this.width
		this.startY = this.yRow * this.height
		this.ctx.drawImage(
			this.playerImage,
			96, 0, this.width, this.height,
			this.startX, this.startY, this.width, this.height
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