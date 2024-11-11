export class TokenProvider {
  private static tokenPath = "sessionToken";

  public static set(token: string) {
    localStorage.setItem(TokenProvider.tokenPath, token);
  }

  public static get() {
    return localStorage.getItem(TokenProvider.tokenPath);
  }

  public static remove() {
    localStorage.removeItem(TokenProvider.tokenPath);
  }
}
