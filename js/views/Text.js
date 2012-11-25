var TextView = Backbone.View.extend ( {
	className: 'text',
	id: 'Body',
	initialize: function ( ) {
		this.model.bind("change",this.render,this);
		this.model.bind("remove",this.remove,this);
		this.model.bind("destroy",this.remove,this);
	},
	template: _.template("<%- this.model.get('From') %><br><%- this.model.get('timestamp') %><br><%- this.model.get('Body') %>"),
	render: function ( ) {
		this.$el.html(this.template(this.model.toJSON()));
		if (this.model.get('received')==1) {
			this.$el.addClass('received');		
		} else {
			this.$el.addClass('sent');
		}
		return this; 
	},
	remove: function ( ) {
		this.$el.remove();
		return this;
	}
} ); 

var TextListView = ModelListView.extend ( {
	 
	initialize: function ( ) {
		this.collection.on('add',this.addOne,this);
		this.collection.on('reset',this.addAll,this);
		this.collection.on('all',this.render,this);
		if(this.collection.phone!="STREET") {
			that = this;
			setInterval(function() {
			  that.collection.fetch({add:true});
			}, 10000);
		}
	},
	render: function () {
		this.$el.empty();
		this.collection.each(this.addOne,this);
		return this;
	},
	addOne: function (model, options) {
		var view = this.createModelView(model);//new TypeView({"model": model});
		this.$el.append(view.render().el);
		this.$el.scrollTop(this.$el.prop('scrollHeight'));
	}, 
	newModel: function ( ) {
		//Router.navigate(GLOBAL.TEXT_URL_ROOT+"/new",true);
	},
	createModelView: function ( model ) {
		model = new TextView({model:model});
		return model;
	},
	scrollToBottom: function () {
		this.$el.scrollTop(this.$el.prop('scrollHeight'));
	}
});

 var TextEditView = ModelEditView.extend ( { 
	template: _.template('<textarea id="Body"></textarea>'+
						'<input id="submit" class="whiteButton" type="button" value="SEND">'
					),
	navigateBack: function ( ) {
		$("html, body").animate({ scrollTop: $(document).height() }, "slow");
	},
	save: function ( ) {
		this.model = new Text();
		_.each(this.$('input, textarea, select'),this.updateAttribute,this);
		this.model.set('To',this.collection.phone);
		//this.collection.add(this.model); 
		that = this;
		this.model.save({},{success:function(){that.trigger('textSent'); that.$('#Body').val('');},error:function(){that.$('#Body').val('ERROR TEXT NOT SENT');}});
		//here we should trigger an event to bubble up to the text view
	}
} );
