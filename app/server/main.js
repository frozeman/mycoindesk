Fiber = Npm.require('fibers');

var deferred = function() {
    var resolve, reject,
        promise = new P(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });


    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
};


// START the SERVER
Meteor.startup(function() {
	console.log('Server started');


	// remap coins to user coins
	// var coinSymbols = [];
	// _.each(UserCoins.find().fetch(), function(item){
	// 	var coin = Coins.findOne({_id: item.coin});
	// 	if(coin){
	// 		coinSymbols.push({
	// 			userCoinId: item._id,
	// 			symbol: coin.symbol
	// 		});
	// 	}
	// });
	
	// remove all coins
	// _.each(Coins.find().fetch(), function(item){
	// 	Coins.remove(item._id);
	// });



	// pull coin data every 30s
	Meteor.setInterval(function(){

		console.log('Call Coin API\'s');

		callCoinMarketCapAPI()
		.then(saveAPIResponse)
		// .then(saveAPIResponse, Meteor.bindEnvironment(function(error){

		// 	console.error('Couldn\'t connect to the Northpole API', error);

		// 	return callNexuistAPI()
		// 	.then(saveAPIResponse);
		// }))
		.catch(Meteor.bindEnvironment(function(error){
			console.error('Couldn\'t connect to any API', error);
		}));

	}, (1000 * 60 * 1));

	// remap to the new coins
	// Meteor.setTimeout(function(){
	// 	console.log(coinSymbols);
	// 	_.each(coinSymbols, function(item){
	// 		var coin = Coins.findOne({symbol: item.symbol});
	// 		if(coin){
	// 			var coin = UserCoins.update({_id: item.userCoinId}, {$set: {coin: coin._id}});
	// 		}
	// 	});
	// }, 60000);



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
var callCoinMarketCapAPI = function(){
	var defer = deferred();


	HTTP.get('https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=1000', function(error, result){


		if(!error && _.isObject(result.data)) {
			var bitcoin = _.find(result.data, function(item){ return (item.symbol === 'BTC'); });

			result.data = _.compact(_.map(result.data, function(item){

				if(item.symbol) {

					return {
						symbol: item.symbol.toUpperCase(),
						name: item.name,
						position: Number(item.rank),
						priceData: {
							position: Number(item.rank),
							marketCap: Number(item.market_cap_usd),
							price: {
								usd: Number(item.price_usd),
								eur: Number(item.price_eur),
								btc: Number(item.price_usd) / bitcoin.price_usd,
							},
							volume: {
								usd: Number(item['24h_volume_usd']),
								eur: Number(item['24h_volume_eur']),
								btc: Number(item['24h_volume_usd']) / bitcoin.price_usd,
							},
							change: Number(item.percent_change_24h),
							supply: Number(item.total_supply),
							timestamp: Number(item.last_updated)
						}
					};
				}
			}));

			defer.resolve(result.data);

		// FAIL
		} else
			defer.reject('https://api.coinmarketcap.com/v1/ticker/');
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
			var countUpdates = 0;

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
				item.timestamp = item.priceData.timestamp;



				var existingCoin = Coins.findOne({symbol: item.symbol});

				// INSERT AS NEW COIN
				if(!existingCoin) {

					// item.priceData = [item.priceData];
					Coins.insert(item);


				// UPDATE EXISTING COIN
				} else {
					countUpdates += Coins.update(existingCoin._id, {
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

			console.log('Successfully parsed '+ countUpdates +' Coins');
		// }).run();
	}
});