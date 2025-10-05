export interface NASSSession {
  token: string;       // Short-lived (e.g., 1 hour)
  tokenBirth: number;  // Unix timestamp
  apiId: string;  // Identifier for the service
}
