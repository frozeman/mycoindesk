var Schemas = {};


// User is created by default from Meteor
// needs subscription options
// stores coins?


// Coins (coin ID, PriceData)
Coins = new Meteor.Collection('coins');
if(Meteor.isServer)
	Coins._ensureIndex({symbol: 1}, {background: true});


// UserCoins
// Coin ID, user ID, buy price, buy timestamp
UserCoins = new Meteor.Collection('usercoins');

if(Meteor.isServer)
	UserCoins._ensureIndex({user: 1}, {background: true});

Schemas.UserCoins = new SimpleSchema({
    amount: {
        type: Number,
        label: 'Amount',
        decimal: true
    },
    buyPrice: {
        type: Number,
        label: 'Buy Price',
        decimal: true
    },
    notes: {
        type: String,
        label: 'Notes',
        max: 150,
        optional: true
    },
    coin: {
        type: String, //Meteor.Collection.ObjectID,
        label: 'Coin Reference',
        max: 24
    },
    user: {
        type: String, //Meteor.Collection.ObjectID,
        label: 'User Reference',
        max: 24
    }
});
UserCoins.attachSchema(Schemas.UserCoins);


UserCoins.allow({
	insert: function(userId, doc) {

		// make sure no strings with html is inserted
		if(doc.notes && doc.notes !== _.stripTags(doc.notes))
			return false;

		return (userId && userId === doc.user) ? true : false;
	},
	update: function(userId, doc, fieldNames) {

		// make sure no strings with html is inserted
		if(doc.notes && doc.notes !== _.stripTags(doc.notes))
			return false;

		return (userId && userId === doc.user) ? true : false;
	},
	remove: function(userId, doc) {
		return (userId && userId === doc.user) ? true : false;
	}
});

UserCoins.deny({
	update: function(userId, doc, fieldNames) {
		return (_.contains(fieldNames, 'user')) ? true : false;
	}
});




// temporary client side collections
if(Meteor.isClient) {

	// LocalUserCoins
	LocalUserCoins = new Meteor.Collection('usercoins-local', {connection: null});

	// Schemas.LocalUserCoins = new SimpleSchema({
	//     title: {
	//         type: String,
	//         label: "Title",
	//         max: 200
	//     },
	//     author: {
	//         type: String,
	//         label: "Author"
	//     },
	//     copies: {
	//         type: Number,
	//         label: "Number of copies",
	//         min: 0
	//     },
	//     lastCheckedOut: {
	//         type: Date,
	//         label: "Last date this book was checked out",
	//         optional: true
	//     },
	//     summary: {
	//         type: String,
	//         label: "Brief summary",
	//         optional: true,
	//         max: 1000
	//     }
	// });
	// LocalUserCoins.attachSchema(Schemas.LocalUserCoins);
}