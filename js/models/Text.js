var Text = Backbone.Model.extend({

    idAttribute: "uid",
    url: function () {
    	return "../sweetorder/api/"+GLOBAL.SENDTEXT_URL_ROOT;
    }
});

var TextCollection = Backbone.Collection.extend({
			model: Text,
			url: function ( ) {
				return '../sweetorder/api/'+GLOBAL.TEXT_URL_ROOT+'/'+this.phone;
			},
			setPhone: function ( phone ) {
				this.phone = phone; 
			}

		});
