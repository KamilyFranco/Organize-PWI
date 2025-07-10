//form (produtos)
const formD = document.querySelector(".form-produto");
const nome = document.querySelector("#nome");
const descricao = document.querySelector("#descricao");
const quantidade =  document.querySelector("#Qtd");
const preco = document.querySelector("#preco");
const cadastrar = document.querySelector(".btn-cadastrar")
const editar =  document.querySelector(".btn-editar");
const deletar = document.querySelector(".btn-deletar");

const produtosFixos = [
  { nome: "Bolo de Chocolate", descricao: "", quantidade: 12, preco: 0 },
  { nome: "Brigadeiro Gourmet", descricao: "", quantidade: 36, preco: 0 },
  { nome: "Beijinho", descricao: "", quantidade: 18, preco: 0 },
  { nome: "Mini Torta de Limão", descricao: "", quantidade: 9, preco: 0 }
];


const produtos = JSON.parse(localStorage.getItem("chaveProduto")) || [];

// Verifica se os produtos fixos já existem (por nome)
produtosFixos.forEach(produtoFixo => {
  const jaExiste = produtos.some(prod => prod.nome === produtoFixo.nome);
  if (!jaExiste) {
    produtos.push(produtoFixo);
  }
});

localStorage.setItem("chaveProduto", JSON.stringify(produtos));

// Índice do item atualmente selecionado para edição/exclusão
let indexSelecionado = null;

cadastrar.addEventListener("click", (event)=>{
    event.preventDefault();
    const produtinhos = {
        nome:nome.value,
        descricao:descricao.value,
        quantidade:Number(quantidade.value),  // Convertido para número
        preco:preco.value
    };

    produtos.push(produtinhos);
    localStorage.setItem("chaveProduto", JSON.stringify(produtos));
    atualizarLista();  
    limpar();
    indexSelecionado = null; // limpa qualquer seleção anterior

    console.log(produtos);
   
});

editar.addEventListener("click", () => {
  if (indexSelecionado === null) {
    return;
  }

  produtos[indexSelecionado] = {
    nome: nome.value,
    descricao: descricao.value,
    quantidade: Number(quantidade.value),  // Convertido para número
    preco: preco.value
  };

  localStorage.setItem("chaveProduto", JSON.stringify(produtos));
  atualizarLista();  // Atualiza lista dinâmica no HTML
  limpar();
  indexSelecionado = null;
});

deletar.addEventListener("click", () => {
  if (indexSelecionado === null) {
    return;
  }
  
  produtos.splice(indexSelecionado, 1);
  localStorage.setItem("chaveProduto", JSON.stringify(produtos));
  atualizarLista();  // Atualiza lista dinâmica no HTML
  limpar();
  indexSelecionado = null;
});

// Função que atualiza a lista de produtos no HTML, gerando ela dinamicamente
function atualizarLista() {
  const lista = document.querySelector(".lista-produtos ul");
  lista.innerHTML = "";  // Limpa a lista atual

  const produtosSalvos = JSON.parse(localStorage.getItem("chaveProduto")) || [];

  produtosSalvos.forEach((produto, index) => {
    const item = document.createElement("li");

    const nomeEl = document.createElement("strong"); 
    nomeEl.textContent = produto.nome;

    const qtd = document.createElement("span");
    qtd.textContent = `Qtd: ${produto.quantidade}`;

    item.appendChild(nomeEl);
    item.appendChild(qtd);

    item.addEventListener("click", () => {
      nome.value = produto.nome;
      descricao.value = produto.descricao;
      quantidade.value = produto.quantidade;
      preco.value = produto.preco;
      indexSelecionado = index;
    });

    lista.appendChild(item);
  });
}

function limpar() {
    nome.value = '';
    descricao.value = '';
    quantidade.value = '';
    preco.value = '';
}

// Chama a função para atualizar a lista assim que a página carrega
atualizarLista();
