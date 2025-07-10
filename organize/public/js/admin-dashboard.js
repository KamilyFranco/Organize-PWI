// ==== FORMULÁRIO PARA CADASTRAR NOVOS ADMINS ====
const nome = document.querySelector('#name');
const email = document.querySelector('#email');
const senha = document.querySelector('#password');
const cadastrar = document.querySelector('button[type="submit"]');

const messageGroup = document.querySelector('.message-group');
const messageText = document.querySelector('#message-text');

let admins = JSON.parse(localStorage.getItem("chaveAdmins")) || [];
const listaConfeitarias = document.getElementById('lista-confeitarias');

// Função para exibir mensagens de sucesso ou erro
function exibirMensagem(resultado) {
  messageText.textContent = resultado.message;
  messageGroup.style.display = 'flex'; // mostra a mensagem
  messageGroup.className = 'message-group'; // reseta classes

  if (resultado.type === 'success') {
    messageGroup.classList.add('success');
  } else if (resultado.type === 'error') {
    messageGroup.classList.add('error');
  }

  setTimeout(() => {
    messageGroup.className = 'message-group';
    messageText.textContent = '';
    messageGroup.style.display = 'none'; // esconde após 6s
  }, 6000);
}

cadastrar.addEventListener("click", (e) => {
  e.preventDefault();

  if (nome.value === '' || email.value === '' || senha.value === '') {
    exibirMensagem({ type: 'error', message: 'Preencha todos os campos!' });
    return;
  }

  const emailValido = /^[^\s@]+@gmail\.com$/;
  if (!emailValido.test(email.value)) {
    exibirMensagem({ type: 'error', message: 'Use um email válido @gmail.com' });
    return;
  }

  let existe = false;

  for (let i = 0; i < admins.length; i++) {
    if (admins[i].email === email.value) {
      existe = true;
      break;
    }
  }
  if (existe) {
    exibirMensagem({ type: 'error', message: 'Este email já está cadastrado!' });
    return;
  }

  const novoAdmin = {
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    tipoUsuario: 'Administrador'
  };

  admins.push(novoAdmin);
  localStorage.setItem('chaveAdmins', JSON.stringify(admins));

  exibirMensagem({ type: 'success', message: 'Administrador cadastrado com sucesso!' });
  limparCampos();
  atualizarResumo();
});

function limparCampos() {
  nome.value = '';
  email.value = '';
  senha.value = '';
}

// ==== MOSTRA CONFEITARIAS CADASTRADAS ====

