export default abstract class JupyterUtils {
	public static getBaseHref(): string {
		return (
			window.location.protocol +
			'//' +
			window.location.hostname +
			':' +
			process.env.NEXT_PUBLIC_JUPYTER_PORT
		);
	}
}
