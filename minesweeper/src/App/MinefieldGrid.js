import { getRandomInt } from '../Utility/helpers';
import MinefieldCell from './MinefieldCell';
import { App } from '../app';

export default class MinefieldGrid {
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
