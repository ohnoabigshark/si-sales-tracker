var Route = Backbone.Model.extend({
	idAttribute: "uid",
	urlRoot: "../sweetorder/api/"+GLOBAL.ROUTE_URL_ROOT,
    viewType: function () {
	   return "route";
	}
});

var RouteCollection = Backbone.Collection.extend({
			model: Route,
			url: '../sweetorder/api/'+GLOBAL.ROUTE_URL_ROOT
		});


var routes = new RouteCollection();