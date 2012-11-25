var ModelListView = Backbone.View.extend ( {
	initialize: function () {
		this.collection.on('add',this.addOne,this);
		this.collection.on('reset',this.addAll,this);
		this.collection.on('all',this.render,this);
	},
	addOne: function (model, options) {
		var view = this.createModelView(model);//new TypeView({"model": model});
		this.$el.append(view.render().el);
	}, 
 
	addAll: function ( ) {
		this.collection.each(this.addOne,this);
	},
	render: function () {
		this.$el.empty();
		this.collection.each(this.addOne,this);
		return this;
	},
	events: function ( ) {
		events = {
			"click #new" : "createNewModel"
		};
		return events;
	},
	createNewModel: function ( ) {
		
	},
	createModelView: function (model) {

	}
 } );

 var ModelEditView = Backbone.View.extend ( { 
	events: function ( ) {
		events = {
			"click #submit" : "save",
			"click #delete" : "deleteModel"
		};
		return events;
	},
	
	render: function ( ) {
		if(this.model)
			this.$el.html(this.template(this.model.toJSON()));
		else
			this.$el.html(this.template());
		return this;		
	},
	updateAttribute: function ( el ) {
		if(el.id!="submit")
			this.model.set(el.id,$(el).val());
	},
	deleteModel: function ( ) {
		this.model.destroy({success:this.navigateBack});
	},
	save: function ( ) {
		_.each(this.$('input'),this.updateAttribute,this);
		this.model.save({},{success:this.navigateBack}); 
	}
} );