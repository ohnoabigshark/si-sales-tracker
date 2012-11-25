<?php
    /* Send an SMS using Twilio. You can run this file 3 different ways:
     *
     * - Save it as sendnotifications.php and at the command line, run 
     *        php sendnotifications.php
     *
     * - Upload it to a web host and load mywebhost.com/sendnotifications.php 
     *   in a web browser.
     * - Download a local server like WAMP, MAMP or XAMPP. Point the web root 
     *   directory to the folder containing this file, and load 
     *   localhost:8888/sendnotifications.php in a web browser.
     */
 
    // Step 1: Download the Twilio-PHP library from twilio.com/docs/libraries, 
    // and move it into the folder containing this file.
    include_once('./Text.php');
    include_once('./Type.php');
    include_once('./Order.php');
    include_once('./Menu.php');
    include_once('./OrderProduct.php');


//http://haveasweetidea.com/sweetorder/api/TwilioReceiver.php?AccountSid=AC724438d929864945260401022f99d258&From=+19784304622
 
    // Step 2: set our AccountSid and AuthToken from www.twilio.com/user/account
    $AccountSid = "AC724438d929864945260401022f99d258";
    $AuthToken = "90219b8db3133e60d363f5d6404911e5";

    if(strcmp($AccountSid,$_REQUEST['AccountSid']) == 0) {

	    $text = new Text();
	 	foreach($text->getModifiableAttributes() as $attr) {
	 		if(isset($_REQUEST[$attr])) {
	 			$text->$attr = $_REQUEST[$attr];
	 		}
	 	}
	 	$text->received = '1';
        
        /*Google voice fix*/
        //$text->Body = '+'.$text->Body; //Only needs to be applied during testing
        $phonePrefix = substr($text->Body,0,1);
        if(strcmp($phonePrefix,'+')==0) {
            $routePhone = $text->From;
            $phone = substr($text->Body,1,11);
            if(is_numeric($phone)){
                $text->From = $phonePrefix.$phone;
                $text->Body = substr($text->Body,12);
            }
        }
        /*end google voice fix*/

	 	$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASS); 
        $query = $db->prepare("SELECT * FROM `Orders` WHERE `phone` = ? AND `timeDelivered` = 0 ORDER BY timeCreated DESC");
        $query->execute(array($text->From));
        $order = new Order();
        if($query->rowCount()>=1){
            $result = $query->fetch(PDO::FETCH_ASSOC);
            $order->rawUpdate($result);
            $text->userID = $order->assignedTo;
        } else {
            $order->phone = $text->From;
            $order->routePhone = $routePhone; //Google voice fix
            $menu = new Menu(1); //static set to Tufts for now
            foreach($menu->getProductList() as $k=>$v) {
                $orderProduct = new OrderProduct();
                $orderProduct->productID = $v['uid'];
                $orderProduct->orderID = $order->uid;
                $orderProduct->save(); 
            }
        }
        $order->timeTouched = 'CURRENT_TIMESTAMP';
        $order->save();
        $text->save();
        $query = $db->prepare("SELECT * FROM  `Users` WHERE  `uid` =  ?");
        $query->execute(array($text->userID));
        $user = $query->fetch(PDO::FETCH_ASSOC);
	    // Step 3: instantiate a new Twilio Rest Client
	    //header("content-type: text/xml");
	    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
	}
    /*
    <Response>
    <Sms><?php if(isset($user['firstName'])) {echo $user['firstName'].' '.$user['lastName'];}else{echo "User not found.";} ?></Sms>
</Response>
*/

?>
