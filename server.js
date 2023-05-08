`use strict`

const express = require('express');
const cors = require("cors");

const app = express()

app.use(cors())

const PORT = 3000;

const axios = require('axios');
require('dotenv').config();

app.use(cors());

app.get("/", homeHandler);
app.get("/favorite", favoriteHandler)
app.get("/trending", trendingHandler);
app.get('/search', searchHandler);
app.get('/idd', movieIdHandler);
app.get('/person', personHandler);



app.get("*", defaultHandler);

app.use(errorHandler);




function Movies(id,title,release_data ,poster_path, overview) {
    this.id=id
    this.title = title
    this.release_data=release_data
    this.poster_path = poster_path
    this.overview = overview
}

const data = require ("./Movie Data/data.json")

function homeHandler(req,res){
    let newMovie = new Movies(
        data.title , data.poster_path ,data.overview
    )
    res.send(newMovie)
}

function favoriteHandler(req,res){
    let str = "Welcome to Favorite Page"
    res.status(200).send(str);
}

function defaultHandler(req,res){
    let str3 = "page not found error"
    res.status(404).send(str3)
}


const APIKEY = process.env.APIkey;

function trendingHandler(req, res) {
    try {
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}`;
        axios.get(url)
            .then((d) => {
                let mapResult = d.data.results.map((newItem) => {
                    let singleFilm = new Movies(newItem.id, newItem.title, newItem.release_date, newItem.poster_path, newItem.overview)
                    return singleFilm;
                })
                res.send(mapResult)
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    }

    catch (error) {
        errorHandler(error, req, res)
    }

}

function searchHandler(req, res) {
    try {
        const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=spider-man&page=1&include_adult=false`
        axios.get(url2)
            .then((b) => {
                // console.log(b);
                let mapResult2 = b.data.results.map((newItem2) => {
                    // console.log(newItem2);
                    let searchFilm = new Movie(newItem2.id, newItem2.title, newItem2.release_date, newItem2.poster_path, newItem2.overview)
                    return searchFilm;
                })
                // console.log(mapResult2);
                res.status(200).json(mapResult2)

            })


            .catch((error) => {
                // res.status(500).send(error)
            })

    }
    catch (error) {
        errorHandler(error, req, res)
    }
}


function movieIdHandler(req, res) {
    try {
        const url3 = `https://api.themoviedb.org/3/movie/785084/videos?api_key=${APIKEY}&language=en-US`
        axios.get(url3)
            .then((c) => {
                // console.log(c);
                let mapResult3 = c.data.results.map((newItem3) => {
                    // console.log(newItem3);
                    let movieId = new Movies(newItem3.id, newItem3.title, newItem3.release_date, newItem3.poster_path, newItem3.overview)
                    return movieId;
                })
                // console.log(mapResult3);
                res.status(200).json(mapResult3)
            })


            .catch((error) => {
                // res.status(500).send(error)
            })

    }
    catch (error) {
        errorHandler(error, req, res)
    }
}

function personHandler(req, res) {
    try {
        const url4 = `https://api.themoviedb.org/3/person/976?api_key=${APIKEY}&language=en-US`
        axios.get(url4)
            .then((c) => {
                // console.log(c);
                // let mapResult3 = c.data.results.map((newItem3) => {
                //     // console.log(newItem3);
                //     let movieId = new Movie(newItem3.id, newItem3.title, newItem3.release_date, newItem3.poster_path, newItem3.overview)
                //     return movieId;
                res.send(c.data)
            })
        // console.log(mapResult3);
        // res.status(200).json(mapResult3)

        .catch ((error) => {
            // res.status(500).send(error)
        })
    }

    catch (error) {
    errorHandler(error, req, res)
}
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        massage: error,

    }
    res.status(500).send(err)
}


app.listen(PORT, () => {
    console.log("listening to 3000");
})
