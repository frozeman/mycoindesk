
/**
Show loading template

@return {boolean}
*/
Template['layout_main'].subscriptionReady = function(){
	return (Meteor.user()) ? userCoinSubscription.ready() : true;
};

/**
The current bitcoin price
@return {string}
*/
Template['layout_main'].btcPrice = function(object){
	var btcPrice = Session.get('bitcoinPrice'),
		currency = Session.get('displayCurrency');

	if(btcPrice) {
		currency = (currency === 'btc') ? 'usd' : currency;

		return Helpers.formatNumber(btcPrice[currency], currency);
	}
};



/**
The total portfolio wealth.
Calculates the total wealth or profit

@param {boolean} profit whether to calculate profit or wealth
@param {boolean} numberOnly whether to return only a number, or including the currency symbol
@return {string}
*/
Template['layout_main'].portfolioTotal = function(profit, numberOnly){
	var userCoins = LocalUserCoins.find({user: Meteor.userId()}).fetch();
		totalBtc = _.reduce(userCoins, function(memo, coin){ return memo + Number((profit) ? coin.profit : (coin.amount * coin.currentPrice.btc)); }, 0),
		btcPrice = Session.get('bitcoinPrice'),
		currency = Session.get('displayCurrency');

	if(userCoins && btcPrice) {
		return Helpers.formatNumber(totalBtc * btcPrice[currency], currency, numberOnly);
	}
};


/**
Gives the total profit as number

@param {boolean} profit whether to calculate profit or wealth
@return {string}
*/
Template['layout_main'].totalProfitNumber = function(){
	return Template['layout_main'].portfolioTotal(true, true);
};


Template['layout_main'].events({
	/**
	Change displayed currency

	@event click .portfolio
	@return {undefined}
	*/
	'click .portfolio': switchCurrency
});
