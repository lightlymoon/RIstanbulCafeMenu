const firebaseConfig = {
  apiKey: "AIzaSyBf6m1mxZ2DexCy0jUc9Du00FzSpMZO4Jg",
  authDomain: "cafemenu-1ff06.firebaseapp.com",
  projectId: "cafemenu-1ff06"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let editId = null;

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadProducts();
  }
});

function logout() {
  auth.signOut().then(() => window.location.href = "login.html");
}

function addProduct() {
  const tr = document.getElementById("product-tr").value;
  const en = document.getElementById("product-en").value;
  const price = Number(document.getElementById("product-price").value);
  const cat = document.getElementById("product-cat").value;
  const details = document.getElementById("product-details").value;

  if (!tr || !en || !price) return alert("Tüm zorunlu alanları doldurun!");

  const data = { tr, en, price, cat, details };

  if (editId) {
    db.collection("products").doc(editId).update(data)
      .then(() => { editId = null; clearForm(); });
  } else {
    db.collection("products").add(data).then(() => clearForm());
  }
}

function clearForm() {
  document.getElementById("product-tr").value = "";
  document.getElementById("product-en").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-cat").value = "hot";
  document.getElementById("product-details").value = "";
}

function loadProducts() {
  const list = document.getElementById("product-list");
  db.collection("products").onSnapshot(snap => {
    list.innerHTML = "";
    snap.forEach(doc => {
      const p = { id: doc.id, ...doc.data() };
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <b>${p.tr} / ${p.en}</b> - ${p.price} ₺
        <p>${p.details || ""}</p>
        <button onclick="editProduct('${p.id}','${p.tr}','${p.en}',${p.price},'${p.cat}','${p.details ? p.details.replace(/'/g,"\\'") : ""}')">✏️ Düzenle</button>
        <button onclick="deleteProduct('${p.id}')">🗑️ Sil</button>
      `;
      list.appendChild(div);
    });
  });
}

function editProduct(id, tr, en, price, cat, details) {
  editId = id;
  document.getElementById("product-tr").value = tr;
  document.getElementById("product-en").value = en;
  document.getElementById("product-price").value = price;
  document.getElementById("product-cat").value = cat;
  document.getElementById("product-details").value = details;
}

function deleteProduct(id) {
  if (!confirm("Silmek istiyor musunuz?")) return;
  db.collection("products").doc(id).delete();
}
