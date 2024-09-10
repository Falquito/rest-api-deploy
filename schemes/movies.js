const z = require('zod')

const movieSchema = z.object({
    tittle:z.string(),
    year: z.number().int().positive(),
    director:z.string(),
    duration:z.number().int().min(0),
    poster:z.string().url(),
    genre:z.array(z.enum(["Action","Adventure","Comedy","Drama","Fantasy","Horror","Thriller","Sci-Fi"]))
})

function validateMovie(object){
    return movieSchema.safeParse(object)
}
function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}