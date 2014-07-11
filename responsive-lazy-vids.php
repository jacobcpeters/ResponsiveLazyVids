<?php
/** 
Plugin Name: Responsive Lazy Vids
Description: A plugin for retrieving and responsively embeding YouTube and Vimeo videos through oEmbed endpoints. 
Version: 1.1.1
Author: Jacob Peters
Copyright: 2014
Author URI: http://jacobpeters.co
License: MIT
*/

add_shortcode('rlvids', 'rlvids');
function rlvids( $atts ) {
    $atts = shortcode_atts(array('video'=>''), $atts);
    
    wp_register_script( 'rlv', plugins_url( '/js/responsive-lazy-vids.min.js' , __FILE__ ), false, '1.01', true );
    wp_enqueue_script('rlv');

    wp_localize_script( 'rlv', 'rlv_object', array( 
        'plugin_url'=> plugins_url( '' , __FILE__ )
    ));
    
    if ($atts['video'] === '') {
        return;
    } elseif (stristr($atts['video'], 'youtube') || stristr($atts['video'], 'yout.be')) {
        return '<div class="responsive-lazy-vids-container" data-video-url="' . $atts['video'] . '" data-service="youtube"></div>';
    } elseif (stristr($atts['video'], 'vimeo')) {
        return '<div class="responsive-lazy-vids-container" data-video-url="' . $atts['video'] . '" data-service="vimeo"></div>';
    } 
    
    return;
}


?>
