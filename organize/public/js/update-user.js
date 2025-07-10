// ==== Troca de abas ====
const btnPerfil = document.querySelector('[data-tab="user"]');
const btnConfeitaria = document.querySelector('[data-tab="bakery"]');
const abaPerfil = document.getElementById("user-tab");
const abaConfeitaria = document.getElementById("bakery-tab");

btnPerfil.addEventListener("click", () => {
  btnPerfil.classList.add("active");
  abaPerfil.classList.add("active");
  btnConfeitaria.classList.remove("active");
  abaConfeitaria.classList.remove("active");
});

btnConfeitaria.addEventListener("click", () => {
  btnConfeitaria.classList.add("active");
  abaConfeitaria.classList.add("active");
  btnPerfil.classList.remove("active");
  abaPerfil.classList.remove("active");
});

// ==== PERFIL ====
const nome = document.querySelector('#name');
const email = document.querySelector('#email');
const senha = document.querySelector('#password');  // campo senha
const updateForm = document.querySelector('#updateForm');
const successMessage = document.querySelector('#successMessage');

const photoInput = document.querySelector('#photoInput');
const photoPreview = document.querySelector('#photoPreview');

const placeholderImg = "/organize/public/imgs/profile-placeholder.png"; // caminho do placeholder

// Função para mostrar foto no preview
function mostrarFotoPreview(src) {
  photoPreview.innerHTML = ''; // limpa
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Foto do perfil';
  img.style.width = '100%'; // ou defina o estilo que quiser
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  photoPreview.appendChild(img);
}

// Carregar dados do usuário, incluindo foto
function carregarDados() {
  const emailLogado = localStorage.getItem("usuarioLogadoEmail");
  if (!emailLogado) return;

  const lista = JSON.parse(localStorage.getItem("chaveConf")) || [];
  const usuario = lista.find(u => u.email === emailLogado);

  if (usuario) {
    nome.value = usuario.nome || '';
    email.value = usuario.email || '';
    senha.value = usuario.senha || '';

    if (usuario.foto) {
      mostrarFotoPreview(usuario.foto);
    } else {
      mostrarFotoPreview(placeholderImg);
    }
  } else {
    mostrarFotoPreview(placeholderImg);
  }
}

// Salvar dados do usuário, incluindo foto (se houver)
function salvarDados() {
  const emailLogado = localStorage.getItem("usuarioLogadoEmail");
  if (!emailLogado) return;

  let lista = JSON.parse(localStorage.getItem("chaveConf")) || [];

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].email === emailLogado) {
      lista[i].nome = nome.value;
      lista[i].email = email.value;
      lista[i].senha = senha.value;

      // Se o preview tem uma imagem diferente do placeholder, salve o src
      const imgPreview = photoPreview.querySelector('img');
      if (imgPreview && imgPreview.src !== window.location.origin + placeholderImg) {
        lista[i].foto = imgPreview.src;
      } else {
        lista[i].foto = null;
      }

      localStorage.setItem("usuarioLogadoEmail", email.value);
      break;
    }
  }

  localStorage.setItem("chaveConf", JSON.stringify(lista));
}

// Capturar mudança da foto e mostrar preview em base64
photoInput.addEventListener('change', (event) => {
  const arquivo = event.target.files[0];
  if (!arquivo) {
    mostrarFotoPreview(placeholderImg);
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    mostrarFotoPreview(e.target.result);
  };
  reader.readAsDataURL(arquivo);
});

// Evento submit do formulário perfil
updateForm.addEventListener('submit', e => {
  e.preventDefault();

  if (nome.value === '' || email.value === '' || senha.value === '') {
    alert('Preencha nome, email e senha.');
    return;
  }

  salvarDados();

  successMessage.style.display = 'block';
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 3000);
});

// ==== CONFEITARIA ====
// ... seu código atual da confeitaria continua igual ...
const nomeFantasia = document.querySelector('#nome_fantasia');
const cnpj = document.querySelector('#cnpj');
const telefone = document.querySelector('#telefone');
const endereco = document.querySelector('#endereco');
const bakeryForm = document.querySelector('#bakeryForm');
const bakeryMessage = document.querySelector('#bakerySuccessMessage');

function carregarDadosConfeitaria() {
  const emailLogado = localStorage.getItem("usuarioLogadoEmail");
  if (!emailLogado) return;

  const lista = JSON.parse(localStorage.getItem("chaveConf")) || [];
  const usuario = lista.find(u => u.email === emailLogado);

  if (usuario) {
    nomeFantasia.value = usuario.nomeConfeitaria || '';
    cnpj.value = usuario.cnpj || '';
    telefone.value = usuario.telefone || '';
    endereco.value = usuario.endereco || '';
  }
}

function salvarDadosConfeitaria() {
  const emailLogado = localStorage.getItem("usuarioLogadoEmail");
  if (!emailLogado) return;

  if (
    nomeFantasia.value === '' ||
    cnpj.value === '' ||
    telefone.value === '' ||
    endereco.value === ''
  ) {
    alert("Preencha todos os campos da confeitaria.");
    return;
  }

  const cnpjValido = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  if (!cnpjValido.test(cnpj.value)) {
    alert("CNPJ inválido. Use o formato 00.000.000/0000-00");
    return;
  }

  const telefoneValido = /^\(\d{2}\) \d{5}-\d{4}$/;
  if (!telefoneValido.test(telefone.value)) {
    alert("Telefone inválido. Use o formato (00) 00000-0000");
    return;
  }

  let lista = JSON.parse(localStorage.getItem("chaveConf")) || [];

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].email === emailLogado) {
      lista[i].nomeConfeitaria = nomeFantasia.value;
      lista[i].cnpj = cnpj.value;
      lista[i].telefone = telefone.value;
      lista[i].endereco = endereco.value;
      break;
    }
  }

  localStorage.setItem("chaveConf", JSON.stringify(lista));

  bakeryMessage.style.display = 'block';
  setTimeout(() => {
    bakeryMessage.style.display = 'none';
  }, 3000);
}

bakeryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  salvarDadosConfeitaria();
});

// ==== MÁSCARAS ====
telefone.addEventListener("input", () => {
  let valor = telefone.value.replace(/\D/g, "");

  if (valor.length >= 2 && valor.length <= 6) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else if (valor.length > 6 && valor.length <= 10) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
  } else if (valor.length > 10) {
    valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
  }

  telefone.value = valor;
});

cnpj.addEventListener("input", () => {
  let valor = cnpj.value.replace(/\D/g, "");
  if (valor.length > 14) valor = valor.slice(0, 14);

  if (valor.length >= 3 && valor.length <= 5) {
    valor = `${valor.slice(0, 2)}.${valor.slice(2)}`;
  } else if (valor.length >= 6 && valor.length <= 8) {
    valor = `${valor.slice(0, 2)}.${valor.slice(2, 5)}.${valor.slice(5)}`;
  } else if (valor.length >= 9 && valor.length <= 12) {
    valor = `${valor.slice(0, 2)}.${valor.slice(2, 5)}.${valor.slice(5, 8)}/${valor.slice(8)}`;
  } else if (valor.length >= 13) {
    valor = `${valor.slice(0, 2)}.${valor.slice(2, 5)}.${valor.slice(5, 8)}/${valor.slice(8, 12)}-${valor.slice(12)}`;
  }

  cnpj.value = valor;
});

// ==== CARREGAR DADOS INICIAIS ====
carregarDados();
carregarDadosConfeitaria();
