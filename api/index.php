<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
require_once 'dbManager.php';
require_once 'functions.php';
require_once 'authMiddleware.php';
require_once 'userController.php';
define('URL', 'http://localhost/savage-dreams');


$db = new dbManager;
$conn = $db->connect();


$method = $_SERVER['REQUEST_METHOD'];
$action = explode('/', $_SERVER['REQUEST_URI']);
$data = json_decode(file_get_contents('php://input'));

// $test = json_encode($method);

// echo $test;
// die;
switch($method) {
    case "GET":
        switch($action[3]){
            case 'checkToken' :
                $allHeaders = getallheaders();                
                $auth = new Auth($conn, $allHeaders);
                $auth = $auth->isValid();
                if ($auth["success"]) {
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode([
                        'error' => 'Invalid token',
                    ]);
                }
                break;
            case 'user' :
                
                break;
            case 'roles':
                $sql = "SELECT * FROM roles";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($users);
                break;
            case 'users':
                $sql = "SELECT users.id, users.name as name, users.firstname, users.mail, roles.intitule as role FROM users, roles WHERE users.role = roles.id";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($users);
                break;
        }
       
        if(isset($action[4]) && is_numeric($action[4])) { // api/user/:id
            $sql .= " WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $action[3]);
            $stmt->execute();
            $users = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {                                          // api/users
           
        }
        
        
        break;
    case "POST": 
        switch($action[3]){
            case 'login':
                login($conn, $data);
                break;     
            case 'user':
                if($action[4] == 'save'){
                    save_user($conn, $data);
                }
                break;
            default:
                echo json_encode(formatMsg(0,422,'Erreur !'));
                break;
        }
        // $user = json_decode( file_get_contents('php://input') );
        // $sql = "INSERT INTO users(id, name, email, mobile, created_at) VALUES(null, :name, :email, :mobile, :created_at)";
        // $stmt = $conn->prepare($sql);
        // $created_at = date('Y-m-d');
        // $stmt->bindParam(':name', $user->name);
        // $stmt->bindParam(':email', $user->email);
        // $stmt->bindParam(':mobile', $user->mobile);
        // $stmt->bindParam(':created_at', $created_at);

        // if($stmt->execute()) {
        //     $response = ['status' => 1, 'message' => 'Success'];
        // } else {
        //     $response = ['status' => 0, 'message' => 'Failed'];
        // }
        break;
    case "PUT":
        $user = json_decode( file_get_contents('php://input') );
        $sql = "UPDATE users SET name= :name, email =:email, mobile =:mobile, updated_at =:updated_at WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id', $user->id);
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':mobile', $user->mobile);
        $stmt->bindParam(':updated_at', $updated_at);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case "DELETE":
        $sql = "DELETE FROM users WHERE id = :id";
        $action = explode('/', $_SERVER['REQUEST_URI']);

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $action[3]);

        if($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }
        echo json_encode($response);
        break;
}