import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase.js';

export async function signUpWithEmail({ username, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });
  await sendEmailVerification(cred.user);
  return cred.user;
}

export async function signInWithEmail({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export const resendVerification = () => sendEmailVerification(auth.currentUser);
export const signOutUser = () => firebaseSignOut(auth);

const AUTH_ERRORS = {
  'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
  'auth/missing-password': 'أدخل كلمة المرور',
  'auth/weak-password': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
  'auth/email-already-in-use': 'هذا البريد مسجل بالفعل',
  'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة',
  'auth/wrong-password': 'البريد أو كلمة المرور غير صحيحة',
  'auth/user-not-found': 'البريد أو كلمة المرور غير صحيحة',
  'auth/too-many-requests': 'محاولات كثيرة، حاول لاحقاً',
  'auth/network-request-failed': 'تحقق من اتصالك بالإنترنت',
};

export const authErrorMessage = (error) => AUTH_ERRORS[error?.code] || 'حدث خطأ، حاول مرة أخرى';
