// apenas uma variável global pra eu não ter que redeclarar várias vezes.
const ol = document.querySelector('.cart__items');

// requisito 4, adiciona os itens do carrinho no localStorage.
function stockItem(key, keyValue) {
  localStorage.setItem(key, keyValue);
}

function amountToPay(price) {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = Math.round((Number(totalPrice.innerText) + Number(price)) * 100) / 100;
  stockItem('totalPrice', totalPrice.innerText);
}

// requisito 3 e 4, remove o item clicado do carrinho e salva as alterações no localStorage.
function cartItemClickListener(event) {
  amountToPay(`-${event.target.innerHTML.split('$')[1]}`);
  event.target.remove();
  stockItem('list', ol.innerHTML);
}

// requisito 2, vai criar um item de lista contendo as informações do objeto do produto selecionado.
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // removido devido a um bug no localStorage, ele não executa o evento após importar os dados.
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2 e 4, vai adicionar o item de lista a lista do carrinho de compras e vai salvá-lon no localStorage.
function addItemCart(item) {
  ol.appendChild(item);
  stockItem('list', ol.innerHTML);
}

// requisito 1 e 2, pega as informações da API e verifica se o resultado deu certo,
// também verifica se a url passada é de um produto específico.
const loadProductsAPI = async (url) => {
  try {
    const result = await fetch(url);
    const resultJson = await result.json();

    if (resultJson.results) {
      return resultJson.results;
    }
    return resultJson;
  } catch (error) {
    console.log(error);
  }
};

// requisito 2, é uma função que vai pegar o id do produto que foi clicado em
// "adicionar ao carrinho" e vai retornar o objeto do produto selecionado.
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisito 2, é uma função que vai ser disparada com um click, se o alvo for um elemento que tenha
// a classe "item_add", ele vai colocar o produto alvo e vai colocar no carrinho de compras.
async function getProductId(event) {
  if (event.target.className === 'item__add') {
    const id2 = getSkuFromProductItem(event.target.parentElement);
    const { id, title, price } = await loadProductsAPI(`https://api.mercadolibre.com/items/${id2}`);
    addItemCart(createCartItemElement({ id, title, price }));
    amountToPay(price);
  }
}

// requisito 1, é responsável por criar os elementos com imagem que vão estar dentro da seção "item".
// você deve ta se perguntando "mas porquê criar outra função só pra isso",
// bom reclame com quem desenvolveu esses exercícios, eu fiz levando em consideração
// que não podiamos alterar essas funções pré estabelecidas.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// requisito 1, é responsável por criar os elementos que vão estar dentro da seção "item".
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// requisito 1, essa função é responsável por criar cada um dos produtos que foi solicitada a API com o termo "computador".
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// requisito 1, adiciona os produtos (no caso computadores) no site.
async function addProducts(url) {
  const sectionItems = document.querySelector('.items');
  const computers = await loadProductsAPI(url);

  computers.forEach((computer) => {
    sectionItems.appendChild(createProductItemElement(computer));
  });

  sectionItems.addEventListener('click', getProductId);
}

// requisito 6, vai limpar o carrinho de compras.
function emptyCart() {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = 0;
  console.log('clicked');
  localStorage.clear();
  ol.innerHTML = '';
}

// vai ser executado depois que o html e css já estiver sido carregado.
window.onload = () => {
  addProducts('https://api.mercadolibre.com/sites/MLB/search?q=computador');

  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);

  // vai adicionar os items do carrinho salvos no localStorage.
  if (localStorage.getItem('list')) {
    ol.innerHTML = localStorage.getItem('list');
    amountToPay(localStorage.getItem('totalPrice'));
  }
  // isso aqui é gambiarra, vou arrumar depois rsrsrs, o importante é que funciona por enquanto kkk.
  ol.addEventListener('click', cartItemClickListener);
};