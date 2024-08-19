const hearts = document.querySelectorAll('.likes-heart');



// click heart toggle
hearts.forEach((h)=>{
    h.addEventListener('click', ()=>{
        h.src = h.src == "http://localhost:3000/img/empty-heart.png"? "/img/filled-heart.png" : "/img/empty-heart.png"
    });
});