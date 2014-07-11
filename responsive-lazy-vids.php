<?php
/** 
Plugin Name: Responsive Lazy Vids
Description: A plugin for retrieving and responsively embeding YouTube and Vimeo videos through oEmbed endpoints. 
Version: 1.2.1
Author: Jacob Peters
Copyright: 2014
Author URI: http://jacobpeters.co
License: MIT
*/

add_shortcode('rlvids', 'rlvids');
function rlvids( $atts ) {
    $atts = shortcode_atts(array('video'=>''), $atts);
    $service = '';
    wp_register_script( 'rlv', plugins_url( '/js/responsive-lazy-vids.min.js' , __FILE__ ), false, '1.2.0', true );
    wp_enqueue_script('rlv');

    wp_localize_script( 'rlv', 'rlv_object', array( 
        'plugin_url'=> plugins_url( '' , __FILE__ )
    ));
    
    if ($atts['video'] === '') {
        return;
    } 
    
    if (stristr($atts['video'], 'youtube.com') || stristr($atts['video'], 'yout.be')) {
        $service = 'youtube';
    } elseif (stristr($atts['video'], 'vimeo.com')) {
        $service = 'vimeo';
    } elseif (stristr($atts['video'], 'dailymotion.com')) {
        $service = 'dailymotion';
    } elseif (stristr($atts['video'], 'hulu.com')) {
        $service = 'hulu';
    } elseif (stristr($atts['video'], 'ted.com')) {
        $service = 'ted';
    } elseif (stristr($atts['video'], 'blip.tv')) {
        $service = 'blip';
    } elseif (stristr($atts['video'], 'justin.tv')) {
        $service = 'justin';
    } elseif (stristr($atts['video'], 'ustream.tv')) {
        $service = 'ustream';
    } elseif (stristr($atts['video'], 'viddler.com')) {
        $service = 'viddler';
    } elseif (stristr($atts['video'], 'kickstarter.com')) {
        $service = 'kickstarter';
    }
        
    return '<div class="responsive-lazy-vids-container" data-video-url="' . $atts['video'] . '" data-service="' . $service . '"></div>';
}


?>
