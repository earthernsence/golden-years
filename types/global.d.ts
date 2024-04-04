export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean,
    }
  }

  interface UserPublicMetadata {
    name: string,
    username: string,
    signupTime: string,
    admin: boolean,
    bio: string,
    location: string,
  }
}