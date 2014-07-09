/*!
* ResponsiveLazyVids 1.0
*
* Copyright 2014, Jacob Peters - http://jacobpeters.co
* Credit to:
*   Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
*   Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

var ResponsiveLazyVids = (function main() {
    "use strict";
    
    var uniqueInstance = 0,
        videos = {};
    
    
    function video_loader(element) {
        var video = element.getAttribute('data-video-url');
        switch (element.getAttribute('data-service')) {
            case 'youtube':
                youtube_proxy_request(video, element);
                break;
            case 'vimeo':
                vimeo_request(video, element);
                break;
            default:
                console.error('Unknown video service: ' + element.getAttribute('data-service'));
                break;
        }
        
    }
    
    function vimeo_request(video, element) {
        var script = document.createElement('script'),
            name = 'rlv' + uniqueInstance++,
            body = document.body || document.getElementsByTagName('body')[0];

        script.src = encodeURI('http://vimeo.com/api/oembed.json?url=') +
                               video + encodeURI('&callback=' + name);
        body.appendChild(script);

        window[name] = function(data){
            element.setAttribute('data-unique-instance', name);
            element_setup.call((element), data);
            body.removeChild(script);
            script = null;

            delete window[name];
        };
    }
    
    function youtube_proxy_request(video, element) {
        var script = document.createElement('script'),
            name = 'rlv' + uniqueInstance++,
            body = document.body || document.getElementsByTagName('body')[0];

        script.src = encodeURI(rlv_object.plugin_url + '/oembed-proxy.php' +
                               '?video=') + video +
                               encodeURI('&callback=' + name);
        body.appendChild(script);

        window[name] = function(data){
            element.setAttribute('data-unique-instance', name);
            element_setup.call((element), data);
            body.removeChild(script);
            script = null;

            delete window[name];
        };
    }
    
    function youtube_yql_request(video, element) {
        var query = encodeURIComponent('SELECT * FROM json WHERE url="' + 
                    'http://www.youtube.com/oembed?url=' +
                    video + '&format=json"'),
            script = document.createElement('script'),
            name = 'rlv' + uniqueInstance++,
            body = document.body || document.getElementsByTagName('body')[0];
        
        script.src = encodeURI('http://query.yahooapis.com/v1/public/yql' +
                        '?format=json&jsonCompat=new&diagnostics=false' +
                        '&q=') + query +
                        encodeURI('&callback=' + name);
        body.appendChild(script);
        
        window[name] = function(data){
            element.setAttribute('data-unique-instance', name);
            element_setup.call((element), data.query.results.json);
            body.removeChild(script);
            script = null;
            
            delete window[name];
        };
    }
    
    function element_setup(data) {
        var aspectRatio = (data.height/data.width)*100;
        videos[this.getAttribute('data-unique-instance')] = data.html;
        
        this.style.backgroundImage = 'url(' + data.thumbnail_url + ')';
        this.style.paddingTop = aspectRatio + '%';
        this.appendChild(document.createElement('div'));
        
        addEventListener(this, 'click', function finish_loading() {
            var tempdiv = document.createElement('div'),
                iframe;
            
            tempdiv.innerHTML = videos[this.getAttribute('data-unique-instance')];
            iframe = tempdiv.firstChild
            tempdiv = null;
            
            if (iframe.hasAttribute('width')) {
                iframe.removeAttribute('width');
            }
            if (iframe.hasAttribute('height')) {
                iframe.removeAttribute('height');
            }
            
            switch (this.getAttribute('data-service')) {
                case 'youtube':
                    iframe.src += '&autoplay=1'
                    break;
                case 'vimeo':
                    iframe.src += '?autoplay=1'
                    break;
                default:
                    break;
            }
            
            
            this.removeChild(this.firstChild);
            this.appendChild(iframe);
            this.style.backgroundImage = '';
        });
    }
    
    function addEventListener(el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function(){
                handler.call(el);
            });
        }
    }
    
    if(!document.getElementById('responsive-lazy-vids-style')) {
        // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
        var head = document.head || document.getElementsByTagName('head')[0],
            css = '.responsive-lazy-vids-container{width:100%;position:relative;padding:0;cursor:pointer;background-position:center;background-repeat: no-repeat;background-size:101% auto;}.responsive-lazy-vids-container iframe,.responsive-lazy-vids-container object,.responsive-lazy-vids-container embed {position:absolute;top:0;left:0;width:100%;height:100%;}',
            playButtonCss = ' .responsive-lazy-vids-container > div{width:100px;height:100px;position:absolute;top:50%;left:50%;-webkit-transform: translateX(-50%) translateY(-50%);-o-transform: translateX(-50%) translateY(-50%);transform: translateX(-50%) translateY(-50%);background:url('+ rlv_object.plugin_url +'/images/play-button.svg);background-repeat:no-repeat;} .responsive-lazy-vids-container:hover > div {background-position:0% 100%;}';
            div = document.createElement('div');
        div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + playButtonCss + '</style>';
        head.appendChild(div.childNodes[1]);
    }
    
    (function execute () {
        var videos = document.querySelectorAll('.responsive-lazy-vids-container');
        for (var i = 0; i < videos.length; ++i) {
            video_loader(videos[i]);
        }
    }());
    
    return video_loader;
}());

