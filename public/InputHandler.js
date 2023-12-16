class InputHandler{
	constructor(config) {
		this.keys = [];
		this.direction = [];

		window.addEventListener('keydown', (e) => {
			if ((e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight")
				&& this.keys.indexOf(e.key) === -1
				&& this.direction.indexOf(util.checkDirection(e.key) === -1)) {
				this.keys.push(e.key);
				this.direction.push(util.checkDirection(e.key))
			}
			console.log('from InputHandler keydown: ', this.keys)
		})

		window.addEventListener('keyup', (e) => {
			if (this.keys.indexOf(e.key) > -1 && this.direction.indexOf(util.checkDirection(e.key)) > -1) {
				this.keys.splice(this.keys.indexOf(e.key), 1);
				this.direction.splice(this.direction.indexOf(e.key), 1)
			}
			this.keys.unshift()
			console.log('from InputHandler after keyup: ', this.keys)
		})
	}
}