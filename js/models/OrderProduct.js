var OrderProduct = Backbone.Model.extend({

    idAttribute: "uid",
    urlRoot: function ( ) {
	    return "../sweetorder/api/"+GLOBAL.ORDERPRODUCT_URL_ROOT+'/'+this.get('orderID');
	}
});

var OrderProductCollection = Backbone.Collection.extend({
			model: OrderProduct,
			url: function () { 
				return '../sweetorder/api/'+GLOBAL.ORDERPRODUCT_URL_ROOT+'/'+this.orderID; 
			},
			initialize: function ( models, args ) {
				this.orderID = args.orderID;
			}
		});

//var orderProducts = new OrderProductCollection();