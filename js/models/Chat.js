var Chat = Backbone.Model.extend({

    idAttribute: "uid",
    urlRoot: "../sweetorder/api/"+GLOBAL.CHAT_URL_ROOT
});

var ChatCollection = Backbone.Collection.extend({
			model: Chat,
			url: '../sweetorder/api/'+GLOBAL.CHAT_URL_ROOT
		});

var chats = new ChatCollection();