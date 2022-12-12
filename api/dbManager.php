<?php
    /**
    * Database Connection
    */
    class dbManager {
        private $server = 'localhost';
        private $dbname = 'savage-dreams';
        private $user = 'root';
        private $pass = 'root';
        public function connect() {
            try {
                $conn = new PDO('mysql:host=' .$this->server .';dbname=' . $this->dbname . ';charset=utf8', $this->user, $this->pass);
                return $conn;
            } catch (\Exception $e) {
                echo "Database Error: " . $e->getMessage();
            }
        }

    }
?>