<?php


	Class Chat {
		private $texts;
		private $order;

		function __construct() {
		}


	public function processRequest( $phone, $req ) {
		if($_REQUEST['_method'])
			$method = $_REQUEST['_method'];
		else
			$method = $_SERVER['REQUEST_METHOD'];
		$requestData = json_decode(stripslashes($_REQUEST['model']),true);
		if(isset($requestData['phone']))
			$phone = $requestData['phone'];
		if ( !isset($phone) || $phone < 1 )
			$phone = basename($_SERVER['REQUEST_URI']);
		
		if(strcmp(substr($phone,0,1),'+')!=0) {
			unset($phone);
		}
		switch($method) {
			case 'POST': 
				break;
			case 'GET': if(isset($phone)) {
							if ($this->load($phone))			
								$this->toJSON($req);
							else
								echo json_encode(array());
						} else {
							$this->getAll();
						}
					break;
			case 'PUT': 
				break;
			case 'DELETE': 
				break;
			default: echo(get_class($this).' BROKE IN PROCESSREQUEST');
				break;
		}
	}

	public function load ($phone) {
		$result = $this->getOrder($phone);
		$this->order = new Order();
		if(count($result)>0){
	        $this->order->rawUpdate($result);
	        $this->texts = $this->getTexts($this->order->phone);
	        return true;
		} 
		return false;
	}

	public function getAll ( ) {
		$chats = array();
		$orders = $this->getOrders();
		foreach($orders as $order) {
			$tempChat = array();
			$tempChat['uid'] = $order['uid'];
			$tempChat['texts'] = $this->getTexts($order['phone']);
			$tempChat['order'] = $order;
			array_push($chats, $tempChat);
		//	print_r($chats);
		}
		header('Content-type: application/json');
		echo json_encode($chats);
	}

	public function getOrders ( ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare("SELECT * FROM  `Orders` WHERE `timeCreated` >  ? ORDER BY timeCreated DESC");
		$time = date('Y-m-d H:m:s',mktime(11, 0, 0, date('m'), date('d')-2, date('Y')));//we want time to be 
		$query->execute(array($time));
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getTexts ( $phone ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare("SELECT * FROM  `Texts` WHERE (`To` LIKE ? OR `From` LIKE ?) AND `timestamp` > ? ORDER BY TIMESTAMP ASC");
		$time = date('Y-m-d H:m:s',mktime(11, 0, 0, date('m'), date('d')-1, date('Y')));//we want time to be
		$query->execute(array($phone,$phone,$time));
		$result = $query->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public function getOrder ( $phone ) {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
        $query = $db->prepare("SELECT * FROM `Orders` WHERE `phone` LIKE ? ORDER BY timeCreated DESC LIMIT 1");
		$query->execute(array($phone));
		$result = $query->fetch(PDO::FETCH_ASSOC);
		return $result;
	}


		public function toJSON($request) {
			$chat = array();
			switch ($request) {
				case 'texts':
					$chat = $this->texts;
					break;
				case 'order':
					$chat = $this->order->schema;
					break;
				default:
					$chat['uid'] = $this->order->uid;
					$chat['texts'] = $this->texts;
					$chat['order'] = $this->order->schema;
					break;
			}
		if(isset($this->order)) {
				echo json_encode($chat);
			} else {
				echo json_encode(array());		
			}
		}
	}

	/*$chat = new Chat();
	$chat->load(15);
	$chat->toJSON();*/

	//first, search for route
	//if route has no assignee
	//list of all texts from a customer from the start of the route
?>