var RouteView = Backbone.View.extend ( {
	initialize: function ( ) {
		this.model.bind("change",this.render,this);
		this.model.bind("remove",this.remove,this);
		this.model.bind("destroy",this.remove,this);
	},
	template: _.template("<div>UID: <% if(this.model.get('uid')!=null) { %> <%- uid %> <%}%> <%- this.model.get('customerPhone') %> <%- this.model.get('timestamp') %></div>"),
	render: function ( ) {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	onclick: function ( ) {
		Router.navigate(GLOBAL.ROUTE_URL_ROOT+"/"+this.model.id,true);
	},
	events: function ( ) {
		events = {
			"click" : "onclick"	
		};
		return events;
	}
} ); 

var ChatRouteView = RouteView.extend ( {
	template: _.template("<h3><%- this.model.get('customerPhone') %> <%- this.model.get('timestamp') %></h3>"),
	onclick: function ( ) {
		Router.navigate(GLOBAL.CHAT_URL_ROOT+"/"+this.model.id,true);
	}
} ); 

var RouteListView = ModelListView.extend ( {
	newModel: function ( ) {
		Router.navigate(GLOBAL.ROUTE_URL_ROOT+"/new",true);
	},
	createModelView: function ( model ) {
		return new RouteView({model:model});
	}
});

 var RouteEditView = ModelEditView.extend ( { 
	template: _.template('<label>UID</label><input id="uid" type="text" disabled value="<% if(this.model.get("uid")!=null) { %><%- uid %><%}%>"></div>'+
						'<label>Timestamp</label><input id="timestamp" disabled type="text" value="<%= this.model.get("timestamp") %>"></div>'+
						'<label>Sweet Idea User ID</label><select id="userID"></select>'+
						'<label>Customer Phone #</label><input id="customerPhone" type="text" value="<%= this.model.get("customerPhone") %>"></div>'+
						'<div><input id="submit" class="btn btn-large brn-block btn-primary" type="button" value="SUBMIT"></div>'
					),
	render: function ( ) {
		this.$el.html(this.template(this.model.toJSON()));
		selectBox = new FormSelectView({collection:users,el:this.$("#userID"),attributes:{displayAttr:"firstName",selected:this.model.get("userID")}});
		return this;
	},	
	navigateBack: function ( ) {
		Router.navigate(GLOBAL.ROUTE_URL_ROOT,true);
	},
	save: function ( ) {
		_.each(this.$('input, select'),this.updateAttribute,this);
		this.model.save({},{success:this.navigateBack}); 
	}

} );