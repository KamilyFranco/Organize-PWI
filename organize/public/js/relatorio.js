function atualizarRelatorio() {
  const pedidos = JSON.parse(localStorage.getItem("chaveEncomenda")) || [];
  const estoque = JSON.parse(localStorage.getItem("chaveProduto")) || [];

  const tabelaEncomendas = document.querySelector("#tabela-encomendas");
  const tabelaEstoque = document.querySelector("#tabela-estoque");

  tabelaEncomendas.innerHTML = "";
  tabelaEstoque.innerHTML = "";

  let totalPedidos = 0;
  let totalProdutos = 0;
  let valorTotal = 0;

  const saidaProdutos = {};

  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];
    totalPedidos++;

    for (let nomeFormatado in pedido.produtos) {
      const quantidade = pedido.produtos[nomeFormatado];

      // Extrai nome real do produto usando if...else
      let nomeProduto;
      const resultado = nomeFormatado.match(/\[(.+)\]/);
      if (resultado) {
        nomeProduto = resultado[1].replace(/_/g, " ");
      } else {
        nomeProduto = nomeFormatado;
      }

      let preco = 0;
      for (let j = 0; j < estoque.length; j++) {
        if (estoque[j].nome === nomeProduto) {
          preco = Number(estoque[j].preco);
          break;
        }
      }

      totalProdutos += quantidade;
      valorTotal += quantidade * preco;

      if (!saidaProdutos[nomeProduto]) {
        saidaProdutos[nomeProduto] = 0;
      }
      saidaProdutos[nomeProduto] += quantidade;

      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${i + 1}</td>
        <td>${pedido.nome}</td>
        <td>${nomeProduto}</td>
        <td>${quantidade}</td>
        <td>R$ ${(quantidade * preco).toFixed(2)}</td>
      `;
      tabelaEncomendas.appendChild(linha);
    }
  }

  for (let produtoNome in saidaProdutos) {
    let qtdEstoque = 0;
    for (let k = 0; k < estoque.length; k++) {
      if (estoque[k].nome === produtoNome) {
        qtdEstoque = estoque[k].quantidade;
        break;
      }
    }

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${produtoNome}</td>
      <td>Confeitaria</td>
      <td>${saidaProdutos[produtoNome]}</td>
      <td>${qtdEstoque}</td>
    `;
    tabelaEstoque.appendChild(linha);
  }

  document.querySelector("#total-encomendas").textContent = totalPedidos;
  document.querySelector("#produtos-saidos").textContent = totalProdutos;
  document.querySelector("#valor-total").textContent = `R$ ${valorTotal.toFixed(2)}`;
}

window.onload = atualizarRelatorio;
