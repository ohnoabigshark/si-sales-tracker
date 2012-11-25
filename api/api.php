<?php
include_once('./StatusCallback.php');

//include_once('./Route.php');
include_once('./Text.php');
include_once('./Type.php');
include_once('./User.php');
include_once('./Chat.php');
include_once('./Order.php');
include_once('./Menu.php');
include_once('./OrderProduct.php');
include_once('./TwilioSender.php');


/*parseURI - chunks up the URI so we can pick apart the pieces
processURIChunk - looks at the chunk of the URI and figures out what it is exactly.
			+xxxxxxxx = phone number
			xxxx = id
			ssss = string = command
			return the data type for the chunk

processRequest
	if $_REQUEST[_method]
		$method = $_method
		$requestData = $_REQUEST[model]
	else if $_REQUEST[method]
		$method = $_REQUEST[method]
		$requestData = $_REQUEST
	else
		fail

	$chunks = $this->parseURI()*/

public function returnRequestData ( $legacy=false ) {
	if($legacy){
		return json_decode(stripslashes($_REQUEST['model']),true);
	}else {
		return $_REQUEST['model'];
	}
}

if($_REQUEST['_method']) {
	$method = $_REQUEST['_method'];
	$requestData = returnRequestData(true);
}
else {
	$method = $_SERVER['REQUEST_METHOD'];
	$requestData = returnRequestData();
}






$requestDetails = explode('/',$_SERVER['REQUEST_URI']);
if(is_string($requestDetails[3]))
	$obj = $requestDetails[3];

$detail = $requestDetails[4];

$detail2 = $requestDetails[5];

switch($obj) {
	case 'types': $obj = new Type();
		$obj->processRequest();
		break;
	case 'texts': $obj = new Text();
		$obj->processRequest();
		break;
	case 'orders': $obj = new Order();
		$obj->processRequest();
		break;
	case 'completedorders': $obj = new Order();
		$obj->processRequest();
		break;

	case 'tufts': $obj = new Order();
		$obj->getTuftsOrders();
		break;

	case 'neu': $obj = new Order();
		$obj->getNEUOrders();
		break;
	
	case 'unassignedorders': $obj = new Order();
		$obj->getUnDispatchedOrders();
		break;
	//case 'conversation': $obj = new Chat();
//		$obj->processRequest($uid,$detail2);
//		break;
//	case 'routes': $obj = new Route();
//		$obj->processRequest();
//		break;
	case 'neworder': $obj = new Order();
		$obj->createNewOrder();
		break;
	case 'users': $obj = new User();
		$obj->processRequest();
		break;
	case 'salesitems': $obj = new Menu();
		$obj->getSalesItems($detail);
		break;
	case 'menus': $obj = new Menu();
		$obj->processRequest();
		break;
	
	case 'sendtext': $obj = new TwilioSender();
		$obj->processRequest();
		break;
	case 'statuscallback': $obj = new StatusCallback();
		$obj->processRequest();
		break;
	case 'orderproducts': $obj = new OrderProduct();
		$obj->processRequest();
		break;
	default:
		echo "api failed";
		break;
}

?>