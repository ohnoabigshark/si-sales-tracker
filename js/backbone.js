Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}

GLOBAL = {};
GLOBAL.CHAT_URL_ROOT = "chats";
GLOBAL.USER_URL_ROOT = "users";
GLOBAL.TYPE_URL_ROOT = "types";
GLOBAL.ROUTE_URL_ROOT = "routes";
GLOBAL.SENDTEXT_URL_ROOT = "sendtext";
GLOBAL.TEXT_URL_ROOT = "texts";
GLOBAL.MENU_URL_ROOT = "menus";
GLOBAL.ORDER_URL_ROOT = "orders";
GLOBAL.ORDERPRODUCT_URL_ROOT = "orderproducts";
GLOBAL.SALESITEM_URL_ROOT = "salesitems";
