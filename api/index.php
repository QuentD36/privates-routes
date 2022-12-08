<?php

header("Access-Control-Allow-Origin: *");

$rest_json = file_get_contents("php://input");

echo json_encode($rest_json);