/*!
* ResponsiveLazyVids 1.2.1
*
* Copyright 2014, Jacob Peters - http://jacobpeters.co
* Credit to:
*   FitVids.js: Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
*   Intrinsic Ratio Method: Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the MIT license - http://opensource.org/licenses/MIT
*
*/

var ResponsiveLazyVids = (function main() {
    "use strict";
    
    var uniqueInstance = 0,
        videos = {},
        callbacks = {};
    
    function request_init(element) {
        var clbkName = 'rlv' + uniqueInstance++;

        callbacks[clbkName] = function(data){
            element.setAttribute('data-unique-instance', clbkName);
            element_setup.call((element), data);
            delete callbacks[clbkName];
        };
        
        return clbkName + ',' + element.getAttribute('data-service') + ',' + element.getAttribute('data-video-url');
    }
    
    function element_setup(data) {
        var aspectRatio = (data.height/data.width)*100,
            button = document.createElement('div'),
            title = document.createElement('div');
        videos[this.getAttribute('data-unique-instance')] = data.html;
        this.setAttribute('data-title', data.title);
        
        this.style.backgroundImage = 'url(' + data.thumbnail_url + ')';
        this.style.paddingTop = aspectRatio + '%';
        
        button.className = 'button';
        title.className = 'title';
        title.innerHTML = data.title;
        this.appendChild(button);
        this.appendChild(title);
        button = null;
        title = null;
        
        
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
            iframe.style.backgroundColor = '#000';
            
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
    
    
    
    var execute = (function execute () {
        var videos = document.querySelectorAll('.responsive-lazy-vids-container'),
            request_queue = [],
            request;
        //add CSS styles
        if(!document.getElementById('responsive-lazy-vids-style')) {
            // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
            var head = document.head || document.getElementsByTagName('head')[0],
                css = '.responsive-lazy-vids-container{width:100%;position:relative;padding:52.65% 0 0;cursor:pointer;background-color:#000;background-position:center;background-repeat: no-repeat;background-size:101% auto;}.responsive-lazy-vids-container iframe,.responsive-lazy-vids-container object,.responsive-lazy-vids-container embed {position:absolute;top:0;left:0;width:100%;height:100%;}',
                titleCss = '.responsive-lazy-vids-container > .title{width: 100%;position: absolute;top:0;padding: 0.25em 0.5em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#eee;background:rgba(0, 0, 0, 0.57)}',
                playButtonCss = ' .responsive-lazy-vids-container > .button{width:100px;height:100px;position:absolute;top:50%;left:50%;-webkit-transform: translateX(-50%) translateY(-50%);-o-transform: translateX(-50%) translateY(-50%);transform: translateX(-50%) translateY(-50%);background:url('+ rlv_object.plugin_url +'/images/play-button.svg);background-repeat:no-repeat;} .responsive-lazy-vids-container:hover > .button {background-position:0% 100%;}',
                div = document.createElement('div');
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + playButtonCss + titleCss + '</style>';
            head.appendChild(div.childNodes[1]);
        }
        for (var i = 0; i < videos.length; ++i) {
            request_queue.push(request_init(videos[i]));
        }
        
        request = new XMLHttpRequest();
        request.open('POST', rlv_object.plugin_url + '/oembed-multi.php', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        
        request.onreadystatechange = function() {
            if (this.readyState === 4){
                if (this.status >= 200 && this.status < 400){
                    var data = JSON.parse(this.responseText);
                    for (var i = 0; i < data.length; ++i) {
                        callbacks[data[i].callback](data[i].data);
                    }
                } else {

                }
            }
        };

        request.send('videos=' + request_queue.join(',,'));
        request = null;
    }());
    
    return execute;
}());

