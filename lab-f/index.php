<?php

require_once __DIR__ . '/autoload.php';

use App\Serializer;
use Encoder\JsonEncoder;
use Encoder\CsvEncoder;
use Encoder\SsvEncoder;
use Encoder\TsvEncoder;
use Encoder\YamlEncoder;

$inputData = '';
$inFormat  = 'CSV';
$outFormat = 'JSON';
$output    = '';

// Initialize serializer with encoders
$serializer = new Serializer();
$serializer->registerEncoder('JSON', new JsonEncoder());
$serializer->registerEncoder('CSV', new CsvEncoder());
$serializer->registerEncoder('SSV', new SsvEncoder());
$serializer->registerEncoder('TSV', new TsvEncoder());
$serializer->registerEncoder('YAML', new YamlEncoder());

//post
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = isset($_POST['input_data']) ? $_POST['input_data'] : '';
    $inFormat  = isset($_POST['in_format'])  ? $_POST['in_format']  : 'CSV';
    $outFormat = isset($_POST['out_format']) ? $_POST['out_format'] : 'JSON';

    // Zapis do ciasteczek
    $expires = time() + 30 * 24 * 60 * 60;
    setcookie('converter_input',      $inputData, $expires, '/');
    setcookie('converter_in_format',  $inFormat,  $expires, '/');
    setcookie('converter_out_format', $outFormat, $expires, '/');

    try {
        $output = $serializer->convert($inputData, $inFormat, $outFormat);
    } catch (\Exception $e) {
        $output = 'Błąd: ' . $e->getMessage();
    }
} else {
  //dane z ciasteczek
    $inputData = isset($_COOKIE['converter_input'])      ? $_COOKIE['converter_input']      : '';
    $inFormat  = isset($_COOKIE['converter_in_format'])  ? $_COOKIE['converter_in_format']  : 'CSV';
    $outFormat = isset($_COOKIE['converter_out_format']) ? $_COOKIE['converter_out_format'] : 'JSON';
    $output    = '';
}

require_once __DIR__ . '/lib/templates/layout.php';
