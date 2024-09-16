const form = document.querySelector("#loginForms");
    const submit = form.elements[2];
    const emailLabel = document.querySelector('[for="email"]');
    const email = form.elements.email;
    const passwordLabel = document.querySelector('[for="password"]');
    const password = form.elements.password; 
    
async function login(data){
    try{
        const resultado = fetch("http://localhost:3000/get-login", {
                method: "POST",
                headers:{
                    "Content-Type": "Application/json"
                },
                body : JSON.stringify(data)
            }
        )

        return resultado;
    }catch(err){
        console.log("Erro: ", err)
    }
}

submit.addEventListener('click', async () => {

    if(verifyPlaces() > 0){return};

    const data = {
        email : email.value,
        password : password.value
    };
    try{
        const rest = await login(data);
        const {resultado} = await rest.json();

        if(resultado == "logado") return window.location.replace("http://localhost:3000/inicio");
    }catch{return;}
    

    email.style.border = "1px red solid";
    password.style.border = "1px red solid";
    passwordLabel.style.color = "red";
    emailLabel.style.color = "red";
    emailLabel.textContent = "Email - email ou senha não encontrados";
    passwordLabel.textContent = "Senha - email ou senha não encontrados";

    email.addEventListener('click', desredfy);
    password.addEventListener('click', desredfy);
});



function desredfy(){
    email.style.border = "0px";
    password.style.border = "0px";
    passwordLabel.style.color = "white";
    emailLabel.style.color = "white";
    emailLabel.textContent = "Email"
    passwordLabel.textContent = "Senha"

    email.removeEventListener('click', desredfy);
    password.removeEventListener('click', desredfy);
}

function verifyPlaces(){
    let empatyPlaces = 0;

    if(email.value == ""){
        emailLabel.style.color = "red";
        emailLabel.textContent = "Email - campo obrigatorio";
        email.style.border = "1px red solid";

        email.addEventListener('click', desredfy);
        empatyPlaces += 1;
    }
    if(password.value == ""){
        passwordLabel.style.color = "red";
        passwordLabel.textContent = "Senha - campo obrigatorio";
        password.style.border = "1px red solid";
        
        password.addEventListener('click', desredfy);
        empatyPlaces += 1;
    }

    if(email.value.split("@")[1] != "gmail.com"){
        emailLabel.style.color = "red";
        emailLabel.textContent = "Email - insira um email (@gmail.com)";
        email.style.border = "1px red solid";

        email.addEventListener('click', desredfy);
        empatyPlaces += 1;
    }

    return empatyPlaces;
}