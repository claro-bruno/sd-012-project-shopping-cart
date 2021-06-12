let arrayStorage = []; 

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
// return item.querySelector('span.item__sku').innerText;
// }

function removeStoreData(element) {
  const id = element.innerText.substr(5, 13);
  arrayStorage = arrayStorage.filter((item) => item.id !== id);
  const stringStorage = JSON.stringify(arrayStorage);
  localStorage.setItem('products', stringStorage); 
}

function cartItemClickListener(event) {
  event.target.remove();
  removeStoreData(event.target);
}

function storeData(obj) {
  arrayStorage.push(obj);
  const stringStorage = JSON.stringify(arrayStorage);
  localStorage.setItem('products', stringStorage); 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getStoreData() {
  if (localStorage.getItem('products') !== null) {
    arrayStorage = JSON.parse(localStorage.getItem('products'));
    arrayStorage.forEach((item) => {
      const product = {};
      const { id, title, price } = item;
      product.sku = id;
      product.name = title;
      product.salePrice = price;
      document.querySelector('.cart__items').appendChild(createCartItemElement(product));
   });
  }
}

function clickItemAdd() {
  const product = {};
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const idEvent = event.target.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${idEvent}`)
      .then((response) => response.json())
      .then((item) => {
        const { id, title, price } = item;
        product.sku = id;
        product.name = title;
        product.salePrice = price;
        storeData(item);
        document.querySelector('.cart__items').appendChild(createCartItemElement(product));
      });
    });
  });
}

function getandCreateItems() {
  const product = {};
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((items) => items.results.forEach((item) => {
      const { id, title, thumbnail } = item;
      product.sku = id;
      product.name = title;
      product.image = thumbnail;
      document.querySelector('.items').appendChild(createProductItemElement(product));
    }))
    .then(() => clickItemAdd());  
}

window.onload = async () => {  
  await getandCreateItems(); 
  getStoreData();
};
