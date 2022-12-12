<?php

require_once 'jwtHandler.php';
require_once 'functions.php';

/**
 * @param $conn : perform connexion to db
 * @param $data : data from login input
 */
function login($conn, $data){
    $return = [];
    
    // if all inputs aren't filled
    if(!isset($data->email) || !isset($data->password) || empty(trim($data->email)) || empty(trim($data->password))){
        $fields = ['fields' => ['email','password']];
        $return = formatMsg(0,422,'Veuillez remplir tous les champs !', $fields);
    }else{  
        $email = trim($data->email);
        $password = trim($data->password);
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){// check email format
            $return = formatMsg(0,422,'E-mail invalide !');   
        }else{
            try{
                
                $find_user_by_email = "SELECT * FROM `users` WHERE `mail`=:email";
                $query_stmt = $conn->prepare($find_user_by_email);
                $query_stmt->bindValue(':email', $email,PDO::PARAM_STR);
                $query_stmt->execute();

                // if user is found
                if($query_stmt->rowCount()){
                    $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
                    $check_password = password_verify($password, $row['password']);
            
                    // if password ok, we send token
                    if($check_password){
                        $jwt = new JwtHandler();
                        $token = $jwt->jwtEncodeData(
                            URL . '/jwtHandler.php',
                            array("user_id"=> $row['id'])
                        );
                        
                        $return = [
                            'success' => 1,
                            'message' => 'Vous vous êtes connecté avec succès.',
                            'token' => $token
                        ];
                    }else{
                        $return = formatMsg(0,422,'Mot de passe invalide !');
                    }
            
                // if user not found
                }else{
                    $return = formatMsg(0,422,'Identifiants de connexion invalides !');
                }
                    
                
            }
            catch(PDOException $e){
                $return = formatMsg(0,500,$e->getMessage());
            }
        }
        
        
    }

    

    echo json_encode($return);
}

function save_user($conn, $data){
    $user = json_decode( file_get_contents('php://input') );
    $sql = "INSERT INTO users(name, firstname, mail, password, role, created_at, modified_at) VALUES(:name, :firstname, :email, :password, :role, :created_at, :modified_at)";
    $stmt = $conn->prepare($sql);
    $data = date('Y-m-d H:i:s');
    $stmt->bindParam(':name', $user->name);
    $stmt->bindParam(':firstname', $user->firstname);
    $stmt->bindParam(':email', $user->email);
    $stmt->bindParam(':password', $user->name);
    $stmt->bindParam(':role', $user->role);
    $stmt->bindParam(':created_at', $date);
    $stmt->bindParam(':modified_at', $date);
    
    if($stmt->execute()) {
        $response = ['status' => 1, 'message' => 'Success'];
    } else {
        $response = formatMsg(0,422, 'Error');
    }
    echo json_encode($response);

}
