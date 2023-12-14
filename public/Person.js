class Person{
	constructor(config) {
		this.canvas = config.element;
		this.ctx = this.canvas.getContext('2d');
		this.socket = config.socket;
		this.person = config
		this.personTileSize = 32;
		this.xColumn = 4;
		this.yRow = 20;
		this.speed = 0;
		this.personImageTileSource = './assets/person/idle_32x32_2.png'
	}

	// Add randomizer here

	renderPerson() {
		const player = new Image();
		player.onload = () => {
			this.startX = this.xColumn * this.personTileSize
			this.startY = this.yRow * this.personTileSize
			this.ctx.drawImage(
				player.src,
				64, 0, this.personTileSize, this.personTileSize,
				this.startX, this.startY, this.personTileSize, this.personTileSize
			)
		}	
		player.src = this.personImageTileSource
		console.log(player.src, 'renderPerson player.src')
	}

	init() {
		this.socket.on('player', (player) => {
			this.person.id = player
			console.log('Im a new player:', this.person.id)
		})
		this.renderPerson()
	}
}