const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        if(!product){
            return res.status(404).json({
                message: 'product not found'
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    }).then(result => {
        console.log(result);
        res.status(201).json({
            message: 'post requests',
            createdOrder: {
                product: result.product,
                quantity: result.quantity,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            }
        });

    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.get('/', (req, res, next) => {
    Order.find().select('product quantity _id').populate('product', '_id name price').exec().then(orders => {
        console.log(orders);
        const response = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
        }
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});



router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    
    Order.findById(id).select('product quantity _id').exec().then(order => {
        console.log(order);
        if (order) {
            res.status(200).json(order);
        } else{
            res.status(404).json({message: 'incorrect id'});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});



router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Order.updateOne({ _id: id }, { $set : updateOps }).exec().then( result => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});


router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    Order.deleteOne({ _id: id }).exec().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});



module.exports = router;