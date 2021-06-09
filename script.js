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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadingScreen = () => {
  const screen = document.createElement('section');
  screen.className = 'loading';
  const box = document.createElement('span');
  box.innerHTML = 'Loading...';
  screen.appendChild(box);
  const body = document.querySelector('body');
  body.appendChild(screen);
};

const loadProducts = (query) => new Promise((pass, fail) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((result) => result.json())
  .then((json) => {
    const loading = document.querySelector('.loading');
    loading.className = 'hide';
    pass(json.results);
  })
  .catch((error) => fail(error));
});

window.addEventListener('load', async () => {
  loadingScreen();
  const itemsSection = document.querySelector('.items');
  const productsList = await loadProducts('computador');
  productsList.forEach((product) => itemsSection.appendChild(createProductItemElement(product))); 
});