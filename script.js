const fatherCart = document.querySelector('.cart__items');
const btnClearCart = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

function sumPriceTotal() {
  const actualPrice = document.querySelector('.total-price');
  const childrenCart = document.querySelectorAll('.cart__item');
  const childrenCartArr = Array.prototype.map.call(childrenCart, (li) => 
    Number(li.innerHTML.slice(li.innerHTML.indexOf('$') + 1)));
    const totalPrice = childrenCartArr.reduce((acc, curr) => acc + curr, 0);
    actualPrice.innerHTML = totalPrice;
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
  const getFather = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  getFather.appendChild(section);  
  return section;
}

function saveItemStorage() {
  const fatherCartContent = fatherCart.innerHTML.toString();
  localStorage.setItem('products', fatherCartContent);
}

function rIS(event) {
    event.addEventListener('click', event.remove());
    sumPriceTotal();
    saveItemStorage();
}

  btnClearCart.addEventListener('click', () => {
    btnClearCart.nextElementSibling.innerHTML = '';
    sumPriceTotal();
    saveItemStorage();
  });

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
    event.target.remove();     
    sumPriceTotal();
    saveItemStorage();
  }
  
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  fatherCart.appendChild(li);
  saveItemStorage();
  return li;
}

function spreadProducts(products) {
  products.forEach((key) => {
    createProductItemElement(key);
  });
}

function addItemCar() {
  const btnAddCar = document.querySelectorAll('.item__add');
  btnAddCar.forEach((btn) => {
    btn.addEventListener('click', () => {
      const eachIdProduct = btn.parentNode.firstChild.innerText;
      const urlEachProduct = `https://api.mercadolibre.com/items/${eachIdProduct}`;
      fetch(urlEachProduct)
      .then((eachProduct) => eachProduct.json())
      .then((eachProduct) => createCartItemElement(eachProduct))
      .then(() => sumPriceTotal());
    });
  });
}

function createLoading() {
  loading.innerHTML = 'loading...';
}

window.onload = function onload() {
  createLoading();
    const contentSave = localStorage.getItem('products');
    if (contentSave) {
    fatherCart.innerHTML = contentSave;
    const childrenCart = document.querySelectorAll('.cart__item');
    childrenCart.forEach((children) => children.addEventListener('click', () => rIS(children)));
  }
  const price = createCustomElement('span', 'total-price', 0);
  const section = document.querySelector('.cart');
  section.appendChild(price);
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then((r) => r.json())
  .then((r) => spreadProducts(r.results))
  .then(() => {
    addItemCar();
    loading.remove();
  });
};
