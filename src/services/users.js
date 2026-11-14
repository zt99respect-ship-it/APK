import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { isAdminEmail } from '../lib/constants.js';

const usersRef = () => collection(db, 'users');

export function subscribeProfile(uid, onChange, onError) {
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => onChange(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onError,
  );
}

export function createProfile({ uid, email, username }) {
  const role = isAdminEmail(email) ? 'admin' : 'user';
  return setDoc(doc(db, 'users', uid), {
    username,
    usernameLower: username.toLowerCase(),
    avatarUrl: '',
    bannerUrl: '',
    bio: '',
    kickUsername: '',
    role,
    banned: false,
    muted: false,
    createdAt: serverTimestamp(),
  });
}

export function updateUser(uid, patch) {
  return updateDoc(doc(db, 'users', uid), patch);
}

export async function listUsers(max = 100) {
  const snap = await getDocs(query(usersRef(), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function countUsers() {
  const snap = await getCountFromServer(usersRef());
  return snap.data().count;
}

export async function searchUsers(term) {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  const snap = await getDocs(
    query(usersRef(), where('usernameLower', '>=', t), where('usernameLower', '<=', `${t}\uf8ff`), limit(8)),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
