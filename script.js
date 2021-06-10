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

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
 event.console.log('ok');
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
    const olCartItems = document.querySelector('.cart__items');
    const buttons = document.querySelectorAll('.item__add');
    Object.values(buttons).map((button, index) =>
      button.addEventListener('click', async () => {
        const itemSku = document.querySelectorAll('.item__sku')[index].innerHTML;
        const idComputadores = await pegarIdComputadorML(itemSku);
        const { id: sku, title: name, price: salePrice } = idComputadores;
        olCartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
      }));
  } catch (erro) {
    console.log(erro);
  }
};

  window.onload = async () => {
    try {
      await pegarComputadoresML();
      await adicionaItensPagina();
      await adicionaItensCarrinho();
    } catch (erro) {
      console.log(erro);
    }
  };
