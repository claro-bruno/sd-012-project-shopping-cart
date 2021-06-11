const sectionPCs = document.querySelector('.items');
const carrinho = document.querySelector('.cart__items');
const btnLimparCarrinho = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

const removeLoading = () => sectionPCs.removeChild(loading);

const saveStorage = () => {
  localStorage.setItem('zéDoPeixe', JSON.stringify(carrinho.innerHTML));
};

const limparCarrinho = () => {
  while (carrinho.firstChild) {
    carrinho.removeChild(carrinho.firstChild);
  }
  saveStorage();
};

const fetchItem = (term = 'computador') => (
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
   .then((response) => response.json())
   .then((jsonPCs) => jsonPCs.results)
   .catch((err) => alert(err))
);

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
  const img = image.replace(/-I.jpg/g, '-O.jpg');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

// requisito 2:
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveStorage();
  return li;
}

function getItemId() {
  const btnAddCarrinho = document.querySelectorAll('button.item__add');
  btnAddCarrinho.forEach((button) => {
    button.addEventListener('click', (event) => {
      const idItem = getSkuFromProductItem(event.target.parentNode).toString();
      fetch(`https://api.mercadolibre.com/items/${idItem}`)
        .then((response) => response.json())
        .then((id) => carrinho.appendChild(createCartItemElement(id)))
        .then(() => saveStorage());
    });
  });
}

const loadStorage = () => {
  if (localStorage) {
    carrinho.innerHTML = JSON.parse(localStorage.getItem('zéDoPeixe'));
  }
  const carrinhoResetado = document.getElementsByClassName('cart__item');
  Object.values(carrinhoResetado).forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

window.onload = () => {
  fetchItem()
    .then((PCs) => {
      removeLoading();
      PCs.forEach((pc) => {
        sectionPCs.appendChild(createProductItemElement(pc));
      });
    })
    .then(() => getItemId());
  btnLimparCarrinho.addEventListener('click', limparCarrinho);
  loadStorage();
};
