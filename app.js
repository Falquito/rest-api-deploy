const express = require('express')
const movies = require('./movies.json')
const crypto=require('node:crypto')
const cors=require('cors')

//metodos normales: GET/HEAD/POST
//metodos complejos: PUT/PATCH/DELETE

//CORS PRE-Flight
//OPTIONS
const ACCEPTED_ORIGINS=[
    'http://localhost:8080',
    'http://localhost:5000'
]
const z = require('zod')
const { validateMovie,validatePartialMovie } = require('./schemes/movies')

const app = express()
app.use(express.json())
app.use(cors())
app.disable('x-powered-by')

//Un endpoint es un path en donde tenemos un recurso
app.get('/',(req,res)=>{
    res.json({message:'hola mundo'})
})


app.get('/movies/:id',(req,res)=>{ //path to regexp /movies/:id es un segmento dinamico, son los paramtertos de la url
    const {id} = req.params
    const movie = movies.find(movie => movie.id==id)
    if(movie) return res.json(movie)
        res.status(404).json({message:'movie not found'})
    
})





app.delete('/movies/:id',(req,res)=>{
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin',origin)
    }
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id==id)
    if(movieIndex==-1){
        return res.status(404).json({message:"movie not found"})
    }
    movies.splice(movieIndex,1)
    return res.json({message:"movie deleted"})
})
//todos los recursos que sean movies se identifican con /movies
app.get('/movies',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    const {genre} = req.query
    if(genre){
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.post('/movies',(req,res)=>{
    const result = validateMovie(req.body)
    if(result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    //en base de datis
    const newMovie={
        id:crypto.randomUUID(),
        ...result.data
    }
    //esto no seria REST, porque se guarda en memoria el body
    
    movies.push(newMovie)
    
    res.status(201).json(newMovie)
})




app.patch('/movies/:id',(req,res)=>{
    const {id} = req.params
    const result = validatePartialMovie(req.body)
    if(result.error){
        return res.status(400).json({error:JSON.parse(result.error.message)})
    }
    const movieIndex = movies.findIndex(movie => movie.id==id)
    
    if(movieIndex==-1) return res.status(404).json({message:"Movie not found"})
        const updateMovie = {
    ...movies[movieIndex],
    ...result.data
}
movies[movieIndex] = updateMovie

return res.json(updateMovie)

})




app.options('/movies/:id',(req,res)=>{
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin',origin)
        res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE')
    }
    res.json({message:'todo god'})
})
const PORT = process.env.PORT ?? 5000

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT} http://localhost:${PORT}`)
})