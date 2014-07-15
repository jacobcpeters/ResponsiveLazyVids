<?php

function caching_available() {
    $loaded_extensions = get_loaded_extensions();

    if (!in_array('pdo_sqlite', $loaded_extensions)) {
        return false;
    }
    
    if (!file_exists('oembed-cache.sqlite3')) {
        $cache_db = new PDO('sqlite:oembed-cache.sqlite3');
        $cache_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $cache_db->exec("CREATE TABLE IF NOT EXISTS oembed (
                    url TEXT PRIMARY KEY, 
                    data TEXT )");
    }
    return true;
}

function cache_lookup(&$requests) {
    $all_requests_are_cached = true;

    $cache_db = new PDO('sqlite:oembed-cache.sqlite3');
    $cache_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $query = $cache_db->prepare('SELECT data
                                 FROM oembed
                                 WHERE url = :url');
    
    foreach ($requests as &$request) {
        $query->execute(array(':url' => $request['url']));
        $query_result = $query->fetch();
        
        if (!$query_result) {
            $all_requests_are_cached = false;
            continue;
        }

        $request['data'] = $query_result[0];
        $request['cached'] = true;

    }
    return $all_requests_are_cached;
}

function add_to_cache($requests) {
    $cache_db = new PDO('sqlite:oembed-cache.sqlite3');
    $cache_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $insert = $cache_db->prepare('INSERT INTO oembed (url, data) VALUES (:url, :data)');

    foreach ($requests as $request) {
        if (!$request['cached']) {
            $insert->execute(array(':url' => $request['url'], ':data' => $request['data']));
        }
    }
    
}

?>