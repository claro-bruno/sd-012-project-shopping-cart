const COMPUTER_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function facilityKeysComputer(computer) {
    return {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function renderNewComputers(newComputers) {
  newComputers.forEach((newcomputer) => {
    const element = createProductItemElement(newcomputer);
    document.getElementsByClassName('items')[0]
    .appendChild(element);
  });
}

const fetchComputer = () => {
  fetch(COMPUTER_URL)
  .then((response) => response.json())
  .then((computers) => computers.results.map((computer) => facilityKeysComputer(computer)))
  .then((newComputers) => renderNewComputers(newComputers));
};

window.onload = function onload() {
  fetchComputer();
 };