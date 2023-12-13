class Overworld{
	constructor(config) {
		this.canvas = config.element;
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = 960;
		this.canvas.height = 640;
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
			img.src = src;
		});
	}

	findTileset(globalTileId) {
    // Iterate backwards through the tilesets as they are usually ordered by firstgid
    for (let i = this.tilesets.length - 1; i >= 0; i--) {
        if (this.tilesets[i].firstgid <= globalTileId) {
            return this.tilesets[i];
        }
    }
    throw new Error('Tileset not found for global tile ID: ' + globalTileId);
	}

	renderMap(tmjMapData) {
		tmjMapData.tilesets.forEach((tileset, index) => {
			// console.log(this.tilesets, 'tilesets data')
			this.tilesets[index] = {
				image: this.tilesets[index],
				firstgid: tileset.firstgid
			}
		});

		tmjMapData.layers.forEach(layer => {
			if (layer.type === 'tilelayer') {
				layer.data.forEach((globalTileId, index) => {
					if (globalTileId !== 0) {
						const tileset = this.findTileset(globalTileId);
						const localTileId = globalTileId - tileset.firstgid;

						const sourceX = (localTileId % (tileset.image.width / this.tileSize)) * this.tileSize;

						const sourceY = Math.floor(localTileId / (tileset.image.width / this.tileSize)) * this.tileSize;
						const targetX = (index % layer.width) * this.tileSize;
						const targetY = Math.floor(index / layer.width) * this.tileSize;

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
			Promise.all(this.tilesetSources.map(src => this.loadTilesetImage(src))).then(tilesetImages => {
				this.tilesets = tilesetImages;
				this.renderMap(tmjMapData);
			});
		});
	}
};