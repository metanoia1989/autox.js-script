auto.waitFor();

//********************************** 
// 变量定义区域
//********************************** 
var finalReadNum = 5  // 阅读文章篇数 至少5篇
var officialName = '三和大神' // 公众号名称
var readShare = true// 阅读完毕后是否分享到朋友圈
var shareText = '分享' // 文章详情页分享按钮的文字 
//********************************** 

// showLog && console.show()

/**
 * 返回上一页
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

var readNum = 0
function readOnceArticle() {
    let articles = className('android.view.ViewGroup').clickable(true).untilFind()
    articles.forEach((item, i) => {
        let bounds = item.bounds()
        let minWidth = device.width * 0.7
        if (i >= 0 && bounds.width() > minWidth && bounds.height() > 50 ) {
            log(item.bounds().width(), item.bounds().height())
            item.click()
            sleep(5000)
            readFullAriticle()
            if (readShare) {
                shareArticle()
            }
            readNum++;
            sleep(2000)
            log('调用一次back', readNum)
            back()
            sleep(2000)
        }
    })
    scrollDown()
    sleep(1000)
}

// readOnceArticle()
// readFullAriticle()
// exit()

function cuSwipeDown(time) {
    gesture(time, [device.width/2, device.height/2], [device.width/2, 0]) 
}

function readFullAriticle() {
    var shareBounds = text(shareText).untilFindOne().bounds()
    let totalHeight = shareBounds.top + 250
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
}

function shareArticle() {
    // text('Share').exists() && text('Share').click()
    // text('分享').exists() && text('分享').click()
    clickRight()
    sleep(500)
    let shareBounds = text('分享到朋友圈').findOnce().bounds()
    click(shareBounds.centerX(), shareBounds.centerY())
    sleep(500)
    text('发表').click()
}

var wechatPackageName = 'com.tencent.mm';

if (currentPackage() != wechatPackageName) {
    app.launchPackage(wechatPackageName);
    waitForPackage("com.tencent.mm")
}


// 进入公众号搜索页面
sleep(1000);
click("通讯录");
sleep(500);

click("公众号");
sleep(500);

className('ImageView').findOnce(1).click()
sleep(500);

// 在公众号搜索页面，搜索指定公众号，进入消息列表页面
textContains('搜索公众号').findOne().setText(officialName)
let result = className('RelativeLayout').clickable(true).untilFind()
let clickBounds = result.findOne(textContains(officialName)).bounds()
click(clickBounds.centerX(), clickBounds.centerY());
sleep(500);

// let img = className('ImageView').findOnce(0)
// click(device.width - img.bounds().centerX(), img.bounds().centerY())
clickRight()
sleep(500);

// 刷新文章
gesture(400, [device.width/2, device.height/2], [device.width/2, 0]) // 滚动到文章视图
sleep(1000)
while (readNum < finalReadNum) {
    readOnceArticle()
}

toastLog('finish')
