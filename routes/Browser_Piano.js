var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('Browser_Piano', { /*don't pass in anything*/ });
  });

//localhost:8000/user/detail

module.exports = router;
