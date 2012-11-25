var UserView = Backbone.View.extend ( {
	initialize: function ( ) {
		this.model.bind("change",this.render,this);
		this.model.bind("remove",this.remove,this);
		this.model.bind("destroy",this.remove,this);
	},
	template: _.template("<a href='#users/<%- uid %>'><div>UID: <% if(this.model.get('uid')!=null) { %> <%- uid %> <%}%> <%- firstName %> <%- lastName %></div></a>"),
	render: function ( ) {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	editModel: function ( ) {
		Router.navigate(GLOBAL.USER_URL_ROOT+"/"+this.model.id,true);
	},
	events: function ( ) {
		events = {
			"click" : "editModel"	
		};
		return events;
	}
} ); 

var UserListView = ModelListView.extend ( {
	newModel: function ( ) {
		Router.navigate(GLOBAL.USER_URL_ROOT+"/new",true);
	},
	createModelView: function ( model ) {
		return new UserView({model:model});
	}
});

 var UserEditView = ModelEditView.extend ( { 
	template: _.template('<div>UID: <input id="uid" type="text" value="<% if(this.model.get("uid")!=null) { %><%- uid %><%}%>"></div>'+
						'<div>First Name: <input id="firstName" type="text" value="<%= this.model.get("firstName") %>"></div>'+
						'<div>Last Name: <input id="lastName" type="text" value="<%= this.model.get("lastName") %>"></div>'+
						'<div>Phone Number: <input id="phoneNumber" type="text" value="<%= this.model.get("phoneNumber") %>"></div>'+
						'<div><input id="submit" type="button" value="SUBMIT"></div>'
					),
	navigateBack: function ( ) {
		Router.navigate(GLOBAL.USER_URL_ROOT,true);
	}

} );