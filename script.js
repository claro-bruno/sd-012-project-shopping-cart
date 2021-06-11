const olCartItems = document.querySelector('.cart__items');
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
const setLocalStorage = () => {
  localStorage.setItem('item', olCartItems.innerHTML);
};
function cartItemClickRemove(event) {
  console.log(`removeu ${event.target.innerText}`);
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
// function getIdFromProductItem(item) {
//   // Função que pega o id do item 'MLB1613404303'
//   alert('funcionou');
//   return item.querySelector('span.item__sku').innerText;
// }

const olChild = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  console.log(data);
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

// Usando Promise

// const fetchMercadoLivre = () => 
// new Promise((resolve, reject) => 
//   fetch(`${URLMercadoLivre}${'computador'}`)
//   .then((response) => response.json())
//   .then((data) => { 
//     data.results.forEach((user) => items
//     .appendChild(createProductItemElement(user)));
//     resolve();
//   })
//   .catch(() => reject()));

// Usando async
const productsList = (data) => {
  console.log(data);
  const items = document.querySelector('.items');

  return data.results.forEach((user) => items
  .appendChild(createProductItemElement(user)));
};

const fetchMercadoLivre = async (page) => {
  try {
    const URLMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=';
    const response = await fetch(`${URLMercadoLivre}${page}`);
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

window.onload = async () => {
  try {
    await fetchMercadoLivre('computador');
    onClick();
    cartItemsOnLocalStorage();
  } catch (error) {
    console.log(error);
  }
};