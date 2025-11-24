import express from 'express'
import db from '../db.js'

const router = express.Router()

//Get all todos
router.get('/', (req , res ) =>{
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id : ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

// Create new todo
router.post('/' , (req ,res ) =>{

})

//Update a todo
router.put('/:id', (req ,res) =>{

})

//Delete a toda
router.delete('/:id' , (req ,res ) =>{

})

export default router