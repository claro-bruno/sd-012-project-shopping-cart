async function fetchList() {
  try {
    const searchQuery = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const fetchResult = await fetch(searchQuery);
    const fetchResultJson = await fetchResult.json();
    const computers = fetchResultJson.results;
    const computersFilteredKeys = computers.map(({ id, title, price, thumbnail }) =>
    ({ sku: id, name: title, price, image: thumbnail }));
    // console.log(computers);
    // console.log(computersFilteredKeys);
    return computersFilteredKeys;
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
  // console.log(event.path);
  const itemsElement = event.path[1];
  const itemElement = event.path[0];
  itemsElement.removeChild(itemElement);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function addOnClickEventListener() {
  const items = document.querySelectorAll('.item');
  items.forEach(async (item) => {
    // console.log(item.children[3]);
    // console.log(item.children[0].innerText);
    item.children[3].addEventListener('click', async () => {
      const searchQuery = `https://api.mercadolibre.com/items/${item.children[0].innerText}`;
      const fetchResult = await fetch(searchQuery);
      const { id, title, price } = await fetchResult.json();
      // console.log(id, title, price);
      const cartItemElement = createCartItemElement({ sku: id, name: title, salePrice: price });
      // console.log(createCartItemElement({ sku: id, name: title, salePrice: price }));
      const cartItemsElement = document.querySelector('.cart__items');
      cartItemsElement.appendChild(cartItemElement);
    });
  });
}

window.onload = async function onload() {
  // console.log(itemsElement);
  const computers = await fetchList();
  // console.log(computers); 
  computers.forEach((computer) => {
    const itemsElement = document.querySelector('.items');
    const productSection = createProductItemElement(computer);
    itemsElement.appendChild(productSection);
 });
 addOnClickEventListener();
};