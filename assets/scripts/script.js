let nomeDoUsuario;
let destinatario;
let tipoVisibilidade;

function carregarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    promise.then( (response) => {
        const mensagensDoServidor = response.data;
        const ulMensagens = document.querySelector(".lista-mensagem");
        ulMensagens.innerHTML += `<ul>${mensagensDoServidor.map(formatarMensagem).join('')}</ul>`;
        window.scroll(0, document.body.scrollHeight);
    });
}
carregarMensagens();

function formatarMensagem(dados){
    let tipoMensagem = "";

    if(dados.type === "status"){
        tipoMensagem = "mensagem status";
    }

    else if(dados.type === "private_message"){
        if (dados.to !== nomeDoUsuario && dados.to !== "Todos" && dados.from !== nomeDoUsuario) {
            return "";
        }

        tipoMensagem = "mensagem reservada";
    }

    else {
      tipoMensagem = "mensagem";  
    }
    
    return `<li class="${tipoMensagem}">
                <span class="texto-transparente">(${dados.time})</span>
                <span class="texto-negrito">${dados.from}</span>
                <span> para</span>
                <span class="texto-negrito">${dados.to}:</span>
                <span class="texto-mensagens">${dados.text}</span>
            </li>`;
}

function entrarSala(){
    nomeDoUsuario = prompt("Qual o seu lindo nome?");
    const nome = {
        name: nomeDoUsuario
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", nome);

    promise.then( () => {
        recarregarPagina();
    });

    promise.catch( () => {
        alert("Nome de usuário indisponível, por favor digite outro!");
        entrarSala();
    });

}
entrarSala();

function enviarMensagem(){
    const input = document.querySelector('.input-mensagem');
    const mensagem = input.value;    

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
        from: nomeDoUsuario,
        to: destinatario,
        text: mensagem,
        type: tipoVisibilidade
    });

    promise.then( ()=> {
        input.value = '';
    })

    promise.catch( () => {
        window.location.reload();
    })
}

function postStatus(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: nomeDoUsuario});

    promise.catch( () => {
        console.log("Algum erro está acontecendo, por favor verifique!");
    })
}

function recarregarPagina(){
    const input = document.querySelector('.input-mensagem');

    carregarMensagens();
    setInterval(postStatus, 5000);
    setInterval(carregarMensagens, 3000);
    setInterval(verificarParticipantesAtivos, 10000);

    input.onkeydown = (e) => {
        if (e.code === 'Enter') {
            enviarMensagem();
        }
    };
}

function acionarMenuLateral(){
    const menuLateral = document.querySelector(".menu-lateral");
    const fundoTransparente = document.querySelector(".fundo-transparente");

    menuLateral.classList.toggle("escondido");
    fundoTransparente.classList.toggle("fundo-escondido");
}

function selecionarVisibilidade(elemento){
    const selecionado = document.querySelector(".visibilidade.selecionado");
    const envio = document.querySelector(".envio");
    
    if(selecionado !== null){
        selecionado.classList.remove("selecionado");
    }

    elemento.classList.add("selecionado");

    
    if(envio.innerText.includes('Reservadamente')){
        const novoEnvio = envio.innerText.replace('(Reservadamente)','');
        envio.innerHTML = `${novoEnvio} (${elemento.innerText})`;
        if(elemento.innerText === 'Reservadamente'){
            tipoVisibilidade = "private_message";
        } else {
            tipoVisibilidade = "message";
        }
    }
    
    else if(envio.innerText.includes('Público')) {
        const novoEnvio = envio.innerText.replace('(Público)','');
        envio.innerHTML = `${novoEnvio} (${elemento.innerText})`;
        if(elemento.innerText === 'Reservadamente'){
            tipoVisibilidade = "private_message";
        } else {
            tipoVisibilidade = "message";
        }
    }

    else {
        envio.innerHTML += ` (${elemento.innerText})`;
        if(elemento.innerText === 'Reservadamente'){
            tipoVisibilidade = "private_message";
        } else {
            tipoVisibilidade = "message";
        }
    }
}

function selecionarParticipante(elemento){
    const participanteSelecionado = document.querySelector(".participante.selecionado");
    const selecionarTodos = document.querySelector(".participantes-todos.selecionado");
    const envio = document.querySelector(".envio");
    destinatario = elemento.innerText;

    if(participanteSelecionado !== null){
        participanteSelecionado.classList.remove("selecionado");
    }

    if(selecionarTodos !== null){
        selecionarTodos.classList.remove("selecionado");
    }

    elemento.classList.add("selecionado");
    envio.innerHTML = `Enviando para ${elemento.innerText}`;
}

function verificarParticipantesAtivos(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");

    promise.then( (response) => {
        const participantesAtivos = response.data;
        const ulParticipantes = document.querySelector(".lista-de-contatos");
        ulParticipantes.innerHTML = "";

        ulParticipantes.innerHTML += `<ul>${participantesAtivos.map((item) =>
            `<li class="participante" onclick="selecionarParticipante(this)" data-identifier="participant">
            <ion-icon name="person-circle"></ion-icon>${item.name}<ion-icon class="check" name="checkmark-outline">
            </li>`
        ).join('')}</ul>`;
    })
}
verificarParticipantesAtivos();