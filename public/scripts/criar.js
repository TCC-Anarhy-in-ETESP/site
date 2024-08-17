
console.log("hello world")

//html elements
const imagem = document.querySelector("#imagem");
const imagemToReplace = document.querySelector("#imagemToReplace");
const form = document.querySelector("#formElements");
const nome = form.elements["name"];
const email = form.elements["email"];
const senha = form.elements["password"];
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


submit.addEventListener('click', async () =>{
    const data = { username: nome.value, 
        email: email.value,  
        password: senha.value, 
        imagem: imagemToReplace.src
    };

    console.log(data);

    try {
        const resultado = await fetch("http://localhost:3000/post-signin", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        });


    } catch (err) {
        console.log("erro: ", err); 
    }
    
})

/*module.exports = (req, res, next)=>{
    const {imagem} = req.body;
    console.log(imagem)
    

    try{
        const reader = new FileReader();

        reader.addEventListener('load', function(imagemGiven){
            const readerTargt = imagemGiven.target;
            console.log(readerTargt);
            req.imagemTarget = readerTargt;
        })
        reader.readAsDataURL(imagem);
        next();

    }catch(err){ res.status(500).send("erro: ", err)}
    
}*/
