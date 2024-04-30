<?php

require_once PROJECTDIR . "/models/database.php";

class Users extends Database{
	private $db;
	private $table = 'users';
	
	public function __construct($db){
		$this->db = $db;
	}
	public function getUsers($limit){
        return $this->execStatement(""); //run a query here
    }

}
?>
