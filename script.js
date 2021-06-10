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
function cartItemClickListener(event) {
  console.log(`removeu ${event}`);
}
// o user que ele vai receber como parametro é o getIdfromProduct
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// -----------------------------------------------CREATE--------------------------------------------------------
// function getIdFromProductItem(item) {
//   // Função que pega o id do item 'MLB1613404303'
//   alert('funcionou');
//   return item.querySelector('span.item__sku').innerText;
// }

const olChild = async (id) => {
  const olCartItems = document.querySelector('.cart__items');
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  console.log(data);
  olCartItems.appendChild(createCartItemElement(data));
};
const onClick = () => {
  const buttons = document.querySelectorAll('.item__add');
  console.log(buttons);
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const userId = event.target.parentElement.querySelector('span.item__sku').innerText;
      console.log(`cliclou ${userId}`);
      olChild(userId);
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

window.onload = async () => {
  try {
    await fetchMercadoLivre('computador');
    onClick();
    //  cartItemClickListener();
  } catch (error) {
    console.log(error);
  }
};