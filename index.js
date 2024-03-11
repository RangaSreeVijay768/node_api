const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUI = require('swagger-ui-express');

const productRoutes = require('./rest_api/routes/products');
const orderRoutes = require('./rest_api/routes/orders');
const userRoutes = require('./rest_api/routes/users');

// const options = {
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'NodeJS project with MongoDB',
//             version: '1.0.0'
//         },
//         servers:[
//             {
//                 url: 'http://localhost:3000/products',
//                 url: 'http://localhost:3000/orders'
//             }
//         ]
//     },
//     apis: ['./app.js']
// };

// const swaggerSpec = swaggerJSDoc(options);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


mongoose.connect("mongodb+srv://ranga:VidyaDatta%40123@test-crud-database.jngbtvf.mongodb.net/?retryWrites=true&w=majority&appName=test-crud-database", {
    ssl: true,
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);


// /**
//  * @swagger
//  * /:
//  *  get:
//  *      summary: qwertyuio wertyuio
//  *      description: asdfghjytrertyu
//  *      responses: 
//  *          "200":
//  *              description: testing 
//  */

// /**
//  * @swagger
//  * /:
//  *  get:
//  *      summary: checking
//  *      description: check
//  *      responses: 
//  *          "200":
//  *              description: check 
//  */


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;