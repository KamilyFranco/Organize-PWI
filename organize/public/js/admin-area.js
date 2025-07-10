function atualizarMetricas() {
  // Produtos no estoque
  const produtos = JSON.parse(localStorage.getItem("chaveProduto")) || [];
  let totalProdutos = 0;
  let produtosBaixos = 0;

  produtos.forEach(p => {
    const qtd = parseInt(p.quantidade) || 0;
    totalProdutos += qtd;

    if (qtd < 5) {
      produtosBaixos++;
    }
  });

  // Vendas do dia
  const pedidos = JSON.parse(localStorage.getItem("chaveEncomenda")) || [];
  const hoje = new Date().toISOString().slice(0, 10);
  let totalVendasHoje = 0;

  pedidos.forEach(pedido => {
    if (pedido.dataPedido === hoje) {
      for (let nomeProduto in pedido.produtos) {
        const quantidadeVendida = pedido.produtos[nomeProduto];

        const produtoCorrespondente = produtos.find(prod => {
          return `quantidade[${prod.nome.replace(/\s+/g, "_")}]` === nomeProduto;
        });

        if (produtoCorrespondente) {
          const preco = parseFloat(produtoCorrespondente.preco);
          totalVendasHoje += preco * quantidadeVendida;
        }
      }
    }
  });

  // Atualizar valores no HTML
  const metricas = document.querySelector(".metricas");
  metricas.innerHTML = `
    <div class="metrica">📦 Produtos no estoque: <strong>${totalProdutos}</strong></div>
    <div class="metrica">⚠️ Produtos baixos: <strong>${produtosBaixos}</strong></div>
    <div class="metrica">💰 Vendas hoje: <strong>R$ ${totalVendasHoje.toFixed(2)}</strong></div>
  `;

  // Notificações
  const listaNotificacoes = document.querySelector(".notificacoes ul");
  listaNotificacoes.innerHTML = "";

  // Estoque crítico
  produtos.forEach(prod => {
    const qtd = parseInt(prod.quantidade) || 0;
    if (qtd < 5) {
      const li = document.createElement("li");
      li.textContent = `📌 Produto "${prod.nome}" com estoque crítico.`;
      listaNotificacoes.appendChild(li);
    }
  });

  // Vendas acima de R$ 500 hoje
  pedidos.forEach(pedido => {
    if (pedido.dataPedido === hoje) {
      let valorPedido = 0;

      for (let nomeProduto in pedido.produtos) {
        const quantidadeVendida = pedido.produtos[nomeProduto];

        const produtoCorrespondente = produtos.find(prod => {
          return `quantidade[${prod.nome.replace(/\s+/g, "_")}]` === nomeProduto;
        });

        if (produtoCorrespondente) {
          const preco = parseFloat(produtoCorrespondente.preco);
          valorPedido += preco * quantidadeVendida;
        }
      }

      if (valorPedido >= 500) {
        const li = document.createElement("li");
        li.textContent = `📌 Venda acima de R$ 500 registrada.`;
        listaNotificacoes.appendChild(li);
      }
    }
  });
}

// Chamada direta, se o script estiver no final do HTML
atualizarMetricas();
