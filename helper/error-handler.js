function errHandler (err, req, res, next) {
    if (err.message.name === 'UnauthorizedError') {
        console.log(err);
        return res.status(401).json({message: "The user is not authorized"})
    }
    if (err.message.name === 'ValidationError') {
      return res.status(401).json({ message: err });
    }
    return res.status(500).json(({msg: err.message  }));
}

module.exports = errHandler;