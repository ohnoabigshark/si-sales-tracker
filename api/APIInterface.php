<?php


		Class APIInterface {

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


				$this->updateAttributes($requestData);
				switch($method) {
					case 'POST': $this->save(); $this->toJSON();
						break;
					case 'GET': 
								if(strcmp(substr($requestData['uid'],0,1),'+')==0) {
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
					case 'DELETE': $this->delete();
						break;
					default: echo(get_class($this).' BROKE IN PROCESSREQUEST');
						break;
				}

		}


		private function processPOST() {
			
		}

		private function processGET() {
			
		}

		private function processPUT() {
			
		}

		private function processDELETE() {
			
		}
}


?>