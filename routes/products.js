const { Product } = require('../models/product');
const express = require('express');
const  {Category}  = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/get/count', async (req, res) => {
  try {
    const productCount = await Product.countDocuments({});
    if (!productCount) {
      return res.status(500).json({ success: false });
    }
    res.send({
      productCount: productCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/get/isFeatured/:count', async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const product = await Product.find({ isFeatured: true }).limit(+count);
    
    if (!product) {
      return res.status(500).json({ success: false });
    }
    res.send({
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/', async (req, res) => {
  
    let filter = {}
    if (req.query.categories) {
      filter = { category : req.query.categories.split(',') };   

    }
  console.log(filter);
  const productList = await Product.find(filter).populate('category')
  console.log(productList);
  if (!productList) 
    res.status(500).json({ success: false });
  res.send(productList);  
  });


router.get(`/`, async (req, res) => {
  const productList = await Product.find().select('name _id');

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});
router.post(`/`, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    console.log('Invalid Category');

    if (!category || category == "") return res.status(400).send('Invalid Category');

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) return res.status(500).send('The product cannot be created');

    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category)
      return res.status(400).send('Invalid Category');
  
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );
    if (!product) return res.status(500).send('the product cannot be updated!');

    res.send(product);
  } catch (error) { 
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  let product = await Product.findByIdAndRemove(req.params.id);
  if (!product) return res.status(404).send('the product not found!');
  else
    return res
      .status(200)
      .json({ success: true, message: 'the product is deleted!' });
});



module.exports = router;
