

//html elements
const imagem = document.querySelector("#imagem");
const imagemToReplace = document.querySelector("#imagemToReplace");

const formSignup = document.querySelector("#form-singn");
const form = document.querySelector("#formElements");
    const nome = form.elements["name"];
    const email = form.elements["email"];
    const senha = form.elements["password"];
    const senhaConfirm = form.elements["passwordConfirme"];
    const imagemFile = form.elements["imagem"];
    const submit = form.elements["submit"];

const popping = document.querySelector("#popping");
    const formEmail = document.querySelector("#formElementsCode");
        const incodigo = formEmail.elements[0];
        const formEmailSubmit = formEmail.elements[1];

startVerify()
function startVerify(){
    nome.disabled = "true";
    nome.value = ""
    nome.style.opacity = ".1";
    senha.disabled = "true";
    senha.style.opacity = ".1";
    nome.value = ""
    senhaConfirm.disabled = "true";
    senhaConfirm.style.opacity = ".1";
    nome.value = ""
    imagemFile.disabled = "true";
    imagemFile.src = "/img/princiapal.jpeg";
    incodigo.textContent = "";
    document.querySelector(".image-place").style.opacity = ".1";
    email.removeEventListener("click", startVerify);
    submit.removeEventListener("click", login);
    submit.addEventListener("click", getEmailVerify);
}


async function codeConfirm(emaily) {
    console.log(emaily)
    const data = {
        email: emaily
    }
    
    const email = await fetch("http://localhost:3000/sendemail", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(data)
    });

    const {codigo} = await email.json()

    return codigo
    
}


//change the image on upload
imagem.addEventListener('change', function(){
    console.log("Hello Wolrd");
    try{
        
        const imagemGiven = imagem.files[0];
        console.log(imagemGiven)
        
        
        const reader = new FileReader()
        reader.addEventListener('load', function(imagemGiven){
            const readerTargt = imagemGiven.target;
            imagemToReplace.src = readerTargt.result
        })
        
        reader.readAsDataURL(imagemGiven)

    }catch(err){
        console.log(err)
    }
})

//fetch to login user


function desredfy(){
    document.querySelector('[for="passwordConfirme"]').style.color = "white";
    document.querySelector('[for="password"]').style.color = "white";
    senha.style.border = "0px";
    senhaConfirm.style.border = "0px";
    document.querySelector('[for="passwordConfirme"]').textContent = "Confirmar senha";
  
    document.querySelector('[for="username"]').style.color = "white";
    nome.style.border = "0px";
    document.querySelector('[for="username"]').textContent = "Nome";

    document.querySelector('[for="email"]').style.color = "white";
    email.style.border = "0px";
    document.querySelector('[for="email"]').textContent = "Email";

    senha.removeEventListener("click", desredfy);
    senhaConfirm.removeEventListener("click", desredfy);
    nome.removeEventListener("click", desredfy);
    email.removeEventListener("click", desredfy);


}



submit.addEventListener('click', getEmailVerify);
async function getEmailVerify(){
    console.log("aaaa")
    const emailLabel = document.querySelector('[for="email"]');
    if(email.value == ""){
        emailLabel.style.color = "red";
        email.style.border = "1px red solid";
        emailLabel.textContent = "Email - campo vazio";
        email.addEventListener("click", desredfy);
        return;
        
    }
    if(email.value.split("@")[1] != "gmail.com"){
        emailLabel.style.color = "red";
        emailLabel.textContent = "Email - insira um email (@gmail.com)";
        email.style.border = "1px red solid";
        email.addEventListener('click', desredfy);
        return;
    }

    const codigo = await codeConfirm(email.value);

    popping.style.display = "flex";
    formSignup.style.display = "none";

   
    document.querySelector("#emailShow").textContent = email.value
    formEmailSubmit.addEventListener('click', ()=>{
        if(codigo != incodigo.value){
            const incodigoLabel = document.querySelector('[for="code"]');
            incodigoLabel.style.color = "red";
            incodigoLabel.textContent = "Digite o codigo de verificação - corretamente";
            incodigo.style.border = "1px red solid";
 
            incodigo.addEventListener("click", function desredfyIncodigo(){
                incodigoLabel.style.color = "white";
                incodigo.style.border = "0px";
                incodigoLabel.textContent = "Digite o codigo de verificação";
                incodigo.removeEventListener("click", desredfyIncodigo)
            });

        }else{
            nome.disabled = false;
            nome.style.opacity = "100";
            senha.disabled = false;
            senha.style.opacity = 100;
            senhaConfirm.disabled = false;
            senhaConfirm.style.opacity = "100";
            imagemFile.disabled = false;
            document.querySelector(".image-place").style.opacity = "100";

            popping.style.display = "none";
            formSignup.style.display = "flex";

            submit.removeEventListener('click', getEmailVerify);
            submit.addEventListener('click', login);
            submit.textContent = "Cadastrar-se";
        }
    });

    

}