function mostrarConfeitarias() {
  const lista = JSON.parse(localStorage.getItem("chaveConf")) || [];

  listaConfeitarias.innerHTML = "";

  if (lista.length === 0) {
    listaConfeitarias.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏪</div>
        <p>Nenhuma confeitaria cadastrada ainda</p>
      </div>
    `;
    return;
  }

  lista.forEach(usuario => {
    const item = document.createElement('div');
    item.classList.add('user-item');

    const avatar = document.createElement('img');
    avatar.classList.add('user-avatar');
    avatar.alt = "Foto do usuário";
    avatar.src = usuario.foto || "/organize/public/imgs/profile-placeholder.png";

    const info = document.createElement('div');
    info.classList.add('user-info');

    const nomeEl = document.createElement('p');
    nomeEl.classList.add('user-name');
    nomeEl.textContent = usuario.nome || 'Sem nome';

    const cnpjEl = document.createElement('p');
    cnpjEl.classList.add('user-cnpj');
    cnpjEl.textContent = usuario.cnpj || 'CNPJ não informado';

    const planoEl = document.createElement('p');
    planoEl.classList.add('user-plan');
    planoEl.textContent = 'Plano: ' + (usuario.plano || 'Não informado');

    const userStatus = document.createElement("div");
    userStatus.classList.add("user-status");
    userStatus.innerHTML = `<span class="status-dot"></span> Ativa`;

    info.appendChild(nomeEl);
    info.appendChild(cnpjEl);
    info.appendChild(planoEl);

    item.appendChild(avatar);
    item.appendChild(info);
    item.appendChild(userStatus);

    listaConfeitarias.appendChild(item);
  });
}

// ==== RESUMO DO SISTEMA ====

function atualizarResumo() {
  const confeitarias = JSON.parse(localStorage.getItem("chaveConf")) || [];
  const admins = JSON.parse(localStorage.getItem("chaveAdmins")) || [];
  const mensagens = JSON.parse(localStorage.getItem("mensagensContato")) || [];

  const mensagensNaoLidas = mensagens.filter(msg => !msg.lida).length;

  document.querySelector('.total-confeitarias').textContent = confeitarias.length;
  document.querySelector('.total-admins').textContent = admins.length;
  document.querySelector('.total-messages').textContent = mensagens.length;
  document.querySelector('.unread-messages').textContent = mensagensNaoLidas;
}

// ==== MOSTRA MENSAGENS NO PAINEL ADMIN ====

function carregarMensagens() {
  const container = document.getElementById("messages-container");
  const mensagens = JSON.parse(localStorage.getItem("mensagensContato")) || [];

  container.innerHTML = "";

  if (mensagens.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📬</div>
        <p>Nenhuma mensagem recebida ainda</p>
      </div>
    `;
    return;
  }

  mensagens.forEach((msg, index) => {
    const div = document.createElement("div");
    div.classList.add("message-card");
    if (!msg.lida) div.classList.add("unread");

    div.innerHTML = `
      <p><strong>Nome:</strong> ${msg.nome}</p>
      <p><strong>Email:</strong> ${msg.email}</p>
      <p><strong>Mensagem:</strong> ${msg.mensagem}</p>
      <p><strong>Data:</strong> ${msg.data}</p>
      <button class="btn btn-small btn-success btn-read" data-index="${index}">Marcar como lida</button>
      <button class="btn btn-small btn-danger btn-delete" data-index="${index}">Excluir</button>
    `;

    container.appendChild(div);
  });

  // Atualizar contadores
  document.querySelector(".total-messages").textContent = mensagens.length;
  const naoLidas = mensagens.filter(m => !m.lida).length;
  document.querySelector(".unread-messages").textContent = naoLidas;

  // Adiciona eventos aos botões de ler e excluir
  const botoesLer = document.querySelectorAll(".btn-read");
  botoesLer.forEach(botao => {
    botao.addEventListener("click", () => {
      const index = botao.getAttribute("data-index");
      marcarMensagemComoLida(index);
    });
  });

  const botoesExcluir = document.querySelectorAll(".btn-delete");
  botoesExcluir.forEach(botao => {
    botao.addEventListener("click", () => {
      const index = botao.getAttribute("data-index");
      excluirMensagem(index);
    });
  });
}

// ==== FUNÇÕES PARA MENSAGENS ====

// Marcar mensagem como lida
function marcarMensagemComoLida(index) {
  let mensagens = JSON.parse(localStorage.getItem("mensagensContato")) || [];
  if (mensagens[index]) {
    mensagens[index].lida = true;
    localStorage.setItem("mensagensContato", JSON.stringify(mensagens));
    carregarMensagens();
    atualizarResumo();
  }
}

// Excluir mensagem
function excluirMensagem(index) {
  let mensagens = JSON.parse(localStorage.getItem("mensagensContato")) || [];
  mensagens.splice(index, 1);
  localStorage.setItem("mensagensContato", JSON.stringify(mensagens));
  carregarMensagens();
  atualizarResumo();
}

// Marcar todas as mensagens como lidas
function marcarTodasComoLidas() {
  let mensagens = JSON.parse(localStorage.getItem("mensagensContato")) || [];
  for (let i = 0; i < mensagens.length; i++) {
    mensagens[i].lida = true;
  }
  localStorage.setItem("mensagensContato", JSON.stringify(mensagens));
  carregarMensagens();
  atualizarResumo();
}

// Limpar todas as mensagens
function limparMensagens() {
  localStorage.removeItem("mensagensContato");
  carregarMensagens();
  atualizarResumo();
}

// ==== INICIALIZAÇÃO ====

mostrarConfeitarias();
atualizarResumo();
carregarMensagens();

// Botões "Marcar todas como lidas" e "Limpar mensagens"
const btnMarcarLidas = document.querySelector('.marcar-lidas');
const btnLimparMensagens = document.querySelector('.limpar-mensagens');

btnMarcarLidas.addEventListener('click', () => {
  marcarTodasComoLidas();
});

btnLimparMensagens.addEventListener('click', () => {
  limparMensagens();
});

