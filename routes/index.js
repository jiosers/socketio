var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session.num)
	req.session.num=req.session.num||0;
	let num=++req.session.num;
  res.render('index', { title: 'Express' ,num});
});

module.exports = router;
