let nomeDoUsuario;

function carregarMensagens() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    promise.then( (response) => {
        const mensagensDoServidor = response.data;
        const ulMensagens = document.querySelector(".lista-mensagem");
        ulMensagens.innerHTML += mensagensDoServidor.map(formatarMensagem);
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
    
    return `
    <li class="${tipoMensagem}">
        <span class="texto-transparente">(${dados.time})</span>
        <span class="texto-negrito">${dados.from}</span>
        <span class="texto-mensagens"> para</span>
        <span class="texto-negrito">${dados.to}:</span>
        <span class="texto-mensagens">${dados.text}</span>
    </li>    
    `;
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
        to: "Todos",
        text: mensagem,
        type: "message"
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
    promise.then( () => {
        console.log("A cada 5s");
    })

    promise.catch( () => {
        console.log("Algum erro está acontecendo, por favor verifique!");
    })
}

function recarregarPagina(){
    const input = document.querySelector('.input-mensagem');

    carregarMensagens();
    setInterval(postStatus, 5000);
    setInterval(carregarMensagens, 3000);

    input.onkeydown = (e) => {
        if (e.code === 'Enter') {
            enviarMensagem();
        }
    };
}