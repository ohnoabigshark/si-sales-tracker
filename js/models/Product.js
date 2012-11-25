var Product = Backbone.Model.extend({

    idAttribute: "uid"
});

var ProductCollection = Backbone.Collection.extend({
			model: Product
		});
