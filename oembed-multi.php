<?php
$oembed_services = array('youtube'=> 'http://www.youtube.com/oembed?format=json&url=',
                         'vimeo'  => 'http://vimeo.com/api/oembed.json?url=');

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

function parse_videos($videos) {
    global $oembed_services;
    $requests = array();
    
    foreach ($videos as $video){
        $temp = explode(',', $video);
        $requests[] = array('callback'=>$temp[0], 'url'=>$oembed_services[$temp[1]] . $temp[2],
                            'data'=>'', 'ch'=> null);
    }
    return $requests;
}

function format_output($requests) {
    $output = array();
    foreach ($requests as $request) {
        $output[] = '{"callback":"' . $request['callback'] . '",' . '"data":' . $request['data'] . '}';
    }
    return '[' . implode(',', $output) . ']';
}

function get_oembed_multi($videos) {
    $requests = parse_videos($videos);
    
    $multi = curl_multi_init();
    
    foreach ($requests as &$request) {
        $request['ch'] = curl_init();
        curl_setopt($request['ch'], CURLOPT_URL, $request['url']);
        curl_setopt($request['ch'], CURLOPT_HEADER, false);
        curl_setopt($request['ch'], CURLOPT_RETURNTRANSFER, true);

        curl_multi_add_handle($multi, $request['ch']);
    }
                    
    $active = null;
    do {
        $mrc = curl_multi_exec($multi, $active);
    } while ($mrc == CURLM_CALL_MULTI_PERFORM);

    while ($active && $mrc == CURLM_OK) {
        do {
            $mrc = curl_multi_exec($multi, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    }

    // Loop through the channels and retrieve the received
    // content, then remove the handle from the multi-handle
    foreach ($requests as &$request) {
        $request['data'] = curl_multi_getcontent($request['ch']);
        curl_multi_remove_handle($multi, $request['ch']);
    }

    // Close the multi-handle and return our results
    curl_multi_close($multi);
    
    return format_output($requests);
}

header('Content-type: application/json');

if (isset($_POST['videos'])) {
    echo get_oembed_multi(explode(',,', $_POST['videos']));
    exit();
}





if (isset($_GET['video']) && isset($_GET['callback'])) {
    echo $_GET['callback'] . '(' .get_url_contents('http://www.youtube.com/oembed?url=' . $_GET['video'] . '&format=json') . ')';
}
?>
