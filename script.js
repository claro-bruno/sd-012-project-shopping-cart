// 1- procure onde voce esta colocando os itens da pesquisa
// 2- pesquise como adicionar um tag html a um elemento pelo innerHTML
// 3- adicione a tag p com class e o texto que eles pedem no requisito no local que voce ta colocando os itens da pesquisa no momento em que todo html foi lido(lembra o que avisa que vai executar depois que todo html é lido) (editado)
// 4- localiza o local onde voce coloca o itens da pesquisa no local e antes de colocar os itens atribui o valor de vazio(como fez no seu ultimo codigo) a esse local.

// Assim que carregar a pagina HTML.
// Capturar o botão esvaziar carrinho.
// Adicionar um evento a esse botão.
// Na função passada para esse evento capturar a ol do carrinho.
// Dar o valor de vazio na innerHTML do carrinho.

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function saveLocalStorage() {
  const ol = document.querySelector('ol');
  localStorage.setItem('item', ol.innerHTML);
}

function cartItemClickListener(event) {
  const eventClicado = event.target;
  const ol = document.querySelector('ol');
  ol.removeChild(eventClicado);
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Pega a ol do carrinho e dar appendChild da li recebida como parametro.
function adicionarCarrinho(li) {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  saveLocalStorage();
}

// recebe o id do item.
// faz uma API de acordo com o id.
// passar os dados que recebeu da API, para uma função que retorna uma li.
// passa a li para função do carrinho.
function clickItemCar(idItem) {
  try {
    const URL = `https://api.mercadolibre.com/items/${idItem}`;
    fetch(URL)
      .then((response) => response.json())
      .then((ObjetoAPI) => {
        const li = createCartItemElement(ObjetoAPI);
        adicionarCarrinho(li);
      });
  } catch (error) {
    console.log(error);
  }
}

// Identificar a função que cria as li.
// identificar a linha que está adicionando evento na lista.
// Idenfica qual é a função passada no evento.
// Na função identificada no evento eu vou acessar o elemento clicado através do event.target
// vou passar a ol para remover o filho que está sendo clicado event.target.

// li.addEventListener('click', (event) => {
//  const eventClicado = event.target;
//  const ol = document.querySelector('.cart__items');
//  ol.removeChid(eventClicado);
// });

// criar um array com todos os botões de adicionar ao carrinho.
// adicionar o evento em todos os botões do array.
// pega o item do id no botão.
function adicionarEventosButton() {
  const button = document.querySelectorAll('.item__add');
  button.forEach((buttonItem) => {
    buttonItem.addEventListener('click', () => {
      const idItem = buttonItem.parentNode.firstChild.innerText;
      // nesse ponto que eu vou passar o id do item com parametro para função que faz a fetch do produto.
      clickItemCar(idItem);
    });
  });
}
// Esse é o ponto onde todos os botões foram criados e vou adicionar eventos a ele
adicionarEventosButton();

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

// 6. Criação da Função colocarItems(ObjetoItem)
// 7. Acessando o meu array de objeto results dentro do ObjetoItem da API.
// 8. criando um laço de repetição do meu array de objeto results para cada item.
// 9. Pegando os três valores do meu array de objeto result.
// 10. Criação de cada item do Produto.
// 11. capturando a class da section do produto de cada item.
// 12. criando um filho dentro da section para cada item do Produto.  

// 1. Criação da Função createSearchProduts()
// 2. Colocar o fetch(URL) que vai ser uma Promise da API do Mercado Livre.
// 3. Essa Promise vai ser retornado um Objeto em JavaScript .json()
// 4. chamar a função colocarItems(ObjetoItem).
// 5. colocar um catch para fazer o tratamento error da API.

// function createSearchProduts(){
// const buttonVazioCarrinho = document.querySelector('.empty-cart');
// buttonVazioCarrinho.addEventListener('click', (event) => {
// const ol = document.querySelector('.cart__items');
// ol.innerHTML = '';
// }    

// function getSkuFromProductItem(item) {
// return item.querySelector('span.item__sku').innerText;
// }

// requisto 1 adicionar no windows. onload
function colocarItems(results) {
  const classItem = document.querySelector('.items');
  classItem.innerHTML = '';
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const item = createProductItemElement({ sku, name, image });
    classItem.appendChild(item);
  });
  // Esse é o ponto onde todos os botões foram criados e vou adicionar eventos a elemento
  adicionarEventosButton();
}

// requisito 1 adicionar no windows. onload
function createSearchProduts() {
  const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(apiMercadoLivre)
    .then((response) => response.json())
    .then((ObjetoItem) => (colocarItems(ObjetoItem.results)))
    .catch((error) => console.log(error));
}

// requisito 6
function esvaziarCarrinho() {
  const buttonVazioCarrinho = document.querySelector('.empty-cart');
  buttonVazioCarrinho.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    localStorage.clear();
  });
}

// Chamar a função no windows. onload

// requisito 7
function loading() {
  const p = document.createElement('p');
  p.className = 'loading';
  p.innerText = '...loading';
  const classItem = document.querySelector('.items');
  classItem.appendChild(p);
}

function getStore() {
  const ol = document.querySelector('ol');
  const getStoreItem = localStorage.getItem('item');
  ol.innerHTML = getStoreItem;
  const liList = document.querySelectorAll('li');
  liList.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

window.onload = function onload() {
  createSearchProduts();
  esvaziarCarrinho();
  loading();
  getStore();
};