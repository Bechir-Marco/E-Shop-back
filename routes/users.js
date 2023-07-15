const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash'); ;

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})
router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash')    ;

  if (!user) {
    res.status(500).json({ success: false, message : 'the user with this id not found' });
  }
  res.send(user);
});
router.post(`/`, async (req, res) => {
    let salt = await bcrypt.genSalt(10);
    console.log(salt);
  try {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, salt),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
      });
      user = await user.save();
      if (!user) {
            return res.status(404).send('the user cannot be created!'); 
      }
      

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put(`/:id`, async (req, res) => {
    try {
        const userExist = await User.findById(req.params.id);
        let newPassword;
        if (req.body.passwordHash) { 
            newPassword = bcrypt.hashSync(req.body.passwordHash,10);
        } else {
            newPassword = userExist.passwordHash;
        }

 
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
      },
      { new: true }
    );
    user = await user.save();
    if (!user) {
      return res.status(404).send('the user cannot be updated!');
    }

    res.send(user);
  }
  
   catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post(`/login`, async (req, res) => {
  
  
    try {
      const user = await User.findOne({email: req.body.email});
        
    if (!user) {
      return res.status(404).send('the user not found!');
    }
        if (user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
            const token = jwt.sign(
              {
                userId: user.id,
                isAdmin: user.isAdmin,
              },
              process.env.TOKEN_SECRET,
              { expiresIn: '1d' }
            );
            res.status(200).send({user: user.email, token: token});
        }

        else { 
            res.status(400).send('wrong password');
        }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports =router;