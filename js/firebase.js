const firebaseConfig = {
  apiKey: "AIzaSyBf6m1mxZ2DexCy0jUc9Du00FzSpMZO4Jg",
  authDomain: "cafemenu-1ff06.firebaseapp.com",
  projectId: "cafemenu-1ff06"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
