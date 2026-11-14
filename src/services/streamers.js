import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';

export function subscribeGlobalStreamers(onChange, onError) {
  return onSnapshot(
    query(collection(db, 'streamers'), orderBy('addedAt', 'desc')),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

export async function fetchGlobalStreamers() {
  const snap = await getDocs(collection(db, 'streamers'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function saveGlobalStreamer(channel) {
  return setDoc(
    doc(db, 'streamers', channel.slug),
    { ...channel, addedAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function refreshGlobalStreamer(slug, channel) {
  return updateDoc(doc(db, 'streamers', slug), { ...channel, updatedAt: serverTimestamp() });
}

export function deleteGlobalStreamer(slug) {
  return deleteDoc(doc(db, 'streamers', slug));
}

export function subscribeBells(uid, onChange, onError) {
  return onSnapshot(
    collection(db, 'users', uid, 'subscriptions'),
    (snap) => onChange(new Set(snap.docs.map((d) => d.id))),
    onError,
  );
}

export function setBell(uid, slug, enabled) {
  const ref = doc(db, 'users', uid, 'subscriptions', slug);
  return enabled
    ? setDoc(ref, { slug, createdAt: serverTimestamp() })
    : deleteDoc(ref);
}

export function subscribePrivateStreamers(uid, onChange, onError) {
  return onSnapshot(
    query(collection(db, 'users', uid, 'privateStreamers'), orderBy('addedAt', 'desc')),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );
}

export function savePrivateStreamer(uid, channel) {
  return setDoc(doc(db, 'users', uid, 'privateStreamers', channel.slug), {
    ...channel,
    addedAt: serverTimestamp(),
  });
}

export function refreshPrivateStreamer(uid, slug, channel) {
  return updateDoc(doc(db, 'users', uid, 'privateStreamers', slug), channel);
}

export function deletePrivateStreamer(uid, slug) {
  return deleteDoc(doc(db, 'users', uid, 'privateStreamers', slug));
}
