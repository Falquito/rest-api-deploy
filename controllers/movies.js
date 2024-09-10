import { movieModel } from "../models/movie.js"
import { validateMovie, validatePartialMovie } from '../schemes/moviesScheme.js'
const ACCEPTED_ORIGINS=[
    'http://localhost:8080',
    'http://localhost:5000'
]
export class MovieController{
    static async getAll(req,res){
        res.header('Access-Control-Allow-Origin','*')
        const {genre} = req.query
        const movies = await movieModel.getAll({genre})
        //que es lo que renderiza
        res.json(movies)
    }

    static async getById (req,res){
        const {id} = req.params
        const movie = await movieModel.getById({id})
        if(movie) return res.json(movie)
            res.status(404).json({message:'movie not found'})
    }

    static async create(req,res){
        const result = validateMovie(req.body)
        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }
        //en base de datis
        const newMovie= await movieModel.create({input:result.data})
        res.status(201).json(newMovie)
    }

    static async delete(req,res){
        const origin = req.header('origin')
        if(ACCEPTED_ORIGINS.includes(origin) || !origin){
            res.header('Access-Control-Allow-Origin',origin)
        }
        const {id} = req.params

        const result= await movieModel.delete({id})

        if(result==false){
            return res.status(404).json({message:"movie not found"})
        }

        return res.json({message:"movie deleted"})
    }

    static async update(req,res){
        const {id} = req.params
        const result = validatePartialMovie(req.body)
        if(result.error){
            return res.status(400).json({error:JSON.parse(result.error.message)})
        }
        const updatedMovie = await movieModel.update({id,input:result.data})

        return res.json(updatedMovie)
    }
}