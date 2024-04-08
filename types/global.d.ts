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
    signupTime: number,
    admin: boolean,
    bio: string,
    location: string,
  }
}