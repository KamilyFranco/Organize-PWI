const assinar = document.querySelector('.buttonComprarAgora');
assinar.addEventListener('click', () => {
  location.href = "/organize/public/create-account.html"; 
});

const planos = document.querySelectorAll('.botao-plano');
planos.forEach((botao) => {
  botao.addEventListener('click', () => {
    location.href = '/organize/public/create-account.html'; 
  });
});

// === FORMULÁRIO DE CONTATO ===
const formContato = document.getElementById('form-contato');
const mensagemSucesso = document.getElementById('mensagem-enviada'); 

if (formContato) {
  formContato.addEventListener('submit', (e) => {
    e.preventDefault();

  
    const nome = document.getElementById('nomeContato');
    const email = document.getElementById('emailContato');
    const mensagem = document.getElementById('mensagemContato');

    // cria o objeto com os valores dos inputs
    const novaMensagem = {
      nome: nome?.value || "Anônimo",  // ?. evita erro se o input for null
      email: email?.value || "",
      mensagem: mensagem?.value || "",
      lida: false,
      data: new Date().toLocaleString()
    };

    const mensagensSalvas = JSON.parse(localStorage.getItem("mensagensContato")) || [];
    mensagensSalvas.push(novaMensagem);
    localStorage.setItem("mensagensContato", JSON.stringify(mensagensSalvas));

    mensagemSucesso.classList.add('ativo');

    setTimeout(() => {
      mensagemSucesso.classList.remove('ativo');
    }, 4000);

    formContato.reset();
  });
}
