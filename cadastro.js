const cadastroMemoria = [{
    name:"Victor",
    email:"victor@email.com",
    senha:"123456Duda",
}
];

const form = document.querySelector("form");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmar-senha");


form.addEventListener("submit", (e) => {
    e.preventDefault()

    const credentials = {
        name: nome.value,
        email: email.value,
        senha: senha.value,
    }

    let userFound = cadastroMemoria.find((user) => {
        user === credentials
    })

    if(!userFound) {
        alert("Usuário não encontrado")
    }else{
        document.location.href = "telainicial.html"
    }
});
// Configurações básicas
const MAX_TENTATIVAS = 5;
const TEMPO_BLOQUEIO_MS = 30 * 1000; // 30 segundos (mude para 5 * 60 * 1000 para 5 minutos)
const SENHA_CORRETA = "123456";

// Elementos do HTML
const inputSenha = document.getElementById('senha');
const botaoEnviar = document.getElementById('btnEnviar');
const painelMensagem = document.getElementById('mensagem');
const formulario = document.getElementById('meuFormulario');

let intervaloCronometro = null;

// 1. Verifica o estado ao carregar a página
function verificarBloqueio() {
    const horarioBloqueio = localStorage.getItem('horarioBloqueio');
    
    if (horarioBloqueio) {
        const tempoDecorrido = Date.now() - parseInt(horarioBloqueio);
        
        if (tempoDecorrido < TEMPO_BLOQUEIO_MS) {
            // Ainda está no tempo de bloqueio
            const tempoRestante = TEMPO_BLOQUEIO_MS - tempoDecorrido;
            iniciarContagemRegressiva(tempoRestante);
            return;
        } else {
            // O tempo já passou! Libera o usuário
            desbloquearAcesso();
        }
    }
}

// 2. Bloqueia os campos e inicia o cronômetro visual
function iniciarContagemRegressiva(tempoRestante) {
    inputSenha.disabled = true;
    botaoEnviar.disabled = true;

    // Atualiza a mensagem a cada 1 segundo
    clearInterval(intervaloCronometro);
    
    let segundosRestantes = Math.ceil(tempoRestante / 1000);
    
    painelMensagem.textContent = `Acesso bloqueado! Tente novamente em ${segundosRestantes}s.`;

    intervaloCronometro = setInterval(() => {
        segundosRestantes--;
        
        if (segundosRestantes <= 0) {
            clearInterval(intervaloCronometro);
            desbloquearAcesso();
        } else {
            painelMensagem.textContent = `Acesso bloqueado! Tente novamente em ${segundosRestantes}s.`;
        }
    }, 1000);
}

// 3. Libera os campos para uma nova tentativa
function desbloquearAcesso() {
    inputSenha.disabled = false;
    botaoEnviar.disabled = false;
    painelMensagem.textContent = "";
    
    // Limpa os dados do localStorage para recomeçar do zero
    localStorage.removeItem('tentativasLogin');
    localStorage.removeItem('horarioBloqueio');
}

// 4. Lógica de envio do formulário
formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    let tentativas = parseInt(localStorage.getItem('tentativasLogin')) || 0;
    const senhaDigitada = inputSenha.value;

    if (senhaDigitada === SENHA_CORRETA) {
        alert("Acesso concedido!");
        desbloquearAcesso();
    } else {
        tentativas++;
        localStorage.setItem('tentativasLogin', tentativas);

        if (tentativas >= MAX_TENTATIVAS) {
            // Salva o momento exato do bloqueio (timestamp atual em milissegundos)
            localStorage.setItem('horarioBloqueio', Date.now());
            iniciarContagemRegressiva(TEMPO_BLOQUEIO_MS);
        } else {
            let restantes = MAX_TENTATIVAS - tentativas;
            painelMensagem.textContent = `Senha incorreta! Restam ${restantes} tentativas.`;
        }
    }

    inputSenha.value = "";
});

// Executa ao abrir ou atualizar a página
verificarBloqueio();

