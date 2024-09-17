


async function getExcluirContaVie() {
    const response = await fetch("http://localhost:3000/viewExcluir");
    const responseHTML = await response.text();

    const parseToHTML = document.createElement('div');
    parseToHTML.innerHTML = responseHTML;

    var div = parseToHTML.querySelector(".comfirmarContent");
    document.querySelector("#placeAbove").append(div);
    document.querySelector("main").style.filter = "blur(4px)"

    const negarExclusao = document.querySelector("#negarExclusao");
        negarExclusao.addEventListener("click", () =>{
            document.querySelector("#placeAbove").removeChild(document.querySelector("#placeAbove").childNodes[0])
            document.querySelector("main").style.filter = "blur(0px)"
        });
    
        const confirmarExclusao = document.querySelector("#confirmarExclusao");
        confirmarExclusao.addEventListener("click", async () => {
            await fetch("http://localhost:3000/excluir-conta", {
                method: "POST",
                credentials: "include"
            });
            loggout()
            
           
        });
}

async function getVerificarContaVie(nextFunction) {
    const nxtFunction = nextFunction;
    const responseView = await fetch("http://localhost:3000/viewVerificacao");
    const responseHTML = await responseView.text();

    const responseCodigo = await fetch("http://localhost:3000/sendemail-logged");
    const resultado = await responseCodigo.json();

    const parseToHTML = document.createElement('div');
    parseToHTML.innerHTML = responseHTML;

    var div = parseToHTML.querySelector(".comfirmarContent");
    document.querySelector("#placeAbove").append(div);
    document.querySelector("main").style.filter = "blur(4px)"

    const codigo = document.querySelector("#codigo");
    const codigoLabel = document.querySelector('[for="codigo"]');

    const avancarVerificacao = document.querySelector("#avancarVerificacao");
        avancarVerificacao.addEventListener("click", () =>{
            if(codigo.value == ""){
                codigoLabel.textContent = "Insira o codigo de verificação - campo vazio"
                codigo.style.border = "1px red solid";
                codigoLabel.style.color = "red";
                codigo.addEventListener("click", function desredfy(){
                    codigoLabel.textContent = "Insira o codigo de verificação"
                    codigo.style.border = "0px";
                    codigoLabel.style.color = "white";
                    codigo.removeEventListener("click", desredfy);
                });
                return;
            }

            if(codigo.value != resultado.codigo){
                codigoLabel.textContent = "Insira o codigo de verificação - codigo errado"
                codigo.style.border = "1px red solid";
                codigoLabel.style.color = "red";
                codigo.addEventListener("click", function desredfy(){
                    codigoLabel.textContent = "Insira o codigo de verificação"
                    codigo.style.border = "0px";
                    codigoLabel.style.color = "white";
                    codigo.removeEventListener("click", desredfy);
                });
                return;
            }

            switch(nxtFunction){
                case "getExcluirContaVie":
                    getExcluirContaVie()
                    break;
                case "getMudarNome":
                    getMudarNome()
                    break;
                case "getMudarSenha":
                    getMudarSenha()
                    break;
                default:
                    break;
                
            } 

            document.querySelector("#placeAbove").removeChild(document.querySelector("#placeAbove").childNodes[0])
            document.querySelector("main").style.filter = "blur(0px)"
        })
}

async function verifyCookie(){
    try {
        const resposta = await fetch("http://localhost:3000/get-usuario", {
            method: "GET",
            credentials: "include"
        });

        if (resposta.status === 401) {
            return -1; 
        }

        if (!resposta.ok) {
            throw new Error('Resposta da rede não foi ok'); 
        }

        // Retorna a resposta convertida para JSON
        return await resposta.json(); 

    } catch (err) {
        
        return -1; // Retorna null em caso de erro
    }
    
}

async function logBar(){
    console.log("Hello world")
    const resposta = await verifyCookie()
    if(resposta === -1) return 

    const userTag = document.querySelector("#userTag")
    
    const { nome, foto_de_perfil } = resposta[0]

    const userName = userTag.childNodes[3];
    const userPhoto = userTag.childNodes[1];

    userName.textContent = nome

    if(foto_de_perfil == null){
        userPhoto.src = "/img/princiapal.jpeg";
    } else{
        userPhoto.src = foto_de_perfil;
    }
}
logBar()

async function loggout(){
    await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include"
    });

    window.location.reload();
    window.location.replace("http://localhost:3000/inicio");
    
}

