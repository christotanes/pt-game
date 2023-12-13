class Overworld{
	constructor(config) {
		this.canvas = config.element
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'black'
		this.ctx.fillRect (10, 10, 100, 100)
	}

	init() {
		console.log(`Hello World from Overworld ${this}`)
	}
}