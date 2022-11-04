// 抖音APP上移除粉丝一天大概一千左右
// 不过管理后台还能移除，搞个油猴脚本，添加个一键勾选的按钮，一分钟手动也能删除很多

// 油猴脚本开发教程 https://juejin.cn/post/7138346293042085924 
// 油猴脚本开发指南 https://violentmonkey.github.io/guide/creating-a-userscript/    

// 一次加载20个粉丝，最多只能勾选20个粉丝 
// 不能手动，手动效率很低
// 一次20个，一万个要点500次，会很累    
// 


// ==UserScript==
// @name        batch delete fans - douyin.com
// @namespace   Violentmonkey Scripts
// @match       https://creator.douyin.com/creator-micro/data/following/follower
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant       none
// @version     1.0
// @author      -
// @description 04/11/2022, 16:49:37
// ==/UserScript==

$(function () {
    var batchSelect = `batchSelectFans
      <div id="batchSelectFans" style="width: 100px; height: 50px; color: red;">删除20个粉丝</div>
    `
    $('#micro').prepend(batchSelect)
    $('#micro').on('click', '#batchSelectFans', function () {
      delFans()
    })
    function delFans()
    {
      // 选中多选
      $('.tabs-extra--2HZn6 .semi-checkbox').click()
  
      // 先点击两次加载更多
      var loadmore = $('.semi-table-wrapper').next()
      loadmore[0].click()
      loadmore[0].click()
  
      // 选中20个粉丝删除
      $('td .semi-checkbox').slice(0, 19).each(function () {
        $(this).trigger('click');
      });
      $('.semi-button-content:contains("批量移除粉丝")').trigger('click');
      setTimeout(function () {
        $('.semi-button-content:contains("确定")').trigger('click');
      }, 800)
    }
    let a = 1;
    setInterval(function () {
      $('#batchSelectFans').click()
      console.log(`删除20个粉丝，第${a}次`)
      a = a + 1;
    }, 3000)
  
  })