var Order = Backbone.Model.extend({

    idAttribute: "uid",
    url: function () {
    	return "../sweetorder/api/"+GLOBAL.ORDER_URL_ROOT+"/"+this.id;
    },
    setTexts: function () {
    	texts = new TextCollection();
    	texts.setPhone(this.get('phone'));
    	this.set('texts',texts);
    }
});

var OrderCollection = Backbone.Collection.extend({
			model: Order,
			url: function ( ) {
				return '../sweetorder/api/'+GLOBAL.ORDER_URL_ROOT;
			}
		});
    
var CompletedOrderCollection = Backbone.Collection.extend({
    model: Order,
    url: function ( ) {
        return '../sweetorder/api/completedorders';
    }

});

var TuftsOrderCollection = Backbone.Collection.extend({
    model: Order,
    url: function ( ) {
        return '../sweetorder/api/tufts';
    }

});
var NEUOrderCollection = Backbone.Collection.extend({
    model: Order,
    url: function ( ) {
        return '../sweetorder/api/neu';
    }

});
var UnassignedOrderCollection = Backbone.Collection.extend({
    model: Order,
    url: function ( ) {
        return '../sweetorder/api/unassignedorders';
    }

});

/*var orders = new OrderCollection();
setInterval(function() {
              orders.fetch({add:true});
            }, 30100);*/
var completedOrders = new CompletedOrderCollection();
setInterval(function() {
              completedOrders.fetch({add:true});
            }, 30200);

/*var neuOrders = new NEUOrderCollection();
setInterval(function() {
              neuOrders.fetch({add:true});
            }, 30300);

var tuftsOrders = new TuftsOrderCollection();
setInterval(function() {
              tuftsOrders.fetch({add:true});
            }, 30400);

var unassignedOrders = new UnassignedOrderCollection();
setInterval(function() {
              unassignedOrders.fetch({add:true});
            }, 30500);*/