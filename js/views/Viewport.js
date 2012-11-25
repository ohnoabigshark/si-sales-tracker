var Viewport = Backbone.View.extend ( {
	el: "#viewport",
	template: _.template("<div id='header' class='orderPhoneHeader'></div><div id='content'></div><div id='edit'></div><div id='footer'></div>"),
	initialize: function ( ) {
		this.$el.html(this.template());
		this.header = new HeaderView({el:this.$("#header")});
		this.header.on("home",this.home,this);
		this.header.on("headerUpdate",this.header.updateHeaderTitle,this.header);	
		this.header.on("newOrder",this.newOrder,this);
		//this.footer = new HomeFooterView({el:this.$("#footer")});
	},
	render: function () {
		this.header.render();
		//this.footer.render();
		return this;
	},
	showView: function ( view ) {
		if(this.main) {
			this.main.close();
		}
		this.main = view;
		this.main.on('viewOrder',this.updateHeader,this);
		this.main.on('viewOrder',this.textFooter,this);
		this.main.render();

		$("#content").html(this.main.el);
	},
	home: function ( e ) {
		Router.navigate('_viewport',true);
	},
	cannedText: function ( body ) {
		text = new Text();
		text.set('To',this.main.model.get('texts').phone);
		text.set('Body',body);
		this.main.model.get('texts').add(this.model);
		text.save({});
	},
	newOrder: function ( ) {
		Router.navigate('newOrder',true);
	},
	updateHeader: function ( phone ) {
		$('#pageTitle').html(phone);
	},
	textFooter: function ( )  {
		/*this.footer = new TextFooterView({el:this.$("#footer")});
		this.footer.on('home',this.homeFooter,this);
		this.footer.render();*/
	},
	homeFooter: function ( ) {
		/*this.footer = new HomeFooterView({el:this.$("#footer")});
		this.footer.render();*/
	}
 } );

var HeaderView = Backbone.View.extend ( { 
	initialize: function ( ) {
	},
	template: _.template("<div class='headerLeft'>HOME</div><span class='headerTitle' id='headerTitle'>Sweet Idea</span><div class='headerRight'>NEW...</div>"),
	render: function ( ) {
		this.$el.html(this.template());
		date = new Date();
		modifier = (date.getHours()>11)?"PM":"AM";
		this.$("#date").html((date.getHours()%12)+":"+date.getMinutes()+" "+modifier);
		return this;
		
	},
	headerLeftClick: function ( ) {
		this.trigger("home");
	},
	headerRightClick: function ( ) {
		//this.trigger("newOrder");
	},
	headerTitleClick: function ( ) {
		
	},
	updateHeaderTitle: function (title) {
		this.$("#headerTitle").html(title);	
	},
	events: function ( ) {
		events = {
			"click div.headerLeft" : "headerLeftClick",
			"click div.headerRight" : "headerRightClick",	
			"click div.headerTitle" : "headerTitleClick",		
		};
		return events;		
	}
} );
var TextFooterView = Backbone.View.extend ( {
	template: _.template("<div class='footer'>"+
							"<div class='footerLink' id='home'>HOME</div>"+
							"<div class='footerLink' id='5min'>5 MIN</div>"+
							"<div class='footerLink' id='10min'>10 MIN</div>"+
							"<div id='here' class='footerLink'>HERE</div>"+
						"</div>"),
	render: function ( ) {
		this.$el.html(this.template());
		return this;
	},
	events: function ( ) {
		events = {
			"click div#home" : "homeClick",
			"click div#5min" : "fiveMinClick",	
			"click div#10min" : "tenMinClick",	
			"click div#here" : "hereClick",	
				
		};
		return events;		
	},
	homeClick: function ( e ) {
		this.trigger('home');
	},
	fiveMinClick: function ( e ) {
		this.trigger('5min');
	},
	tenMinClick: function ( e ) {
		this.trigger('10min');
	},
	hereClick: function ( e ) {
		this.trigger('here');
	},
	goToPage: function ( e ) {
		Router.navigate("",true);
	}
} );

var HomeFooterView = Backbone.View.extend ( {
	template: _.template("<div class='footer'>"+
							"<div class='footerLink' id='home'>HOME</div>"+
							"<div class='footerLink' id='inprogress'>In Progress</div>"+
							"<div class='footerLink' id='completed'>Completed</div>"+
							"<div class='footerLink' id='new'>NEW</div>"+
						"</div>"),
	render: function ( ) {
		this.$el.html(this.template());
		return this;
	},
	events: function ( ) {
		events = {
			"click div#home" : "homeClick",
			"click div#inprogress" : "inprogressClick",	
			"click div#completed" : "completedClick",	
			"click div#new" : "newClick",	
				
		};
		return events;		
	},
	homeClick: function ( e ) {
		Router.navigate("_viewport",true);
		this.trigger('home');
	},
	inprogressClick: function ( e ) {
		Router.navigate('orders',true);
	},
	completedClick: function ( e ) {
		Router.navigate('completed',true);
	},
	newClick: function ( e ) {
		Router.navigate('newOrder',true);
	},
	goToPage: function ( e ) {
		Router.navigate("",true);
	}
} );

var NavView = Backbone.View.extend ( { 
	template: _.template("<li id='<%- link %>' class='menuItem'><h2><%- title %></h2></li>"),
	render: function ( ) {
		links = [
			{link:"sale",title:"SALE"}
			//{link:"inventory",title:"INVENTORY"},
			//{link:"history",title:"HISTORY"},

		];
		ul = $('<ul class="menu"></ul>');
		_.each(links,function (model) { ul.append(this.template(model)); }, this);
		this.$el.html(ul);
		//this.$el.html(this.template(links));
		return this;
		
	},
	events: function ( ) {
		events = {
			"click li" : "goToPage"	
		};
		return events;
	},
	goToPage: function ( e ) {
		Router.navigate(e.currentTarget.id,true);
	}
 } );


