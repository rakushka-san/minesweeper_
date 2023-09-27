document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid')
	const flagsLeft = document.querySelector('#flags-left')
	const result = document.querySelector('#result')
	let width = 10
	let bombAmount = 20
	let flags = 0
	let squares = []
	let isGameOver = false

	// создание игрового поля
	function createBoard() {
		flagsLeft.innerHTML = bombAmount

		// получение списка, отражающего игровое поле и содержащего информацию о положении бомб
		const bombsArray = Array(bombAmount).fill('bomb')
		const emptyArray = Array(width * width - bombAmount).fill('valid')
		const gameArray = emptyArray.concat(bombsArray)
		const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

		// отрисовка игрового поля
		for (let i = 0; i < width * width; i++) {
			const square = document.createElement('div')
			square.setAttribute('id', i)
			square.classList.add(shuffledArray[i])
			grid.appendChild(square)
			squares.push(square)

			// обработка нажатия левой кнопкой мыши
			square.addEventListener('click', function (e) {
				click(square)
			})

			// обработка нажатия правой кнопкой мыши
			square.oncontextmenu = function (e) {
				e.preventDefault()
				addFlag(square)
			}
		}

		// вычисление числа окружающих бомб для каждой клетки
		for (let i = 0; i < squares.length; i++) {
			let total = 0
			const isLeftEdge = i % width === 0
			const isRightEdge = i % width === width - 1

			if (squares[i].classList.contains('valid')) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
					total++
				if (
					i > 9 &&
					!isRightEdge &&
					squares[i + 1 - width].classList.contains('bomb')
				)
					total++
				if (i > 10 && squares[i - width].classList.contains('bomb')) total++
				if (
					i > 11 &&
					!isLeftEdge &&
					squares[i - 1 - width].classList.contains('bomb')
				)
					total++
				if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb'))
					total++
				if (
					i < 90 &&
					!isLeftEdge &&
					squares[i - 1 + width].classList.contains('bomb')
				)
					total++
				if (
					i < 88 &&
					!isRightEdge &&
					squares[i + 1 + width].classList.contains('bomb')
				)
					total++
				if (i < 89 && squares[i + width].classList.contains('bomb')) total++
				squares[i].setAttribute('data', total)
			}
		}
	}
	createBoard()

	// функция изменения состояния отметки клетки флагом
	function addFlag(square) {
		if (isGameOver) return
		if (!square.classList.contains('checked') && flags < bombAmount) {
			if (!square.classList.contains('flag')) {
				square.classList.add('flag')
				square.innerHTML = ' 🚩'
				flags++
				flagsLeft.innerHTML = bombAmount - flags
				checkForWin()
			} else {
				square.classList.remove('flag')
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
