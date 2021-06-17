// window.onload = async() => {
//   try {
//     getItem();
//   } catch /* obrigatoriamente tem que ter junto com o try, retorna sempre um erro. */ (error) {
//     console.log(error);
//   }
// };

window.onload = async () => {
  try {
    getItem();
  } catch (error) {
    console.log(error);
  }
};

// async function getItem() { /* async faz a mesma coisa da Promise, fica mais fácil de interpretar */
//   let response /* response um objeto que recebe a propriedade Json(), que recebe uma promessa q seja retornado um fetch (API) */= await /* await esperando uma promessa, a chamada do fetch, mas somente a propriedade do Json */ fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') /* toda a API está contida no response, mas só queremos pegar o JASON */
//   let itemData = await /* await esperando o response.json */response.json(); /* .json é uma function */
//   return itemData.results.forEach((itemML) => createProductItemElement(itemML)); /* itemML não sabemos qual parametro está passando, qual valor vai ser recebido */
// } /* forEach vai passar por cada item para pegar o produto, criando o produto */ 

async function getItem() {
  let response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const itemData = await response.json();
  return itemData.results.forEach((itemML) => createProductItemElement(itemML));
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

// function createProductItemElement({ id: sku, id: name, id: image }) /* ({}) desestruturando um objeto ?*/{
//   const section = document.createElement('section');
//   section.className = 'item';
//   const product = document.querySelector('.items'); /* buscar a section contendo a class.item */

//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
//   product.appendChild(section); /* meu product vai receber um filho chamado section, puxando o arquivo.
//  */ 
// /*   não precisa do return pois o product.appendChild(section); já está retornando */
// }

function createProductItemElement({ id: sku, id: name, id: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const product = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  product.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = async () => {
  try {
    getItem();
  } catch (error) {
    console.log(error);
  }
};

// OK!
