import MinefieldGrid from './App/MinefieldGrid';

export class App {
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
