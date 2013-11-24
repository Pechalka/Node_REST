//List view model 

var Category = function(data){
	var self = this;

	self.id = data.id;
	self.title = data.title;
	self.range = ko.observable(data.range);

	self.updateRange = function(offset, cb){
		self.range(self.range()+offset);
		data.range = self.range();
		$.put('/api/category/' + data.id, data, cb);		
	}
}

var List = function(){
	var self = this;

	self.pager = ko.observable(new Pager({ perPage : 5 }));

	self.breadcrumb = ko.observable(new NavBar([
							{ name : 'Home', parentId : 0 }
						]));

	self.items = ko.observableArray([])
					.extend({
						fetch : {
							source : '/api/category',
							params : { 
								page : self.pager().page,
								perPage : self.pager().perPage,
								sortField : 'range',
								sortDist : 'DESC',
								parentId : self.breadcrumb().currentCategoryId 
							},
							proccessReponse : function(response){
								self.pager().setItemsCount(response.totalCount);
								return response.items;
							},
							map : Category
						}
					});

	self.categoryId = ko.observable();
	self.upClick = function(category){
		self.categoryId(category.id);
		category.updateRange(+1, self.fetch)
	}

	self.downClick = function(category){
		self.categoryId(category.id);
		category.updateRange(-1, self.fetch)
	}

	self.add = function(){
		bus.trigger('add',  { parentId : self.breadcrumb().currentCategoryId() });		
	}

	self.edit = function(item){
		bus.trigger('edit', { id : item.id });				
	}

	self.moveToChild = function(item){
		self.breadcrumb().add({ name : item.title, parentId : item.id });
	}

	self.fetch = function(){
		self.items.reload();
	}

	self.remove = function(item){
		$.delete('/api/category/' + item.id, self.fetch);
	}
}