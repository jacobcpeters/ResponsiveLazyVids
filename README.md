# ResponsiveLazyVids

> A WordPress plugin for retrieving and responsively embeding YouTube and Vimeo videos through oEmbed endpoints

ResponsiveLazyVids (RLV) speeds up load times on pages with a few too many embeded videos,
and it does it without sacrificing smooth resizing of videos. The JavaScript is completely
vanilla, so no need to worry about including jQuery if your site doesn't require it. The
shortcode is simple and easy to use.

## Supported Services

RLV supports more than just YouTube and Vimeo. However, they are the only two that will
start playback with only one click. The rest of the services will require two clicks.
One to load the video, and the other to start playback.

| Service     | One Click Playback |
|-------------|--------------------|
| YouTube     | Yes                |
| Vimeo       | Yes                |
| Hulu        | No                 |
| dailymotion | No                 |
| Twitch      | No                 |
| Ted Talks   | No                 |
| Blip.tv     | No                 |
| UStream     | No                 |
| Viddler     | No                 |
| Kickstarter | No                 |

## Getting Started

### Download / Clone

Clone the repo using Git:

```bash
git clone --bare https://github.com/jacobcpeters/ResponsiveLazyVids.git
```

Alternatively you can [download](https://github.com/jacobcpeters/ResponsiveLazyVids/archive/master.zip) this repository.

### Embedding a video

To embed a video all you have to do is place a shortcode where you would have put the iframe.
Put the link to the video into the the video attribute of the shortcode

```
[rlvids video="link-to-video"]
```
```
[rlvids video="http://www.youtube.com/watch?v=UjwjIKo6YeI"]
```
```
[rlvids video="http://vimeo.com/84546365"]
```

## Feature requests

If RLV doesn't support a service you require, please put a request in the issues tracker. 


## License

© Jacob Peters, 2015. Licensed under an [MIT](https://github.com/jacobcpeters/ResponsiveLazyVids/blob/master/LICENSE) license.