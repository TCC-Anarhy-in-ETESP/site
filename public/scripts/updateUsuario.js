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
            window.location.replace("http://localhost:3000/inicio");
            console.log("conta excluida");
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

console.log(document.querySelector("#userTag").childNodes)

const btnExcluir = document.querySelector("#btnExcluir");
const btnSenha = document.querySelector("#btnSenha");
const btnNome = document.querySelector("#btnNome");

btnExcluir.addEventListener("click", ()=>getVerificarContaVie("getExcluirContaVie"));