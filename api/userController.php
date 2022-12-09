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
                
                $find_user_by_email = "SELECT * FROM `users` WHERE `email`=:email";
                $query_stmt = $db->prepare($find_user_by_email);
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
                            'http://localhost/dashboard/server/jwtHandler.php',
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
    
}
