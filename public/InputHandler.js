class InputHandler{
	constructor(config) {
		this.keys = [];
		this.direction = [];
		this.newState;
	};

	checkState(key) {
		if (key === "ArrowUp" || key === "w") return "Up";
		if (key === "ArrowDown" || key === "s") return 'Down';
		if (key === "ArrowLeft" || key === "a") return 'Left';
		if (key === "ArrowRight" || key === "d") return 'Right';
	}
		

	init() {
		window.addEventListener('keydown', (e) => {
			this.newState = this.checkState(e.key);

			if ((this.newState) && this.keys.indexOf(this.newState) === -1
				&& this.direction.indexOf(this.newState === -1)) {
				this.keys.push(this.newState);
				this.direction.push(this.newState);
			}
			// console.log('from InputHandler keydown: ', this.keys)
		})

		window.addEventListener('keyup', (e) => {
			this.newState = this.checkState(e.key);
			// console.log(this.newState)
			if (this.keys.indexOf(this.newState) > -1
				&& this.direction.indexOf(this.newState) > -1) {
				this.keys.splice(this.keys.indexOf(this.newState), 1);
				this.direction.splice(this.direction.indexOf(this.newState), 1)
			}
			if (this.keys.length > 1) {
				this.keys.unshift()
			}
			
			// console.log('from InputHandler after keyup: ', this.direction)
		})
	}
}