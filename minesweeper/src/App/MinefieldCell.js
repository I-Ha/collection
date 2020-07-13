import { App } from '../app';

export default class MinefieldCell {
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
