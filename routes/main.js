var router = require('express').Router();



router.get('/', function(req, res) {
	res.render('main/home');	//viewing the home page

});


router.get('/about', function(req, res){
	res.render('main/about');	//viewing the about page
});


module.exports = router;