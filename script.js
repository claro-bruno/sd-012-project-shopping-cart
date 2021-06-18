const urlComputador = 'https://api.mercadolibre.com/sites/MLB/search?q=COMPUTADOR';

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
// Requisito 3
// Auxilio da Gisele no slack do Sérgio A. Barbosa
function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items')
  event.target.remove(ol)
  saveCart()
}


function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2, Auxiliado pelo slack de Diogo Sant'Anna
const addPurchases = () => {
  const button = document.querySelectorAll('.item__add');
  const ol = document.querySelector('.cart__items')
  button.forEach((b) => {
    b.addEventListener('click', () => {
      const id = b.parentNode.firstChild.innerText;
      const url = `https://api.mercadolibre.com/items/${id}`;
      fetch(url).then((response) => response.json().then((i) => {
        ol.appendChild(createCartItemElement(i))
        saveCart()
      }));
    });
  });
};
// Requesito 1
// Requisito 1, auxiliado por:https://www.youtube.com/watch?v=Zl_jF7umgcs&ab_channel=RogerMelo , aprendendo a usar async/await
// E utilizando o Slack com a dúvida de Eder Santos
const getProduct = async () => {
  const response = await fetch(urlComputador);
  const computer = await response.json();
  const sectionItems = document.querySelector('.items');
  computer.results.forEach((element) => {
    sectionItems.appendChild(createProductItemElement(element));
  });
  addPurchases();
};

// ffonte de como salvar o localStorage:
// https://pt.stackoverflow.com/questions/329223/armazenar-um-array-de-objetos-em-um-local-storage-com-js#:~:text=Para%20salvar%20no%20localStorage%20%2C%20basta,parse%20.
// https://www.youtube.com/watch?v=pLtAZF8FDXE&ab_channel=CFBCursos
const saveCart = () => {
  const ol = document.querySelector('.cart__items')
  localStorage.setItem('cart', ol.innerHTML);
};
const addSaveCart = () => {
  const ol = document.querySelector('.cart__items')
  ol.innerHTML = localStorage.getItem('cart')
  const list = document.querySelectorAll('.cart__items');
  list.forEach((item) => item.addEventListener('click', cartItemClickListener))
};
const createPrice = () => {
  const section = document.querySelector('.cart')
  const priceTotal = document.createElement('p')
  priceTotal.textContent = 'Total:'
  priceTotal.className = 'total-price'
  section.appendChild(priceTotal)
};

window.onload = function onload() { 
  getProduct();
  addSaveCart();
  createPrice();
};
