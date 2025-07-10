const nome = document.querySelector('#nome');
const email = document.querySelector('#email');
const senha = document.querySelector('#senha');
const confirmaSenha = document.querySelector('#confirmaSenha');
const nomeConfeitaria = document.querySelector('#nomeConfeitaria');
const plano = document.querySelector('#plano');
const cadastrar = document.querySelector("#cadastrar");
const messageGroup = document.querySelector('.message-group');
const messageText = document.querySelector('#message-text');


const confeitarias = JSON.parse(localStorage.getItem("chaveConf")) || [];

function exibirMensagem(resultado) {
  messageText.textContent = resultado.message;
  messageGroup.className = 'message-group'; // reseta classes

  if (resultado.type === 'success') {
    messageGroup.classList.add('success');
  } else if (resultado.type === 'error') {
    messageGroup.classList.add('error');
  }

  setTimeout(() => {
    messageGroup.className = 'message-group'; //remove o success ou error
    messageText.textContent = ''; // apaga o texto da messagem 
  }, 6000);
}

cadastrar.addEventListener("click", (e) => {
  e.preventDefault(); 

  // Verificação de campos vazios
  if (
    nome.value === '' ||
    email.value === '' ||
    senha.value === '' ||
    confirmaSenha.value === '' ||
    nomeConfeitaria.value === '' ||
    plano.value === ''
  ) {
    exibirMensagem({
      type: "error",
      message: "Preencha todos os campos obrigatórios!"
    });
    return;
  }

  // Verificação de e-mail válido (padrão básico)
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailEhValido = emailValido.test(email.value);
  if (!emailEhValido) {
    exibirMensagem({
      type: "error",
      message: "E-mail inválido!"
    });
    return;
  }

  // Verificação se o e-mail já existe
  let emailJaExiste = false;
  for (let i = 0; i < confeitarias.length; i++) {
    if (confeitarias[i].email.toLowerCase() === email.value.toLowerCase()) {
      emailJaExiste = true;
      break;
    }
  }

  if (emailJaExiste) {
    exibirMensagem({
      type: "error",
      message: "Este e-mail já está cadastrado!"
    });
    return;
  }

  if (senha.value !== confirmaSenha.value) {
    exibirMensagem({
      type: "error",
      message: "As senhas não conferem. Tente novamente!"
    });
    return;
  }

  const conf = {
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    nomeConfeitaria: nomeConfeitaria.value,
    tipoUsuario: "Confeitaria", // valor fixo atribuído automaticamente
    plano: plano.value,

  };

  confeitarias.push(conf);
  localStorage.setItem("chaveConf", JSON.stringify(confeitarias)); // salva
  
  console.log(conf);
  console.log(confeitarias);

  exibirMensagem({
    type: "success",
    message: "Conta criada com sucesso"
  });

  limpar();
});

function limpar() {
  nome.value = '';
  email.value = '';
  senha.value = '';
  confirmaSenha.value = '';
  nomeConfeitaria.value = '';
  plano.value = '';
}
