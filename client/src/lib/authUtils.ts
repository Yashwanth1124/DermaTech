export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('dermatech_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('dermatech_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('dermatech_token');
}

export function getUserFromToken(token: string): any {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}