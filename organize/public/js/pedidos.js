const form = document.querySelector("#orderForm");
const nome = document.querySelector("#cliente");
const email = document.querySelector("#email");
const telefone = document.querySelector("#telefone");
const produtosDisponiveis = document.querySelector("#produtos-disponiveis");
const dataPedido = document.querySelector("#data");
const status = document.querySelector("#status");
const observcoes = document.querySelector("#obs");
const cadastrar = document.querySelector("#submitBtn");
const messageGroup = document.querySelector(".message-group");
const messageText = document.querySelector("#message-text");

const encomendas = JSON.parse(localStorage.getItem("chaveEncomenda")) || [];

// Verificar se há um pedido para edição
const dadosEdicao = JSON.parse(localStorage.getItem("pedidoParaEditar"));

// Gerar os produtos a partir do estoque
function gerarProdutosDinamicamente() {
  const produtosSalvos = JSON.parse(localStorage.getItem("chaveProduto")) || [];

  const container = document.querySelector("#produtos-disponiveis .produtos-container");
  container.innerHTML = ""; // limpa o que tiver

  produtosSalvos.forEach(produto => {
    const linha = document.createElement("div");
    linha.classList.add("produto-linha");

    const nomeSpan = document.createElement("span");
    nomeSpan.classList.add("nome-produto");
    nomeSpan.textContent = produto.nome;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.placeholder = "0";
    input.name = `quantidade[${produto.nome.replace(/\s+/g, "_")}]`;

    linha.appendChild(nomeSpan);
    linha.appendChild(input);

    container.appendChild(linha);
  });
}

//inputs atualizados
function getInputsProdutos() {
  return document.querySelectorAll("#produtos-disponiveis input[type='number']");
}

gerarProdutosDinamicamente();

// Preencher os campos se for edição
if (dadosEdicao) {
  const pedido = dadosEdicao.pedidoSelecionado;

  // Preencher os campos com os dados existentes
  nome.value = pedido.nome;
  email.value = pedido.email;
  telefone.value = pedido.telefone;
  dataPedido.value = pedido.dataPedido;
  status.value = pedido.status;
  observcoes.value = pedido.observcoes || "";

  // Preenche os produtos com as quantidades já salvas
  getInputsProdutos().forEach(input => {
    input.value = pedido.produtos[input.name] || "";
  });
}

function exibirMensagem(resultado) {
  messageText.textContent = resultado.message;
  messageGroup.className = 'message-group'; // reseta classe base

  if (resultado.type === 'success') {
    messageGroup.classList.add('success');
  } else if (resultado.type === 'error') {
    messageGroup.classList.add('error');
  }

  setTimeout(() => {
    messageGroup.className = 'message-group';
    messageText.textContent = '';
  }, 6000);
}

cadastrar.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    nome.value === "" ||
    email.value === "" ||
    telefone.value === "" ||
    dataPedido.value === ""
  ) {
    exibirMensagem({
      type: "error",
      message: "Por favor, preencha todos os campos obrigatórios."
    });
    return;
  }

  // Verifica se algum produto foi selecionado e Captura os dados dos inputs de produto
  const produtosSelecionados = {};
  let algumProdutoSelecionado = false;

  getInputsProdutos().forEach(input => {
    const nome = input.name;
    const quantidade = parseInt(input.value);
    if (quantidade > 0) {
      produtosSelecionados[nome] = quantidade;
      algumProdutoSelecionado = true;
    }
  });

  if (!algumProdutoSelecionado) {
    exibirMensagem({
      type: "error",
      message: "Selecione pelo menos um produto com quantidade maior que zero."
    });
    return;
  }

  // Se tudo estiver certo
  const pedidos = {
    nome: nome.value,
    email: email.value,
    telefone: telefone.value,
    produtos: produtosSelecionados,
    dataPedido: dataPedido.value,
    status: status.value,
    observcoes: observcoes.value
  };

  // Verifica se está editando um pedido
  if (dadosEdicao) {
    encomendas[dadosEdicao.indice] = pedidos; // substitui o pedido existente
    localStorage.removeItem("pedidoParaEditar"); // remove os dados de edição 
  } else {
    encomendas.push(pedidos); 
  }

  localStorage.setItem("chaveEncomenda", JSON.stringify(encomendas)); 


// Atualiza o estoque: tira os produtos que foram pedidos
let estoque = JSON.parse(localStorage.getItem("chaveProduto")) || [];

for (let nomeComFormato in produtosSelecionados) {

  //  Pega o nome real do produto, e tira o outro formato
  let nomeProduto = nomeComFormato.split("[")[1].split("]")[0].replace(/_/g, " ");
  let qtdPedido = produtosSelecionados[nomeComFormato];

  for (let i = 0; i < estoque.length; i++) {
    if (estoque[i].nome === nomeProduto) {
      estoque[i].quantidade = Number(estoque[i].quantidade) - qtdPedido;

      if (estoque[i].quantidade <= 0) {
        estoque.splice(i, 1); // remove 
      }

      break; 
    }
  }
}

// estoque atualizado
localStorage.setItem("chaveProduto", JSON.stringify(estoque));


  exibirMensagem({
    type: "success",
    message: "Pedido salvo com sucesso!"
  });

  limparFormulario();

});

function limparFormulario() {
  nome.value = '';
  email.value = '';
  telefone.value = '';
  dataPedido.value = '';
  status.value = 'pendente';
  observcoes.value = '';

  getInputsProdutos().forEach(input => {
    input.value = '';
  });
}

telefone.addEventListener("input", () => {
  // Remove qualquer caractere que não seja número
  let valor = telefone.value.replace(/\D/g, "");

  
  if (valor.length >= 2 && valor.length <= 6) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`; //(51)

  }else if (valor.length > 6 && valor.length <= 10) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`; 
    //Se digitou "519872063" → fica "(51) 9872-063"

  } else if (valor.length > 10) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6, 10)}`;
   // Se digitou "51987206354" → fica "(51) 9872-0635"
  }

  telefone.value = valor;
});
