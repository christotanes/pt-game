class Overworld{
	constructor(config) {
		this.ctx = config.canvas
		this.tileSize = 32; // tile width 32x32
		this.tilesets = []; // will hold tileset data
		this.tilesetSources = [
			'./assets/map/Interiors_free_32x32.png',
			'./assets/map/Room_Builder_free_32x32.png'
		];
		this.map = config.map;
		this.isLoaded = false;
	}

	static FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
	static FLIPPED_VERTICALLY_FLAG = 0x40000000;
	static FLIPPED_DIAGONALLY_FLAG = 0x20000000;
	static ROTATED_HEXAGONAL_120_FLAG = 0x10000000;

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
						// console.log(this.tilesets[i])
            return this.tilesets[i];
        }
    }
    throw new Error('Tileset not found for global tile ID: ' + globalTileId);
	}

	renderMap(tmjMapData) {
		tmjMapData.layers.forEach(layer => {
			if (layer.type === 'tilelayer') {
				layer.data.forEach((globalTileId, index) => {
					if (globalTileId !== 0) {

						const flipped_horizontally = (globalTileId & Overworld.FLIPPED_HORIZONTALLY_FLAG) !== 0;
						const flipped_vertically = (globalTileId & Overworld.FLIPPED_VERTICALLY_FLAG) !== 0;
						const flipped_diagonally = (globalTileId & Overworld.FLIPPED_DIAGONALLY_FLAG) !== 0;
						const rotated_hex120 = (globalTileId & Overworld.ROTATED_HEXAGONAL_120_FLAG) !== 0;

						globalTileId &= ~(Overworld.FLIPPED_HORIZONTALLY_FLAG |
															Overworld.FLIPPED_VERTICALLY_FLAG |
															Overworld.FLIPPED_DIAGONALLY_FLAG |
															Overworld.ROTATED_HEXAGONAL_120_FLAG);
						
						const tileset = this.findTileset(globalTileId);
						const localTileId = globalTileId - tileset.firstgid;

						const sourceX = (localTileId % (tileset.image.width / this.tileSize)) * this.tileSize;
						const sourceY = Math.floor(localTileId / (tileset.image.width / this.tileSize)) * this.tileSize;
						const targetX = (index % layer.width) * this.tileSize;
						const targetY = Math.floor(index / layer.width) * this.tileSize;

						this.ctx.save();

						// Apply transformations if the tile is flipped or rotated
						if (flipped_horizontally || flipped_vertically || flipped_diagonally) {
							// Calculate the center of the tile
							const centerX = targetX + this.tileSize / 2;
							const centerY = targetY + this.tileSize / 2;

							// Translate to the center, apply transformations, and translate back
							this.ctx.translate(centerX, centerY);
							if (flipped_horizontally) {
								this.ctx.scale(-1, 1);
							}
							if (flipped_vertically) {
								this.ctx.scale(1, -1);
							}
							if (flipped_diagonally) {
								this.ctx.scale(-1, -1);
							}
							this.ctx.translate(-centerX, -centerY);
					}

						this.ctx.drawImage(
							tileset.image,
							sourceX, sourceY, this.tileSize, this.tileSize,
							targetX, targetY, this.tileSize, this.tileSize
						);

						this.ctx.restore();
					};
				});
			};
		});
	};

	init() {
		Promise.all(this.tilesetSources.map(src => this.loadTilesetImage(src))).then(tilesetImages => {
			this.tilesets = tilesetImages.map((image, index) => ({
				image: image,
				firstgid: this.map.tilesets[index].firstgid
			}));
			this.isLoaded = true;
			this.renderMap(this.map);
		});
		
	}
}
