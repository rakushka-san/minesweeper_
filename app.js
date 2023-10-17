import { Square } from './Square.js'

document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid')
	const flagsLeft = document.querySelector('#flags-left')
	const result = document.querySelector('#result')
	let width = 10
	let bombAmount = 20
	let flags = 0
	let squares = []
	let isGameOver = false

	let gameArray = []

	// отрисовка
	function render() {
		flagsLeft.innerHTML = bombAmount

		// отрисовка игрового поля
		for (let i = 0; i < width * width; i++) {
			const square = document.createElement('div')
			square.setAttribute('id', i)
			square.classList.add('cell')
			grid.appendChild(square)
			squares.push(square)
		}

		// обработка нажатия левой кнопкой мыши
		grid.addEventListener('click', function (e) {
			click(e.target)
		})

		// обработка нажатия правой кнопкой мыши
		grid.oncontextmenu = function (e) {
			e.preventDefault()
			addFlag(e.target)
		}
	}

	// создание игрового поля
	function createBoard() {
		// получение списка, отражающего игровое поле и содержащего информацию о положении бомб
		const bombsArray = Array(bombAmount)
		for (let i = 0; i < bombsArray.length; i++) {
			bombsArray[i] = new Square(false)
		}
		const emptyArray = Array(width * width - bombAmount)
		for (let i = 0; i < emptyArray.length; i++) {
			emptyArray[i] = new Square(true)
		}
		gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5)

		for (let index = 0; index < gameArray.length; index++) {
			if (gameArray[index].isValid) {
				let count = 0

				const currentY = Math.floor(index / width)
				const currentX = index % width

				for (let i = -1; i <= 1; i++) {
					for (let j = -1; j <= 1; j++) {
						if (i === 0 && j === 0) continue

						const checkingY = currentY + i
						const checkingX = currentX + j

						if (checkingY < 0 || checkingY >= width) continue
						if (checkingX < 0 || checkingX >= width) continue

						const checkingIndex = checkingY * width + checkingX

						if (!gameArray[checkingIndex].isValid) {
							count++
						}
					}
				}

				gameArray[index].bombsAround = count
			}
		}
	}
	createBoard()
	render()

	// функция изменения состояния отметки клетки флагом
	function addFlag(square) {
		if (isGameOver) return
		if (!gameArray[square.id].isChecked && flags < bombAmount) {
			if (!gameArray[square.id].isFlagged) {
				gameArray[square.id].isFlagged = true
				square.innerHTML = ' 🚩'
				flags++
				flagsLeft.innerHTML = bombAmount - flags
				checkForWin()
			} else {
				gameArray[square.id].isFlagged = false
				square.innerHTML = ''
				flags--
				flagsLeft.innerHTML = bombAmount - flags
			}
		}
	}

	// функция открытия клетки
	function click(square) {
		if (isGameOver) return
		if (gameArray[square.id].isChecked || gameArray[square.id].isFlagged) return
		if (!gameArray[square.id].isValid) {
			gameOver()
			return
		}
		let total = gameArray[square.id].bombsAround
		if (total != 0) {
			square.classList.add(`cell-${total}`)
			square.innerHTML = total

			square.classList.add('checked')
			gameArray[square.id].isChecked = true
			return
		}

		square.classList.add('checked')
		gameArray[square.id].isChecked = true
		checkSquare(square)
	}

	// функция проверки соседних клеток
	function checkSquare(square) {
		const currentY = Math.floor(square.id / width)
		const currentX = square.id % width

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue

				const checkingY = currentY + i
				const checkingX = currentX + j

				if (checkingY < 0 || checkingY >= width) continue
				if (checkingX < 0 || checkingX >= width) continue

				const checkingIndex = checkingY * width + checkingX
				click(squares[checkingIndex])
			}
		}
	}

	// функция оповещения о проигрыше
	function gameOver() {
		result.innerHTML = 'BOOM! Game Over!'
		isGameOver = true

		// открытие всех бомб
		squares.forEach((square, index) => {
			if (!gameArray[index].isValid) {
				square.innerHTML = '💣'
			}
		})
	}

	// функция проверки поля на выигрыш
	function checkForWin() {
		let matches = 0
		// поиск совпадений наличия бомбы и отметки-флага
		for (let i = 0; i < gameArray.length; i++) {
			if (gameArray[i].isFlagged && !gameArray[i].isValid) {
				matches++
			}
			if (matches === bombAmount) {
				result.innerHTML = 'YOU WIN!'
				isGameOver = true
			}
		}
	}
})
