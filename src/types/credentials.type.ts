export interface NASSCredentials {
  apiKey: string;      // Secret, never changes (unless rotated)
  apiId: string;       // Public identifier
}
