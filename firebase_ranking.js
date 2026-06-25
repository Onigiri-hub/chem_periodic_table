firebase.initializeApp({
  apiKey: "AIzaSyBqTJHyHeBNz2qeGfLgsFNazjM8bVwThik",
  authDomain: "chem-puzzle.firebaseapp.com",
  projectId: "chem-puzzle",
  storageBucket: "chem-puzzle.firebasestorage.app",
  messagingSenderId: "897439874773",
  appId: "1:897439874773:web:d653f479a7b7a665f76c5c"
});

const db = firebase.firestore();
const auth = firebase.auth();

async function ensureSignedIn() {
  if (!auth.currentUser) await auth.signInAnonymously();
}

async function submitScore(name, seconds, period, style) {
  await ensureSignedIn();
  const ref = await db.collection('rankings').add({
    name, seconds, period, style,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return ref.id;
}

async function fetchTopRankings(period, style) {
  await ensureSignedIn();
  const snap = await db.collection('rankings')
    .where('period', '==', period)
    .where('style', '==', style)
    .orderBy('seconds', 'asc')
    .limit(100)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
