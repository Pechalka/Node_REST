
define([
	"knockout"
	, "text!./../templates/NavBar.html"
	], function(
		ko
		, template
		){

	return  function(data){
		var self = this;

		self.breadcrumb = ko.observableArray([
			{ name : 'Home', parentId : 0 }
		]);

		self.currentCategoryId = ko.computed(function(){
			return self.breadcrumb()[self.breadcrumb().length-1].parentId;
		})

		self.navClick = function(item){
			var result = [];
			var breadcrumb = self.breadcrumb();
			for (var i = 0; i < breadcrumb.length; i++) {
				result.push(breadcrumb[i]);
				if (breadcrumb[i].parentId == item.parentId) break;
			}
			self.breadcrumb(result);
		}
		self.add = function(item){
			self.breadcrumb.push(item);
		}

		self.template = template;
	}
});