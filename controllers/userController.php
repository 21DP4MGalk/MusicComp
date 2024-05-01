<?php
class UserController extends BaseController{
    public function listAction(){
        $errorDesc = '';

        $queryStringParams = $this->getQuery();

        if(strtoupper($_SERVER['REQUEST_METHOD']) == 'GET'){
            $userModel = new Users();
            $limit = 10;
            if( isset($queryStringParams['limit']) && $queryStringParams['limit'] ){
                $limit = $queryStringParams['limit'];
            }
            $users = $userModel->getUsers($limit);
            $response = json_encode($users);
        }
        else{
            $errorDesc = 'Shit\'s fucked mate, use another method';
            $errorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        if(!errorDesc){
            $this->sendOutput($response, array("Content-Type: application/json", "HTTP/1.1 200 OK") );
        }
        else{
            $this->sendOutput(json_encode(array('error' => $errorDesc)), array("Content-Type: application/json", $errorHeader) );
        }
        
    }
}
?>