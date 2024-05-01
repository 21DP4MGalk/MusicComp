<?php

require_once PROJECTDIR . "/models/database.php";

class Users extends Database{
	
	public function getUsers($limit){
        return $this->execStatement("select * from users;"); //run a query here
    }

}
?>
