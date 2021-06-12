const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cart = document.querySelector('.cart__items');
const loading = document.createElement('h1');
loading.className = 'loading';
loading.innerText = 'loading...';
document.querySelector('.container').appendChild(loading);

function recordStorage(keyStorage, valuestorage) {
  localStorage.setItem(keyStorage, valuestorage);
}

function rescueStorage(keyStorage) {
  return localStorage.getItem(keyStorage);
}

/* function removeStorage(keyStorage) {
//  //JASON stringfy
localStorage.removeItem(keyStorage);
} */

function clearItemsCar() {
  cart.innerHTML = '';
  localStorage.clear();
}

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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  event.target.remove();
  /* removeStorage(cart.innerText); */
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart() {
  const button = document.querySelectorAll('.item__add');
  button.forEach((btn) => {
    btn.addEventListener('click', (event) => {
    const iditem = event.target.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${iditem}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const itemCart = createCartItemElement({ id, title, price });
      /* const cart = document.querySelector('.cart__items'); */
      cart.appendChild(itemCart);
      recordStorage('sku', id);
    });
  });
});
}

function getApiMl() { 
  const sectionItems = document.querySelector('.items');
  fetch(endPoint)
    .then((response) => response.json())
    .then((produts) => produts.results.forEach((itemsProduts) => {
      loading.remove();
      const incItem = createProductItemElement(itemsProduts);
      sectionItems.appendChild(incItem);
    }))
    .then(() => rescueStorage())
    .then(() => addCart());
}

  /* .forEach((itemsProduts) => sectionItems.appendChild(createProductItemElement(itemsProduts)))) */
  /* .then(() => addCart());  */

  window.onload = function onload() { };
  
  getApiMl();
  const btClearCart = document.querySelector('.empty-cart');
  btClearCart.addEventListener('click', clearItemsCar);