async function login() {

    let camposVazios = 0;
    if(nome.value == ""){
        camposVazios += 1;

        document.querySelector('[for="username"]').style.color = "red";
        nome.style.border = "1px red solid";
        document.querySelector('[for="username"]').textContent = "Nome - campo vazio";

    }
    if(email.value == ""){
        camposVazios += 1;

        document.querySelector('[for="email"]').style.color = "red";
        email.style.border = "1px red solid";
        document.querySelector('[for="email"]').textContent = "Email - campo vazio";

    }
    if(senha.value == ""){
        camposVazios += 1;

        document.querySelector('[for="passwordConfirme"]').style.color = "red";
        document.querySelector('[for="password"]').style.color = "red";
        senha.style.border = "1px red solid";
        senhaConfirm.style.border = "1px red solid";
        document.querySelector('[for="passwordConfirme"]').textContent = "Confirmar senha - campo vazio";

    }
    if(camposVazios > 0){
        senha.addEventListener("click", desredfy);
        senhaConfirm.addEventListener("click", desredfy);
        nome.addEventListener("click", desredfy);
        email.addEventListener("click", desredfy);
        return;
    }
    
    if(senha.value != senhaConfirm.value){
        document.querySelector('[for="passwordConfirme"]').style.color = "red";
        document.querySelector('[for="password"]').style.color = "red";
        senha.style.border = "1px red solid";
        senhaConfirm.style.border = "1px red solid";
        document.querySelector('[for="passwordConfirme"]').textContent = "Confirmar senha - senhas diferentes";

        senha.addEventListener("click", desredfy);
        senhaConfirm.addEventListener("click", desredfy);
        nome.addEventListener("click", desredfy);
        email.addEventListener("click", desredfy);
        return;
    };


    const data = { 
        username: nome.value, 
        email: email.value,  
        password: senha.value, 
        imagem: imagemToReplace.src
    };

    try {
        const rest = await fetch("http://localhost:3000/post-signin", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        }); 

        const {resultado} = await rest.json();
    
        if(resultado === "nome"){
            console.log(document.querySelector('[for="username"]'))
            document.querySelector('[for="username"]').style.color = "red";
            nome.style.border = "1px red solid";
            document.querySelector('[for="username"]').textContent = "Nome - nome ja esta sendo usado";

            senha.addEventListener("click", desredfy);
            senhaConfirm.addEventListener("click", desredfy);
            nome.addEventListener("click", desredfy);
            email.addEventListener("click", desredfy);
            return;
    
        } else if(resultado === "gmail"){
            console.log(resultado)
            document.querySelector('[for="email"]').style.color = "red";
            email.style.border = "1px red solid";
            document.querySelector('[for="email"]').textContent = "Email - email ja esta sendo usado";

            senha.addEventListener("click", desredfy);
            senhaConfirm.addEventListener("click", desredfy);
            nome.addEventListener("click", desredfy);
            email.addEventListener("click", desredfy);
            email.addEventListener("click", startVerify)
            return;
        }else{
            window.location.replace("http://localhost:3000/login");
        }


    } catch (err) {
        console.log("erro: ", err); 
    }
}

