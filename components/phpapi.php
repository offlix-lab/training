<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');


// Handle preflight request

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);



session_start();


$myconn = require __DIR__."/conn.php";
$semister = require __DIR__."/semister.php";
$year = require __DIR__."/year.php";
$pgrades = require __DIR__."/grades.php";

$data = json_decode(file_get_contents("php://input"), true);



if (isset($_GET["sh_st"])) {
        

     $grade = $_GET["grade"];
     $section = $_GET["section"] ?? "all";
     $school_code = $_GET["sh_st"] ?? "all";
     $gender = $_GET["sex"] ?? "all";
     $semister = $_GET["semister"] ?? 1;
     $limit = (($_GET["limit"] > 30 OR $_GET["limit"] <= 0) ? 10 : $_GET["limit"]);


     if (empty($grade)) {
             
             echo json_encode([
                     "status"=>"failed",
                     "message" =>"Empty Grade",
                     "value" =>$grade
             ]);
             
          exit;
     }

     if (!in_array($grade,$pgrades)) {

          echo json_encode([
                     "status"=>"failed",
                     "message" =>"Invalid Grade",
                     "value" =>$grade
          ]);
             
          exit;
     }
     if (!in_array($gender,array("M","F","all"))) {

          echo json_encode([
                     "status"=>"failed",
                     "message" =>"Invalid Gender",
                     "value" =>$gender
          ]);
             
          exit;
     }
     
     if (in_array($grade,$pgrades)) {
          $DbGrade = "grade_".$grade."_".$year;
     }

     if ($semister > 2 || $semister <1) {

          echo json_encode([
                     "status"=>"failed",
                     "message" =>"Invalid Semister",
                     "value" =>$semister
          ]);
             
          exit;
     }
     

     //Dynamic filter place
     
     $encrypted = $_GET["sh_st"];
     $key = "xilffo-7858";
     $school_code = $_GET["sh_st"] == 'all' ? 'all' : openssl_decrypt($encrypted,"AES-128-ECB",$key);

     if ($school_code != 'all') {
          if ($school_code > 9999 || $school_code < 1000) {

          echo json_encode([
                     "status"=>"failed",
                     "message" =>"Unknown School",
                     "value" => "undefined"
          ]);
             
          exit;
          }
     }


     

     $section = ($section === 'all') ? null : $section;
     $gender = ($gender === 'all') ? null : $gender;
     $school_code = ($school_code === 'all') ? null : $school_code;
     
     $sql = "SELECT $DbGrade.name, sex, section, profile, average_$semister, total_$semister,school_name, $DbGrade.school_code FROM $DbGrade LEFT JOIN schools_$year ON $DbGrade.school_code = schools_$year.school_code WHERE 
          ($DbGrade.school_code = COALESCE(?, $DbGrade.school_code))
          AND (section = COALESCE(?, section))
          AND (sex = COALESCE(?, sex)) ORDER BY average_$semister DESC LIMIT ?;";

           
           $stmt = $myconn->prepare($sql);

           $stmt->bind_param(
               "issi",
               $school_code,
               $section,
               $gender,
               $limit
           );
           
           $stmt->execute();
           $result = $stmt->get_result();
           
           $rank = 0;
           $prevTotal = null;
           $counter = 0;
        
        
        
           //grade names 
        
           $gradeNames = [
                   11 => "11 Natural",
                   13 => "11 Social",
                   12 => "12 Natural",
                   15 => "12 Social"
           ];
        
           //ranking names 
           $rankNames = [
                   1=>"gold",
                   2=>"silver",
                   3=>"bronze"
           ];
        
          
           //preparing the object for the api

           $resultData = [];

           while($stud = $result->fetch_assoc()){

               $counter++;
               
               if($stud["total_$semister"] !== $prevTotal){
                    $rank = $counter;
               }
               
               
               $stud["meta"] = [
                    "rank" => $rank,
                    "type" => $rankNames[$rank] ?? "normal",
                    "profile"=> $stud["profile"] === null ? "$stud[sex].png" : $stud["profile"],
                    "grade" => $gradeNames[$grade] ?? $grade 
               ];

               $resultData[] = $stud;   
               
               $prevTotal = $stud["total_$semister"];
          }
        
        
        unset($stud["profile"]);
        
      
          echo json_encode([
                  "status" => "success",
                  "data" => $resultData
          ]);
        
          
          
          
         if ($result->num_rows === 0) {
                echo json_encode([
        "status" => "success",
        "message" => "No students found",
        "data" => []
    ]);
    exit;
}

}
       
     
     

     
     