


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


async function placepost(){
    const {resultados} = await getposts();
    const postElementes = postElemente.cloneNode(true);
    postElemente.remove();

    for(i = resultados.length - 1; i >= 0; i--){
        
        const {post_comments} = resultados[i];
        const {post} = post_comments;
        const {comments} = post_comments;
        
        const posts = postElementes.cloneNode(true);
        
        const userTag = posts.childNodes[1]
        userTag.childNodes[3].textContent = post.p_nome;
        
        if(post.p_foto_de_perfil == null){
            userTag.childNodes[1].src = "/img/princiapal.jpeg";
        } else{
            userTag.childNodes[1].src = post.p_foto_de_perfil;
        }

        const content = posts.childNodes[3];

        content.childNodes[1].textContent = post.p_mensagem
        if(post.p_imagem == null){
            content.childNodes[3].style.display = "none";
        }else{
            content.childNodes[3].src = post.p_imagem;
        }

        const divlike = content.childNodes[5];

        
        if(post.p_liked == "TRUE"){
            divlike.childNodes[1].src = "/img/filled-heart.png"
        }
        
        
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

        const commentsElemente = content.childNodes[9];

        const commentSection = content.childNodes[7];

        const commentArea = commentSection.childNodes[1].cloneNode(true);
    
        commentSection.childNodes[1].remove();

       

        divlike.childNodes[5].addEventListener('click', async () => {

            const resposta = await verifyCookie();
            if(resposta === -1) return window.location.replace("http://localhost:3000/login");
            
            if(commentSection.childNodes.length > 2){
                return commentSection.childNodes[2].remove();    
            }

            if(document.querySelector("#posting-massage")){
                document.querySelector("#posting-massage").remove()
            }

            const content_comment =  commentArea.childNodes[3];
                const formPosting_comment = content_comment.childNodes[1];
                    const message_comment = formPosting_comment.elements.mensage;
                    const submit_comment = formPosting_comment.elements[1];

            
            
            submit_comment.addEventListener('click', () => {

                const data = {
                    id_post : post.p_id_post,
                    mensagem : message_comment.value
                };

                const treatReturn = postComment(data);

                if(treatReturn == -1){
                    console.log("o comentario não foi postado");
                }else{

                    window.alert("MENSAGEM POSTADA");
                    window.location.reload();
                }
            });
            
            
            commentSection.appendChild(commentArea);

            document.addEventListener('scroll', function registerScroll ()  {
                const {y} = commentArea.getBoundingClientRect();
                if(y <= -100 || y >= 700){
                    commentSection.childNodes[2].remove();
                    document.removeEventListener('scroll', registerScroll);
                }
                console.log(y);
            });

            
            
      
        });

        
       
        
        //BREAK

        

        if(comments.length >= 1){
            for(p = comments.length - 1; p >= 0; p--){
                const commentsClone = commentsElemente.cloneNode(true);
                commentsClone.style.display = "flex";
                content.appendChild(commentsClone);

                const userTagComments = commentsClone.childNodes[1];
                const contentComments = commentsClone.childNodes[3];
                const comment = comments[p];
                userTagComments.childNodes[3].textContent = comment.p_nome;

                if(comment.p_foto_de_perfil == null){
                    userTagComments.childNodes[1].src = "/img/princiapal.jpeg";
                } else{
                    userTagComments.childNodes[1].src = comment.p_foto_de_perfil;
                }

                contentComments.childNodes[1].textContent = comment.p_mensagem;

                if(comment.p_imagem == null){
                    contentComments.childNodes[3].style.display = "none";
                }else{
                    contentComments.childNodes[3].src = comment.p_imagem;
                }

                const divlikeComments = contentComments.childNodes[5];
               
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
            }
        }
        
        
        posts.style.display = "flex";
        containar.appendChild(posts);
    }
}

placepost()

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

async function isLogged(){
    const resposta = await verifyCookie()
    if(resposta === -1) return;
    console.log("logado")
    const posting = document.querySelector("#posting-post");
    posting.style.display = "flex";

        const postDiv = posting.childNodes[1];

            const user_tag = postDiv.childNodes[1];
                const user_img = user_tag.childNodes[1];
                const user_name = user_tag.childNodes[3];
            
            const content = postDiv.childNodes[3];
                const formPosting = content.childNodes[1];
                    const message = formPosting.elements.mensage;
                    const image = formPosting.childNodes[3].childNodes[1];
                    const submit = formPosting.elements[2];



    const commenting = document.querySelector('#posting-massage');

        const user_tag_comment = commenting.childNodes[1];
            const user_img_comment = user_tag_comment.childNodes[1];
            const user_name_comment = user_tag_comment.childNodes[3];

        const content_comment =  commenting.childNodes[3];
            const formPosting_comment = content_comment.childNodes[1];
                const message_comment = formPosting_comment.elements.mensage;
                const submit_comment = formPosting_comment.elements[1];

        
              
    const { nome, foto_de_perfil } = resposta[0];

    user_name.textContent = nome;
    user_name_comment.textContent = nome;

    if(foto_de_perfil == null){
        user_img.src = "/img/princiapal.jpeg";
        user_img_comment.src = "/img/princiapal.jpeg";
        
    } else{
        user_img.src = foto_de_perfil;
        user_img_comment.src = foto_de_perfil;
    }



    submit.addEventListener('click', ()=>{
        try{
            const imagem = image.src == "http://localhost:3000/img/princiapal.jpeg"? "null" : image.src;
            const data = {
                mensagem: message.value, 
                imagem: imagem
            };

            postPost(data);

            window.alert("MENSAGEM POSTADA");

            window.location.reload();
        }catch(err){
            console.log("erro: ", err);
        }
    });

    
}

isLogged()
