// 2014.11.10 Tilltue
// server.js
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear     = require('./app/models/bear');
var Item     = require('./app/models/item');
var fs		 = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/html'));

mongoose.connect('mongodb://localhost/restapidb'); 

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

router.route('/share/items')

	// create a bear (accessed at POST http://localhost:8080/api/share/items)
	.post(function(req, res) {
		console.log('post item');
		var item = new Item(); 		// create a new instance of the Item model
		item.name = req.body.name;  // set the bears name (comes from the request)
		item.create_date = new Date;
		item.desc = req.body.desc;
		//item.images.push(req.body.images);
		item.price = req.body.price;
		// save the item and check for errors
		item.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Item created!' });
		});
		
	})

	// get all the bears (accessed at GET http://localhost:8080/api/share/items)
	.get(function(req, res) {
		Item.find(function(err, items) {
			if (err)
				res.send(err);
			res.json(items);
		});
	});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {
		
		var bear = new Bear(); 		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		// save the bear and check for errors
		bear.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});
		
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);
			res.json(bears);
		});
	});

router.route('/bears/:bear_id')

	// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	.put(function(req, res) {

		// use our bear model to find the bear we want
		Bear.findById(req.params.bear_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name; 	// update the bears info

			// save the bear
			bear.save(function(err) {
				if (err)
					res.send(err);
				Bear.find(function(err, bears) {
					if (err)
						res.send(err);
					res.json(bears);
				});
				//res.json({ message: 'Bear updated!' });
			});

		});
	})

	// delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
