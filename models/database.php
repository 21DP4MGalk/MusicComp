<?php
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
?>