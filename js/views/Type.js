var TypeView = Backbone.View.extend ( {
	initialize: function ( ) {
		this.model.bind("change",this.render,this);
		this.model.bind("remove",this.remove,this);
		this.model.bind("destroy",this.remove,this);
	},
	template: _.template("<div>UID: <% if(this.model.get('uid')!=null) { %> <%- uid %> <%}%>  Type: <%- name %></div>"),
	render: function ( ) {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	editModel: function ( ) {
		Router.navigate(GLOBAL.TYPE_URL_ROOT+"/"+this.model.id,true);
	},
	events: function ( ) {
		events = {
			"click" : "editModel"	
		};
		return events;
	}
} ); 

var TypeListView = ModelListView.extend ( {
	newModel: function ( ) {
		Router.navigate(GLOBAL.TYPE_URL_ROOT+"/new",true);
	},
	createModelView: function ( model ) {
		return new TypeView({model:model});
	}
});

 var TypeEditView = ModelEditView.extend ( { 
	template: _.template('<div>UID: <input id="uid" type="text" value="<% if(this.model.get("uid")!=null) { %><%- uid %><%}%>"></div>'+
						'<div>Name: <input id="name" type="text" value="<%- name %>"></div>'+
						'<div><input id="submit" type="button" value="SUBMIT"></div>'+
						'<% if(!this.model.isNew()) { %><div><input id="delete" type="button" value="DELETE"></div><%}%>'
					),
	navigateBack: function ( ) {
		Router.navigate(GLOBAL.TYPE_URL_ROOT,true);
	}
} );
