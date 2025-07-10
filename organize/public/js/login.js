const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const entrar = document.querySelector("#Entrar");
const tipoUsuario = document.querySelector("#tipoUsuario"); // agora com id
const messageGroup = document.querySelector('.message-group');
const messageText = document.querySelector('#message-text');

// Recupera o array de confeitarias cadastradas
const confeitarias = JSON.parse(localStorage.getItem("chaveConf")) || [];
const admins = JSON.parse(localStorage.getItem("chaveAdmins")) || [];


function exibirMensagem(resultado) {

  messageText.textContent = resultado.message;
  messageGroup.className = 'message-group'; // resetando

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

function limpar() {
  email.value = '';
  senha.value = '';
  tipoUsuario.value = '';
  messageText.textContent = '';
  messageGroup.className = "message-group";
}


entrar.addEventListener("click", (e)=>{
    e.preventDefault(); // impede o comportamento padrão do botão (recarregar)
    const dados = {
        email:email.value,
        senha:senha.value,
        tipoUsuario:tipoUsuario.value
    };

    console.log("Confeitarias no localStorage:", confeitarias);
    console.log("Dados do login:", dados);

    // Verifica se o tipo de usuário foi selecionado
    if (dados.tipoUsuario === "") {
      exibirMensagem({
        type: "error",
        message: "Selecione o tipo de usuário!"
      });
      return;
    }

    let usuario = null;
    let emailExiste = false;

    let listaUsuarios = [];

    if (dados.tipoUsuario === "Confeitaria") {
      listaUsuarios = confeitarias;
    } else if (dados.tipoUsuario === "Administrador") {
      listaUsuarios = admins;
    }

    for (let i = 0; i < listaUsuarios.length; i++) {
      if (listaUsuarios[i].email === dados.email) {
        emailExiste = true;
        if (listaUsuarios[i].senha === dados.senha) {
          usuario = listaUsuarios[i];
          break;
        }
      }
    }

    if (usuario != null) {
        // Salva o usuário logado atual no localStorage
        localStorage.setItem("usuarioLogadoEmail", usuario.email);

        // Redireciona de acordo com o tipo
        if (usuario.tipoUsuario.toLowerCase() === 'confeitaria') {
          location.href = "/organize/public/conf-area.html"; 
          return;
        } else if (usuario.tipoUsuario.toLowerCase() === 'administrador') {
          location.href = "/organize/public/admin-dashboard.html"; 
          return;
        }

        console.log("Lista de usuários selecionada:", listaUsuarios)
    } 

    if (!emailExiste) {
      exibirMensagem({
        type: "error",
        message: "Esse usuário não existe."
      });
    } else {
      exibirMensagem({
        type: "error",
        message: "Email ou senha inválidos, ou tipo de usuário incorreto."
      });
    }
});



