let codigo = -1;
let gmail_usuario = "";

const form = document.querySelector("form");
    const email = form.email;
    const emailLabel = document.querySelector("[for='email']");

    const code = form.code;
    const codeLabel = document.querySelector("[for='code']");

    let button_submit = form.elements[2];

    let password = form.password;
    let passwordLabel = document.querySelector("[for='password']");

    let password2 = form.password2;
    let passwordLabel2 = document.querySelector("[for='password2']");


button_submit.addEventListener("click", verifyEmail);

async function send_verifyEamil(email) {
    try{
        const data = {
            gmail: email
        }
    
        const emaill = await fetch("http://localhost:3000/verify-user-by-email", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
    
        const {resposta} = await emaill.json()

        return resposta

    }catch(err){
        console.log(err);
        return -1;
    }
   
}

async function send_code(email) {
    try{
        const data = {
            email: email
        }
    
        const emaill = await fetch("http://localhost:3000/sendemail", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
    
        const {codigo} = await emaill.json()

        return codigo

    }catch(err){
        console.log(err);
        return -1;
    }
   
}

async function send_password(gmail, senha){
    try{
        const data = {
            gmail : gmail,
            senha : senha,
        };
    
        const result = await fetch("http://localhost:3000/alterar-usuario-senha", {
            method : "POST",
            credentials : "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        const {resposta} = await result.json();

        return resposta;

    }catch(err){
        console.log(err);
        return -1
    }
}


function desredfy(){
    list = [    
                [email], [emailLabel, "Email"],
                [code], [codeLabel, "Código de Verificação"],
                [password], [passwordLabel, "Digite sua nova"],
                [password2], [passwordLabel2, "Repita a senha"]
            ];

    for(i=0; i < list.length; i++){
        const element = list[i][0];
        
        if(element.nodeName == "LABEL"){
            const text = list[i][1];
            element.style.color = "white";
            element.textContent = text;
        }
        
        if(element.nodeName == "INPUT"){
            element.removeEventListener("click", desredfy);
            element.style.border = "0px";
        }
        
    }
}

function redfy(list){
    for(i=0; i < list.length; i++){
        const element = list[i][0];
        
        if(element.nodeName == "LABEL"){
            const text = list[i][1];
            element.style.color = "red";
            element.textContent = text;
        }
        
        if(element.nodeName == "INPUT"){
            element.style.border = "1px red solid";
            element.addEventListener("click", desredfy);
        }
        
    }
    conut_saprr = 1
}


async function verifyEmail(){
    if(email.value.trim() == ""){
        redfy([[email], [emailLabel, "Email - campo vazio"]]);
        return;
    }

    const email_exists = await send_verifyEamil(email.value.trim());

    if(email_exists < 1){
        redfy([[email], [emailLabel, "Email - este email não se encontra cadastrado"]]);
        return;
    };

    codigo = await send_code(email.value.trim());
    if (codigo == -1) return console.log(codigo);
    
    code.disabled = false;
    code.style.opacity = "1";

    button_submit.textContent = "Verificar";
    button_submit.removeEventListener("click", verifyEmail)
    button_submit.addEventListener("click", verifyCode)
}

function verifyCode(){
    if(code.value.trim() == ""){
        redfy([[code], [codeLabel, "Código de Verificação - campo vazio"]]);
        return;
    }

    if(codigo != code.value.trim()){
        redfy([[code], [codeLabel, "Código de Verificação - codigo incorreto"]]);
        return;
    }

    if(codigo == code.value.trim()){
        gmail_usuario = email.value.trim();
        const str_changePassword = `
                <div class="mb-3">
                    <label for="password" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="password" name="password" placeholder="Digite sua nova">
                </div>
                <div class="mb-3">
                    <label for="password2" class="form-label">Repita a senha</label>
                    <input type="password" class="form-control" id="password2" name="password2" placeholder="Repita a mesma senha">
                </div>
                <button type="submit" class="btn btn-primary">Trocar senha</button>
            `;
        form.innerHTML = str_changePassword;

        password = form.password;
        passwordLabel = document.querySelector("[for='password']");

        password2 = form.password2;
        passwordLabel2 = document.querySelector("[for='password2']");

        button_submit = form.elements[2];
        
        button_submit.removeEventListener("click", verifyCode)
        button_submit.addEventListener("click", changePassword)
    }
}

async function changePassword(){
    var campos = 0;

    if(password.value.trim() == ""){
        redfy([[password], [passwordLabel, "Digite sua nova - campo vazio"]]);
        campos++;
    }

    if(password2.value.trim() == ""){
        redfy([[password2], [passwordLabel2, "Repita a senha - campo vazio"]]);
        campos++;
    }

    if(campos > 0){return;};

    if(password.value.trim() != password2.value.trim()){
        redfy([[password], [passwordLabel, "Digite sua nova"]]);
        redfy([[password2], [passwordLabel2, "Repita a senha - senhas diferentes"]]);
        return;
    }

    const response = await send_password(gmail_usuario, password.value.trim());

    if(response == "usuario alterado"){
        window.location.replace("http://localhost:3000/login");
    }else{
        console.log("erro");
    }

}