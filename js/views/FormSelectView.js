 var FormSelectView = Backbone.View.extend ( {
 	//collection: ,
 	//displayAttr: ,
 	//selected:,
 	el: $('<select></select>'),
	initialize: function () {
		this.collection.on('add',this.addOne,this);
		this.collection.on('reset',this.addAll,this);
		this.collection.on('all',this.render,this);
		this.collection.fetch();
	},
	addOne: function (model, options) {
		selected = "";
		if(model.id==this.attributes.selected)
			selected = " selected";
		option = $('<option value="'+model.id+'" '+selected+'>'+model.get(this.attributes.displayAttr)+'</option>');
		
		this.$el.append(option);
	}, 
 
	addAll: function ( ) {
		console.log(this.collection);
		this.collection.each(this.addOne,this);
	},
	render: function () {
		return this;
	}
 } );

  var QtySelectView = Backbone.View.extend ( {
 	//selected:,
	initialize: function () {
		this.values = [0,1,2,3,4,5,6,7,8,9,10];
	},
	addOne: function (value) { 
		selected = "";
		if(value==this.attributes.selected)
			selected = " selected";
		option = $('<option value="'+value+'" '+selected+'>'+value+'</option>');
		
		this.$el.append(option);
	}, 
 
	addAll: function ( ) {
		_.each(this.values,this.addOne,this);
	},
	render: function () {
		this.addAll();    
		return this;
	}
 } );