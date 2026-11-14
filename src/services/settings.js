import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { DEFAULT_CONFIG } from '../lib/constants.js';

const configRef = () => doc(db, 'config', 'app');

export function subscribeAppConfig(onChange) {
  return onSnapshot(configRef(), (snap) => onChange({ ...DEFAULT_CONFIG, ...(snap.data() || {}) }));
}

export function updateAppConfig(patch) {
  return setDoc(configRef(), patch, { merge: true });
}
