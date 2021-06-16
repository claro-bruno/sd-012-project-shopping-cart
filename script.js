const valorFetch = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProducts() {
  const addCart = document.querySelectorAll('.item__add');
  addCart.forEach((cart) => {
    cart.addEventListener('click', (event) => {
      const itemid = event.target.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${itemid}`)
      .then((response) => response.json())
      .then((jsonBody) => {
        const cartValue = createCartItemElement(
          { sku: jsonBody.id, name: jsonBody.title, salePrice: jsonBody.price },
          );
          document.querySelector('.cart__items').appendChild(cartValue);
        });
      });
    });
  }
  
  function fetchMode() {
    fetch(valorFetch)
    .then((response) => response.json())
    .then((jsonBody) =>
    jsonBody.results.forEach((itensBody) => {
      const conver = createProductItemElement(
        { sku: itensBody.id, name: itensBody.title, image: itensBody.thumbnail },
        );
        document.querySelector('.items').appendChild(conver);
      }))
      .then(() => addProducts());
    }
  function removeButton() {
    const removeB = document.getElementsByClassName('empty-cart')[0];
    const ordenedB = document.getElementsByClassName('cart__items')[0];
    // console.log(ordenedB);
    removeB.addEventListener('click', () => {
      ordenedB.innerHTML = '';
    });
  }

window.onload = function onload() { 
  fetchMode();
  removeButton();
};
