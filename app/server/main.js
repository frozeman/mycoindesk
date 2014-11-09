Fiber = Npm.require('fibers');


// START the SERVER
Meteor.startup(function() {
	console.log('Server started');

	// pull coin data every 30s
	Meteor.setInterval(function(){

		console.log('Call Coin API\'s');

		callNorthpoleAPI()
		.then(saveAPIResponse, Meteor.bindEnvironment(function(error){

			console.error('Couldn\'t connect to the Northpole API', error);

			return callNexuistAPI()
			.then(saveAPIResponse);
		}))
		.fail(Meteor.bindEnvironment(function(error){
			console.error('Couldn\'t connect to any API', error);
		}));

	}, (1000 * 60 * 1));


	// clean up database duplicates
	// _.each(Coins.find().fetch(), function(item){
	// 	if(!UserCoins.findOne({coin: item._id}))
	// 		Coins.remove(item._id);
	// });
});



/**
Parses the nexuist coinmarket cap API and normalizes the data.

http://coinmarketcap-nexuist.rhcloud.com/api/all

*/
var callNexuistAPI = function(){
	var defer = Q.defer();


	HTTP.get('http://coinmarketcap-nexuist.rhcloud.com/api/all', function(error, result){

		if(!error && _.isObject(result.data)) {
			result.data = _.compact(_.map(result.data, function(item, coinName){

				if(item.symbol) {

					return {
						symbol: item.symbol.toUpperCase(),
						name: coinName,
						position: item.position,
						priceData: {
							position: item.position,
							marketCap: item.market_cap,
							price: item.price,
							volume: item.volume,
							change: item.change,
							supply: item.supply,
							timestamp: parseInt(item.timestamp)
						}
					};
				}
			}));

			defer.resolve(result.data);

		// FAIL
		} else
			defer.reject('Couldn\'t connect to http://coinmarketcap-nexuist.rhcloud.com');
	});

	return defer.promise;
};

/**
Parses the northpole coinmarket cap API and normalizes the data.

http://coinmarketcap.northpole.ro/api/v5/all.json

*/
var callNorthpoleAPI = function(){
	var defer = Q.defer();

	HTTP.get('http://coinmarketcap.northpole.ro/api/v5/all.json', function(error, result){

		if(!error && _.isObject(result.data) && result.data.markets) {

			// get current bitcoin price
			var bitcoin = _.find(result.data.markets, function(item){ return (item.symbol === 'BTC'); });

			result.data = _.compact(_.map(result.data.markets, function(item, coinName){

				if(item.symbol) {


					// calculate the other volumes
					item.volume24 = {
						usd: bitcoin.price.usd * item.volume24.btc,
						btc: item.volume24.btc,
						eur: bitcoin.price.eur * item.volume24.btc,
						cny: bitcoin.price.cny * item.volume24.btc,
						cad: bitcoin.price.cad * item.volume24.btc,
						rub: bitcoin.price.rub * item.volume24.btc
					};

					return {
						symbol: item.symbol.toUpperCase(),
						name: item.name,
						position: item.position,
						priceData: {
							position: item.position,
							marketCap: item.marketCap,
							price: item.price,
							volume: item.volume24,
							change: (_.isFinite(item.change7h.usd)) ? item.change7h.usd : 0,
							supply: item.availableSupply.replace(/[\,\.]+/,''),
							timestamp: item.timestamp
						}
					};
				
				}
			}));

			defer.resolve(result.data);

		// FAIL
		} else
			defer.reject('Couldn\'t connect to http://coinmarketcap-nexuist.rhcloud.com');
	});	

	return defer.promise;
};


/**
Inserts the normalized data into the Coins collection.

Example of the normalized data:

	[
		{
		symbol: 'BTC',
		name: 'Bitcoin',
		position: 1,
		priceData: [{
				position: 1,
				marketCap: {
					usd: 4400299.53431,
					eur: 3275213.348179482,
					cny: 27185076.924764387,
					cad: 4756600.58820215,
					rub: 156905748.78543994,
					btc: 7518.11605524
				},
				price: {
					usd: 0.000163659,
					eur: 0.000121814012244,
					cny: 0.001011086283954,
					cad: 0.00017691079654800002,
					rub: 0.00583574771223,
					btc: 2.79619e-07
				},
				volume: {
					usd: 434004,
					eur: 323036.121264,
					cny: 2681279.316024,
					cad: 469146.17188800004,
					rub: 15475701.61188,
					btc: 741.516
				},
				change: -18.36, // %
				supply: 26887000008,
				timestamp: 1406665238
			}]
		}
	]

@param {array} resultData the normalized coins data
*/
var saveAPIResponse = Meteor.bindEnvironment(function(resultData){

	if(_.isArray(resultData)) {
		// run inside a fiber
		// Fiber(function() {

			_.each(resultData, function(item){

				// transform
				_.each(item.priceData.price, function(value, key){
					item.priceData.price[key] = Number(value);
				});
				_.each(item.priceData.marketCap, function(value, key){
					item.priceData.marketCap[key] = Number(value);
				});
				_.each(item.priceData.volume, function(value, key){
					item.priceData.volume[key] = Number(value);
				});
				item.priceData.position = Number(item.priceData.position);
				item.priceData.change = Number(item.priceData.change);
				item.priceData.supply = Number(item.priceData.supply);

				item.position = item.priceData.position;
				item.supply = item.priceData.supply;
				item.change = item.priceData.change;
				item.currentPrice = item.priceData.price;



				var existingCoin = Coins.findOne({symbol: item.symbol});

				// INSERT AS NEW COIN
				if(!existingCoin) {

					item.priceData = [item.priceData];
					Coins.insert(item);


				// UPDATE EXISTING COIN
				} else {
					Coins.update(existingCoin._id, {
						// $addToSet: {priceData: item.priceData},
						$set: {
							name: item.name,
							position: item.position,
							change: item.priceData.change,
							supply: item.priceData.supply,
							currentPrice: item.currentPrice
						}
					});
				}
			});

			console.log('Successfully parsed '+ resultData.length +' Coins');
		// }).run();
	}
});