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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Gera a Promise do Computador

const getComputerPromise = (computerName) => new Promise((resolve, reject) => {
  if (computerName !== 'computador') {
    reject(new Error('Nome Errado'));
  } else {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computerName}`)
    .then((response) => {
      response.json().then((computer) => {
        const section = createProductItemElement(computer.results);
        const sectionPai = document.querySelector('.items');
        computer.results.map((computerUnit) => sectionPai
          .appendChild(createProductItemElement(computerUnit)));        
        resolve();
      });
    });
  }
});

// fetch Computer

const fetchComputer = async () => {
  try {
    await getComputerPromise('computador');
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() {
  fetchComputer();
};