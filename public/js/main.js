
//app
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