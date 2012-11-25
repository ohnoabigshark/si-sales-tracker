<?php

include_once('./DBWriter.php');
//include_once('./DBQuery.php');


class Menu extends DBWriter {
	
	function __construct($uid=0) { 
		$this->table = 'Menus';
		parent::__construct($uid);
	}

	public function toJSON() {
		header('Content-type: application/json');
		$this->products = $this->getProductList();
		echo json_encode($this->schema);

	}

	public function getProductList () {
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$products = explode(",",$this->products);
		$output = array();
		foreach ( $products as $k=>$product ) {
			$query = $db->prepare("SELECT * FROM  `Products` WHERE  `uid` =  ?");
	    	$query->execute(array($product));
            $product = $query->fetch(PDO::FETCH_ASSOC);
            array_push($output,$product);
		}
		return $output;	    
	}

	public function getSalesItems ( $uid ) {
		$sql = "SELECT Products.name, Products.price, OrderProducts.* FROM `Products` INNER JOIN `OrderProducts` ON Products.uid = OrderProducts.productID AND OrderProducts.orderID = ? ORDER BY uid ASC";
		echo ($uid);
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
		$query = $db->prepare($sql);
	    $query->execute(array($uid));
	    $result = $query->fetchAll(PDO::FETCH_ASSOC);
		header('Content-type: application/json');
		echo json_encode($result);
	}

}




?>