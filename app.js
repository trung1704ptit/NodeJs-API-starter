require('dotenv').config()

const bodyParser = require('body-parser');
const express =  require('express');
const secureApp = require('helmet');
const logger = require('morgan')
const userRoute = require('./routes/user');
const deckRoute = require('./routes/deck');

const mongoClient = require('mongoose')
const passport = require('passport')

const cors = require('cors')

// setup connect mongodb by mongoose
mongoClient.connect('mongodb://localhost/nodejsapistarter')
    .then(() => console.log('✅ Connect to mongodb'))
    .catch(error => console.error(`❌ Connect database failed with error which is ${error}`))


const app = express()

// app.use(cors())
var allowedOrigins = ['http://localhost:3000',
                      'http://yourapp.com'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  exposedHeaders: ['Content-Length', 'Authorization'],
}));

app.use(secureApp())
app.use(passport.initialize());

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
const port = app.get('port') || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`))
