import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '889514379802-966rhu14uk3dj9dlf97tb889gc7g91g9.apps.googleusercontent.com',
});

// --- EMAIL & PASSWORD METHODS ---

/**
 * Signs in an existing user with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error: any) {
    console.error("Email Login Error:", error.code);
    throw error;
  }
};

/**
 * Creates a new account for the user
 */
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error: any) {
    console.error("Signup Error:", error.code);
    throw error;
  }
};

// --- GOOGLE SIGN-IN METHOD ---

export const signInWithGoogle = async () => {
  try {
    // 1. Check for Play Services
    await GoogleSignin.hasPlayServices();

    // 2. Perform Sign In
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    if (!idToken) {
      throw new Error('Google Sign-In failed: No ID Token found');
    }

    // 3. Link Google Account to Firebase
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return await auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

/**
 * Helper to log out from both Firebase and Google
 */
export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
};