
Helpers = {};


/**
Formates any number to either to 2 or 8 decimal points and adds the currency symbol

@param {number} amount the currency ammount
@param {string} type the type of the currency, either 'coin', 'btc', 'usd' or 'eur' etc.
@param {numberOnly} type whether to return only a number, or including the currency symbol
@return {string}
*/
Helpers.formatNumber = function(amount, type, numberOnly, dontFormat){
	if(!_.isString(type))
		type = Session.get('displayCurrency');

	if(_.isFinite(amount)) {

		// crypto currencies
		if(type === 'btc' || type === 'coin') {
			amount = (dontFormat === true) ? Number(amount).toFixed(8) : numeral(amount).format('0,0.00000000');
			return (numberOnly === true || type !== 'btc') ? amount : new Spacebars.SafeString(amount +'<span class="btc-symbol">฿</span>');
		
		// fiat currencies
		} else {
			amount = (dontFormat === true) ? Number(amount).toFixed(2) : numeral(amount).format('0,0.00');

			if(numberOnly === true)
				return amount;
			else if(type === 'eur')
				return amount +'€';
			else if(type === 'usd')
				return '$'+ amount;

		}

	} else
		return amount;
};
UI.registerHelper('formatNumber', Helpers.formatNumber);


/**
Formates any bitcoin amount to either to 2 or 8 decimal points and adds the currency symbol

@param {number} amount the currency ammount
@param {string} type the type of the currency, either 'coin', 'btc', 'usd' or 'eur' etc.
@param {numberOnly} type whether to return only a number, or including the currency symbol
@return {string}
*/
Helpers.formatPrice = function(amount, type, numberOnly){
	var btcPrice = Session.get('bitcoinPrice');

	// calculate the current currency price
	amount = amount * btcPrice[Session.get('displayCurrency')];

	return Helpers.formatNumber(amount, type, numberOnly);
};
UI.registerHelper('formatPrice', Helpers.formatPrice);


/**
Checks if a value is greater and equal than the second given value

@param {number} value1
@param {number} value2
@return {boolean}
*/
Helpers.isGreaterThan = function(value1, value2){
	if(_.isFinite(value1) && _.isFinite(value2))
		return value1 >= value2;
	else
		return false;
};
UI.registerHelper('isGreaterThan', Helpers.isGreaterThan);


/**
Checks if a value is lower than the second given value

@param {number} value1
@param {number} value2
@return {boolean}
*/
Helpers.isLowerThan = function(value1, value2){
	if(_.isFinite(value1) && _.isFinite(value2))
		return value1 < value2;
	else
		return false;
};
UI.registerHelper('isLowerThan', Helpers.isLowerThan);


/**
Helper: Returns text with linked twitter users and hashtags

Must be used with tripple stash {{{parseText text}}}

@method ((parseText))
@param {String} text the text to parse
@return {String}
**/
Helpers.parseText = function (text, stripHtml) {
    // make sure not existing values are not Spacebars.kw
    if(stripHtml instanceof Spacebars.kw)
        stripHtml = false;

    if(_.isString(text)) {

        if(stripHtml)
            text = _.stripTags(text);

        // parse hashtags and add a target="_blank" to links
        return text
        .replace(/\n+/g,'<br>')
        // this regex finds every link http://mylink.de, www.mylink.de and even mylink.de
        // Thanks to Android: http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/2.0_r1/android/text/util/Regex.java#Regex.0WEB_URL_PATTERN
        .replace(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi, '<a href="http://$1" target="_blank">$1</a>')
        .replace(/http\:\/\/http\:\/\//g,'http://')
        .replace(/http\:\/\/https\:\/\//g, 'https://')
        .replace(/(\#[\w]+)/g, '<a href="http://twitter.com/$1">$1</a>')
        .replace(/^(\@[\w]+)/g, ' <a href="http://twitter.com/$1">$1</a>')
        .replace(/ (\@[\w]+)/g, ' <a href="http://twitter.com/$1">$1</a>')
        .replace(/<a href\=\"http\:\/\/twitter\.com/g,'<a target="_blank" href="http://twitter.com');

    } else if(_.isFinite(text)) {
        return text;
    } else {
        return null;
    }
};
UI.registerHelper('parseText', Helpers.parseText);