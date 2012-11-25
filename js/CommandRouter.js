var CommandRouter = Backbone.Router.extend({
			    
			    routes: {
			        "_viewport":"home",
			        "sale":"showSaleView",
			        "inventory":"showInventoryView",
			        "history":"showHistoryView"
			    }, 

			    initialize: function () {
				},
			    home: function ( ) {
			    	//console.log($("#viewport").html());
					//view = new ModelListView({collection:types});
					App.render();
			    	view = new NavView();
			    	App.showView(view);
			    },
			    showSaleView: function ( ) {
			    	order = new Order();
			    	order.save({phone:"NEW ORDER"},{success:function(){view = new SaleView({model:order});App.showView(view); }});	
			    },
			    showOrder: function ( detail ) {
			    	order = orders.get(detail);
			    	if(!order)
			    		order = completedOrders.get(detail);
			    	if(!order) {
			    		order = new Order();
			    		order.save({phone:"STREET"},{success:function(){view = new StreetOrderView({model:order}); App.showView(view); }});
			    		
			    	} else {
			    		if(order.get('phone')=="STREET"){
			    			view = new StreetOrderView({model:order});
			    		} else {
			    			view = new OrderView({model:order});
			    		}
			    		App.showView(view);
			    	}
			    	App.header.trigger('headerUpdate',order.get('phone'));
			    },
			    showHistoryView: function ( ) {
					orders.fetch();
			    	view = new OrderListView({collection:orders});
			    	App.showView(view);
			    	App.header.trigger('headerUpdate','In Progress');
			    },
			    tuftsOrders: function ( ) {
					tuftsOrders.fetch();
			    	view = new OrderListView({collection:tuftsOrders});
			    	App.showView(view);
			    	App.header.trigger('headerUpdate','TUFTS');
			    },
			    neuOrders: function ( ) {
					neuOrders.fetch();
			    	view = new OrderListView({collection:neuOrders});
			    	App.showView(view);
			    	App.header.trigger('headerUpdate','NEU');
			    },
			    unassignedOrders: function ( ) {
					unassignedOrders.fetch();
			    	view = new OrderListView({collection:unassignedOrders});
			    	App.showView(view);
			    	App.header.trigger('headerUpdate','Unassigned');
			    },
			    showCompleted: function ( ) {
			    	completedOrders.fetch();
			    	view = new CompletedOrderListView({collection:completedOrders});
			    	App.showView(view);
			    	App.header.trigger('headerUpdate','Completed');
			    },
			    getEditView: function ( type, uid ) {
						switch(type) {
							case "type": model = types.get(uid) || types.add({},{silent:true}).last(); view = new TypeEditView({model:model}); break;
							case "route": model = routes.get(uid) || routes.add({},{silent:true}).last(); view = new RouteEditView({model:model}); break;
							case "user": model = users.get(uid) || users.add({},{silent:true}).last(); view = new UserEditView({model:model}); break;
							case "menu": model = menus.get(uid) || menus.add({},{silent:true}).last(); view = new MenuEditView({model:model}); break;
							default: break;
						}
						return view;
				}
			    
			});
			
			var Router = new CommandRouter();
