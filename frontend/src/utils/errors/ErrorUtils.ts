export default class ErrorUtils {
	public static showAlert(message: string) {
		if (typeof window !== 'undefined') window.alert(message);
	}
}
