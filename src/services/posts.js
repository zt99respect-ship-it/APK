import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { PAGE_SIZE } from '../lib/constants.js';

const postsRef = () => collection(db, 'posts');
const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

export function subscribeFirstPage(onChange, onError) {
  return onSnapshot(
    query(postsRef(), orderBy('createdAt', 'desc'), limit(PAGE_SIZE)),
    (snap) => onChange(snap.docs, snap.docs[snap.docs.length - 1] ?? null),
    onError,
  );
}

export async function fetchOlderPosts(afterDoc) {
  const snap = await getDocs(
    query(postsRef(), orderBy('createdAt', 'desc'), startAfter(afterDoc), limit(PAGE_SIZE)),
  );
  return { docs: snap.docs, lastDoc: snap.docs[snap.docs.length - 1] ?? null };
}

export function subscribePinnedPosts(onChange, onError) {
  return onSnapshot(
    query(postsRef(), where('pinned', '==', true)),
    (snap) =>
      onChange(
        mapDocs(snap).sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)),
      ),
    onError,
  );
}

export async function fetchTrendingPosts(max = 5) {
  const snap = await getDocs(query(postsRef(), orderBy('likesCount', 'desc'), limit(max)));
  return mapDocs(snap);
}

export async function fetchRecentPosts(max = 50) {
  const snap = await getDocs(query(postsRef(), orderBy('createdAt', 'desc'), limit(max)));
  return mapDocs(snap);
}

export async function countPosts() {
  const snap = await getCountFromServer(postsRef());
  return snap.data().count;
}

export function createPost(author, { text, imageUrl }) {
  return addDoc(postsRef(), {
    text,
    imageUrl,
    authorId: author.id,
    authorName: author.username,
    authorAvatar: author.avatarUrl || '',
    authorRole: author.role || 'user',
    likedBy: [],
    likesCount: 0,
    commentsCount: 0,
    pinned: false,
    createdAt: serverTimestamp(),
  });
}

export function setPostLiked(postId, uid, liked) {
  return updateDoc(doc(db, 'posts', postId), {
    likedBy: liked ? arrayUnion(uid) : arrayRemove(uid),
    likesCount: increment(liked ? 1 : -1),
  });
}

export function setPostPinned(postId, pinned) {
  return updateDoc(doc(db, 'posts', postId), { pinned });
}

export function deletePost(postId) {
  return deleteDoc(doc(db, 'posts', postId));
}

export function subscribeComments(postId, onChange, onError) {
  return onSnapshot(
    query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc')),
    (snap) => onChange(mapDocs(snap)),
    onError,
  );
}

export function addComment(postId, author, text) {
  const batch = writeBatch(db);
  const commentRef = doc(collection(db, 'posts', postId, 'comments'));
  batch.set(commentRef, {
    text,
    authorId: author.id,
    authorName: author.username,
    authorAvatar: author.avatarUrl || '',
    authorRole: author.role || 'user',
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db, 'posts', postId), { commentsCount: increment(1) });
  return batch.commit();
}
