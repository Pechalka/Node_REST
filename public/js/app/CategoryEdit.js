
define([
	"knockout"
	, "jquery"
	, "bus"
	], function(
		ko,
		$,
		bus
		){
//Edit view model 
var trigger_refresh = function(){
	bus.trigger('refresh');
}

	return function(model){
		var model = model;
		var self = this;
		self.formTitle = ko.observable(model.id ? 'create' : 'update');
		self.title = ko.observable(model.title);

		self.save = function(){
			model.title = self.title();
			if (model.id){
				$.put('/api/category/' + model.id, model, trigger_refresh);
			} else {
				$.post('/api/category', model, trigger_refresh);
			}
		}
	}
});