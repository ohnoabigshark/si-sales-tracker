var SalesItem = Backbone.Model.extend({

    idAttribute: "uid",
    url: function () {
	    return "../sweetorder/api/"+GLOBAL.ORDERPRODUCT_URL_ROOT+'/'+this.get('orderID');
    }
});

var SalesItemCollection = Backbone.Collection.extend({
			model: SalesItem,
			url: function () {
				return '../sweetorder/api/'+GLOBAL.SALESITEM_URL_ROOT+'/'+this.orderID;
			},
			setOrderID: function (orderID) {
				this.orderID = orderID;
				return this;
			}
		});


