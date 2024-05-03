<?php
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
?>