(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
    }
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
// 防止iphone移动
$(document).on('touchmove',function(ev){
    ev.preventDefault();
});
$(document).ready(function(){
    var $main = $('#main');
    var $list = $('#list');
    var $li = $list.find('>li');
    var viewHeight = $(window).height();
    // 每一屏的高度
    $main.css({"height":viewHeight});
    // background-size进行缩放后 图片偏右的处理
    function nowPicWidth(){
        // 计算当前屏幕图片的宽度
        var w = 640 * viewHeight / 960;
        w = w > 640 ? w : 640;
        return w;
    }
    var leftRight = (640 - nowPicWidth()) / 2;
    $li.css({"background-position":leftRight+"px 0"});
    $li.find('.one-one').css({"background-position":leftRight+"px 0"});
    slide();
    // 滑屏操作
    function slide(){
        var startY = 0;
        var step = 1/4;
        var nowIndex = 0;
        var nextIndex = 0;
        var btn = true;

        $li.on('touchstart',function(ev){
            ev.stopPropagation();    //  阻止事件冒泡
            if(btn){
                btn = false;
                var touch = ev.originalEvent.changedTouches[0];
                startY = touch.pageY;//获取touch的坐标
                nowIndex = $(this).index();
                $li.on('touchmove.move',function(ev){
                    var touch = ev.originalEvent.changedTouches[0];
                    $(this).siblings().hide();
                    // 移动的坐标和 刚开始的比较从而判断是上还是下
                    $li.eq(nextIndex).show().addClass('zIndex').siblings().removeClass('zIndex');
                    // 缩放系数
                    var $scale =1-Math.abs(touch.pageY-startY)*step/viewHeight;
                    if(touch.pageY < startY){//上
                        nextIndex = nowIndex == $li.length-1?0:nowIndex+1;
                        $li.eq(nextIndex).css('transform', 'translate(0,'+(viewHeight+touch.pageY - startY)+'px)');

                    }else{//下
                        nextIndex = nowIndex == 0?$li.length-1:nowIndex-1;
                        $li.eq(nextIndex).css('transform', 'translate(0,'+(-viewHeight+touch.pageY - startY)+'px)');
                    }

                   $(this).css('transform', 'translate(0,'+(touch.pageY-startY)*step+'px) scale('+$scale+')');//图片一起滑动

                });

                $li.on('touchend.move',function(ev){
                    var touch = ev.originalEvent.changedTouches[0];
                    if(touch.pageY < startY){//上
                        $li.eq(nowIndex).css('transform','translate(0,'+(-viewHeight*step)+'px) scale('+(1-step)+')');
                    }else{//下
                       $li.eq(nowIndex).css('transform','translate(0,'+(viewHeight*step)+'px) scale('+(1-step)+')');
                    }
                    $li.eq(nowIndex).css('transition', '.3s');
                    $li.eq(nextIndex).css('transition', '.3s');
                    $li.eq(nextIndex).css('transform','translate(0,0)');
                    $li.off('.move');
                });
            }
        });
        // transition end
        $li.on('transitionEnd webkitTransitionEnd',function(){
            resetFn();
        });
        function resetFn(){
            $li.css('transform','');
            $li.css('transition','');
            btn = true;
        }

    }

    // 入场动画和出厂动画
   var Ani = [
        {
            inAn : function(){
                $('.one-boom').addClass('text');
                $('.one-pic').addClass('one-ani');
            },
            outAn : function(){
                $('.one-boom').removeClass('text');
                $('.one-pic').removeClass('one-ani');
            }
        }
   ];
   Ani[0].outAn();

   showMusic();
    // music
    function showMusic(){
        var $music = $('#music');
        var $a1 = $('#a1');
        var onoff = true;
        $music.on('touchstart',function(){
            if(onoff){
                $(this).attr('class','active');
                $a1.get(0).play();
            }
            else{
                $(this).attr('class','');
                $a1.get(0).pause();
            }
            onoff = !onoff;
        });
        $music.trigger('touchstart');
    }


    //loading 预加载
    var arr = ['360.png','arrow.png','barrage.png','barrage_open.png','HOT_1.jpg','HOT_2.jpg','HOT_3.jpg',
        'hot_off.png','hot_on.png','IMG_7591.JPG','IMG_7592.JPG','IMG_7593.JPG','IMG_7594.JPG','IMG_7595.JPG',
        'IMG_7596.JPG','IMG_7597.JPG','IMG_7598.JPG','IMG_7599.JPG','IMG_7600.JPG','IMG_7601.JPG','IMG_7602.JPG',
        'IMG_7603.JPG','IMG_7604.JPG','IMG_7605.JPG','IMG_7606.JPG','IMG_7607.JPG','IMG_7608.JPG','IMG_7609.JPG',
        'IMG_7610.JPG','IMG_7611.JPG','IMG_7612.JPG','IMG_7613.JPG','IMG_7614.JPG','IMG_7615.JPG','IMG_7616.JPG',
        'IMG_7617.JPG','IMG_7618.JPG','IMG_7619.JPG','IMG_7620.JPG','IMG_7621.JPG','IMG_7622.JPG','IMG_7623.JPG',
        'IMG_7624.JPG','IMG_7625.JPG','IMG_7626.JPG','like.png','music.png','music_pause.png','product_table.png',
        'shop_cart.png','vertical_covert_horizontal.png'];
    var num = 0;
    function showLoading(){
        $.each(arr,function(i,imgSrc){
            var objImg = new Image();
            objImg.src = 'images/' + imgSrc;
            objImg.onload = function(){
                num++;
                if(num > 5){
                    $('#loading').animate({opacity : 0},1000,function(){
                        $(this).remove();
                    });
                }
                if( num < arr.length ){
                    showLoading();
                }
            };
            objImg.onerror = function(){
                $('#loading').animate({opacity : 0},1000,function(){
                    $(this).remove();
                });
            }

        });

    }
    showLoading();


    //360度旋转
    var descList = new Array();
    var imgArray = new Array();
    var product_1;
    function rotateImgFllowDesc(picTags){
        if (picTags){
            if(picTags.length==0){
                $(".product-pic-desc").hide();
            }else{
                $(".product-pic-desc").show();
                var descLen = imgArray.length;
                var index=new Array;
                for(key in picTags){
                    index[index.length]=key;
                }
                if(index.length==1){
                    descList.push(picTags[index[0]]);
                }else{
                    var desLen = imgArray.length;
                    for(var i=1;i<index.length;i++){
                        for(var j=0;j<parseInt(index[i]-index[i-1]);j++){
                            descList.push(picTags[index[i-1]]);
                        }
                    }
                    descList.push(picTags[index[index.length-1]]);
                    if(index[index.length-1]<descLen){
                        for(var i=0;i<=descLen-(index[index.length-1]);i++){
                            descList.push(picTags[index[index.length-1]]);
                        }
                    }
                }
            }
        }
    }

    function processJsonData(jsonData){
        //pic list
        if (jsonData.picUrls){
            for (var i=0; i<jsonData.picUrls.length; i++) {
                //imgArray.push('http://123.57.3.33:9000/pic/work/'+jsonData.picUrls[i]);
                imgArray.push(jsonData.picUrls[i]);
            }

            rotateImgFllowDesc(jsonData.picTags);

            console.log(imgArray);
            console.log(descList);


            var totalPicNum = imgArray.length;
            console.log(totalPicNum);
            var picHeight = "100%";
            var picWidth = "100%";
            product_1 = $('.product1').ThreeSixty({
                totalFrames: totalPicNum, // Total no. of image you have for 360 slider
                endFrame: totalPicNum, // end frame for the auto spin animation
                currentFrame: 0, // This the start frame for auto spin
                zeroBased: true,
                imgList: '.threesixty_images', // selector for image list
                progress: '.spinner', // selector to show the loading progress
                filePrefix: '', // file prefix if any
                ext: '.jpg', // extention for the assets
                height: 300,
                width: 500,
                navigation: true,
                disableSpin: false, // Default false
                imgDescList: descList,
                imgDesc: '.product-pic-desc',
                framerate: 30,
                imgArray: imgArray,
                playSpeed: 800,
                autoplayDirection:-1,
                onReady: function(){
                    product_1.play();
                },
                onDragStart: function () {
                    console.log('1')
                    console.log(imgArray);
                    console.log(descList);
                    clearInterval(product_1.play);
                },
                onDragStop: function () {
                    console.log('2')
                    console.log(imgArray);
                    console.log(descList);
                    clearInterval(product_1.play);
                },
            });
        }
    }

    function showImagesFromLocalJson(jsonFile){
        $.getJSON(jsonFile, function(data){
            if (data.code!=0) {
                console.log("code: "+data.code);
                alert("作品不存在");
            } else {
                processJsonData(data.data);
            }
        });
    }

    showImagesFromLocalJson('data/example.json');

});
