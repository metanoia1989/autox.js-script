auto.waitFor();


// var appPackageName = 'com.ss.android.ugc.aweme';

// if (currentPackage() != appPackageName) {
//     app.launchPackage(appPackageName);
//     waitForPackage(appPackageName)
// }

// 手动进入粉丝页面
function delFan()
{
    desc('删除粉丝').findOne().click()
    sleep(800)
    var delBtn = text('移除').findOne()
    delBtn.click()
}

for(let i=0;i<1000;i++) {
    toastLog(`正在删除${i+1}个粉丝`)
    delFan()
    sleep(800)
}

toastLog('finish')
