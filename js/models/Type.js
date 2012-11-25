var Type = Backbone.Model.extend({

    idAttribute: "uid",
    urlRoot: "../sweetorder/api/"+GLOBAL.TYPE_URL_ROOT,
    viewType: function () {
	   return "type";  //explode urlRoot, take last arg
	}
});

var TypeCollection = Backbone.Collection.extend({
			model: Type,
			url: '../sweetorder/api/'+GLOBAL.TYPE_URL_ROOT
		});

var types = new TypeCollection();