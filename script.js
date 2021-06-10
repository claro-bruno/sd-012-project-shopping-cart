window.onload = function onload() { 
  
};
createPromisseResult('computador');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}


 function async createPromisseResult(item) {

 const section = document.querySelector('.itens');
 const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
 let result = await fetch(url);
 result = await result.json();
 const resultProduct = await result.results;
 resultProduct.forEach(({ id: sku, title: name, thumbnail: image}) => {
  section.appendChild(createProductItemElement({ sku, name, image }));
 });

//   const obj = {
//    method: 'GET',
//   headers: { Authorization: 'Bearer $ACCESS_TOKEN' },
// };

//      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
//     .then((readJson) => readJson.json())
//     .then((arrResult) => arrResult.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
//       section.appendChild(createProductItemElement({ sku, name, image }));
//     }));
}
//crea
