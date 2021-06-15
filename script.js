// Requisito 03 - Remove item do carrinho ao clicar

let precoTotal = 0;
function cartItemClickListener(event) {  
  // const remover = document.querySelector('.cart__items');
  // remover.removeChild(event.target);
  event.target.remove();
  const removeElement = event.target.innerHTML.split('SKU: ')[1].split(' ')[0];
  localStorage.removeItem(removeElement);
  // console.log(event.target.innerHTML.split('SKU: ')[1].split(' ')[0]);
}
// Requisito 05 - Some o valor total dos itens do carrinho de compras
// const preco = [];
function somaPreco(salePrice) {
  // preco.push(salePrice);
  console.log(salePrice);
const totalCart = document.querySelector('.total-price p');
console.log(totalCart.innerText);
// const somaTotalPreco = preco.reduce((accumulator, current) => accumulator + current, 0);
// precoTotal.innerText = `${somaTotalPreco}`;
totalCart.innerText = Number(salePrice) + Number(totalCart.innerText);
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
}
const addProductCart = async (item) => {
  const idProduto = getSkuFromProductItem(item);
  // Requisito 01 - Faz uma listagem dos produtos
  const add = document.querySelector('.cart__items');
  const dadosProduto = await fetch(`https://api.mercadolibre.com/items/${idProduto}`);
  const result = await dadosProduto.json();
  const { id: sku, title: name, price: salePrice } = await result;
  const productStorage = await createCartItemElement({ sku, name, salePrice });
  await add.appendChild(productStorage);
  await localStorage.setItem(sku, productStorage.innerHTML);
  await somaPreco(salePrice);
  // alert('Produto adicionado ao carrinho!');
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
// Requisito 02 -Adiciona o item ao carrinho
fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', obj) 
  .then((r) => r.json())
  .then((data) => data.results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    section.appendChild(createProductItemElement({ sku, name, image })))); 
};

window.onload = function onload() {
// const container = document.querySelector('.container');
// const loading = document.querySelector('.loading');
// container.removeChild(loading);
computers();
// console.log(localStorage.length);
// console.log(Object.keys(localStorage));
// Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página
  for (let index = 0; index < localStorage.length; index += 1) {
  const text = Object.values(localStorage)[index];
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = text;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  }
};
