const hearts = document.querySelectorAll('.likes-heart');
const containar = document.querySelector('#mgas');
const postElemente = document.querySelector('.posts')


async function getposts(){
    try{
        const resultado = await fetch("http://localhost:3000/get-posts-with-comments",{
            method: "GET",
            credentials: "include"
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function likePost(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch("http://localhost:3000/like-post",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function dislikePost(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch("http://localhost:3000/dislike-post",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function likeComment(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch("http://localhost:3000/like-comment",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function dislikeComment(id_post){
    const data ={
        id_post : id_post
    }
    try{
        const resultado = await fetch("http://localhost:3000/dislike-comment",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

const content = document.querySelector("#mgas");

async function placepost(){
        

        const [posts, commentss, commentArea, divExcluir] = await getViewPost();
       
        const {resultados} = await getposts();
        if(posts == -1 || commentss == -1 || commentArea == -1 || divExcluir == -1){
            return;
        }
        
        
        if(resultados == undefined){
            const semResposta = document.createElement("div");
            semResposta.style.backgroundColor = "#001027";
            semResposta.style.display = "flex";
            semResposta.style.justifyContent = "center";
            semResposta.style.alignItems = "center";
            semResposta.style.height = "70vh";
            semResposta.style.width = "100%";
            semResposta.innerHTML = "<h2 style='color: white;'>Não há posts...</h2>";
            content.appendChild(semResposta);
            return;
        }

        for(i = resultados.length - 1; i >= 0; i--){
            //postsarea
            const {post_comments} = resultados[i];
            const {post} = post_comments;
            const {comments} = post_comments;

            const donoNome = await verifyCookie();
            const donoPost = post.p_nome == donoNome[0].nome? true : false;

            const postsClone = posts.cloneNode(true);
            const btnComentar = postsClone.querySelector(".btnComentarios");
            const btnPostComentar = postsClone.querySelector(".btnComentar");
            const btnExcluir = postsClone.querySelector(".btnExcluirPost")

            const userTag = postsClone.childNodes[3]
            userTag.childNodes[3].textContent = post.p_nome;

            if(post.p_foto_de_perfil == null){
                userTag.childNodes[1].src = "/img/princiapal.jpeg";
            } else{
                userTag.childNodes[1].src = post.p_foto_de_perfil;
            }

            const postContent = postsClone.childNodes[5];
            postContent.childNodes[1].textContent = post.p_mensagem;

            console.log(postContent.childNodes)
            if(post.p_imagem == "null" || post.p_imagem == null){
                postContent.childNodes[3].style.display = "none";
            }else{
                postContent.childNodes[3].src = post.p_imagem;
            }

            const divlike = postContent.childNodes[5];
            

            divlike.childNodes[7].textContent = comments.length

            divlike.childNodes[1].addEventListener("click", async (e)=>{

                if(e.src = "public/img/empty-heart.png"){
                    try{
                        const ressul = await likePost(post.p_id_post);
    
                        if(ressul == -1) window.location.replace("http://localhost:3000/login")
    
                        const {resultado} = ressul;
                        divlike.childNodes[1].src = "/img/filled-heart.png";
                        divlike.childNodes[3].textContent = resultado.p_curtidas;
                        if(resultado == -1){
                            divlike.childNodes[1].src = "/img/empty-heart.png";
                            const {resultado} = await dislikePost(post.p_id_post);
                            divlike.childNodes[3].textContent = resultado.p_curtidas;
                            console.log("dislike ", resultado);
                    }
                    }catch{
                        await fetch("http://localhost:3000/login");
                    }
                    
                }
            });
    
            divlike.childNodes[3].textContent = post.p_curtidas
    
            if(post.p_liked == "TRUE"){
                divlike.childNodes[1].src = "/img/filled-heart.png"
            }
        

            //END postsarea

            //pcomentsarea  
            if(comments.length >= 1){
                for(p = comments.length - 1; p >= 0; p--){
                    
                    const commentsClone = commentss.cloneNode(true);
    
                    const userTagComments = commentsClone.childNodes[1];
                    const contentComments = commentsClone.childNodes[3];
                    const comment = comments[p];

                    const donoComntario = comment.p_nome == donoNome[0].nome? true : false;

                    userTagComments.childNodes[3].textContent = comment.p_nome;
                    
                    if(comment.p_foto_de_perfil == null){
                        userTagComments.childNodes[1].src = "/img/princiapal.jpeg";
                    } else{
                        userTagComments.childNodes[1].src = comment.p_foto_de_perfil;
                    }
                    
                    contentComments.childNodes[1].textContent = comment.p_mensagem;
                    
                    const divlikeComments = contentComments.childNodes[3];
                    const btnExcluirComentario = divlikeComments.querySelector(".btnExcluirComentario");
                   
                        if(comments[p].p_liked == "TRUE"){
                            divlikeComments.childNodes[1].src = "/img/filled-heart.png"
                        }
    
                        divlikeComments.childNodes[1].addEventListener("click", async (e)=>{
                            
                            if(e.src = "public/img/empty-heart.png"){
                                try{
    
                                    const ressul = await likeComment(comment.p_id_comentario);
                                    
                                    if(ressul == -1) window.location.replace("http://localhost:3000/login")
                
                                    const {resultado} = ressul;
                                    divlikeComments.childNodes[1].src = "/img/filled-heart.png";
                                    divlikeComments.childNodes[3].textContent = resultado.p_curtidas;
                                    if(resultado == -1){
                                        divlikeComments.childNodes[1].src = "/img/empty-heart.png";
                                        const {resultado} = await dislikeComment(comment.p_id_comentario);
                                        divlikeComments.childNodes[3].textContent = resultado.p_curtidas;
                                        console.log("dislike ", resultado);
                                }
                                }catch{
                                    window.location.replace("http://localhost:3000/login")
                                }
                                
                            }
                        });
    
                    divlikeComments.childNodes[3].textContent = comment.p_curtidas;
                    
                    contentComments.style.display = "flex";
                    
                    if(donoComntario){
                        btnExcluirComentario.addEventListener("click", () => {
                            const divExcluirComentario = divExcluir.cloneNode(true);

                            const negarExclusao = divExcluirComentario.querySelector("#negarExclusao");
                            negarExclusao.addEventListener("click", () =>{
                                document.querySelector("#placeAbove").removeChild(document.querySelector("#placeAbove").childNodes[0])
                                document.querySelector("main").style.filter = "blur(0px)";
                            });

                            divExcluirComentario.querySelector(".comfirmar").childNodes[1].textContent = "Deseja deletar este Comntario?";

                            const confirmarExclusao = divExcluirComentario.querySelector("#confirmarExclusao");
                            confirmarExclusao.addEventListener("click", async () => {
                                const deletou = deletarComentario(comment.p_id_comentario);
                                if(deletou == -1){
                                    console.log("erro ao deletar o post");
                                }else{
                                    window.location.reload();
                                }
                            });
            
                            document.querySelector("#placeAbove").append(divExcluirComentario);
                            document.querySelector("main").style.filter = "blur(4px)";
                        });
                    }else{
                        btnExcluirComentario.remove();
                    }
                    
                    
                    postContent.childNodes[9].appendChild(commentsClone);
                }
                btnComentar.addEventListener("click", ()=>{
                    
                    if(postContent.childNodes[9].style.height == "35vh"){
                        postContent.childNodes[9].style.height = "0px";
                    }else{
                        const consultarCommentArea = document.querySelector(".comment-area");
                        if(consultarCommentArea != undefined){
                             consultarCommentArea.parentElement.style.height = "0px";
                            consultarCommentArea.parentElement.removeChild(consultarCommentArea);
                        }
                        postContent.childNodes[9].style.height = "35vh";
                    }
                });
            }else{
                btnComentar.disabled = true;
                btnComentar.style.opacity = ".5";
                divlike.childNodes[5].style.opacity = ".5";
                divlike.childNodes[7].style.opacity = ".5";
            }

            btnPostComentar.addEventListener('click', async function tirarComentario(){
                const commentAreaa = commentArea.cloneNode(true);
                if(postContent.childNodes[7].style.height == "35vh"){
                    postContent.childNodes[7].style.height = "0px";
                    const consultarCommentArea = document.querySelector(".comment-area");
                    consultarCommentArea.parentElement.removeChild(consultarCommentArea);
                }else{
                    const consultarCommentArea = document.querySelector(".comment-area");
                    if(consultarCommentArea != undefined){
                        consultarCommentArea.parentElement.style.height = "0px";
                        consultarCommentArea.parentElement.removeChild(consultarCommentArea);
                    }
                    postContent.childNodes[9].style.height = "0px";
                    postContent.childNodes[7].style.height = "35vh";

                    await createCommnteryComander(commentAreaa, post.p_id_post);

                    postContent.childNodes[7].appendChild(commentAreaa);
                    
                }
            });
            if(donoPost){
                btnExcluir.addEventListener("click", () => {

                    const confirmarExclusao = divExcluir.querySelector("#confirmarExclusao");
                    confirmarExclusao.addEventListener("click", async () => {
                        const deletou = deletarPost(post.p_id_post);
                        if(deletou == -1){
                            console.log("erro ao deletar o post");
                        }else{
                            window.location.reload();
                        }
                    });
    
                    document.querySelector("#placeAbove").append(divExcluir);
                    document.querySelector("main").style.filter = "blur(4px)";
                });
                
            } else{
                btnExcluir.remove();
            }

           
            //END commentsarea
            content.appendChild(postsClone);
        
    
    }
}

placepost()

async function deletarPost(id_post) {
    const data = {
        id_post : id_post
    };

    try{
        await fetch("http://localhost:3000/deletar-post", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
        return 1;

    }catch(err){
        return -1;
    }
}

async function getViewPost(){
    try{
        const resposta = await fetch("http://localhost:3000/viewPostsUsuario");
        const responseHTML = await resposta.text();

        const parseToHTML = document.createElement('div');
        parseToHTML.innerHTML = responseHTML;

        const posts = parseToHTML.querySelector(".post");
        const comments = parseToHTML.querySelector(".comments");
        const commentArea = parseToHTML.querySelector(".comment-area");
        const postArea = parseToHTML.querySelector(".post-area");

        const responseExcluir = await fetch("http://localhost:3000/viewExcluir");
        const responseHTMLExcluir = await responseExcluir.text();

        const parseToHTMLExcluir = document.createElement('div');
        parseToHTMLExcluir.innerHTML = responseHTMLExcluir;

        const divExcluir = parseToHTMLExcluir.querySelector(".comfirmarContent");
        divExcluir.querySelector(".comfirmar").childNodes[1].textContent = "Deseja deletar este post?";

        const negarExclusao = divExcluir.querySelector("#negarExclusao");
            negarExclusao.addEventListener("click", () =>{
                document.querySelector("#placeAbove").removeChild(document.querySelector("#placeAbove").childNodes[0])
                document.querySelector("main").style.filter = "blur(0px)";
            });



        return [posts, comments, commentArea, divExcluir, postArea];
    }catch(err){
        return [-1, -1, -1, -1, -1];
    }
    
}

async function postArea(){
    var nomem = "";
    const {nome} = await verifyCookie();
    nomem = nome;

    const content = document.querySelector("#postArea-post");
    
    if(nomem != ""){
        const resposta = await fetch("http://localhost:3000/viewPostsUsuario");
        const responseHTML = await resposta.text();
        
        const parseToHTML = document.createElement('div');
        parseToHTML.innerHTML = responseHTML;

        const postAreaThing = parseToHTML.querySelector(".post-area");
        const postAreaSubmit = postAreaThing.querySelector("[type='submit']");
        postAreaSubmit.addEventListener("click", async () => {
            const postAreaTextArea = postAreaThing.querySelector("TextArea");
            const postAreaInputImage = postAreaThing.querySelector("#imagePlacePosting");
            if(postAreaTextArea.value.trim() == ""){
                return;
            }

            var img = "";
            if((postAreaInputImage.src + "") != "http://localhost:3000/comunidade"){
                img = postAreaInputImage.src;
            }else{
                img = "null";
            };

            const data = {
                mensagem : postAreaTextArea.value,
                imagem : img
            };
            
            const response = await postPost(data);
            if(response != -1){
                window.alert("Post mandado");
                window.location.reload();
            }
        });


        content.appendChild(postAreaThing)

    }else(
        console.log("não logado")
    )

}
postArea();

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

async function postPost(data){
    try {
        const resultado = fetch("http://localhost:3000/post-post",{
            method: "POST",
            credentials: "include",
            headers:{
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        })

    }catch(err){
        return -1
    }
}



async function deletarComentario(id_comentario) {
    const data = {
        id_comentario : id_comentario
    };
    
    try{
        await fetch("http://localhost:3000/deletar-comentario", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });
        return 1;

    }catch(err){
        return -1;
    }
}


async function createCommnteryComander(consultarCommentArea, p_id_post){
    const btn = consultarCommentArea.childNodes[3];
    const textArea = consultarCommentArea.childNodes[1];
    
    document.addEventListener('scroll', function registerScroll ()  {
        const {y} = consultarCommentArea.getBoundingClientRect();
        if(y <= -100 || y >= 700){
            consultarCommentArea.parentElement.style.height = "0px";
            consultarCommentArea.remove();
            document.removeEventListener('scroll', registerScroll);
        }
        console.log(y);
    });

    btn.addEventListener("click", async ()=>{
        const data = 
        {
                id_post : p_id_post,
                mensagem : textArea.value
        };
    
        const treatReturn = postComment(data);
    
        if(treatReturn == -1){
                    console.log("o comentario não foi postado");
                }else{
    
                    window.alert("MENSAGEM POSTADA");
                    window.location.reload();
                }
    });
}



async function postComment(data){
    try {
        fetch("http://localhost:3000/post-comment",{
            method: "POST",
            credentials: "include",
            headers:{
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        })

    }catch(err){
        return -1
    }
}
