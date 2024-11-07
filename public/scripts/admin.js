const section_right = document.querySelector("section.right")

var place_now = "equipes";

document.querySelector("#equipe-place-button").addEventListener("click", ()=>{
    place_now = "equipes";
    select_palace_pag()
})

document.querySelector("#banimentos-place-button").addEventListener("click", ()=>{
    place_now = "banimentos";
    select_palace_pag()
})

function select_palace_pag(){
    var str_add = "";
    switch(place_now){
        case "equipes":
            str_add = `<h1>EQUIPE</h1>
                       <div class="box-for-admins">
                       </div>`
            section_right.innerHTML = str_add;
            putinformation();
            break;
        case "banimentos":
            str_add = `<h1>BANIMENTOS</h1>
                       <div class="box-for-banimentos">
                       </div>`
            section_right.innerHTML = str_add;
            banimentos();
            
    }
    
}

select_palace_pag()

async function getadmins(){
    try{
        const resultado = await fetch("http://localhost:3000/administration/get-admins",{
            method: "GET",
            credentials: "include"
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function verifyCookie(){
    try {
        const res = await fetch("http://localhost:3000/get-usuario", {
            method: "GET",
            credentials: "include"
        });

        if (res.status === 401) {
            return -1; 
        }

        if (!res.ok) {
            throw new Error('Resposta da rede não foi ok'); 
        }

        // Retorna a resposta convertida para JSON
        const resul = await res.json()
        return resul[0];

    } catch (err) {
        console.log(err)
        return -1; // Retorna null em caso de erro
    }  
}

async function rebaixar(id) {

    const data = {
        id_admin: id
    }
    
    const email = await fetch("http://localhost:3000/administration/downgrade-admins", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(data)
    });

    const {resposta} = await email.json()

    return resposta
}

async function aumento(id) {

    const data = {
        nome_or_gmail: id
    }
    
    const email = await fetch("http://localhost:3000/administration/upgrade-admins", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(data)
    });

    const {resposta} = await email.json()

    return resposta
    
}




async function putinformation(){
    const box_for_admins = document.querySelector(".box-for-admins");

    const {resposta} = await getadmins();
    const verifyCookier = await verifyCookie();

    var str_html = "";
    var foto = "";
    var str_component = "";
    const id_admin = verifyCookier.id_usuario;

    resposta.forEach(element => {
        const nome = element.nome;
        const gmail = element.gmail;
        const id = element.id_usuario;
       
        const foto_de_perfil = element.foto_de_perfil;
        foto = foto_de_perfil;
        
        if(foto_de_perfil == null || foto_de_perfil == "null"){
            foto = "http://localhost:3000/img/princiapal.jpeg"
        }
        if(id_admin == 24 && id != 24){
            var str_component = `<div class="admin-box">
                                    <img src="${foto}" alt="">
                                    <p>${nome}</p>
                                    <p>${gmail}</p>
                                    <button value="${id}">rebaixar</button>
                                </div>`;
        }else{
            var str_component = `<div class="admin-box">
                                    <img src="${foto}" alt="">
                                    <p>${nome}</p>
                                    <p>${gmail}</p>
                                </div>`;
        }
        
        str_html += str_component;
    });

    if(id_admin == 24){
        str_html += `<div class="add-admin">
                        <input type="text" placeholder="email ou nome da pessoa a virar admin"></input>
                        <button>add admin</button>
                    </div>
                    `
    }

    box_for_admins.innerHTML = str_html;

    if(id_admin == 24){
     
        for(i=0; i < box_for_admins.childNodes.length; i++){
            if(box_for_admins.childNodes[i].childNodes.length > 7){
                
                const id_admin_button = box_for_admins.childNodes[i].childNodes[7].value;
                box_for_admins.childNodes[i].childNodes[7].addEventListener("click", async (eve)=>{
                    const response = await rebaixar(id_admin_button);
                    window.location.reload();
                })
                
            }
        }

        document.querySelector(".add-admin").childNodes[3].addEventListener("click", async()=>{
            const response = await aumento(document.querySelector(".add-admin").childNodes[1].value);
            window.location.reload();
        })
    }
}

async function get_bans(){
    try {
        const res = await fetch("http://localhost:3000/administration/get-banned-users", {
            method: "GET",
            credentials: "include"
        });

        if (res.status === 401) {
            return -1; 
        }

        if (!res.ok) {
            throw new Error('Resposta da rede não foi ok'); 
        }

        // Retorna a resposta convertida para JSON
        const resul = await res.json()
        return resul;

    } catch (err) {
        console.log(err)
        return -1; // Retorna null em caso de erro
    }  
}

async function unban(id) {

    const data = {
        id_usuario: id
    }
    
    const email = await fetch("http://localhost:3000/administration/unban-user", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(data)
    });

    const {resposta} = await email.json()

    return resposta
}

async function ban(nome_or_gmail, id_administrador, motivo) {

    const data = {
        nome_or_gmail: nome_or_gmail, 
        id_administrador: id_administrador, 
        motivo: motivo
    }
    
    const email = await fetch("http://localhost:3000/administration/ban-user", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(data)
    });

    const {resposta} = await email.json()

    return resposta
}

async function banimentos(){
    const box_for_banimentos = document.querySelector(".box-for-banimentos");

    const {resposta} = await get_bans();
    const verifyCookier = await verifyCookie();
    const id_admin = verifyCookier.id_usuario;

    var str_html = "";
    var foto = "";
    var str_component = "";

    resposta.forEach(element => {
        const nome = element.p_nome;
        const admin_nome = element.p_admin;
        const id = element.p_id_usuario;
        const motivo = element.p_motivo;
       
        const foto_de_perfil = element.p_foto_de_perfil;
        foto = foto_de_perfil;
        
        if(foto_de_perfil == null || foto_de_perfil == "null"){
            foto = "http://localhost:3000/img/princiapal.jpeg"
        }
    
            var str_component = `<div class="admin-box">
                                    <img src="${foto}" alt="">
                                    <p>BANIDO: ${nome}</p>
                                    <p>ADMIN: ${admin_nome}</p>
                                    <p>MOTIVO: ${motivo}</p>
                                    <button value="${id}">desbanir</button>
                                </div>`;

        
        str_html += str_component;
    });

    
        str_html += `<div class="add-admin">
                        <input type="text" placeholder="email ou nome da pessoa a ser banida"></input>
                        <input type="text" placeholder="motivo para banir"></input>
                        <button>banir</button>
                    </div>
                    `
    

    box_for_banimentos.innerHTML = str_html;

    for(i=0; i < box_for_banimentos.childNodes.length; i++){
        if(box_for_banimentos.childNodes[i].childNodes.length > 7){
            
            const id_banned_button = box_for_banimentos.childNodes[i].childNodes[9].value;
            box_for_banimentos.childNodes[i].childNodes[9].addEventListener("click", async (eve)=>{
                const response = await unban(id_banned_button);
                window.location.reload()
                
            })
            
        }
    }

    document.querySelector(".add-admin").childNodes[5].addEventListener("click", async()=>{
        const nome_or_gmail = document.querySelector(".add-admin").childNodes[1].value;
        const motivo = document.querySelector(".add-admin").childNodes[3].value;
        const response = await ban(nome_or_gmail, id_admin, motivo);
        window.location.reload();
    })
}
