Router.configure({
	layoutTemplate: 'layout_main',
	loadingTemplate: 'layout_loading'
});
Router.onRun('loading');



Router.map(function() {
	this.route('home', {
		template: 'views_home',
		path: '/'
	});

	this.route('dashboard', {
		template: 'views_dashboard',
		path: '/dashboard',
		// waitOn: function(){
		// 	var userCoins = UserCoins.find({user: Meteor.userId()}).fetch();
		// 	return [
		// 		Meteor.subscribe('coinNames'),
		// 		Meteor.subscribe('myFullCoins', userCoins),
		// 		Meteor.subscribe('myUserCoins')
		// 		// Meteor.subscribe('myUserCoins', Coins.find({_id: {$in: _.map(userCoins, function(item){ return item.coin; })}}))
		// 	];
		// },
		// onAfterAction: function(){

		// 	// remove also from the local user coins collection, when removed
		// 	if(this.ready()) {
		// 		if(localCollectionObserve.stop)
		// 			localCollectionObserve.stop();

		// 		localCollectionObserve = UserCoins.find({user: Meteor.userId()}).observe({
		// 			added: updateLocalCollection,
		// 			changed: updateLocalCollection,
		// 			removed: function(doc){
		// 				LocalUserCoins.remove(doc._id);
		// 			}
		// 		});		
		// 	}

		// },
		onStop: function(){
			// if(this._transformReactiveFunction)
			// 	this._transformReactiveFunction.stop();

			// clear collection
			// _.each(LocalUserCoins.find().fetch(), function(item){
			// 	LocalUserCoins.remove(item._id);
			// });
		},
		onBeforeAction: function (pause) {
	        AccountsEntry.signInRequired(this, pause);

// console.log(this);
// 	        if(!this.ready()) {
// 			    this.render('layout_loading', {to: 'loading'});
// 			    pause(); // otherwise the action will just render the main template.
// 		    }
	    }
	});
});