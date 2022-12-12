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
    if(empty($data) || !isset($data->name) || !isset($data->firstname) || !isset($data->email) || !isset($data->password) || !isset($data->role)
       || empty(trim($data->name)) || empty(trim($data->firstname)) || empty(trim($data->email)) || empty(trim($data->password)) || empty(trim($data->role))
    ){
        $return = formatMsg(0,422, 'Veuillez remplir tous les champs !');
    }else{
        $sql = "INSERT INTO users(name, firstname, mail, password, role, created_at, modified_at) VALUES(:name, :firstname, :email, :password, :role, :created_at, :modified_at)";
        $stmt = $conn->prepare($sql);
        $date = date('Y-m-d H:i:s');
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':firstname', $data->firstname);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':role', $data->role);
        $stmt->bindParam(':created_at', $date);
        $stmt->bindParam(':modified_at', $date);
        if($stmt->execute()) {
            $return = ['success' => 1, 'message' => 'Création de l\'utilisateur ' . $data->firstname . ' ' . $data->name . ' réussie.'];
        } else {
            $return = formatMsg(0,422, 'Error');
        }
    }
    
    echo json_encode($return);
}

function import_users($conn, $data){
    if(empty($data)){
        $return = formatMsg(0,422, 'Echec de l\'importation : Assurez-vous d\'utiliser le fichier .csv fourni et de le remplir correctement');
    }else{
        $count = 1;
        $return = '';
        foreach($data as $d){
            if(empty($d->name) || empty($d->firstname) || empty($d->email) || empty($d->password) ||  empty($d->role)){
                $return = formatMsg(0,422, 'Echec de l\'importation : Assuez-vous d\'utiliser le fichier .csv fourni et de le remplir correctement');
            }
            else{
                echo json_encode('test2)');
                die;
                $sql = "INSERT INTO users(name, firstname, mail, password, role, created_at, modified_at) VALUES(:name, :firstname, :email, :password, :role, :created_at, :modified_at)";
                $stmt = $conn->prepare($sql);
                $date = date('Y-m-d H:i:s');
                $password = password_hash($d->password, PASSWORD_DEFAULT);
                $stmt->bindParam(':name', $d->name);
                $stmt->bindParam(':firstname', $d->firstname);
                $stmt->bindParam(':email', $d->email);
                $stmt->bindParam(':password', $password );
                $stmt->bindParam(':role', $d->role);
                $stmt->bindParam(':created_at', $date);
                $stmt->bindParam(':modified_at', $date);
                if(!$stmt->execute()) {
                    $return = formatMsg(0,422, 'Error ');
                }else{
                    $return = [
                        'success' => 1,
                        'message' => 'Importation de ' . $count . ' utilisateurs réussie.'
                    ];
                }
                $count ++;
            }
        }
    }
    
    echo json_encode($return);
}
