// requisito 1
const intensExibidos = document.querySelector('.items');

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// console.log('cheguei aqui 1')
const mostrarProdutos = (arrayResult) => {
    arrayResult.forEach((item) => {
    intensExibidos.appendChild(createProductItemElement(item));
  });
 };

async function listadeProdutos() {
    try {
    const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results } = await api.json();
    mostrarProdutos(results);
     } catch (error) {
    return error;
  }
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// requisito 3
// function cartItemClickListener(event) {
//   const text = event.target.innerText;
//   const valor = parseFloat(text.split('$')[1]);
//   const total = document.querySelector('.total-price').innerText;
//   const totalF = total - valor;
//   document.querySelector('.total-price').innerText = totalF;
//   event.target.remove();
//   saveCartItemToLocalStorage();
// }// coloque seu código aqui

// requisito 2
// function createCartItemElement({ id, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = function onload() {
  listadeProdutos();
};
