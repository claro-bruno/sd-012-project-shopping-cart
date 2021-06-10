let total = 0;
let list;
let totalPrice;

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const carrinhoVazio = () => {
  list = document.querySelector('.cart__items');
  const botaoLimpar = document.querySelector('.empty-cart');
  botaoLimpar.addEventListener('click', () => {
    list.innerHTML = '';
    localStorage.clear();
    totalPrice = document.querySelector('.total-price');
    totalPrice.innerHTML = 'Price total: 0$';
    total = 0;
  });
};

const reduzirPreco = (event) => {
  const str = event.innerText;
  const posI = str.indexOf('PRICE') + 8;
  const posF = str.length;
  const sub = str.substr(posI, posF);
  const price = parseFloat(sub);
  return price;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const price = reduzirPreco(event.target);
  console.log(price);
  totalPrice = document.querySelector('.total-price');
  total -= price;
  totalPrice.innerHTML = total;
  event.target.remove();
}

const somarPrecos = (preco) => {
  const price = document.querySelector('.total-price');
  total += preco;
  price.innerHTML = total;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  somarPrecos(salePrice);
  return li;
}

const saveCarrinho = () => {
  const allItems = document.querySelectorAll('.cart__item');
  const array = [];
  for (let i = 0; i < allItems.length; i += 1) {
    array.push(allItems[i].outerHTML);
  }

  localStorage.setItem('produtos', JSON.stringify(array));
};

const getResult = (results) => {
  const getItems = document.querySelector('.items');
  const load = document.querySelector('.loading');
  load.remove();
  const objeto = {};
  results.forEach(({id, title, thumbnail}) => {
    objeto.sku = id;
    objeto.name = title;
    objeto.image = thumbnail;
    const product = createProductItemElement(objeto);
    getItems.appendChild(product);
  })
};

const getButton = () => {
  const getAllButtons = document.querySelectorAll('.item__add');
  getAllButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const ID = event.target.parentElement.firstChild.innerText;
      getItem(ID);
    })
  })
};

const getProducts = async () => {
  const url = "https://api.mercadolibre.com/sites/MLB/search?q=$computador";
  fetch(url).then((response) => response.json())
  .then((result) => getResult(result.results))
  .then(() => getButton());
  const load = document.querySelector('.loading');
  load.innerHTML = 'loading...';

};

const addCarrinho = (results) => {
  const getListItems = document.querySelector('.cart__items');
  const objeto = {};
  objeto.sku = results.id;
  objeto.name = results.title;
  objeto.salePrice = results.price;
  const product = createCartItemElement(objeto);
  getListItems.appendChild(product);
  saveCarrinho();
};

const getItem = (ID) => {
  const url = `https://api.mercadolibre.com/items/${ID}`;
  fetch(url).then((response) => response.json())
  .then((result) => addCarrinho(result));
};

const loadCarrinho = () => {
  const getListItems = document.querySelector('.cart__items');
  const price = document.querySelector('.total-price');
  const array = JSON.parse(localStorage.getItem('produtos'));
  if (array !== null) {
    for (let i = 0; i < array.length; i += 1) {
      getListItems.innerHTML += array[i];
    }
  }
};

window.onload = function onload() {
  getProducts();
  loadCarrinho();
  carrinhoVazio();
  addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      event.target.remove();
      saveCarrinho();
    }
  });
};