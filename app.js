import express, { json } from 'express'
// import movies from './movies.json' //ESTO NO ES VALIDO, no se pueden importar json en ESModules asi tal cual
import { moviesRouter } from './routes/movies.js'


//ASi se leeria un json en ESModules
// import fs from 'node:fs'

// const movies = JSON.parse(fs.readFileSync('./movies.json','utf-8')) 

//COmo leer un json recomendado por ahora en ESModules





import cors from 'cors'

//metodos normales: GET/HEAD/POST
//metodos complejos: PUT/PATCH/DELETE

//CORS PRE-Flight
//OPTIONS
const ACCEPTED_ORIGINS=[
    'http://localhost:8080',
    'http://localhost:5000'
]
import z from 'zod'
import { assert } from 'node:console'

const app = express()
app.use(json())
app.use(cors())
app.disable('x-powered-by')

//Un endpoint es un path en donde tenemos un recurso
app.use('/movies',moviesRouter)
app.options('/movies/:id',(req,res)=>{
    const origin = req.header('origin')
    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin',origin)
        res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE')
    }
    res.json({message:'todo god'})
})
const PORT = process.env.PORT ?? 3000

app.listen(PORT,()=>{
    console.log(`Server listening on ${PORT} http://localhost:${PORT}`)
})