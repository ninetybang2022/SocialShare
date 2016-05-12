/**
 * QQ浏览器分享Api
 * 如果是QQ浏览器那么要引入这两个文件 可以打开APP进行分享
 */
 /**
  * 社交分享URL
  */
;(function(){


    //test数据
    var shareData = {
        'url':'http://m.buka.cn',
        'title':'布卡漫画',
        'description':'年轻人最喜欢的漫画',
        'img_url':'http://m.buka.cn/img/touch-icon-ipad-retina.png',
        'img_title':'',
        'to_app':'',
        'cus_text':'分享内容'
    }
    //web分享API
    var shareApi = {
        qzone      :'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={pic}&summary={content}',
        weibo      :'http://service.weibo.com/share/share.php?url={url}&title={title}&pic={pic}&searchPic=false',
        tqq        :'http://share.v.t.qq.com/index.php?c=share&a=index&url={url}&title={title}',
        renren     : 'http://widget.renren.com/dialog/share?resourceUrl={url}&srcUrl={url}&title={title}&description={content}',
        douban     : 'http://www.douban.com/share/service?href={url}&name={title}&text={content}&image={pic}',
        facebook   :'https://www.facebook.com/sharer/sharer.php?u={url}&t={title}&pic={pic}',
        twitter    : 'https://twitter.com/intent/tweet?text={title}&url={url}',
        linkedin   : 'https://www.linkedin.com/shareArticle?title={title}&summary={content}&mini=true&url={url}&ro=true',
        weixin     : 'http://qr.liantu.com/api.php?text={url}',
        tieba      : 'http://tieba.baidu.com/f/commit/share/openShareApi?url={url}&title={title}&pic={pic}',
        qq         : 'http://connect.qq.com/widget/shareqq/index.html?url={url}&desc={title}&pics={pic}'
    }

    var qApiSrc = {
        lower: "http://3gimg.qq.com/html5/js/qb.js",
        higher: "http://jsapi.qq.com/get?api=app.share"
    };
    var bLevel = {
        qq: {forbid: 0, lower: 1, higher: 2},
        uc: {forbid: 0, allow: 1}
    };
    var UA = navigator.appVersion;
    var isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid;
    var isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid;
    var version = {
        uc: "",
        qq: ""
    };

    //加载QQ浏览器API
    var isloadqqApi = function()
    {
        if (isqqBrowser) {
            var b = (version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher;
            var d = document.createElement("script");
            var a = document.getElementsByTagName("head")[0];
            d.setAttribute("src", b);
            a.appendChild(d);
        }
    }
    //获取版本号
    var getVersion = function (c) {
        var a = c.split("."), b = parseFloat(a[0] + "." + a[1]);
        return b
    };
    //判断是否为微信浏览器
    var is_weixin = function () {
        var a = navigator.appVersion.toLowerCase();
        if (a.match(/MicroMessenger/i) == "micromessenger") {
            return true
        } else {
            return false
        }
    };

    /**
    * 获取当前系统平台
    */
    var getPlantform = function()
    {
        var ua = navigator.userAgent;
        if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1 || ua.indexOf('iPad') > -1)) {
            return "iPhone"
        }else if(ua.indexOf("Android") > -1)
        {
            return "Android";
        }else{
            return "Pc";
        }
    }

    var createApi = function(api,data)
    {
        api = api.replace('{url}',data.url);
        api = api.replace('{title}',data.title + ' - '+ data.description);
        api = api.replace('{content}',data.description);
        api = api.replace('{pic}',data.img_url);
        return api;
    }

    //网页分享
    var webShare =
    {
        qzone:function(data)
        {
            window.open(createApi(shareApi.qzone,data),"_blank","width=500,height=500");
        },
        weibo:function(data)
        {
            window.open(createApi(shareApi.weibo,data),"_blank","width=500,height=500");
        },
        qq:function(data)
        {
            window.open(createApi(shareApi.qq,data),"_blank","width=500,height=500");
        },
        tqq:function(data)
        {
            window.open(createApi(shareApi.tqq,data),"_blank","width=500,height=500");
        },
        weixin:function(data)
        {
            window.open(createApi(shareApi.weixin,data));
        },
        tieba:function(data)
        {
            window.open(createApi(shareApi.tieba,data));
        }
    }


    var ucAppList = {
        weibo: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
        weixin: ['kWeixin', 'WechatFriends', 1, '微信好友'],
        weixinFriend: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
        QQ: ['kQQ', 'QQ', '4', 'QQ好友'],
        QZone: ['kQZone', 'QZone', '3', 'QQ空间']
    };
    var _plantForm = getPlantform();
    var toAppIndex = (_plantForm == 'iPhone' ?0:1);

    var QQBrowserShare =
    {
        /*
            to_app字段
            //微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
        */
        _openApp:function(data)
        {
            if (typeof(browser) != "undefined") {
                if (typeof(browser.app) != "undefined" && isqqBrowser == bLevel.qq.higher) {
                    browser.app.share(data)
                }
            } else {
                if (typeof(window.qb) != "undefined" && isqqBrowser == bLevel.qq.lower) {
                    window.qb.share(data)
                }else{}
            }
        },
        weibo:function(data)
        {
            data.to_app = ucAppList['weibo'][2];
            this._openApp(data);
        },
        weixin:function(data)
        {
            data.to_app = ucAppList['weixin'][2];
            this._openApp(data);
        },
        weixinFriend:function(data)
        {
            data.to_app = ucAppList['weixinFriend'][2];
            this._openApp(data);
        },
        qq:function(data)
        {
            data.to_app = ucAppList['QQ'][2];
            this._openApp(data);
        },
        qzone:function(data){
            webShare.qzone(data);
        }
    }


    /**
    * 使用UC浏览器自带分享功能
    */
    var UCBrowserShare =
    {
        weibo:function(data)
        {
            ucbrowser.web_share(data.title,data.title,data.url,ucAppList['weibo'][toAppIndex],"","@"+data.title,"")
        },
        weixin:function(data)
        {
            ucbrowser.web_share(data.title,data.title,data.url,ucAppList['weixin'][toAppIndex],"","@"+data.title,"")
        },
        weixinFriend:function(data){
            ucbrowser.web_share(data.title,data.title,data.url,ucAppList['weixinFriend'][toAppIndex],"","@"+data.title,"")
        },
        qzone:function(data){
            webShare.qzone(data);
        },
        qq:function(data)
        {
            ucbrowser.web_share(data.title,data.title,data.url,ucAppList['QQ'][toAppIndex],"","@"+data.title,"")
        },
        more:function(data)
        {
            ucbrowser.web_share(data.title,data.title,data.url,"","","@"+data.title,"")
        }
    }

    //微信分享
    var WXShare = function()
    {

    }
    var UCWebShare =
    {
        weibo:function(data)
        {
            ucweb.startRequest("shell.page_share",[data.title,data.title,data.url,ucAppList['weibo'][toAppIndex],"","@"+data.title,""]);
        },
        weixin:function(data)
        {
            ucweb.startRequest("shell.page_share",[data.title,data.title,data.url,ucAppList['weixin'][toAppIndex],"","@"+data.title,""]);
        },
        weixinFriend:function(data){
            ucweb.startRequest("shell.page_share",[data.title,data.title,data.url,ucAppList['weixinFriend'][toAppIndex],"","@"+data.title,""]);
        },
        qzone:function(data){
            webShare.qzone(data);
        },
        qq:function(data)
        {
            ucweb.startRequest("shell.page_share",[data.title,data.title,data.url,ucAppList['QQ'][toAppIndex],"","@"+data.title,""])
        },
        more:function(data)
        {
            ucweb.startRequest("shell.page_share",[data.title,data.title,data.url,"","","@"+data.title,""])
        }
    }


    /**
     * 判断移动端浏览器类型
     */
    var moblieBrowser = function()
    {
        if(isucBrowser)
        {
            version.uc = isucBrowser ? getVersion(UA.split("UCBrowser/")[1]) : 0;
            if(typeof(ucweb) != 'undefined')
            {
                return UCWebShare;
            }
            if(typeof(ucbrowser) != 'undefined')
            {
                return UCBrowserShare;
            }
        }else{
            if(isqqBrowser)
            {
                if(is_weixin())
                {
                    return WXShare();
                }
                version.qq = isqqBrowser ? getVersion(UA.split("MQQBrowser/")[1]) : 0;
                isloadqqApi();
                //未解决的一个BUG要加载两次JS文件能才使用qq浏览器自带的功能
                isloadqqApi();
                return QQBrowserShare;
            }else{
                return webShare;
            }
        }
    }



    //初始化函数
    var init = function()
    {
        if(_plantForm == 'Pc')
        {
            return webShare;
        }
        else
        {
            return moblieBrowser();
        }

    }


    var btn = document.querySelector('#qq');
    var init = init();
    btn.onclick = function(){
        init.qq(shareData);
    }
    document.querySelector('#weixin').onclick = function(){
        init.weixin(shareData);
    }


})()