async function getMudarNome(){
    const response = await fetch("http://localhost:3000/viewMudarNome");
    const responseHTML = await response.text();

    const parseToHTML = document.createElement('div');
    parseToHTML.innerHTML = responseHTML;

    var div = parseToHTML.querySelector(".comfirmarContent");
    document.querySelector("#placeAbove").append(div);
    document.querySelector("main").style.filter = "blur(4px)"

    const avancar = document.querySelector("#avancarNome");
    const nome = document.querySelector("#nome");
    const nomeLabel = document.querySelector("[for='nome']")

    avancar.addEventListener("click", async () => {

        if(nome.value == ""){
            nomeLabel.textContent = "Insira o seu novo nome - campo vazio"
            nome.style.border = "1px red solid";
            nomeLabel.style.color = "red";
            nome.addEventListener("click", function desredfy(){
                nomeLabel.textContent = "Insira o seu novo nome"
                nome.style.border = "0px";
                nomeLabel.style.color = "white";
                nome.removeEventListener("click", desredfy);
            });
            return;
        };

        const data = {
            nome : nome.value,
            gmail : "null",
            senha : "null",
            foto : "null"
        };
    
        await fetch("http://localhost:3000/alterar-usuario", {
            method : "POST",
            credentials : "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
    
        window.location.reload();
    });

    
}

async function getMudarSenha() {
    const response = await fetch("http://localhost:3000/viewMudarSenha");
    const responseHTML = await response.text();

    const parseToHTML = document.createElement('div');
    parseToHTML.innerHTML = responseHTML;

    var div = parseToHTML.querySelector(".comfirmarContent");
    document.querySelector("#placeAbove").append(div);
    document.querySelector("main").style.filter = "blur(4px)";

    const avancar = document.querySelector("#avancarSenha");
    const senha = document.querySelector("#senha");
    const senhaLabel = document.querySelector("[for='senha']");
    const senhaConfirmacaoLabel = document.querySelector("[for='senhaConfirmacao']");
    const senhaConfirmacao = document.querySelector("#senhaConfirmacao");

    avancar.addEventListener("click", async () => {
        var empatyPlaces = 0;

        if(senha.value == ""){
            senhaLabel.textContent = "Insira sua nova senha - campo vazio"
            senha.style.border = "1px red solid";
            senhaLabel.style.color = "red";
            senha.addEventListener("click", function desredfy(){
                senhaLabel.textContent = "Insira sua nova senha"
                senha.style.border = "0px";
                senhaLabel.style.color = "white";
                senha.removeEventListener("click", desredfy);
            });
            empatyPlaces += 1;
        };

        if(senhaConfirmacao.value == ""){
            senhaConfirmacaoLabel.textContent = "Insira novamente - campo vazio"
            senhaConfirmacao.style.border = "1px red solid";
            senhaConfirmacaoLabel.style.color = "red";
            senhaConfirmacao.addEventListener("click", function desredfy(){
                senhaConfirmacaoLabel.textContent = "Insira novamente"
                senhaConfirmacao.style.border = "0px";
                senhaConfirmacaoLabel.style.color = "white";
                senhaConfirmacao.removeEventListener("click", desredfy);
            });
            empatyPlaces += 1;
        };

        if(senhaConfirmacao.value != senha.value){
            senhaConfirmacaoLabel.textContent = "Insira novamente - repita exatamente a senha"
            senhaConfirmacao.style.border = "1px red solid";
            senhaConfirmacaoLabel.style.color = "red";
            senhaConfirmacao.addEventListener("click", function desredfy(){
                senhaConfirmacaoLabel.textContent = "Insira novamente"
                senhaConfirmacao.style.border = "0px";
                senhaConfirmacaoLabel.style.color = "white";
                senhaConfirmacao.removeEventListener("click", desredfy);
            });
            empatyPlaces += 1;
        };

        if(empatyPlaces > 0){
            return;
        }

        const data = {
            nome : "null",
            gmail : "null",
            senha : senha.value,
            foto : "null"
        };
    
        await fetch("http://localhost:3000/alterar-usuario", {
            method : "POST",
            credentials : "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
    
        window.location.reload();

    });
    
}

console.log(document.querySelector("#userTag").childNodes)

const btnExcluir = document.querySelector("#btnExcluir");
const bntSair = document.querySelector("#btnSair")
const btnSenha = document.querySelector("#btnSenha");
const btnNome = document.querySelector("#btnNome");

btnExcluir.addEventListener("click", ()=>getVerificarContaVie("getExcluirContaVie"));
bntSair.addEventListener("click", loggout)
btnSenha.addEventListener("click", ()=>getVerificarContaVie("getMudarSenha"))
btnNome.addEventListener("click", ()=>getVerificarContaVie("getMudarNome"))
