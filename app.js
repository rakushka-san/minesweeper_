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
		let currentId = square.id
		if (isGameOver) return
		if (
			square.classList.contains('checked') ||
			square.classList.contains('flag')
		)
			return
		if (square.classList.contains('bomb')) {
			gameOver(square)
		} else {
			let total = square.getAttribute('data')
			if (total != 0) {
				square.classList.add('checked')
				if (total == 1) square.classList.add('one')
				if (total == 2) square.classList.add('two')
				if (total == 3) square.classList.add('three')
				if (total == 4) square.classList.add('four')
				square.innerHTML = total
				return
			}
			// отрытие соседних клеток
			checkSquare(square, currentId)
		}
		square.classList.add('checked')
	}

	// функция проверки соседних клеток
	function checkSquare(square, currentId) {
		const isLeftEdge = currentId % width === 0
		const isRightEdge = currentId % width === width - 1

		setTimeout(() => {
			if (currentId > 0 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId > 9 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 - width].id

				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId > 10) {
				const newId = squares[parseInt(currentId - width)].id

				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId > 11 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 - width].id

				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId < 98 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1].id

				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId < 90 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 + width].id

				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId < 88 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 + width].id

				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId < 89) {
				const newId = squares[parseInt(currentId) + width].id

				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
		}, 10)
	}

	// функция оповещения о проигрыше
	function gameOver(square) {
		result.innerHTML = 'BOOM! Game Over!'
		isGameOver = true

		// открытие всех бомб
		squares.forEach(square => {
			if (square.classList.contains('bomb')) {
				square.innerHTML = '💣'
				square.classList.remove('bomb')
				square.classList.add('checked')
			}
		})
	}

	// функция проверки поля на выигрыш
	function checkForWin() {
		let matches = 0
		// поиск совпадений наличия бомбы и отметки-флага
		for (let i = 0; i < squares.length; i++) {
			if (
				squares[i].classList.contains('flag') &&
				squares[i].classList.contains('bomb')
			) {
				matches++
			}
			if (matches === bombAmount) {
				result.innerHTML = 'YOU WIN!'
				isGameOver = true
			}
		}
	}
})
