

const hearts = document.querySelectorAll('.likes-heart');
const containar = document.querySelector('#mgas');
const postElemente = document.querySelector('.post')


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
    try{
        const resultado = await fetch("http://localhost:3000/like-post",{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(id_post)
        });

        return await resultado.json();

    }catch(err){
        console.log("erro: ", err); 
        return -1
    }
}

async function placepost(){
    const {resultados} = await getposts();
    for(i = resultados.length - 1; i >= 0; i--){
        
        const {post_comments} = resultados[i];
        const {post} = post_comments;
        const {comments} = post_comments;
        
        const posts = postElemente.cloneNode(true);
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

        try{
            if(post.p_liked == true){
                divlike.childNodes[1].src = "/img/filled-heart.png"
            }

        }catch{

        }
        //parei aqui
        divlike.childNodes[1].addEventListener("click", async (e)=>{
            console.log(e);
            if(e.src = "public/img/empty-heart.png"){
                divlike.childNodes[1].src = "/img/filled-heart.png";
                const likedPost = await likePost();
                divlike.childNodes[3].textContent = likedPost.p_curtidas;
                console.log(likedPost);
            }
        })

        divlike.childNodes[3].textContent = post.p_curtidas

        const commentsElemente = content.childNodes[7];
        

        if(comments.length >= 1){
            for(p = comments.length - 1; p >= 0; p--){
                const commentsClone = commentsElemente.cloneNode(true);
                commentsClone.style.display = "flex";
                content.appendChild(commentsClone);

                const userTagComments = commentsClone.childNodes[1]
                const contentComments = commentsClone.childNodes[3]
                userTagComments.childNodes[3].textContent = comments[p].p_nome

                if(comments[p].p_imagem == null){
                    userTagComments.childNodes[1].src = "/img/princiapal.jpeg";
                } else{
                    userTagComments.childNodes[1].src = comments[p].p_mensagem;
                }

                contentComments.childNodes[1].textContent = comments[p].p_mensagem;

                if(comments[p].p_imagem == null){
                    contentComments.childNodes[3].style.display = "none";
                }else{
                    contentComments.childNodes[3].src = comments[p].p_imagem;
                }

                const divlikeComments = contentComments.childNodes[5];

                try{
                    if(comments[p].p_liked == true){
                        divlikeComments.childNodes[1].src = "/img/filled-heart.png"
                    }
        
                }catch{
        
                }

                divlikeComments.childNodes[3].textContent = comments[p].p_curtidas;

                
                console.log(divlikeComments.childNodes)


                console.log(comments[p])
            }
        }else{
            content.childNodes[7].remove()
        }
        
        
        
       
        

        posts.style.display = "flex";
        containar.appendChild(posts);
    }
}

placepost()


// click heart toggle
hearts.forEach((h)=>{
    h.addEventListener('click', ()=>{
        h.src = h.src == "http://localhost:3000/img/empty-heart.png"? "/img/filled-heart.png" : "/img/empty-heart.png"
    });
});