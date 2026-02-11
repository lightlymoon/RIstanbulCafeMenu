const firebaseConfig = {
  apiKey: "AIzaSyBf6m1mxZ2DexCy0jUc9Du00FzSpMZO4Jg",
  authDomain: "cafemenu-1ff06.firebaseapp.com",
  projectId: "cafemenu-1ff06"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let lang = "tr";
let category = "all";
let products = [];

const list = document.getElementById("list");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

const texts = {
  tr: {
    title: "Taze ve Günlük",
    categories: {
      all: "Tümü",
      drinks: "İçecek",
      hot: "Sıcak",
      cold: "Soğuk",
      food: "Yiyecek",
      dessert: "Tatlı"
    },
    price: "Fiyat",
    varieties: "Çeşitler",
    hotDrinks: "Sıcak İçecekler",
    coldDrinks: "Soğuk İçecekler",
    footer: "© 2026 Real İstanbul Cafe Menu • Dijital Menü Sistemi"
  },
  en: {
    title: "Fresh and Daily",
    categories: {
      all: "All",
      drinks: "Drinks",
      hot: "Hot",
      cold: "Cold",
      food: "Food",
      dessert: "Dessert"
    },
    price: "Price",
    varieties: "Varieties",
    hotDrinks: "Hot Drinks",
    coldDrinks: "Cold Drinks",
    footer: "© 2026 Real Istanbul Cafe Menu • Digital Menu System. • Designed & Developed by Nuray Guliyeva"
  }
};

function setLang(l) {
  lang = l;
  updateTexts();
  render();
}

function filter(c) {
  category = c;
  render();
}

db.collection("products").onSnapshot(snap => {
  products = [];
  snap.forEach(d => {
    const data = d.data();
    products.push({
      id: d.id,
      tr: data.tr,
      en: data.en,
      price: data.price,
      cat: data.cat,
      details: data.details || ""
    });
  });
  render();
});

function render() {
  list.innerHTML = "";

  let filtered = products.filter(p => {
    if (category === "all") return true;
    if (category === "drinks") return p.cat === "hot" || p.cat === "cold";
    return p.cat === category;
  });

  if (category === "drinks") {
    const hotDrinks = filtered.filter(p => p.cat === "hot");
    const coldDrinks = filtered.filter(p => p.cat === "cold");

    if (hotDrinks.length > 0) {
      const h3 = document.createElement("h3");
      h3.innerText = texts[lang].hotDrinks;
      list.appendChild(h3);
      hotDrinks.forEach(addProductCard);
    }

    if (coldDrinks.length > 0) {
      const h3 = document.createElement("h3");
      h3.innerText = texts[lang].coldDrinks;
      list.appendChild(h3);
      coldDrinks.forEach(addProductCard);
    }

  } else {
    filtered.forEach(addProductCard);
  }
}

function addProductCard(p) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <h4>${lang === "tr" ? p.tr : p.en}</h4>
    ${p.details ? `<p>${p.details}</p>` : ""}
    <small>${texts[lang].price}: ${p.price} ₺</small>
  `;
  div.onclick = () => openModal(p);
  list.appendChild(div);
}

function openModal(p) {
  modal.classList.add("active");
  modalContent.innerHTML = `
    <h3>${lang === "tr" ? p.tr : p.en}</h3>
    ${p.details ? `<p>${texts[lang].varieties}: ${p.details}</p>` : ""}
    <p>${texts[lang].price}: ${p.price} ₺</p>
    <p>Kategori: ${texts[lang].categories[p.cat] || p.cat}</p>
  `;
}

modal.onclick = e => {
  if (e.target === modal)
    modal.classList.remove("active");
};

function updateTexts() {
  document.getElementById("title").innerText = texts[lang].title;
  document.getElementById("cat-all").innerText = texts[lang].categories.all;
  document.getElementById("cat-drinks").innerText = texts[lang].categories.drinks;
  document.getElementById("cat-food").innerText = texts[lang].categories.food;
  document.getElementById("cat-dessert").innerText = texts[lang].categories.dessert;
  document.getElementById("footer-text").innerText = texts[lang].footer;
}

updateTexts();
render();