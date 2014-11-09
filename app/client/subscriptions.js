
// to be used in templates to show the loading screen
userCoinSubscription = {};



Meteor.startup(function(){

	// SUBSCRIBE TO BITCOIN
	Meteor.subscribe('bitcoin');
	// store the current bitcoin price in a session
	Deps.autorun(function(c){
		var btc = Coins.findOne({symbol: 'BTC'});

		if(!c.firstRun && btc && btc.currentPrice)
			Session.set('bitcoinPrice', btc.currentPrice);
	});


	Deps.autorun(function(c){
		var userCoins = UserCoins.find({user: Meteor.userId()}).fetch();
		// if(c.firstRun) return;

		Meteor.subscribe('coinNames');
		Meteor.subscribe('myFullCoins', userCoins);
		userCoinSubscription = Meteor.subscribe('myUserCoins');
	});


	// Maintain LocalUserCoins
	var updateLocalCollection = function(userCoin){

		// add user coin data
		var coin = Coins.findOne(userCoin.coin);

		// only proceed when priceData is available
		if(coin && coin.currentPrice) {

			delete coin._id;

			// merge userCoin and coin data
			coin = _.extend(userCoin, coin);

			coin.amount = Number(coin.amount);
			coin.buyPrice = Number(coin.buyPrice);

			coin.profit = Number(Number(coin.currentPrice.btc - coin.buyPrice) * coin.amount);

			LocalUserCoins.upsert(coin._id, coin);
		}
	};

	var localCollectionObserve = {};
	Deps.autorun(function(c){
		var user = Meteor.userId(),
			userCoins = UserCoins.find({user: user});

		// make reactive to coins as well
		Coins.find({_id: {$in: _.map(userCoins.fetch(), function(item) { return item.coin; })}},{fields: {_id: 1}}).fetch();


		if(user) {
			if(localCollectionObserve.stop)
				localCollectionObserve.stop();

			localCollectionObserve = userCoins.observe({
				added: updateLocalCollection,
				changed: updateLocalCollection,
				removed: function(doc){
					LocalUserCoins.remove(doc._id);
				}
			});

		// on logout
		} else {
			// clear collection
			_.each(LocalUserCoins.find({},{reactive: false}).fetch(), function(item){
				LocalUserCoins.remove(item._id);
			});
		}
	});
});