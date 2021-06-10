const URLMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const items = document.querySelector('.items');
// const olCartItems = document.querySelector('.cart__items');
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
function createProductItemElement({ id: sku, tittle: name, thumbnail: image }) {
  // 'Reatribuindo os valores que o parametro vai receber'
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// function createCartItemElement(user) {
//   const { sku, name, salePrice } = user;
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
// ----------------------------------CREATE----------------------------------------------------------------------
// function getSkuFromProductItem(item) {
//   // Função que pega o id do item 'MLB1613404303'
//   alert('funcionou');
//   return item.querySelector('span.item__sku').innerText;
// }

// Requisito 2

// Removi o parametro event do cartItemClickListener
// function cartItemClickListener(event) {
// }

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

const fetchMercadoLivre = async () => {
  try {
    const response = await fetch(`${URLMercadoLivre}${'computador'}`);
    const data = await response.json();
    return data.results.forEach((user) => items
    .appendChild(createProductItemElement(user)));
  } catch (e) {
    return e;
  }
};

window.onload = async () => {
  try {
     await fetchMercadoLivre();
    //  cartItemClickListener();
  } catch (error) {
    console.log(error);
  }
};