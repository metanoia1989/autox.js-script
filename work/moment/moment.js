auto.waitFor();
listenVoiceDownAndExitProgram() // 好像没卵用哈哈哈 

var readNum = 0 // 全局变量，请勿修改，阅读文章数量纪录 

//********************************** 
// 变量定义区域
//********************************** 
var finalReadNum = 8  // 阅读文章篇数 
var readShare = true // 阅读完毕后是否分享到朋友圈
var shareText = '分享' // 文章详情页分享按钮的文字 
var selfNickname = '老哥吧' // 朋友圈自己微信号的显示昵称
var releaseText = '发表于' // 公众号文章详情页的文字，没有这个就是第三方链接
//********************************** 

/**
 * 监听音量键减少被按下，退出程序
 */
function listenVoiceDownAndExitProgram()
{
    events.observeKey()
    events.onKeyDown('volume_down', function(event) {
        toastLog('按下了音量下键，退出auto.js程序')
        exit()
    })
    events.onKeyDown('volume_up', function(event) {
        toastLog('按下了音量上键')
    })
}

/**
 * 点击左上角返回图标
 */
function back() 
{
    let imgs = className('ImageView').find();
    let close = imgs.get(0);
    imgs.forEach(i=> {
        if (i.bounds().centerX() < close.bounds().centerX() || i.bounds().centerY() < close.bounds().centerY()) {
            close = i
        }
    });
    sleep(300)
    click(close.bounds().centerX(), close.bounds().centerY())
}

/**
 * 点击右上角图标
 */
function clickRight() {
    let imgs = className('ImageView').find();
    let maxX = 0;
    let minY = imgs.get(0).bounds().centerY()
    imgs.forEach(i=> {
        if (i.bounds().centerX() > maxX) {
            maxX = i.bounds().centerX() 
        }
        if (i.bounds().centerY() < minY) {
            minY = i.bounds().centerY() 
        }
    });
    click(maxX, minY)
}

/**
 * 朋友圈一页的文章
 */
function readPage() {
    let articles = className('LinearLayout').clickable(true).untilFind()
    log('调用了一次 readPage 可点击文章数量:', articles.length)
    let minTop = text('朋友圈').findOne().bounds().bottom
    articles.forEach((item, i) => {
        let bounds = item.bounds()
        let minWidth = device.width * 0.7
        if (i >= 0 && bounds.width() > minWidth && (bounds.height() ==  150) && (bounds.top > minTop) ) {
            click(item.bounds().centerX(), item.bounds().centerY())
            toastLog(`开始阅读第${readNum+1}篇`)
            sleep(5000)
            readFullAriticle()
            readNum++;
            sleep(2000)
            toastLog(`已读完第${readNum}篇，返回上一页`)
            back()
            sleep(2500)
        }
    })
    if (articles.length > 0) {
        toastLog("读完一页了")
    }
    scrollDown()
    sleep(4000)
}


/**
 * 滑动半个屏幕
 * @param {Number} time 滑动时间
 */
function cuSwipeDown(time) {
    gesture(time, [device.width/2, device.height/2], [device.width/2, 0]) 
}

/**
 * 阅读一整篇的文章
 */
function readFullAriticle() {
    if (text('微信公众平台运营中心').exists()) {
        return toastLog("文章已删除")
    }

    if (!textContains(releaseText).exists()) {
        return toastLog("第三方链接，无需阅读到底部")
    }

    var share = text(shareText).untilFindOne()
    let totalHeight = share.bounds().top + 250
    let swipeHeight = 0
    while (true) {
        cuSwipeDown(500)
        sleep(500)
        swipeHeight += device.height/2
        log(totalHeight, swipeHeight)
        if (swipeHeight >= totalHeight) {
            toastLog("滚动完毕")
            break;
        }
        toastLog("继续滚动")
    }

    if (readShare) {
        shareArticle()
    }
}

/**
 * 分享文章
 */
function shareArticle() {
    clickRight()
    sleep(500)
    let shareBounds = text('分享到朋友圈').findOnce().bounds()
    click(shareBounds.centerX(), shareBounds.centerY())
    sleep(500)
    text('发表').click()
}

/**
 * 朋友圈页面滑动到合适的位置
 */
function momentDownList()
{
    gesture(800, [device.width/2, device.height * 0.8], [device.width/2, device.height * 0.4]) 
}

/**
 * 是否有背景照片
 */
function hasBackgroundPicture()
{
    let nickname = text(selfNickname)
    if (!nickname.exists()) {
        return false;
    }

    nickname = nickname.findOne()

    return nickname.bounds().centerX() > device.width / 2
}

/**
 * 程序运行主逻辑
 */
function runProgramMain()
{
    // 屏幕自动坐标缩放，确保朋友圈的文章高度为150px
    setScreenMetrics(1080, 2400)

    var wechatPackageName = 'com.tencent.mm';

    if (currentPackage() != wechatPackageName) {
        app.launchPackage(wechatPackageName);
        waitForPackage("com.tencent.mm")
    }

    // 进入朋友圈
    sleep(1000);
    click("发现");
    sleep(500);

    click("朋友圈");
    sleep(500);

    // 滚动到文章视图
    if (hasBackgroundPicture()) {
        momentDownList()
    }
    sleep(1000)

    while (readNum < finalReadNum) {
        log("执行xxxx")
        readPage()
    }

    toastLog('finish')
}

// showLog && console.show()
runProgramMain()