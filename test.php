<?php
header("Access-Control-Allow-Origin: *");

define("DB_HOST", "127.0.0.1");
define("DB_USER", "website");
define("DB_PSWD", "mysqlIndeedSucks5#");
define("DB_NAME", "MusicProject");

class BaseController{
    
    function __call($name, $arguments){
        $this->send_output('AAAAAAAAAAAAA', array("HTTP/1.1 404 Error not found"));
    }

    protected function getUriSegments(){
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = explode($uri, '/');

        return $uri;
    }

    protected function getQuery(){
        return parse_str($_SERVER['QUERY_STRING'], $query);
    }

    protected function sendOutput($data, $httpHeaders=array()){
        header_remove("Set-cookie");

        if( is_array($httpHeaders) && count($httpHeaders) ){
            foreach($httpHeaders as $httpHeader){
                header($httpHeader);
            }
        }

        echo $data;
        exit;
    }
}

class Database{
    
    protected $connection = null;

    public function __construct(){

        $this->connection = new mysqli(DB_HOST, DB_USER, DB_PSWD, DB_NAME); 
        
        if( mysqli_connection_errno() ){
            throw new Exception("Error during first stage of connecting, i.e. it's all fucked again.");
        }
    }

    public function execStatement($query = "", $params = []){
        
        $stmnt = $this->connection->prepare($query);
        if($params){
            $stmnt->bind_param($params[0], $params[1]);
        }

        $stmnt->execute();
        $result = $stmnt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmnt->close();
        return $result;
    }


}


class Users extends Database{
	
	public function getUsers($limit){
        return $this->execStatement("select * from users;"); //run a query here
    }

}

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

$uri = parse_url($_SERVER["REQUEST_URL"], PHP_URL_PATH);
$uri = explode('/', $uri);
echo sizeof($uri);
$feedController = new UserController();
$methodName = $uri[3] . "Action";
$feedController->{$methodName}();
echo "test";
?>
