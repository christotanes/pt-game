class Overworld{
	constructor(config) {
		this.canvas = config.element
		this.ctx = this.canvas.getContext('2d');
	}

	init() {
		console.log('Hello World from Overworld')
	}
}