const MercadoLivreURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getRequest(url) {
  const response = fetch(url).then((r) => r.json())
  .catch((reject) => { throw new Error('Could not find the url!'); });

  return response;
}

async function organizaElementos() {
  const MLlista = await getRequest(MercadoLivreURL);
  const listaItens = [];
  const itemsSection = document.querySelector('.items');
  
  MLlista.results.forEach((result) => {
    listaItens.push(createProductItemElement(result));
  });
  listaItens.forEach((item) => {
    itemsSection.appendChild(item);
  });
}

window.onload = async function onload() { 
  organizaElementos();
};