const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();
const {OrderItems} = require('../models/orderItems');
router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})
// router.post('/', async (req, res) => {

     // const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderitem) => { 
//     //     let newOrderItem = new OrderItems({
//     //       quantity: orderitem.quantity,
//     //       product: orderitem.product,
//     //     });
//     //     newOrderItem = await newOrderItem.save();
//     //     return newOrderItem._id;
//     // }))
//     // const orderItemsIdsResolved = await orderItemsIds;
//     // console.log(orderItemsIdsResolved);
//   let order = new Order({
//     orderItems: req.body.orderItems,
//     shippingAddress1: req.body.shippingAddress1,
//     shippingAddress2: req.body.shippingAddress2,
//     city: req.body.city,
//     zip: req.body.zip,
//     country: req.body.country,
//     phone: req.body.phone,
//     status: req.body.status,
//     totalPrice: req.body.totalPrice,
//     user: req.body.user,
//   });
//   order = await order.save();
//   if (!order) return res.status(404).send('the category cannot be created!');

//   res.send(order);
// });
router.post('/', async (req, res) => {
  try {
    const orderItems = req.body.orderItems;

      ordedItems= []
    
    for (const orderitem of orderItems) {
      let newOrderItem = new OrderItems({
        quantity: orderitem.quantity,
        product: orderitem.product,
      });
      newOrderItem = await newOrderItem.save();
      ordedItems.push(newOrderItem);
    }

    const order = new Order({
      orderItems: ordedItems,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });

    const savedOrder = await order.save();
    if (!savedOrder) {
      return res.status(404).send('The order could not be created!');
    }

    res.send(savedOrder);
  } catch (error) {
    res.status(500).send('An error occurred while processing the request.');
  }
});



module.exports =router;