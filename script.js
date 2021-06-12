// window.onload = function onload() { };

const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const computerItems = document.getElementsByClassName('items'); // 1 - Pegando Items
// Template 
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Template
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Template 1.1 Renderiza os produtos na tela
function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
/*
// Template
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
/*
// Template
function cartItemClickListener(event) {
  // Remove o produto do
  const renderProd = document.querySelector(stringOrderedList);
  event.target.remove();
  localStorage.setItem(`${strinListaProdutos}`, renderProd.innerHTML);
}
*/
// Template
/*
function createCartItemElement({
  sku,
  name,
  salePrice
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
*/
// Questão 01 - Criando uma lista de produtos
const apiComputer = async () => {
  try {
    const indiceApi = await fetch(url); // Retorna os índices da Api
    const apijson = await indiceApi.json(); // Recupera o json
    const arrayResult = apijson.results; // pega o resultado do json
    await arrayResult.forEach((item) =>
      computerItems[0].appendChild(createProductItemElement(item))); // await aguarda caso não retorne resultados, se não, entrega lista.
  } catch (error) {
    console.log(error);
  }
};
window.onload = function onload() {
  apiComputer();
};

/*
// vídeo youTube Fernando Leonid & Revisão Bloco 09 com Jensen
// Espera assíncrona  | fetch (Busca e retorna uma promisse) await (Aguarda)  then (Retorna) catch (Pega)
// try (retorna um erro)
// Função para pegar o json Ml
function getCartml (){
  return new Promise ((resolve) =>{
    // console.log('Olá Mundo');
    fetch(url)
    .then((response) => response.json())
    //.then((computador)=> console.log(computador))
    .then((computador)=> resolve(computador))
    .catch((error) => reject(error))
});
window.onload = async () => {

  try {
    const computador = await getCartml();
    computador.forEach(items => colocarNaTela (items));

  } catch{
    console.log(error)
  }
}
*/
/*
// Promise
window.onload = () => {
    const items = getCartml ()
      .then((computador) => {
        computador.forEach(items => colocarNaTela (items))
    // console.log(computador);
      })
      .catch(error => console.log(error))
}
*/