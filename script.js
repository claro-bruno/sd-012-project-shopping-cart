window.onload = async () => { 
  const products = await fetchProducts();
  products.forEach((product) => {
    document
    .querySelector('.items')
    .appendChild(createProductItemElement(product));
  })
}

const fetchProducts = () => (
  new Promise((resolve, reject) => {
    fetch(API)
    .then(response => response.json())
    .then(data => resolve(data.results))
    .catch(fail => reject('Bugou'));
  })
);

const fetchProduct = (url) => (
  new Promise((resolve, reject) => {
    fetch(url)
    .then(response => response.json())
    .then(data => resolve(data.results))
    .catch(fail => reject('Bugou'));
  })
);

const addToCart = async (item) => {

}










const API = "https://api.mercadolibre.com/sites/MLB/search?q=$computador";

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
  if (element == 'button'){
    e.addEventListener('click', (event) => {
      const item = event.target.parentElement;

      console.log(getSkuFromProductItem(item));
    })
  }
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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

