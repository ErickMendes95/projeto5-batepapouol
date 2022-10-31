const respostaConexao = axios.get('https://mock-api.driven.com.br/api/v6/uol/status');

// FUNÇÕES SOBRE PARTICIPANTE

let nomeUsuario = prompt("Por favor, digita o nome de usuário que deseja utilizar")
function getApiParticipantes(resposta){
    const respostaParticipantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    respostaParticipantes.then(conferirParticipantes)
}

getApiParticipantes()

function conferirParticipantes(resposta) {
    
    for(let i =0; i < resposta.data.length; i++){
        if(nomeUsuario === resposta.data[i].name){
            while(nomeUsuario === resposta.data[i].name){
                alert("Nome de usuário inválido, por favor use outro")
                nomeUsuario = prompt("Por favor, digita o nome de usuário que deseja utilizar")
            }
        } else {
            enviarNome(nomeUsuario)
        }
    }
}

function enviarNome(nomeUsuario){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {
        name: nomeUsuario
    })
}

function manterConexao() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {
        name: nomeUsuario
    })
}

setInterval(manterConexao, 5000)

// FUNCÕES SOBRE MENSAGENS
function getApiMensagens() {
    const respostaMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    respostaMensagens.then(buscarMensagens)
}

setInterval(getApiMensagens, 3000)

function buscarMensagens(resposta) {

    renderizarMensagens(resposta)
}

function renderizarMensagens(resposta) {
    const corpo = document.querySelector(".messageBox")
    corpo.innerHTML = '';

    for( let i=0; i<resposta.data.length; i++){
        const divMensagem = document.createElement('div')
        divMensagem.classList.add("message")
        divMensagem.innerHTML += `(${resposta.data[i].time}) ${resposta.data[i].from} para ${resposta.data[i].to}: ${resposta.data[i].text}`

        if(resposta.data[i].type == 'message'){
            divMensagem.classList.add("normalMessage")
        } else if(resposta.data[i].type == 'status'){
            divMensagem.classList.add("statusMessage")
        } else if(resposta.data[i].type == 'private_message'){
            divMensagem.classList.add("privateMessage")
        }
        corpo.appendChild(divMensagem)
        divMensagem.scrollIntoView()

    }
}

function privateMessageOrNot() {
    if(selectNomes.value !== "Todos"){
        tipomensagem = "private_message"
    } else {
        tipomensagem = "message"
    }
    return tipomensagem
}

function enviarMensagens() {
    const mensagem = document.querySelector('input')
    const envio = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {
        from: nomeUsuario,
        to:   selectNomes.value,
        text: mensagem.value,
        type: privateMessageOrNot()
    })

    envio.catch(tratarFalha);
}



function tratarFalha() {
    alert("Você foi deslogado, a pagina irá reiniciar")
    window.location.reload()
}

// Selecionar Destinatário

function selectUser() {
    const selecionarParticipantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    selecionarParticipantes.then(implementarNomes)
}

setInterval(selectUser, 6000);

function implementarNomes(resposta) {
    renderizarNomes(resposta)
}

const selectNomes = document.querySelector("select")

function renderizarNomes(resposta) {
    selectNomes.innerHTML = ''
    let option = document.createElement("option")
    option.text = option.value = "Todos"
    selectNomes.add(option, selectNomes[0])
    for(let i = 1; i < resposta.data.length; i++){
        let option = document.createElement("option")
        option.text = option.value = `${resposta.data[i].name}`
        selectNomes.add(option, selectNomes[i])
    }
}