const listaPedidos = document.getElementById("orders-list");
const contador = document.getElementById("orders-count");
const pedidos = JSON.parse(localStorage.getItem("chaveEncomenda")) || [];

if (pedidos.length === 0) {
  // Mostra mensagem se não houver nenhum pedido
  listaPedidos.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-box-open"></i>
      <h3>Nenhuma encomenda encontrada</h3>
      <p>Cadastre uma nova encomenda para começar.</p>
    </div>`;
  contador.textContent = "0 encomendas";
} else {
  // Conta só os pedidos que ainda não foram finalizados
  const pedidosPendentes = pedidos.filter(p => p.status !== "finalizada");
  contador.textContent = pedidosPendentes.length + " encomendas";

  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];

    // Pula os pedidos finalizados (não exibe na tela)
    if (pedido.status === "finalizada") {
      continue;
    }

    let produtosHTML = "";

    for (let nome in pedido.produtos) {
      produtosHTML += `
        <div class="product-item">
          <span class="product-name">${nome}</span>
          <span class="product-quantity">${pedido.produtos[nome]}</span>
        </div>
      `;
    }

    const card = document.createElement("div");
    card.classList.add("order-card");
    card.innerHTML = `
      <div class="order-header">
        <div class="order-status status-${pedido.status.toLowerCase()}">${pedido.status}</div>
      </div>

      <div class="order-info">
        <div class="info-group">
          <h4>Cliente</h4>
          <p>${pedido.nome}</p>
        </div>
        <div class="info-group">
          <h4>Telefone</h4>
          <p>${pedido.telefone}</p>
        </div>
        <div class="info-group">
          <h4>Data de Entrega</h4>
          <p>${pedido.dataPedido}</p>
        </div>
        <div class="info-group">
          <h4>Observações</h4>
          <p>${pedido.observcoes || "Nenhuma"}</p>
        </div>
      </div>

      <div class="order-products">
        <div class="products-header">Produtos Solicitados:</div>
        ${produtosHTML}
      </div>

      <div class="order-actions">
        <button class="btn btn-success btn-sm finalizar">Finalizar</button>
        <button class="btn btn-warning btn-sm editar">Editar</button>
        <button class="btn btn-danger btn-sm excluir">Excluir</button>
      </div>
    `;

    // Ações dos botões
    const botaoExcluir = card.querySelector(".excluir");
    const botaoFinalizar = card.querySelector(".finalizar");
    const botaoEditar = card.querySelector(".editar");

    // Excluir: remove do array e atualiza localStorage
    botaoExcluir.addEventListener("click", () => {
      pedidos.splice(i, 1);
      localStorage.setItem("chaveEncomenda", JSON.stringify(pedidos));
      location.reload(); // Recarrega a página para atualizar a lista
    });

    // Finalizar: altera status, salva, e some da lista
    botaoFinalizar.addEventListener("click", () => {
      pedidos[i].status = "finalizada";
      localStorage.setItem("chaveEncomenda", JSON.stringify(pedidos));
      location.reload(); // Recarrega a página para ocultar o card
    });

    // Editar: salva no localStorage e redireciona para formulário
    botaoEditar.addEventListener("click", () => {
      const dadosEditar = { indice: i, pedidoSelecionado: pedidos[i] };
      localStorage.setItem("pedidoParaEditar", JSON.stringify(dadosEditar));
      window.location.href = "pedidos.html"; // Vai para página de edição
    });

    listaPedidos.appendChild(card);
  }
}
