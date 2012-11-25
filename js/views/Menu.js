var MenuView = Backbone.View.extend ( {
	initialize: function ( ) {
		this.model.bind("change",this.render,this);
		this.model.bind("remove",this.remove,this);
		this.model.bind("destroy",this.remove,this);
	},
	template: _.template("<div>UID: <% if(this.model.get('uid')!=null) { %> <%- uid %> <%}%> <%- this.model.get('name') %> <%- this.model.get('campus') %></div>"),

	render: function ( ) {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	editModel: function ( ) {
		Router.navigate(GLOBAL.MENU_URL_ROOT+"/"+this.model.id,true);
	},
	events: function ( ) {
		events = {
			"click" : "editModel"	
		};
		return events;
	}
} ); 

var MenuListView = ModelListView.extend ( {
	newModel: function ( ) {
		Router.navigate(GLOBAL.MENU_URL_ROOT+"/new",true);
	},
	createModelView: function ( model ) {
		return new MenuView({model:model});
	}
});

 var MenuEditView = ModelEditView.extend ( { 
	template: _.template('<label>UID</label><input id="uid" type="text" disabled value="<% if(this.model.get("uid")!=null) { %><%- uid %><%}%>"></div>'+
						'<label>Name</label><input id="name" type="text" value="<%= this.model.get("name") %>"></div>'+
						'<label>Campus</label><input id="campus" type="text" value="<%= this.model.get("campus") %>"></div>'+
						'<label>Products</label><input id="products" type="text" value="<%= this.model.get("products") %>">'+
						'<div><input id="submit" class="btn btn-large brn-block btn-primary" type="button" value="SUBMIT"></div>'
					),
	navigateBack: function ( ) {
		Router.navigate(GLOBAL.MENU_URL_ROOT,true);
	}

} );