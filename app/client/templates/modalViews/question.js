

Template['modalView_question'].events({
	'click .ok': function(e, template){
		if(_.isFunction(this.ok))
			this.ok();
	},
	'click .cancel': function(e, template){
		if(_.isFunction(this.cancel))
			this.cancel();
	}
});