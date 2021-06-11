// window.onload = function onload() {
//   fetchPC();
// };

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
  const OlItem = document.querySelector('.cart__items');
  OlItem.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cartShop = async (itemID) => {
  let fetchCart = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  fetchCart = await fetchCart.json();
  const olCart = document.querySelector('.cart__items');
  olCart.appendChild((createCartItemElement(fetchCart)));
};

const createButton = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((element) => {
    element.addEventListener('click', ((event) => {
      const elementSku = event.target.parentElement.firstChild.innerText;
      cartShop(elementSku);
    }));
  });
};

const fetchPC = async () => {
  const tagSection = document.querySelector('.items');
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const apiFetch = await fetch(API_URL);
  const apiJson = await apiFetch.json();
  const jsonResults = apiJson.results;
  jsonResults.forEach((product) => {
    const productList = createProductItemElement(product);
    tagSection.appendChild(productList);
  });
  createButton();
};
fetchPC();
createButton();