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
  itemsContainer.appendChild(section);
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

const loadProducts = (query) => {
  return new Promise((pass, fail) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
      .then((result) => result.json())
      .then((json) => pass(json))
      .catch((error) => fail(error));
  });
  // fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  // .then((response) => response.json())
  // .then((json) => json.results.forEach((result) => createProductItemElement(result)));
};

window.onload = function onload() {
  // const itemsContainer = document.querySelector('.items');
  loadProducts('computador');  
};