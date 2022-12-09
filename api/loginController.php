<?php

require 'jwtHandler.php';
include 'functions.php';



// function signup($db, $data){
//     $return = [];
    
//     if(!isset($data->name) 
//         || !isset($data->password)
//         || empty(trim($data->email))
//         || empty(trim($data->password))
//         ):
    
//         $fields = ['fields' => ['name']];
//         $return = formatMsg(0,422,'Please Fill in all Required Fields!',$fields);
    
//     // IF THERE ARE NO EMPTY FIELDS THEN-
//     else:
//         // $email = trim($data->email);
//         // $password = trim($data->password);
//         $name = trim($data->name);

//         // CHECKING THE EMAIL FORMAT (IF INVALID FORMAT)
//         // if(!filter_var($email, FILTER_VALIDATE_EMAIL)):
//         //     $return = formatMsg(0,422,'Invalid Email Address!');
        
//         // // IF PASSWORD IS LESS THAN 8 THE SHOW THE ERROR
//         // elseif(strlen($password) < 8):
//         //     $return = formatMsg(0,422,'Your password must be at least 8 characters long!');
    
//         // // THE USER IS ABLE TO PERFORM THE LOGIN ACTION
//         // else:
//             try{
                
//                 $find_user_by_email = "SELECT * FROM `users` WHERE `name`=:name";
//                 $query_stmt = $db->prepare($find_user_by_email);
//                 $query_stmt->bindValue(':name', $name,PDO::PARAM_STR);
//                 $query_stmt->execute();
//                 // IF THE USER IS FOUNDED BY EMAIL
//                 if($query_stmt->rowCount()):
//                     $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
//                     // $check_password = password_verify($password, $row['password']);
    
//                     // VERIFYING THE PASSWORD (IS CORRECT OR NOT?)
//                     // IF PASSWORD IS CORRECT THEN SEND THE LOGIN TOKEN
//                     // if($check_password):
    
//                         $jwt = new JwtHandler();
//                         $token = $jwt->jwtEncodeData(
//                             'http://localhost/dashboard/server/jwtHandler.php',
//                             array("user_id"=> $row['id'])
//                         );
                        
//                         $return = [
//                             'success' => 1,
//                             'message' => 'You have successfully logged in.',
//                             'token' => $token
//                         ];
    
//                     // IF INVALID PASSWORD
//                     // else:
//                         // $return = formatMsg(0,422,'Invalid Password!');
//                     // endif;
    
//                 // IF THE USER IS NOT FOUNDED BY EMAIL THEN SHOW THE FOLLOWING ERROR
//                 else:
//                     $return = formatMsg(0,422,'Invalid Email Address!');
//                 endif;
//             }
//             catch(PDOException $e){
//                 $return = formatMsg(0,500,$e->getMessage());
//             }
    
//         endif;
    
//     // endif;
    
//     echo json_encode($return);
// }

/**
 * @param $db : perform connexion to db
 * @param $data : data from login input
 */
function login($db, $data){
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
