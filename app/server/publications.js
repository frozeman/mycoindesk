
/**
Publish coin names and symbol.
*/
Meteor.publish('coinNames', function () {
 	return Coins.find({}, {fields: {name: 1, symbol: 1, currentPrice: 1}}); //position: 1, supply: 1, change: 1,
});


/**
Publish the full bitcoin price
*/
Meteor.publish('bitcoin', function () {
 	return Coins.find({symbol: 'BTC'}, {fields: {priceData: 0}});
});

/**
Publish my coins details in full
*/
Meteor.publish('myFullCoins', function (userCoins) {
	check(userCoins, [Match.ObjectIncluding({_id: String})]);

 	return Coins.find({_id: {$in: _.map(userCoins, function(item) { return item.coin; })}}, {fields: {priceData: 0}});
});

/**
Publish coin names and symbol.
*/
Meteor.publish('myUserCoins', function () {
	if (!this.userId) return;

 	return UserCoins.find({user: this.userId});
});




// Meteor.publish('myUserCoins', function () {
// 	if (!this.userId) return;


//     new SimplePublication({
//         subHandle: this,
//         collection: UserCoins,
//         selector: {user: this.userId},
//         options: {reactive: true},
//         dependant: new SimplePublication({
//             subHandle:this,
//             collection: Coins,
//             foreignKey: 'coin',
//             inverted: true
//         })

//     }).start();


// });


// Meteor.censor('myUserCoins', function (coins) {
// 	return UserCoins.find({user: this.userId}, {
// 		transform: function(doc){
// 			// add user coin data
// 			var coin = Coins.findOne(doc.coin, {reactive: true});

// 			// only proceed when priceData is available
// 			if(coin && coin.priceData) {

// 				delete coin._id;

// 				// merge userCoin and coin data
// 				coin = _.extend(doc, coin);

// 				coin.amount = Number(coin.amount);
// 				coin.buyPrice = Number(coin.buyPrice);

// 				var price = Number(_.last(coin.priceData).price.btc);
// 				price = (price - coin.buyPrice) * coin.amount;

// 				coin.profit = Number(price);

// 			}

// 			return coin;
// 		}
// 	});
// });