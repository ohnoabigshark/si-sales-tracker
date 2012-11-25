var SaleView = Backbone.View.extend ( { 

	initialize: function ( ) {
		this.$el.html(this.template());
		this.model.set('salesitems',new SalesItemCollection());
		this.loadElements();
		this.model.get('salesitems').setOrderID(this.model.id).fetch();
		this.showMenu();
	},
	template: _.template(""+
					"<div id='orderMenu'></div>"),
	render: function ( ) {
		this.orderMenu.render();
		return this;
	},


	loadElements: function ( ) {
		this.orderMenu = new OrderMenu({el:this.$("#orderMenu"),model:this.model,collection:this.model.get('salesitems')});
		this.orderMenu.on("save",this.updateOrder,this);
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	showMenu: function () {
		this.orderMenu.$el.show();
	},
	updateOrder: function ( ) {
		
	},
	events: function ( ) {
		events = {
		};
		return events;
	}

} );


var OrderListingView = Backbone.View.extend ( {
	initialize: function ( ) {
		this.model.bind("change",this.render,this);
		this.model.bind("remove",this.remove,this);
		this.model.bind("destroy",this.remove,this);
	}, 
	//model will be {order, menu}
	template: _.template("<div class='orderListing'><div class='phone'><%- this.model.get('phone') %></div><div id='time' class='time'>"+
						"<%- this.model.get('timeCreated') %></div><div class='zone' id='uni'></div>"+
						"</div>"),
	render: function ( ) {
		this.$el.html(this.template());
		this.model.get('assignedTo')==2?this.$('div').addClass('northeastern'):this.$('div').addClass('tufts');
		time = this.model.get('timeTouched');
		time = new Date(time);
		if(time.getDate()>0)
			this.$("#time").html(this.model.get('timeTouched'));
		zone = deliveryZones.get(this.model.get('assignedTo')); 
		if(zone){this.$("#uni").html(zone.get('name'));}

		return this;
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	onclick: function ( ) {
		Router.navigate(GLOBAL.ORDER_URL_ROOT+"/"+this.model.id,true);
	},
	events: function ( ) {
		events = {
			"click" : "onclick"	
		};
		return events;
	}
} ); 

var CompletedOrderListView = ModelListView.extend ( {
	addOne: function (model, options) {
		//var timeDelivered = new Date(model.get('timeDelivered'));
		//if(timeDelivered.getDate()>0) {
			var view = this.createModelView(model);//new TypeView({"model": model});
			this.$el.append(view.render().el);
		//}
	},
	createModelView: function ( model ) {
		return new OrderListingView({model:model});
	}

});

var OrderListView = ModelListView.extend ( {
	addOne: function (model, options) {
		//var timeDelivered = new Date(model.get('timeDelivered'));
		//if(!(timeDelivered.getDate()>0)) {
			var view = this.createModelView(model);//new TypeView({"model": model});
			this.$el.append(view.render().el);
		//}
	},
	createModelView: function ( model ) {
		return new OrderListingView({model:model});
	}

});

var StreetOrderView = Backbone.View.extend( {
	initialize: function ( ) {
		this.$el.html(this.template());
		this.model.set('salesitems',new SalesItemCollection());
		this.loadElements();
		this.model.get('salesitems').setOrderID(this.model.id).fetch();
		this.showMenu();
	},
	template: _.template(""+
					"<div class='orderHeader'>"+
						"<div class='link' id='menu'>MENU</div>"+
						"<div class='link' id='info'>INFO</div>"+
					"</div>"+
					"<div id='orderForm'></div>"+
					"<div id='orderMenu'></div>"),
	render: function ( ) {
		this.orderView.render();
		this.orderMenu.render();
		return this;
	},


	loadElements: function ( ) {
		this.orderMenu = new OrderMenu({el:this.$("#orderMenu"),model:this.model,collection:this.model.get('salesitems')});
		this.orderView = new OrderEditView({el:this.$("#orderForm"),model:this.model});
		this.orderMenu.on("save",this.updateOrder,this);
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	editModel: function ( ) {
		//Router.navigate(GLOBAL.CHAT_URL_ROOT+"/"+this.model.get('route').uid,true);
	},
	showInfo: function () {
		this.orderView.$el.show();
		this.orderMenu.$el.hide();
	},
	showMenu: function () {
		this.orderView.$el.hide();
		this.orderMenu.$el.show();
	},
	updateOrder: function ( ) {
		
	},
	events: function ( ) {
		events = {
			"click" : "editModel",
			"click #info" : "showInfo",
			"click #menu" : "showMenu"

		};
		return events;
	}

} );

var OrderView = Backbone.View.extend( {
	className: 'fullheight',
	initialize: function ( ) {
		this.$el.html(this.template());
		if(this.model.get('phone')) {
			this.model.setTexts();
			this.loadTextView();
			this.model.get('texts').fetch();
		}
		this.model.set('salesitems',new SalesItemCollection());
		this.loadElements();
		this.model.get('salesitems').setOrderID(this.model.id).fetch();
		this.showMenu();
	},
	template: _.template(""+
						"<div class='orderHeader'>"+
							"<div class='link' id='text'>TEXT</div>"+
							"<div class='link' id='menu'>MENU</div>"+
							"<div class='link' id='info'>INFO</div>"+
						"</div>"+
						"<div id='textList' class='scrollableList'></div>"+
						"<div id='textForm'></div>"+
						"<div id='orderForm'></div>"+
						"<div id='orderMenu'></div>"),
	render: function ( ) {
		this.trigger('viewOrder',this.model.get('phone'));
		this.renderTexts();
		this.orderView.render();
		this.orderMenu.render();
		return this;
	},
	renderTexts: function ( ) {
		if(this.textList)
			this.textList.render();
		if(this.textForm)
			this.textForm.render(); 
	},
	loadTextView: function ( ) {
		this.textList = new TextListView({el:this.$("#textList"),collection:this.model.get('texts')});
		this.textForm = new TextEditView({el:this.$("#textForm"),collection:this.model.get('texts')});
		this.textForm.on('textSent',this.textSent,this);
	},
	loadElements: function ( ) {
		this.orderMenu = new OrderMenu({el:this.$("#orderMenu"),model:this.model,collection:this.model.get('salesitems')});
		this.orderView = new OrderEditView({el:this.$("#orderForm"),model:this.model});
		this.orderMenu.on("save",this.updateOrder,this);
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	},
	editModel: function ( ) {
		//Router.navigate(GLOBAL.CHAT_URL_ROOT+"/"+this.model.get('route').uid,true);
	},
	showInfo: function () {
		this.textForm.$el.hide();
		this.textList.$el.hide();
		this.orderView.$el.show();
		this.orderMenu.$el.hide();
	},
	showText: function ( ) {
		this.textForm.$el.show();
		this.textList.$el.show();
		this.textList.scrollToBottom();
		this.orderView.$el.hide();
		this.orderMenu.$el.hide();
	},
	showMenu: function () {
		this.textForm.$el.hide();
		this.textList.$el.hide();
		this.orderView.$el.hide();
		this.orderMenu.$el.show();
	},
	textSent: function ( ) {
		this.model.save({timeTouched:"CURRENT_TIMESTAMP"});
	},
	updateOrder: function ( ) {
		
	},
	events: function ( ) {
		events = {
			"click" : "editModel",
			"click #info" : "showInfo",
			"click #text" : "showText",
			"click #menu" : "showMenu"

		};
		return events;
	}

} );


var OrderEditView = ModelEditView.extend ( {
		initialize: function ( ) {
			this.$el.html(this.template());	
		},
		template: _.template("<table>"+
								"<tr>"+
									"<td>Created: <%- this.model.get('timeCreated') %></td><td>Lat: <%- this.model.get('latitude') %> / Long: <%- this.model.get('longitude') %></td>"+
								"</tr><tr>"+
									"<td>Dispatched: <%- this.model.get('timeDispatched') %></td><td><select id='assignedTo'><option value='0'>DISPATCH</option><option value='1' <%- this.model.get('assignedTo')==1?'selected':'' %> >Tufts University</option><option value='2' <%- this.model.get('assignedTo')==2?'selected':'' %>>Northeastern University</option></select></div></td>"+
								"</tr>"+
							"</table>"+
							"<div><image id='deliverZone' width='300' src=''></div>"+
							"<input type='button' id='delete' value='DELETE'>"),
		navigateBack: function ( ) {
		},
		render: function ( ) {
			if(this.model)
				this.$el.html(this.template(this.model.toJSON()));
			else
				this.$el.html(this.template());
			
			zone = deliveryZones.get(this.model.get('assignedTo')); 
			if(zone){this.$("#deliverZone").attr("src",zone.get('imageSrc'));}	
			return this;		
		},
		deleteOrder: function ( ) {
			this.model.destroy();
			Router.navigate('_viewport',true);
		},
		updateOrder: function ( ) {
			zone = this.$("#assignedTo").val();
			this.model.set('assignedTo',zone);
			zone = deliveryZones.get(zone);
			if(zone){this.$("#deliverZone").attr("src",zone.get('imageSrc'));}
			this.model.save({timeDispatched:"CURRENT_TIMESTAMP",timeTouched:"CURRENT_TIMESTAMP"});
		},
		events: function ( ) {
			events = {
				"click #delete" : "deleteOrder",
				"change #assignedTo" : "updateOrder"
			};
			return events;
		}
});

var OrderMenu = ModelListView.extend ( { 
	initialize: function ( ) {
		this.$el.html(this.template());	

		this.collection.on('add',this.addOne,this);
		this.collection.on('reset',this.addAll,this);
		this.collection.on('all',this.render,this);
	},
	template: _.template("<div id='status'></div>"+
						"<div class='row-fluid' id='menuItems'></div>"+
						"<div class='row-fluid' id='totalRow'><div class='butt'>Total </div><div id='total' class='butt'><%- this.model.get('price') %></div></div>"+
						"<div id='controls'>"+
						"<input id='cash' class='whiteButton big' type='button' value='PAID CASH'>"+
						"<input id='credit' class='whiteButton big' type='button' value='PAID CREDIT'>"
						+"</div>"),
	render: function ( ) {
		var timeDelivered = new Date(this.model.get('timeDelivered'));
		if(timeDelivered.getDate()>0) {
			this.$("#status").addClass('completed').text("COMPLETED");
			this.$("select").attr('disabled','disabled');
			this.$("input").hide();
		}
		return this;
	},
	addOne: function (model, options) {
		view = this.createModelView(model);//new TypeView({"model": model});
		view.on('change',this.updateTotal,this);
		this.$("#menuItems").append(view.render().el);
	}, 
	addAll: function ( ) {
		this.collection.each(this.addOne,this);
	},
	createModelView: function ( model ) {
		//return new OrderProductView({model:model});
		return new SaleProductView({model:model});
	},

	updateAttribute: function ( el ) {
		if(el.id!="submit") {
			salesitem=this.collection.get(el.id);
			salesitem.set('qty',$(el).val());
			salesitem.save({},{success:this.navigateBack});
		}
	},
	updateTotal: function ( ) {
		total = this.collection.reduce(
			this.reduceFunction,0
		);
		this.$("#total").html("$"+total);
		this.model.set('price',total);
	},
	reduceFunction: function ( memo, model ) {
			qty = model.get('qty');
			price = model.get('price');
			return memo + (qty*price);
	},
	navigateBack: function ( ) {
		//Router.navigate(,true);	
	},
	paidCash: function () {
		this.model.set('paymentType',0);
		this.save();	
	},
	paidCredit: function ( ) {
		this.model.set('paymentType',1);	
		this.save();
	},
	save: function ( ) {
		_.each(this.$('input[type=text]'),this.updateAttribute,this);
		that = this;
		navigator.geolocation.getCurrentPosition(function(position){
			that.model.set('latitude',position.coords.latitude);
			that.model.set('longitude',position.coords.longitude);
			that.model.set('timeDelivered','CURRENT_TIMESTAMP');
			that.model.set('timeTouched','CURRENT_TIMESTAMP');
			that.model.save({});
			Router.navigate('_viewport',true);
			that.trigger("save");
		});
		
	},
	events: function ( ) {
		events = {
			"click #credit" : "paidCredit",
			"click #cash" : "paidCash",
		};
		return events;
	}

});

var SaleProductView = Backbone.View.extend (  { 
	className: '',
	initialize: function ( ) {
		this.$el.html(this.template());	
	},
	template: _.template("<div class='productRow'>"+
						"<div class='productName'><div> + <%- this.model.get('name') %></div><div>$<%- this.model.get('price') %></div></div>"+
						"<div class='productControls'><div class='reset'>RESET</div>"+
						"<div class='productQty'><input type='text' class='saleInputText' id='<%- this.model.get('uid') %>' value=<%- this.model.get('qty') %>></div></div>"+
						//"<div class='butt' id='price'></div>"+
						"</div>"),
	updatePrice: function () {
		qty = parseInt($("#"+this.model.get('uid')).val());
		price = qty*this.model.get('price');
		//this.$("#price").html("$"+price);	
		this.model.set('qty',qty);
		this.trigger('change');
	},
	render: function ( ) {
		return this;
	},
	focusSelect: function ( ) {
		ele = this.$("#"+this.model.get('uid'));
		ele.focus();
		ele.select();
	},
	incrementQty: function ( ) {
		ele = this.$("#"+this.model.get('uid'));
		qty = parseInt(ele.val())+1;
		ele.val(qty);
		this.updatePrice();
	},
	resetQty: function ( ) {
		ele = this.$("#"+this.model.get('uid'));
		qty = 0;
		ele.val(qty);
		this.updatePrice();
	},
	events: function ( ) {
		events = {
			"change input" : "updatePrice",
			"click .productName":"incrementQty",
			"click .reset":"resetQty"

		};
		return events;
	}
} );
 
var OrderProductView = Backbone.View.extend ( {
	className: '',
	initialize: function ( ) {
		this.$el.html(this.template());	
		this.selectBox = new QtySelectView({el:this.$("#"+this.model.get('uid')),attributes:{selected:this.model.get('qty')}});
	},
	template: _.template("<div class='productRow'>"+
						"<div class=''><%- this.model.get('name') %></div>"+
						"<div class='butt'><select id='<%- this.model.get('uid') %>' class='qtySelect'></select> x </div>"+
						"<div class='butt'>$<%- this.model.get('price') %> = </div>"+
						"<div class='butt' id='price'></div>"+
						"</div>"),
	updatePrice: function () {
		qty = $("#"+this.model.get('uid')).val();
		price = qty*this.model.get('price');
		this.$("#price").html("$"+price);	
		this.model.set('qty',qty);
		this.trigger('change');
	},
	render: function ( ) {
		this.selectBox.render();
		return this;
	},
	focusSelect: function ( ) {
		ele = this.$("#"+this.model.get('uid'));
		ele.focus();
		ele.select();
	},
	events: function ( ) {
		events = {
			"change select" : "updatePrice",
			"click":"focusSelect"

		};
		return events;
	}
});