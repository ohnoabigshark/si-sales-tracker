var ChatView = Backbone.View.extend ( {
	initialize: function ( ) {
		this.model.bind("change",this.render,this);
		this.model.bind("remove",this.remove,this);
		this.model.bind("destroy",this.remove,this);
		this.$el.html(this.template());

		texts = new TextCollection(this.model.get('texts'),{silent:true});
		this.textList = new TextListView({el:this.$("#textList"),collection:texts});
		attrs = {routeID:this.model.get('route').uid,customerPhone:this.model.get('route').customerPhone};
		this.textForm = new TextEditView({el:this.$("#textForm"),collection:texts,attributes:attrs});
		orderProducts =  new OrderProductCollection([],obj);
		orderProducts.fetch();
		this.orderView = new OrderView({el:this.$("#orderForm"),attributes:{order:this.model.get('order'),menu:MenuTufts}});

	}, 
	template: _.template("<ul id='orderTab' class='nav nav-tabs' style='width: 100%;'><li class='active'><a id='text'>TEXT</a></li><li><a id='order'>ORDER</a></li></ul><div id='textList'></div><div id='textForm'></div><div id='orderForm'></div>"),
	render: function ( ) {
		this.textList.render();
		this.textForm.render();
		this.orderView.render();
		return this;
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	editModel: function ( ) {
		Router.navigate(GLOBAL.CHAT_URL_ROOT+"/"+this.model.get('route').uid,true);
	},
	showOrder: function () {
		this.textForm.$el.hide();
		this.textList.$el.hide();
		this.orderView.$el.show();
	},
	showText: function ( ) {
		this.textForm.$el.show();
		this.textList.$el.show();
		this.orderView.$el.hide();
	},
	events: function ( ) {
		events = {
			"click" : "editModel",
			"click a#order" : "showOrder",
			"click a#text" : "showText"
		};
		return events;
	}
} ); 
 
var ChatListView = ModelListView.extend ( {
	newModel: function ( ) {
		Router.navigate(GLOBAL.CHAT_URL_ROOT+"/new",true);
	},
	createModelView: function ( model ) {
		model = new Route(model.get('route'));
		model = new ChatRouteView({model:model});
		return model;
	}
});

 var ChatEditView = ModelEditView.extend ( { 
	template: _.template('<div>UID: <input id="uid" type="text" value="<% if(this.model.get("uid")!=null) { %><%- uid %><%}%>"></div>'+
						'<div>Name: <input id="name" type="text" value="<%- name %>"></div>'+
						'<div><input id="submit" type="button" value="SUBMIT"></div>'+
						'<% if(!this.model.isNew()) { %><div><input id="delete" type="button" value="DELETE"></div><%}%>'
					),
	navigateBack: function ( ) {
		Router.navigate(GLOBAL.CHAT_URL_ROOT,true);
	}
} );
