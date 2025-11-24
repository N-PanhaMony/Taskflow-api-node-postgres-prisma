import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Register a new user endpoing /auth/register
router.post('/register', (req , res ) =>{
    const {username , password} = req.body
   
    // encrypt password
    const hashedPassword = bcrypt.hashSync(password,8)

    //save new user and hashed password to db
    try {
        // Create a prepared SQL statement (same idea as MySQL's connection.query)
        // This compiles the SQL once and allows safe parameter binding (?,?)
        const insertUser = db.prepare(`
            INSERT INTO users (username, password) VALUES (?, ?)
        `)

        // Execute the prepared statement with values
        // result.lastInsertRowid will contain the new user's ID
        const result = insertUser.run(username, hashedPassword)


        // After creating a user, insert their first default todo
        const defaultTodo = "Add first todo"

        // Prepare another SQL statement for todos table
        const insertTodo = db.prepare(`
            INSERT INTO todos (user_id, task) VALUES (?, ?)
        `)

        // Run the prepared statement
        // We use result.lastInsertRowid so the todo belongs to the new user
        insertTodo.run(result.lastInsertRowid, defaultTodo)


        // Create JWT token for this new user
        const token = jwt.sign({id: result.lastInsertRowid} , process.env.JWT_SECRET , {expiresIn : '24'})
        res.json({token})

    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
    res.sendStatus(201)
})

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body

    try {
        // Prepare SQL query to find user by username
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')

        // Execute the query (returns a single row)
        const user = getUser.get(username)

        // If user does not exist -> send 404
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }

        // Compare input password with hashed password in DB
        const passwordIsValid = bcrypt.compareSync(password, user.password)

        // If password incorrect -> send 401
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid password" })
        }

        // Create JWT token with user ID, expires in 24h
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // better to use '24h' instead of '24'
        )

        // Send token to client
        res.json({ token })

    } catch (error) {
        console.log(error.message)
        res.sendStatus(503) // Server error
    }
})


export default router 