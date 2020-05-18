const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
};

class MinefieldCell {
	constructor(status) {
		this.status = status;
		this.isActive = true;
		this.isMarked = false;
		this.createCell();

		this.cell.addEventListener('click', this.leftClickHandler.bind(this));

		this.cell.addEventListener('contextmenu', this.rightClickHandler.bind(this));
	}

	createCell() {
		this.cell = document.createElement('div');
		this.cell.classList.add('minefield__cell', 'minefield__cell--empty');
	}

	activateCell() {
		this.isActive = false;
		this.cell.classList.remove('minefield__cell--empty');

		if (this.status === false) {
			this.cell.classList.add('minefield__cell--red-bg');
			this.cell.textContent = String.fromCharCode(9728);

			this.cell
				.closest('.minesweeper')
				.querySelector('.minesweeper__center')
				.classList.add('loose');

			App.endGame();
		} else {
			this.cell.classList.add(`minefield__cell--${this.status}`);
			this.cell.textContent = this.status;
			App.trackProgress.call(App);
		}
	}

	leftClickHandler() {
		if (this.isActive === false) {
			return;
		}

		this.activateCell();
	}

	rightClickHandler() {
		const counterElement = this.cell.closest('.minesweeper').querySelector('.counter p');
		let counterElementValue = +counterElement.textContent;

		if (this.isMarked === false && this.isActive === true) {
			this.cell.textContent = String.fromCharCode(9873);
			this.isMarked = true;
			this.isActive = false;

			counterElement.textContent = --counterElementValue;
		} else if (this.isMarked === true && this.isActive === false) {
			this.cell.textContent = '';
			this.isMarked = false;
			this.isActive = true;

			counterElement.textContent = ++counterElementValue;
		}
	}
}

class MinefieldGrid {
	constructor(height, width, mines) {
		const grid = this.createGrig(height, width);
		this.mineGrid = this.placeMines(height, width, mines, grid);

		this.renderMinefield(height, width, this.mineGrid);
		this.controlHeader(mines);
	}

	createGrig(height, width) {
		const field = [];

		for (let i = 0; i < height; i++) {
			field[i] = [];

			for (let j = 0; j < width; j++) {
				field[i][j] = 0;
			}
		}

		return field;
	}

	placeMines(height, width, mines, grid) {
		const mineGrid = grid.map((arr) => {
			return arr.slice();
		});

		while (mines > 0) {
			const randomCell = getRandomInt(width * height);
			const coordinatesX = randomCell % width;
			const coordinatesY = Math.floor(randomCell / width);

			if (mineGrid[coordinatesY][coordinatesX] === false) {
				continue;
			} else {
				mineGrid[coordinatesY][coordinatesX] = false;
				this.placeHints(coordinatesY, coordinatesX, mineGrid);

				mines--;
			}
		}

		return mineGrid;
	}

	placeHints(coordinatesY, coordinatesX, mineGrid) {
		const hintRange = 1;

		for (let i = coordinatesY - hintRange; i <= coordinatesY + hintRange; i++) {
			if (mineGrid[i] === undefined) {
				continue;
			}

			for (let j = coordinatesX - hintRange; j <= coordinatesX + hintRange; j++) {
				if (mineGrid[i][j] === undefined || mineGrid[i][j] === false) {
					continue;
				}

				mineGrid[i][j] += 1;
			}
		}
	}

	revealNeighbours(coordinatesY, coordinatesX) {
		const range = 1;

		if (this.classGrid[coordinatesY][coordinatesX].status !== 0) {
			return;
		}

		for (let i = coordinatesY - range; i <= coordinatesY + range; i++) {
			if (this.classGrid[i] === undefined) {
				continue;
			}

			for (let j = coordinatesX - range; j <= coordinatesX + range; j++) {
				if (
					this.classGrid[i][j] === undefined ||
					this.classGrid[i][j].isActive === false ||
					this.classGrid[i][j].status === false
				) {
					continue;
				}

				this.classGrid[i][j].activateCell();
				this.revealNeighbours(i, j);
			}
		}
	}

	renderMinefield(height, width, mineGrid) {
		const gridElement = document.querySelector('#minesweeper .minefield');
		this.classGrid = [];
		gridElement.addEventListener('contextmenu', (e) => e.preventDefault());

		for (let i = 0; i < height; i++) {
			this.classGrid[i] = [];
			const gridRow = document.createElement('div');
			gridRow.classList.add('minefield__row');

			for (let j = 0; j < width; j++) {
				const gridCell = new MinefieldCell(mineGrid[i][j]);
				const gridCellElement = gridCell.cell;
				this.classGrid[i][j] = gridCell;

				gridCellElement.addEventListener('click', this.revealNeighbours.bind(this, i, j));
				gridCellElement.addEventListener('click', App.winGame.bind(App, gridCellElement));
				gridRow.append(gridCellElement);
			}

			gridElement.append(gridRow);
		}
	}

	controlHeader(mines) {
		const gridElement = document.querySelector('#minesweeper .minefield');
		const counterElement = document.querySelector('#minesweeper .counter p');

		gridElement.addEventListener('mousedown', () => {
			gridElement
				.closest('.minesweeper')
				.querySelector('.minesweeper__center')
				.classList.add('active');
		});
		gridElement.addEventListener('mouseup', () => {
			gridElement
				.closest('.minesweeper')
				.querySelector('.minesweeper__center')
				.classList.remove('active');
		});

		counterElement.textContent = mines;
	}
}

class App {
	static init(height, width, mines) {
		new MinefieldGrid(height, width, mines);
		this.winCondition = height * width - mines;
		this.gameProgress = 0;
	}

	static trackProgress() {
		++this.gameProgress;
	}

	static endGame() {
		const gridElement = document.querySelector('#minesweeper .minefield');
		const newGridElement = gridElement.cloneNode(true);
		gridElement.parentNode.replaceChild(newGridElement, gridElement);
	}

	static winGame(gridCellElement) {
		if (this.gameProgress !== this.winCondition) {
			return;
		}

		gridCellElement
			.closest('.minesweeper')
			.querySelector('.minesweeper__center')
			.classList.add('win');

		this.endGame();
	}
}

App.init(16, 30, 60);
