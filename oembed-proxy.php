<?php
function get_url_contents($url){
    $crl = curl_init();
    $timeout = 5;
    curl_setopt ($crl, CURLOPT_URL,$url);
    curl_setopt ($crl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt ($crl, CURLOPT_CONNECTTIMEOUT, $timeout);
    $ret = curl_exec($crl);
    curl_close($crl);
    return $ret;
}

header('Content-type: text/javascript');

if (isset($_GET['video']) && isset($_GET['callback'])) {
    echo $_GET['callback'] . '(' .get_url_contents('http://www.youtube.com/oembed?url=' . $_GET['video'] . '&format=json') . ')';
}
?>