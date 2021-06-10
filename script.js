const somaItems = [];
const cartItens = () => document.querySelector('.cart__items');
const pSomaTotal = () => document.querySelector('.total-price');

const pegarComputadoresML = () => new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((computador) => resolve(computador.results))
  .catch((erro) => reject(erro));
});

const pegarIdComputadorML = (ids) => new Promise((resolve, reject) => {
  fetch(`https://api.mercadolibre.com/items/${ids}`)
    .then((response) => response.json())
    .then((id) => resolve(id))
    .catch((erro) => reject(erro));
});

const salvaCarrinho = () => {
  localStorage.setItem('items', cartItens().innerHTML);
};

const carregaCarrinho = () => {
  cartItens().innerHTML = localStorage.getItem('items'); 
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const criaSomaCart = () => {
  const cart = document.querySelector('.cart');
  const criaP = document.createElement('p');
  criaP.className = 'total-price';
  cart.appendChild(criaP);
};

const somaPreços = (salePrice) => {
  somaItems.push(salePrice);
  const total = somaItems.reduce((acc, num) => acc + num);
  pSomaTotal().innerHTML = `Preço total: $${Math.round(total * 100) / 100}`;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

// const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  event.target.remove();
  salvaCarrinho();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const adicionaItensPagina = async () => {
  try {
    const computadores = await pegarComputadoresML();
    const classItems = document.querySelector('.items');
    computadores.map(({ id: sku, title: name, thumbnail: image }) =>
      classItems.appendChild(createProductItemElement({ sku, name, image })));
  } catch (erro) {
    console.log(erro);
  }
};

const adicionaItensCarrinho = async () => {
  try {
    const buttons = document.querySelectorAll('.item__add');
    Object.values(buttons).map((button, index) =>
      button.addEventListener('click', async () => {
        const itemSku = document.querySelectorAll('.item__sku')[index].innerHTML;
        const idComputadores = await pegarIdComputadorML(itemSku);
        const { id: sku, title: name, price: salePrice } = idComputadores;
        cartItens().appendChild(createCartItemElement({ sku, name, salePrice }));
        salvaCarrinho();
        somaPreços(salePrice);
      }));
  } catch (erro) {
    console.log(erro);
  }
};

const removerTudo = () => {
  const buttonRemoveTudo = document.querySelector('.empty-cart');
  buttonRemoveTudo.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    pSomaTotal().innerHTML = '';
    localStorage.clear('lis');
  });
};

window.onload = async function onload() {
  try {
    await carregaCarrinho();
    await criaSomaCart();
    await pegarComputadoresML();
    await adicionaItensPagina();
    await adicionaItensCarrinho();
    await removerTudo();
  } catch (erro) {
    console.log(erro);
  }
};