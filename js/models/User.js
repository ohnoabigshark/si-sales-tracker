var User = Backbone.Model.extend({

    idAttribute: "uid",
    urlRoot: "../sweetorder/api/"+GLOBAL.USER_URL_ROOT,
    viewType: function () {
	   return "user";
	}
});

var UserCollection = Backbone.Collection.extend({
			model: User,
			url: '../sweetorder/api/'+GLOBAL.USER_URL_ROOT
		});

var users = new UserCollection();
