const URLMercadoLivre = 'https://api.mercadolibre.com/';
const olCartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const clean = document.querySelector('.empty-cart');
// Adiciona imagen
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Adiciona o elemento da imagen
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Adiciona o elemento na pag
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  // 'Reatribuindo os valores que o parametro vai receber'
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
const sumAllPrices = (price) => {
  // Tenho muito a agradecer pelo Bruno Yamamoto ter me ajudado a construir essa função, diminuindo e muito o meu trabalho
  totalPrice.innerText = parseFloat(totalPrice.innerText) + price;
};
const setLocalStorage = () => {
  localStorage.setItem('item', olCartItems.innerHTML);
};
function cartItemClickRemove(event) {
  console.log(event.target.innerText);
  console.log(`removeu ${event.target.innerText}`);
  const price = event.target.innerText.split('$').pop();
  totalPrice.innerText = parseFloat(totalPrice.innerText - price);
  event.target.remove();
  setLocalStorage();
}
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickRemove);
  return li;
}

// -----------------------------------------------CREATE--------------------------------------------------------

const olChild = async (id) => {
  const response = await fetch(`${URLMercadoLivre}items/${id}`);
  const data = await response.json();
  console.log(data);
  sumAllPrices(data.price);
  olCartItems.appendChild(createCartItemElement(data));
  setLocalStorage();
};

const onClick = () => {
  const buttons = document.querySelectorAll('.item__add');
  console.log(buttons);
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const userId = event.target.parentElement.querySelector('span.item__sku').innerText;
      console.log(`adicionou ${userId}`);
      await olChild(userId);
    });
  });
};
// -------------------------------------Requisito 1 onload fetch API ------------------------------

// Usando async
const productsList = (data) => {
  console.log(data);
  const items = document.querySelector('.items');

  return data.results.forEach((user) => items
  .appendChild(createProductItemElement(user)));
};

const fetchMercadoLivre = async (page) => {
  try {
    const response = await fetch(`${URLMercadoLivre}sites/MLB/search?q=${page}`);
    const data = await response.json();
    return productsList(data);
  } catch (e) {
    return e + alert('ERROR API NOT FOUND ');
    // return e;
  }
};

const cartItemsOnLocalStorage = () => {
  olCartItems.innerHTML = localStorage.getItem('item');
  olCartItems.childNodes.forEach((element) => element
  .addEventListener('click', cartItemClickRemove));
};

const clearcart = () => {
  olCartItems.innerHTML = '';
  totalPrice.innerHTML = 0;
  localStorage.removeItem('item');
};
clean.addEventListener('click', clearcart);

window.onload = async () => {
  try {
    await fetchMercadoLivre('computador');
    onClick();
    cartItemsOnLocalStorage();
  } catch (error) {
    console.log(error);
  }
};