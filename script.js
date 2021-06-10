// inicio de projeto!
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // os nomes que vem no json são diferentes, estou atribuido os correspondentes
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// função chama a createProductItemElement que adiciona na tela os produtos vindos da api S2!
async function getProductsApi() {
  const getApi = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const getApiResults = await getApi.json();
  const products = getApiResults.results;
  document.querySelector('.loading').remove();
  // console.log(products)
  const itemsProducts = document.querySelector('.items');
  // console.log(itemsProducts);
  products.forEach((element) => {
    const item = createProductItemElement(element);
    itemsProducts.appendChild(item);
  });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const cartItemClickListener = ({ target }) => target.remove();

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const element = document.getElementsByClassName('cart__items');
// console.log(element);
async function getElementToCart(itemID) {
  let elementChoice = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  elementChoice = await elementChoice.json();
  element[0].appendChild(createCartItemElement(elementChoice));
  // console.log(elementChoice);
}

document.addEventListener('click', ({ target }) => {
  if (target.classList.contains('item__add')) {
    const elementAdd = target.parentElement.firstChild.innerText;
    getElementToCart(elementAdd);
  }
});

window.onload = function onload() {
  getProductsApi();
 };
