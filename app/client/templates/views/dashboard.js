/**
Template Controllers

@module Templates
**/


// session defaults
Session.setDefault('dashboard_sorting',{'profit': -1});

// GLOBAL EVENT
// possible selectable currencies
var currencies = ['btc','usd','eur'];
switchCurrency = function(e, template){
	var currentSelected = Session.get('displayCurrency'),
		index = _.indexOf(currencies, currentSelected);


	if (currencies[index+1])
		Session.set('displayCurrency', currencies[index+1]);
	else
		Session.set('displayCurrency', currencies[0]);
};



/**
The dashboard

@class [template] views_dashboard
@constructor
**/

/**
Debug template objects

@return {string}
*/
Template['views_dashboard'].helpers({
	debug: function(object){
		console.log(object);
	},



	/**
	Show the create coin form

	@return {boolean}
	*/
	created: function(){
		TemplateVar.set('showCreateCoin', false);
	},


	// DATA
	/**
	Get all coins data

	@return {Array}
	*/
	coins: function(){
		return Coins.find({},{sort: {name: 1}, fields: {priceData: 0}});
	},


	// REACTIVE

	/**
	Show the create coin form

	@return {boolean}
	*/
	createCoin: function(){
		return TemplateVar.get('showCreateCoin');
	},

	/**
	Select the current editable coin

	@return {boolean}
	*/
	isSelected: function(coin){
		return (coin === this._id) ? 'selected' : '';
	},


	/**
	Return user coins

	@return {array}
	*/
	userCoins: function(){
		return LocalUserCoins.find({user: Meteor.userId()}, {sort: Session.get('dashboard_sorting')});
	},

	/**
	Return user coin

	@return {object}
	*/
	showArrow: function(sort){
		var sorting = Session.get('dashboard_sorting');
		return sorting[sort];
	},
	dynamicTemplate: function(){
		var templ = TemplateVar.get('dynamicTemplate');
		if(templ) {
			return templ.template;
		}
	},
	dynamicTemplateData: function(){
		var templ = TemplateVar.get('dynamicTemplate');
		if(templ) {
			return templ.data;
		}
	}
});




Template['views_dashboard'].events({
	/**
	Change displayed currency

	@event click td.profit
	@return {undefined}
	*/
	'click tbody td.profit': switchCurrency,

	/**
	Show the add coin form

	@event click .add-coin
	@return {boolean}
	*/
	'click .add-coin, click .dimmContainer': function(e, template){
		if(!TemplateVar.get('showCreateCoin'))
			TemplateVar.set('showCreateCoin', true);
		else
			TemplateVar.set('showCreateCoin', false);
	},

	/**
	Sort the coin table

	@event click .sort-table
	@return {boolean}
	*/
	'click .sort-table td': function(e, template){
		var sort = {},
			sorting = $(e.currentTarget).attr('class');

		if(sorting === 'symbol')
			sort[sorting] = (Session.get('dashboard_sorting')[sorting] === 1) ? -1 : 1;
		else
			sort[sorting] = (Session.get('dashboard_sorting')[sorting] === -1) ? 1 : -1;

		Session.set('dashboard_sorting', sort);
	},

	/**
	Save new user coin

	@event click .save-coin
	@return {boolean}
	*/
	'click .save-coin': function(e, template){
		var userCoinId = template.$('.add-coin-form select[name="coinSelection"]').val(),
			editCoinID =  TemplateVar.get('showCreateCoin')._id
			buyPrice = template.$('.add-coin-form input[name="buyPrice"]').val(),
			amount = template.$('.add-coin-form input[name="amount"]').val(),
			notes = template.$('.add-coin-form input[name="notes"]').val();

		// insert
		if(!editCoinID) {

			UserCoins.insert({
				user: Meteor.userId(),
				coin: userCoinId,
				buyPrice: buyPrice,
				amount: amount,
				notes: notes
			}, function(error){
				if(!error)
					TemplateVar.set(template, 'showCreateCoin', false);
				else
					alert(error);
			});


		// update
		} else {
			UserCoins.update(editCoinID, {$set: {
					coin: userCoinId,
					buyPrice: buyPrice,
					amount: amount,
					notes: notes
				}
			}, function(error){
				if(!error)
					TemplateVar.set(template, 'showCreateCoin', false);
				else
					alert(error);
			});
		}

		// hide immediately, if its likely to succeed
		if(_.isFinite(buyPrice) && _.isFinite(amount))
			TemplateVar.set('showCreateCoin', false);
	},

	
	/**
	Edit user coin

	@event .coin-list button.edit-coin
	@return {boolean}
	*/
	'click .coin-list button.edit-coin': function(e, template){
		var userCoindID = $(e.currentTarget).parents('tr').attr('id');

		// show edit coin
		TemplateVar.set('showCreateCoin', UserCoins.findOne(userCoindID));
	},


	/**
	Remove user coin

	@event click .coin-list button.remove-coin
	@return {boolean}
	*/
	'click .coin-list button.remove-coin': function(e, template){
		var userCoindID = $(e.currentTarget).parents('tr').attr('id');

		// add new info modal
		// var modal = new Iron.DynamicTemplate({template: 'modalView_question', data: {
	 //    	title: 'Remove this coin?',
	 //    	ok: function(){
	 //    		UserCoins.remove(userCoindID);
	 //    		modal.clear();
	 //    	},
	 //    	cancel: function(){
	 //    		modal.clear();
	 //    	}
	 //    }}).insert({el: 'body'});


		var modal = {template: 'modalView_question', data: {
	    	title: 'Remove this coin?',
	    	ok: function(){
	    		UserCoins.remove(userCoindID);
	    		TemplateVar.set(template, 'dynamicTemplate', null);
	    	},
	    	cancel: function(){
	    		TemplateVar.set(template, 'dynamicTemplate', null);
	    	}
	    }};

		TemplateVar.set('dynamicTemplate', modal);
	}
});




/**
The dashboard

@class [template] views_dashboard_coin
@constructor
**/


/**
Show the note

@return {string}
*/
Template['views_dashboard_coin'].helpers({
	showNotes: function(){
		return TemplateVar.get('showNotes');
	},


	/**
	Return coins image name

	@return {string}
	*/
	coinImageName: function(){
		return (this) ? _.slugify(this.name) : '';
	},


	/**
	Gets the current value of the amount

	@return {string}
	*/
	currentValue: function(passedCurrency){
		var btcPrice = Session.get('bitcoinPrice'),
			currency = (_.isString(passedCurrency)) ? passedCurrency : Session.get('displayCurrency');

		if(!this)
			return '';

		if(_.isString(passedCurrency) && currency === 'btc')
			return Helpers.formatNumber(this.amount * this.currentPrice.btc, currency);
		
		else {
			// prevent display of btc
			currency = (currency === 'btc') ? 'usd' : currency;

			return Helpers.formatNumber((this.amount * this.currentPrice.btc) * btcPrice[currency], currency);
		}
	}
});



Template['views_dashboard_coin'].events({
	'click button.notes': function(){
		if(TemplateVar.get('showNotes'))
			TemplateVar.set('showNotes', false);
		else
			TemplateVar.set('showNotes', true);
	}
});