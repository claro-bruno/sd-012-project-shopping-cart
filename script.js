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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

const showProducts = async (computers) => {
  console.log(computers);
  computers.forEach((item) => {
    const mainSection = document.querySelector('.items');
    mainSection.appendChild(createProductItemElement(item));    
  });
 };

function getProducts() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((computers) => resolve(showProducts(computers.results)))
      .catch((error) => reject(console.log(error)));
  });
}

window.onload = function onload() { 
  getProducts();
};
