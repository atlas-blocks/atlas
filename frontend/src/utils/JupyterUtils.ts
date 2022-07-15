export default abstract class JupyterUtils {
	public static getBaseHref(): string {
		return window.location.protocol + '//' + window.location.hostname + ':8888';
	}
}
