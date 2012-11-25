<?php

include_once('./DBWriter.php');
    include_once('./Menu.php');
    include_once('./OrderProduct.php');
//include_once('./DBQuery.php');


class Order extends DBWriter {
	
	function __construct($uid=0) {
		$this->table = 'Orders';
		parent::__construct();
	}

	public function processRequest( ) {
		if($_REQUEST['_method'])
			$method = $_REQUEST['_method'];
		else
			$method = $_SERVER['REQUEST_METHOD'];
		$requestData = json_decode(stripslashes($_REQUEST['model']),true);
		if ( !isset($requestData['uid']) || $requestData['uid'] < 1 )
			$requestData['uid'] = basename($_SERVER['REQUEST_URI']);
		
		if(strcmp($requestData['uid'],'orders')==0) {
			unset($requestData['uid']);
		}

		if(strcmp($requestData['uid'],'completedorders')==0) {
			unset($requestData['uid']);
			$completed = true;
		}


		$this->updateAttributes($requestData);
		switch($method) {
			case 'POST': $this->save(); $this->createOrderProducts(); $this->toJSON();
				break;
			case 'GET': if($completed){
							$output = $this->getCompletedOrders();
						} else if(strcmp(substr($requestData['uid'],0,1),'+')==0) {
							$output = $this->getOrder($requestData['uid']);
						} else if (isset($requestData['uid'])) {
							$this->load($requestData['uid']);
							$output = $this->schema;
						} else {
							$output = $this->getOrders();
						}
						echo json_encode($output);
						break;
			case 'PUT': $this->save(); $this->toJSON();
				break;
			case 'DELETE': $this->removeOrderProducts($requestData['uid']); $this->delete();
				break;
			default: echo(get_class($this).' BROKE IN PROCESSREQUEST');
				break;
		}

	}

	public function createOrderProducts ( ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare("SELECT * FROM  `OrderProducts` WHERE `orderID` =  ?");
		$query->execute(array($this->uid));
		if($query->rowCount()==0) {
			$menu = new Menu(1); //static set to Tufts for now
	        foreach($menu->getProductList() as $k=>$v) {
	            $orderProduct = new OrderProduct();
	            $orderProduct->productID = $v['uid'];
	            $orderProduct->orderID = $this->uid;
	            $orderProduct->save(); 
	        }
	    }
	}

	public function removeOrderProducts ( $uid ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare("DELETE * FROM  `OrderProducts` WHERE `orderID` =  ?");
		$query->execute(array($uid));
	}

	public function getOrders ( $days=0 ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		if(isset($days) && $days > 0)
			$query = $db->prepare("SELECT * FROM  `Orders` WHERE `timeCreated` >  ? AND `price` = 0 ORDER BY timeCreated DESC");
		else
			$query = $db->prepare("SELECT * FROM  `Orders` WHERE `price` = 0 ORDER BY timeCreated DESC LIMIT 20");
		$time = date('Y-m-d H:m:s',mktime(11, 0, 0, date('m'), date('d')-$days, date('Y')));//we want time to be 
		$query->execute(array($time));
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getCompletedOrders ( $days=0 ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		if(isset($days) && $days > 0)
			$query = $db->prepare("SELECT * FROM  `Orders` WHERE `timeCreated` >  ? AND `price` != 0 ORDER BY timeCreated DESC");
		else
			$query = $db->prepare("SELECT * FROM  `Orders` WHERE `price` != 0 ORDER BY timeCreated DESC LIMIT 20");
		$time = date('Y-m-d H:m:s',mktime(11, 0, 0, date('m'), date('d')-$days, date('Y')));//we want time to be 
		$query->execute(array($time));
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getTuftsOrders ( ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare("SELECT * FROM  `Orders` WHERE `assignedTo` = 1 AND `price` = 0 ORDER BY timeTouched DESC");
		$query->execute();
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result);
	}

	public function getNEUOrders ( ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare("SELECT * FROM  `Orders` WHERE `assignedTo` = 2 AND `price` = 0 ORDER BY timeTouched DESC");
		$query->execute();
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result);
	}

	public function getUnDispatchedOrders() {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare("SELECT * FROM  `Orders` WHERE `assignedTo` = 0 AND `price` = 0 ORDER BY timeTouched DESC");
		$query->execute();
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result);
	}

	public function getOrder ( $phone ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
        $query = $db->prepare("SELECT * FROM `Orders` WHERE `phone` LIKE ? ORDER BY timeCreated DESC LIMIT 1");
		$query->execute(array($phone));
		$result = $query->fetch(PDO::FETCH_ASSOC);
		return $result;
	}

	public function createNewOrder( ) {
		$order = new Order();
		$order->phone = "STREET";
		$order->save();
        $menu = new Menu(1); //static set to Tufts for now
        foreach($menu->getProductList() as $k=>$v) {
            $orderProduct = new OrderProduct();
            $orderProduct->productID = $v['uid'];
            $orderProduct->orderID = $order->uid;
            $orderProduct->save(); 
        }
        $order->toJSON();
	}
}


?>