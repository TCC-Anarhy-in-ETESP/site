
console.log("hello world")

//html elements
const imagem = document.querySelector("#imagem");
const imagemToReplace = document.querySelector("#imagemToReplace");
const form = document.querySelector("#formElements");
const nome = form.elements["name"];
const email = form.elements["email"];
const senha = form.elements["password"];
const senhaConfirm = form.elements["passwordConfirme"];
const imagemFile = form.elements["imagem"];
const submit = document.querySelector("#submit");

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



submit.addEventListener('click', async () =>{
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
            return;
        }else{
            window.location.replace("http://localhost:3000/login");
        }


    } catch (err) {
        console.log("erro: ", err); 
    }
    
})

