export default abstract class JupyterUtils {
	public static getBaseHref(): string {
		return window.location.protocol + '//' + window.location.hostname + ':8888';
	}

	public static generateRandomHex(size: number): string {
		return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
	}
}
