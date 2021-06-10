async function fetchList() {
  try {
    const searchQuery = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const fetchResult = await fetch(searchQuery);
    const fetchResultJson = await fetchResult.json();
    const computers = fetchResultJson.results;
    const computersFilteredKeys = computers.map(({ id, title, price, thumbnail }) =>
    ({ sku: id, name: title, price, image: thumbnail }));
    return computersFilteredKeys;
    // console.log(computersFilteredKeys);
    // console.log(computers);
  } catch (error) {
    console.log(error);
  }
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
window.onload = async function onload() {
  const itemsElement = document.querySelector('.items');
  console.log(itemsElement);
  const computers = await fetchList();
  // console.log(computers); 
  computers.forEach((computer) => {
  const productSection = createProductItemElement(computer);
    itemsElement.appendChild(productSection);
 });
};