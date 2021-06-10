function cartItemClickListener(event) {  
  // const remover = document.querySelector('.cart__items');
  // remover.removeChild(event.target);
  event.target.remove();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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
}// Adicionando Produtos ao carrinho
const addProductCart = async (item) => {
  const idProduto = getSkuFromProductItem(item);
  const add = document.querySelector('.cart__items');
  
  const dadosProduto = await fetch(`https://api.mercadolibre.com/items/${idProduto}`);
  const result = await dadosProduto.json();
  const { id: sku, title: name, price: salePrice } = result;
  add.appendChild(createCartItemElement({ sku, name, salePrice }));
};
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', () => addProductCart(section));
  section.appendChild(botao);
  return section;
}
const computers = () => {
  const section = document.querySelector('.items');
  const obj = {
  method: 'GET',
  headers: { Authorization: 'Bearer $ACCESS_TOKEN' },
};

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', obj) 
  .then((r) => r.json())
  .then((data) => data.results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    section.appendChild(createProductItemElement({ sku, name, image })))); 
};

window.onload = function onload() {
computers();
};
