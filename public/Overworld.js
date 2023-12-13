class Overworld{
	constructor(config) {
		this.canvas = config.element;
		this.ctx = this.canvas.getContext('2d');
		this.socket = config.socket
		this.tileSize = 32; // tile width 32x32
		this.tilesets = []; // will hold tileset data
		this.tilesetSources = [
			'./assets/map/Interiors_free_32x32.png',
			'./assets/map/Room_Builder_free_32x32.png'
		];
	}

	// loads a new object Image() that will hold one of the tileset sources
	loadTilesetImage(src) {
		return new Promise(resolve => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.src = src
			console.log(img.src)
		});
	}

	findTilesetId(globalTileId) {
		// Will find the tileset that the image is a part of
		for (let i = 0; i < this.tilesets.length; i++) {
			if (i === this.tilesets.length - 1 || this.tilesets[i + 1].firstgid > globalTileId) {
				if (this.tilesets[i] <= globalTileId) {
					return this.tilesets[i];
				}
			}
		}
	}

	renderMap(tmjMapData) {
		tmjMapData.tilesets.forEach((tileset, index) => {
			console.log(this.tilesets, 'tilesets data')
			this.tilesets[index] = {
				image: this.tilesets[index],
				firstgid: tileset.firstgid
			}
		});

		tmjMapData.layers.forEach(layer => {
			if (layer.type === 'tilelayer') {
				layer.data.forEach((globalTileId, index) => {
					if (globalTileId !== 0) {
						const tileset = this.findTilesetId(globalTileId);
						const localTileId = globalTileId - tileset;

						const sourceX = (localTileId % (tileset.image.width / this.tileSize)) * this.tileSize;
						const sourceY = Math.floor(localTileId / (tileset.image.width / this.tileSize)) * this.tileSize;
						const targetX = (index % tileset.image.width) * this.tileSize;
						const targetY = Math.floor(index / tileset.image.width) * this.tileSize;

						this.ctx.drawImage(
							tileset.image,
							sourceX, sourceY, this.tileSize, this.tileSize,
							targetX, targetY, this.tileSize, this.tileSize
						);
					};
				});
			};
		});
	};

	init() {
		this.socket.on('tmjMapData', (tmjMapData) => {
			console.log(this.tilesets)
			Promise.all(this.tilesetSources.map(src => this.loadTilesetImage(src))).then(() => {
				this.renderMap(tmjMapData);
			});
		});
		console.log(`Hello World from Overworld ${this}`)
	}
};