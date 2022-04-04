export default class InvalidTokenError extends Error {
	constructor(message?: string) {
		super(message);
		Object.setPrototypeOf(this, InvalidTokenError.prototype);
	}
}
