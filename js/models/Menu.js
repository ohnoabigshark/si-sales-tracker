var Menu = Backbone.Model.extend({

    idAttribute: "uid",
    urlRoot: "../sweetorder/api/"+GLOBAL.MENU_URL_ROOT,
    getProductCollection: function () {
    	return new ProductCollection(this.get('products'));
    }
}); 

var MenuCollection = Backbone.Collection.extend({
			model: Menu,
			url: '../sweetorder/api/'+GLOBAL.MENU_URL_ROOT
		});

var MenuTufts = new Menu({uid:1});
MenuTufts.fetch();