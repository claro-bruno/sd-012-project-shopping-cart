const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // reatrubuí os valores
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// função que adiciona os produtos pego na fetchItem() aos elementos criados na createProductItemElement().
const getProductAddElement = (produtos) => {
  const itemContent = document.querySelector('.items');
  produtos.forEach((item) => {
    itemContent.appendChild(createProductItemElement(item));
  });
};

const fetchItem = () => { // extrai o array de elementos do arquivo jason e manda pra a função getProductAddElement().
  fetch(URL)
  .then((response) => response.json())
  .then((produtos) => getProductAddElement(produtos.results));
};
fetchItem();
// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }
  
// function cartItemClickListener(event) {
  //   // coloque seu código aqui
  // }
  
  // function createCartItemElement({ id: sku, title: name, sale: salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = function onload() {
  fetchItem();
};