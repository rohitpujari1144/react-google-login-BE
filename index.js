const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohit10231:rohitkaranpujari@cluster0.kjynvxt.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)
const port = 4000

// getting all users information
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('user_management')
        let users = await db.collection('All Accounts').find().toArray()
        res.status(200).send(users)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// creating new account
app.post('/createAccount', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if (req.body.email && req.body.name && req.body.address && req.body.age && req.body.socialMediaHandle) {
            const db = await client.db('user_management')
            let user = await db.collection('All Accounts').findOne({ email: req.body.email })
            if (!user) {
                await db.collection('All Accounts').insertOne(req.body)
                res.status(201).send({ message: 'New account created', data: req.body })
            }
            else {
                res.status(400).send({ message: `user with email id ${req.body.email} already exist` })

            }
        }
        else {
            res.status(400).send({ message: 'email, name, address, age, socialMediaHandle are mandatory' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// user login
app.get('/login/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('user_management')
        let user = await db.collection('All Accounts').findOne({ email: req.params.email })
        if (user) {
            res.status(200).send({ message: 'Login successful', data: user })
        }
        else {
            res.status(404).send({ message: `user with email id ${req.params.email} not exist` })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// updating user information
app.put('/updateUser/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if (req.params.email) {
            const db = await client.db('user_management')
            let user = await db.collection('All Accounts').findOne({ email: req.params.email })
            if (user) {
                let user = await db.collection('All Accounts').updateOne({ email: req.params.email }, { $set: req.body })
                res.status(200).send({ message: 'User info updated successfully' })
            }
            else {
                res.status(400).send({ message: `User not found with email ${req.params.email}` })
            }
        }
        else {
            res.status(400).send({ message: 'email is mandatory' })
        }
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// deleting user account
app.delete('/deleteUser/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        if (req.params.email) {
            const db = await client.db('user_management')
            let user = await db.collection('All Accounts').findOne({ email: req.params.email })
            if (user) {
                let user = await db.collection('All Accounts').deleteOne({ email: req.params.email })
                res.status(200).send({ message: 'User deleted successfully' })
            }
            else {
                res.status(400).send({ message: `User not found with email ${req.params.email}` })
            }
        }
        else {
            res.status(400).send({ message: 'email is mandatory' })
        }
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})


app.listen(port, () => { console.log(`App listening on ${port}`) })