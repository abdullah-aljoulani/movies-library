`use strict`

const express = require('express');
const cors = require("cors");

const app = express()

app.use(cors())




app.listen(3000 , () => console.log("Hello from movie library"))


function Movies(title, poster_path, overview) {
    this.title = title
    this.poster_path = poster_path
    this.overview = overview
}



app.get("/", (req, res) => {
    const data = require("./Movie Data/data.json");
    let newMovie = new Movies(
        data.title , data.poster_path ,data.overview
    )
    res.send(newMovie)
})


app.get("/favorite",(req,res)=>{
    let str = "Welcome to Favorite Page";
    res.status(200).send(str);

})

app.get("*",(req,res)=>{
    let str3= "page not found error"
        res.status(404).send(str3)
    })


app.get("*",(req,res)=>{
let str2= "Sorry, something went wrong"
    res.status(500).send(str2)
})
