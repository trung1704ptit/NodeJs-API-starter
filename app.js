const bodyParser = require('body-parser');
const express =  require('express');
const logger = require('morgan')
const userRoute = require('./routes/user');
const deckRoute = require('./routes/deck');

const mongoClient = require('mongoose')


// setup connect mongodb by mongoose
mongoClient.connect('mongodb://192.168.0.103:27017/nodejsapistarter')
    .then(() => console.log('✅ Connect to mongodb'))
    .catch(error => console.error(`❌ Connect database failed with error which is ${error}`))


const app = express()

// middleware
app.use(logger('dev'))
app.use(bodyParser.json())

// deck routes
app.use('/decks', deckRoute)

// user routes
app.use('/users', userRoute)


// routes
app.get('/', (req, res,next) => {
    return res.status(200).json({
        message: 'Server is running hehe'
    })
})

// catch 404, ... 
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404
    next(err)
})

// error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500;

    // respone to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

// start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`))