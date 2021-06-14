window.onload = function onload() { 
  getProduct();
};

const API = `https://api.mercadolibre.com/sites/MLB/search?q=COMPUTADOR`


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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProduct = async () => {
  const response = await fetch(API);
  const computer = await response.json();
  const sectionItems = document.querySelector('.items');
  computer.results.forEach(element => {
    sectionItems.appendChild(createProductItemElement(element))
  });
  
}

// requesito 1, auxiliado por:https://www.youtube.com/watch?v=Zl_jF7umgcs&ab_channel=RogerMelo , aprendendo a usar async/await
// E utilizando o Slack com a dúvida de Eder Santos
