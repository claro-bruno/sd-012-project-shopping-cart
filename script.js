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

function cartItemClickListener(li) {
  li.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', () => { cartItemClickListener(li); });
  return li;
}

async function getItem(id) {
  const cart = document.querySelector('.cart__items');
  try {
    await fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
      response.json().then((product) => {
        cart.appendChild(createCartItemElement(product));
      });
    });
  } catch (error) {
    console.log(error);
  }
 }

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getProducts = ((searchTerm) => new Promise((resolve, reject) => {
  if (searchTerm === 'computador') {
    const items = document.querySelector('.items');
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`).then((response) => {
      response.json().then((products) => {
        products.results.forEach((product) => {
          items.appendChild(createProductItemElement(product))
          .querySelector('.item__add').addEventListener('click', () => (getItem(product.id)));
        });
        resolve(products.results);
      });
    });
  } else {
    return reject(new Error('Produto não aceito!'));
  }
}));

const fetchProducts = async () => {
  try {
    await getProducts('computador');
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() {
  fetchProducts();
  // addButtonListeners();
};
