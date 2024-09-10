import { Router } from "express";
export const moviesRouter = Router();

import { createRequire } from 'node:module'
import { movieModel } from "../models/movie.js";
import { MovieController } from "../controllers/movies.js";

const require = createRequire(import.meta.url)
const movies = require('../movies.json')

moviesRouter.get('/',MovieController.getAll)
moviesRouter.get('/:id',MovieController.getById)
moviesRouter.post('/',MovieController.create)
moviesRouter.delete('/:id',MovieController.delete)
moviesRouter.patch('/:id',MovieController.update)
