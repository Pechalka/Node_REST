
define([
	"knockout"
	, "text!./../templates/Pager.html"
	], function(
		ko
		, template
		){

	return function(data){
		var self = this;

		self.page = ko.observable(1);
		self.perPage = ko.observable(data.perPage);

		self.itemsCount = ko.observable(1);

		self.totalPages = ko.computed(function(){
			if (self.itemsCount() == 0) return 1;

			return Math.ceil(self.itemsCount() / self.perPage());
		})

		self.text = ko.computed(function(){
			return ' page ' + self.page() + ' of ' + self.totalPages();
		})

		self.canNotNext = ko.computed(function(){
			var page = self.page()+1;
			return page > self.totalPages();
		});

		self.nextClick = function(){
			if (self.canNotNext()) return;

			self.page(self.page()+1);
		}

		self.canNotPrev = ko.computed(function(){
			var page = self.page()-1;
			return page == 0;
		});

		self.prevClick = function(){
			if (self.canNotPrev()) return;

			self.page(self.page() - 1);
		}

		self.setItemsCount = function(count){
			self.itemsCount(count);
		}

		self.template = template;
	}
});
