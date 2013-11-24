

require.config({
    paths: {
    	"jquery" : "vendor/jquery"
    	, "bootstrap" : "/bootstrap/js/bootstrap.min"
    	, "knockout" : "vendor/knockout-2.3.0"		
    	, "bus" : "libs/bus"
    	, "utils" : "libs/knockout.localStorage"
    	, "REST" : "libs/REST"
    	, "text": "vendor/text"
    	, "templateEngine" : "vendor/stringTemplateEngine"
    },
    shim: {
    	"bootstrap" : ["jquery"]
    }
})


require([
	"knockout"
	, "jquery"
	, "bus"
	, "app/viewModels/CategoryList"
	, "app/viewModels/CategoryEdit"
	, "utils"
	, "REST"
	, "bootstrap"
	, "templateEngine"
	], function(
		ko
		, $
		, bus
		, List
		, Edit
	){
	
	var app = {
		popup : ko.observable(null),
		content : ko.observable(null)
	};

	bus.on('refresh', function(){
		$('#edit-form').modal('hide');
		app.popup(null);
		app.content().fetch();
	})

	bus.on('add', function(e, data){
		var model = {
			title : '',
			status : "ACTION",
			range : 5,
			description : "bla",
			parentId : data.parentId,
			isService : 1
		};
		app.popup(new Edit(model))
		$('#edit-form').modal('show');
	})

	bus.on('edit', function(e, data){
		$.get('/api/category/' + data.id, function(model){
			app.popup(new Edit(model));
			$('#edit-form').modal('show');		
		})
	})


	$(function() {
		ko.applyBindings(app);

		app.content(new List())
		app.content().fetch();
	})
});
