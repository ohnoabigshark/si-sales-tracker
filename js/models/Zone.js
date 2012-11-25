var Zone = Backbone.Model.extend({

    idAttribute: "uid",
    url: function () {
    	return "../sweetorder/api/"+GLOBAL.ZONE_URL_ROOT;
    }
});

var ZoneCollection = Backbone.Collection.extend({
			model: Text,
			url: function () {
		    	return "../sweetorder/api/"+GLOBAL.ZONE_URL_ROOT;
		    }

		});


var deliveryZones = new ZoneCollection();
deliveryZones.add(new Zone({uid:1,name:"Tufts University",imageSrc:"http://haveasweetidea.com/blog/wp-content/uploads/2012/01/delivery_zone_base.png"}));
deliveryZones.add(new Zone({uid:2,name:"Northeastern University",imageSrc:"http://www.placehold.it/300x300"}));