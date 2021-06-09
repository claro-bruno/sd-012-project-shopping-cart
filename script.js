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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getItem(item) {
  return new Promise((resolve, reject) => {
    if (item === 'computador') {
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
        .then((res) => res.json())
        .then((json) => {
          json.results.forEach((curr) => {
            const { id: sku, title: name, thumbnail: image } = curr;
            const itemSection = document.querySelector('.items');
            itemSection.appendChild(
              createProductItemElement({ sku, name, image }),
            );
            resolve();
          });
        });
    } else {
      reject();
    }
  });
}

function appendCartItem(itemObj) {
  const cartContainer = document.getElementsByClassName('cart__items')[0];
  const { id: sku, title: name, price: salePrice } = itemObj;
  cartContainer.appendChild(createCartItemElement({ sku, name, salePrice }));
}

function addItemCart(event) {
  if (event.target.className === 'item__add') {
    const itemId = event.target.parentElement.firstChild.innerHTML;
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
      .then((res) => res.json())
      .then((elem) => appendCartItem(elem));
  }
}

window.onload = function onload() {
  getItem('computador');
  document
    .getElementsByClassName('items')[0]
    .addEventListener('click', addItemCart);
};
