



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
    const resposta = await verifyCookie()
    if(resposta === -1) return

    const nav = document.querySelector("#userSapce")
    
    const { nome, foto_de_perfil } = resposta[0]
    console.log(resposta[0])

    const userLogBar = document.createElement("div");
    userLogBar.style.display = "flex";
    userLogBar.style.alignContent = "center";

    const userName = document.createElement("p");
    userName.classList.add("nav-link");
    userName.style.margin="0";
    userName.style.marginRight="2vw"
    userName.innerText = `${nome}`;

    const userPhoto = document.createElement("img");
    console.log(foto_de_perfil)
    userPhoto.classList.add("user-photo");
    userPhoto.src = "../img/henrique.jpeg"
    userPhoto.src = foto_de_perfil;

    userLogBar.appendChild(userName);
    userLogBar.appendChild(userPhoto);
  
    nav.replaceChildren(userLogBar);
}

logBar()



