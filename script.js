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

function cartItemClickListener(e) {
  e.target.remove();
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const addToCart = (sku) => {
  const cart = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((response) => {
      (cart.appendChild(createCartItemElement(response)));
    })
    .catch((error) => (error));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // Para adicionar o evento na criação do botão tive ajuda do Emerson Filho!
  button.addEventListener('click', () => { 
    addToCart(sku);
  });
  section.appendChild(button);

  return section;
}

const getMLProducts = () => new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

window.onload = function onload() { 
  getMLProducts()
    .then((response) => response.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const list = document.querySelector('.items');
       list.appendChild(createProductItemElement({ sku, name, image }));
    }))
    .catch((error) => error);
};
