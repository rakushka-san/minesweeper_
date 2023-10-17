export class Square {
	constructor(isValid) {
		this.isValid = isValid
		this.isChecked = false
		this.isFlagged = false
		this.bombsAround = 0
	}
}
