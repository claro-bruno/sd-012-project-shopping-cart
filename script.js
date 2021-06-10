const cartItems = document.querySelector('.cart__items');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// 4 
// 1º fiz uma func para armazenace o produto/item na chave 'cart' e a 2ª func para pegar o valor dessa chave.
const localStorageSave = () => {
  const cart = cartItems.innerHTML;
  localStorage.setItem('cart', cart);
};

const getLocalStorage = () => {
  // const getLocalStorage = localStorage.getItem('cart');
  // cartItems.innerHTML = getLocalStorage; Esse buga a lista e para de apagar os itens.
  localStorage.getItem('cart');
};

// 3
function cartItemClickListener(event) {
  // coloque seu código aqui event
  cartItems.removeChild(event.target);
  localStorageSave(); // requisito 4
  getLocalStorage(); // requisito 4
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 1
async function fetchApi() {
  const apiFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const apiFetchJson = await apiFetch.json();
  const apiResults = apiFetchJson.results;
  const items = document.querySelector('.items');
  apiResults.forEach((item) => items.appendChild(createProductItemElement(item)));
}
// Nessa função promisse, fiz um fetch, transformei ele em json e peguei apenas o elemento results (apiResults). Recuperei o elemento html que tem a classe items e criei um filhos passando a func createProductItem Element.
// Renomiei as chaves que vão de parâmetro na func creatProductItemElement com object destructuring: { id: sku, title: name, thumbnail: image }

// 2, 3 
// Adicionar e remover produtos do carrinho de compra
// Eu separei em 2 func por recomendação dos colegas José Carlos e André Moreno.
// Na 1ª func eu fiz o fetch da api e criei um filho para o elemento com classe cart__items.

async function buttonAdd(id) {
  const fetchItems = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await fetchItems.json();
  cartItems.appendChild(createCartItemElement(product));
  localStorageSave();  // requisito 4
  getLocalStorage(); // requisito 4
}
// Na 2ª func eu adicionei o evendo de click no document no elemento que sofreu o evento (event.target) e que tem a classe item__add. Foi usado o classList ao invés do className, mas eu não entendi pq. Se o elemento contém, aí eu coloco o id desse elemento numa constante e uso como parâmetro para a função anterior que vai criar um filho ao cartItems.
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = event.target.parentNode.firstChild.innerText;
    buttonAdd(id);
  }
});

window.onload = function onload() { 
  fetchApi();
  localStorageSave();
  getLocalStorage();
};