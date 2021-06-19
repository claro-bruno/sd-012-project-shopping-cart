function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updateLocalStorage() {
  const getCart = document.querySelector('ol').childNodes;
  localStorage.clear();
  getCart.forEach((item, index) => localStorage.setItem(`cart ${index}`, item.outerHTML));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  updateLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getMercadoLivreApi() {
  // Baseado na PR do Thalles Carneiro - T12 https://github.com/tryber/sd-012-project-shopping-cart/pull/9
  const getElementSection = document.querySelector('.items');
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJSON = await response.json();
  const arraySync = responseJSON.results;
  arraySync.forEach((item) => {
    const items = createProductItemElement(item);
    getElementSection.appendChild(items);
  });
}

function addItemToCart() {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((item) => {
    item.addEventListener('click', (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then((response) => response.json())
        .then((produto) => {
          const li = createCartItemElement(produto);
          const getOl = document.querySelector('.cart__items');
          getOl.appendChild(li);
          updateLocalStorage();
        });
    });
  });
}

function loadCart() {
  const getLocal = Object.values(localStorage);
  const getOL = document.querySelector('.cart__items');
  // pega valores do local storage em forma de string
  getLocal.forEach((liString, index) => {
    // concatena com Ol 
    getOL.innerHTML += localStorage.getItem(`cart ${index}`);
  });
}

window.onload = async function onload() {
  await getMercadoLivreApi();
  await addItemToCart();
  loadCart();
};
