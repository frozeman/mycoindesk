// var __hasProp = {}.hasOwnProperty,
//     __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };


// Coins = (function(_super) {
//     __extends(Coins, _super);

//     function Coins() {
//         return Coins.__super__.constructor.apply(this, arguments);
//     }

//     Coins.Meta({
//         name: 'Coins'
//     });

//     return Coins;

// })(Document);


// UserCoins = (function(_super) {
//     __extends(UserCoins, _super);

//     function UserCoins() {
//         return UserCoins.__super__.constructor.apply(this, arguments);
//     }

//     UserCoins.Meta({
//         name: 'UserCoins',
//         fields: function(fields) {
//             fields.coin = UserCoins.ReferenceField(Coins);//, ['symbol', 'name']);

//             fields.profit = UserCoins.GeneratedField('self', ['coin'], function(fields) {

//                 var userCoin = Coins.documents.findOne(fields.coin._id),
//                     price = Number(_.last(userCoin.priceData).price.btc);
//                 price = (price - userCoin.buyPrice) * userCoin.amount;

//                 if (!price) {
//                     return [fields._id, void 0];
//                 } else {
//                     return [fields._id, Number(price)];
//                 }
//             });


//             return fields;
//         }
//     });

//     return UserCoins;

// })(Document);