/* Caso alguem consulte o repositório, apaguei todo o trabalho e estou começando do zero. Analisei todos os requisitos, e enumerei as funções que tenho que criar e os locais onde devem ser inseridas, dessa forma, evito ficar trocando de lugar conforme vou desenvolvendo o código e não gera confusão se precisar parar e retomar. */

// 1 - criar função para salvar itens
function storageCart() {
  const cartStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartStorage);
}

// 2 - criar função para somar os itens do carrinho

// createProductImagemElement - cria o elemento, add a classe imagem e adiciona o endereço da imagem no atributo src da img;
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// createCustomElement - cria elemento customizado
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// createProductItemElement - com base nas informações da API, irá criar um objeto com, atribuir uma classe e determinar a "hierarquia" através do DOM;
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// getSkuFromProductItem - seleciona o elemento html que tem span.item__sku
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// cartItemClickListiner - função a ser implementada para escutar o evento de click, que realizará  a remoção do elemento clicado. Para isso, o evento de click utilizará a hierarquia do DOM para remover elementos com base no event target. 
// parentElement (https://www.w3schools.com/jsref/prop_node_parentelement.asp)
// *é importante que essa função salve os itens que estão no carrinho e execute a função de calculo do valor total (em resumo, as duas funçoes iniciais devem ser executadas dentro dessa função);

function cartItemClickListener(event) {
  event.target.remove();
}

// createCartItemElement - cria o carrinho de compras em formato de li;
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 3- Criar função para implementar a lista de itens, utilizando a fetch API;
async function getItems() {
  const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';  
  try {
    const requiredItems = await fetch(urlAPI);
    const { results } = await requiredItems.json();
    results.forEach((item) => {
      const objItem = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(objItem));
    });
  } catch (error) {
    return error;
  }
}

// 4 - Criar função para adicionar os produtos no carrinho através da função de click, também com as funções de salvar storage e realizar o calculo dos preços.;

function selectItem() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const elementDOM = event.target.parentElement;
      const sku = getSkuFromProductItem(elementDOM);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((response) => response.json())
        .then((data) => {
          const skuKey = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(skuKey));
        });
    }
  });
}

// 5 - Criar função de carregar os itens salvos no carrinho;

// 6 - Criar função para esvaziar o carrinho, alterando preço e itens salvos no storage.

window.onload = function onload() { 
  // chamar as funções de storage (acrescentar itens no carrinho, carregar os itens salvos e limpar o carrinho); função de calculo de preço total e implementação da lista de itens;
  getItems();
  selectItem();
};