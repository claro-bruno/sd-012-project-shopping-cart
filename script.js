function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

async function cartItem(id) {
  const objId = await fetch(`https://api.mercadolibre.com/items/${id}`).then((r) => r.json());
  const { title, price } = objId;
  const newCart = createCartItemElement({ sku: id, name: title, salePrice: price });
  const list = document.querySelector('.cart__items');
  list.appendChild(newCart);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      const id = event.target.parentNode.firstChild.innerText;
      cartItem(id);
    });
  }
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
  // coloque seu código aqui
}

async function verifetch(url) {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      return fetch(url)
      .then((r) => r.json())
      .then((r) => r.results)
      .then((r) => r.forEach((element) => {
        const { id, title, thumbnail } = element;
        const section = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail });
        const elementoPai = document.querySelector('.items');
        elementoPai.appendChild(section);
      }));
    }
      throw new Error('endpoint does not exist');
}

window.onload = function onload() { 
  verifetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};