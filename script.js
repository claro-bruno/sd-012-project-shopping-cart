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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
  if (event.target.classList.value === 'cart__item') {
    event.target.remove();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const fatherCart = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  fatherCart.appendChild(li);
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
      .then((eachProduct) => createCartItemElement(eachProduct));
    });
  });
}

window.onload = function onload() { 
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then((r) => r.json())
  .then((r) => spreadProducts(r.results))
  .then(() => addItemCar());
};