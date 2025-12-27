import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '889514379802-966rhu14uk3dj9dlf97tb889gc7g91g9.apps.googleusercontent.com',
  offlineAccess: true, 
});

// --- EMAIL & PASSWORD METHODS ---

export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error: any) {
    console.error("Email Login Error:", error.code);
    throw error;
  }
};

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
    await GoogleSignin.hasPlayServices();

    // Force sign out from Google SDK to ensure the picker always appears
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      // User wasn't signed in, safe to ignore
    }

    const signInResult = await GoogleSignin.signIn();
    
    // Support both new (data) and old Google Sign In library response shapes
    const idToken = signInResult.data ? signInResult.data.idToken : (signInResult as any).idToken;

    if (!idToken) {
      throw new Error('Google Sign-In failed: No ID Token found');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return await auth().signInWithCredential(googleCredential);
  } catch (error: any) {
    if (error.code === 'SIGN_IN_CANCELLED') {
      console.log("User cancelled Google Sign-In");
    } else {
      console.error("Google Sign-In Error:", error);
    }
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
};