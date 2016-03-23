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
		onBeforeAction: function () {
	        AccountsEntry.signInRequired(this);
	        if(this.next)
		        this.next();
	    }
	});
});