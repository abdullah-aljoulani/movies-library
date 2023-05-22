`use strict`

const express = require('express');
const cors = require("cors");

const app = express()

const axios = require('axios');
require('dotenv').config();

const pg = require("pg")

const APIKEY = process.env.APIkey;

app.use(cors())

app.use(express.json());

const PORT = process.env.PORT || 3001;

const client = new pg.Client(process.env.DBURL)

app.get("/", homeHandler);

app.get("/favorite", favoriteHandler)


app.get("/trending", trendingHandler);

app.get('/search', searchHandler);

app.get('/idd', movieIdHandler);

app.get("/getMovies", getMoviewHandler);


app.post("/getMovies", postMovieHandler);

app.get("/getMovies/:newid", getsecMoviewHandler);

app.delete("/getMovies/:id", deletMovieHandler);

app.put("/getMovies/:iddd", UPDateMovieHandler);

app.get('/addMovie',getMovieHandler)
app.post('/addMovie',addMovieHandler)
// app.put('/addMovie',updateMoviesHandler)
app.delete('/addMovie/:id',deleteMoviesHandler)

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

function Movie(title,id,overview,poster_path,vote_average,vote_count){
    this.title = title;
    this.id = id;
    this.overview = overview;
    this.poster_path = poster_path;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
    Movie.all.push(this)
}

Movie.all=[];

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
                errorHandler(error, req, res)
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
                errorHandler(error, req, res)
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
        .catch ((error) => {
            errorHandler(error, req, res)
        })
    }
    catch (error) {
    errorHandler(error, req, res)
}
}

function getMoviewHandler(req, res) {
    const sql = `SELECT * from firstMOV`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows)
        })
        .catch((err) => {
            errorHandler(err, req, res)
        })
}

function postMovieHandler(req, res) {
    const mov = req.body;
    const sql = `INSERT INTO firstMOV (title,release_date,poster_path,overview)
    VALUES ('${mov.title}','${mov.release_date}','${mov.poster_path}','${mov.overview}',') RETURNING *;`
    client.query(sql)
        .then((data) => {
            res.send(data.rows)
        })
        .catch ((error) => {
            res.status(500).send(error)
        })
}

function deletMovieHandler(req, res) {
    const newID = req.params.id;
    const sql = `DELETE FROM firstMOV WHERE id=${newID} RETURNING *;`;
    client.query(sql)
        .then((data) => {
            const sql = `SELECT * from firstMOV`;
            client.query(sql)
                .then((data) => {
                    res.send(data.rows)
                })
                .catch((err) => {
                    errorHandler(err, req, res)
                })
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

function getsecMoviewHandler(req, res) {
    const secID = req.params.newid
    const sql = `SELECT * from firstMOV WHERE id=${secID}`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows)
        })
        .catch((err) => {
            errorHandler(err, req, res)
        })
}

function UPDateMovieHandler(req,res){
    const therdID =req.params.iddd;
    const show = req.body
    const sql = `UPDATE firstMOV SET comment ='${show.comment}' WHERE id =${therdID} RETURNING *`;
    client.query(sql)
    .then((data) => {
        const sql = `SELECT * from firstMOV`; 
        client.query(sql)
            .then((data) => {
                res.send(data.rows)
            })
            .catch((err) => {
                errorHandler(err, req, res)
            })
    })
    .catch((err) => {
        errorHandler(err, req, res);
    })
}

function getMovieHandler(req,res){
    Movie.all=[];
    const sql = `SELECT * from firstMOV`
    client.query(sql).then(result =>{
        result.rows.map(item => new Movie(item.title,item.movies_id,item.overview,item.poster_path,item.vote_average,item.vote_count))
        res.status(200).json({
            code : 200,
            movie : Movie.all
        })
        }
        ).catch(err => errorHandler(err,req,res))
    }

function addMovieHandler(req,res){
    const userInput = req.body;
    const sql = `INSERT INTO firstMOV(title , movies_id , overview , poster_path , vote_average , vote_count)
    VALUES($1,$2,$3,$4,$5,$6) RETURNING *`
    const sqlValues = [userInput.title , userInput.id ,userInput.overview 
        ,userInput.poster_path , userInput.vote_average , userInput.vote_count]

        client.query(sql , sqlValues).then(result => {
            res.status(201).json(result.rows)
        }).catch(err => errorHandler(err,req,res))
}

// function updateMoviesHandler(req,res){
//     const id = req.params.id;
//     const userInput = req.body;

//     const sql = `update movies set `

// }

function deleteMoviesHandler(req,res){
    const id = req.params.id;

    const sql = `delete from firstMOV where id =${id}`;

    client.query(sql).then(result =>{
        res.status(204).json(result.rowCount)
    }).catch(err => errorHandler(err,req,res))
}

function errorHandler(error, req, res) {
    const err = {
        status: 500,
        massage: error,
    }
    res.status(500).send(err)
}

client.connect()
    .then(
        app.listen(PORT, () => {
            console.log(`listening to ${PORT}`);
        }
    )
    )
    .catch((err) => {
        console.log(err)
    })