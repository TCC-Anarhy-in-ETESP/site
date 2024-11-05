const box_for_admins = document.querySelector(".box-for-admins");

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

async function putinformation(){
    const {resposta} = await getadmins();
    var str_html = "";
    var foto = "";

    resposta.forEach(element => {
        const nome = element.nome;
        const gmail = element.gmail;
        const foto_de_perfil = element.foto_de_perfil;
        foto = foto_de_perfil;
        if(foto_de_perfil == null || foto_de_perfil == "null"){
            foto = "http://localhost:3000/img/princiapal.jpeg"
        }
        const str_component = `<div class="admin-box">
                                    <img src="${foto}" alt="">
                                    <p>${nome}</p>
                                    <p>${gmail}</p>
                                </div>`;

        str_html += str_component;
    });

    box_for_admins.innerHTML = str_html;

}
putinformation()