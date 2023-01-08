window.addEventListener('load',function(){
    // 1.获取元素
    let focus= document.querySelector('.focus');
    let ul = focus.children[0];
    let ol = focus.children[1];
    //获得focus的宽度:注意offsetLeft和offsetWidth不一样(不但返回width还包含padding和边框，client就不包含边框)
    let width = focus.offsetWidth;

    // 2.利用定时器自动轮播图片：从第一张图片开始而不是替补（no1）图片开始(css->margin:-100%)
    // let index =1;//不用trans用left
    let index =0;//default at 第一张，set index of it to be 0
    let timer = this.setInterval(function(){
        index++;
        let translatex=  -(index*width);
        ul.style.transition='all .3s'
        // ul.style.left= translatex+'px';
        ul.style.transform= 'translateX(' + translatex + 'px)';
    },2000)

    //从替补NO2（第一张的替身，也就是最后一张）跳回初始图片（第一张）
    //等着我们过度完成之后，再去判断 监听过度完成的事件 transtionend
    ul.addEventListener('transitionend',function(){
        //无缝滚动:每次过度完都会来检查一次，只有最后一张图片的时候才起效果，趁停留之际(动画已做完)从替补NO2跳回第一张（非替补NO1）
        if(index>=3){//走到最后一张(替补no2)时（这个时候过度效果已经做完，停留在那边）
            index=0;//把index调回
            // 去掉过渡效果 这样让我们的ul 快速的跳到目标位置
            ul.style.transition='none';
            // 利用最新的索引号乘以宽度 去滚动图片：滚到第一张(因为替补第一目前使用ml来做的)
            let translatex = -(index * width);//计算trans值=0
            ul.style.transform= 'translateX(' + translatex + 'px)';
            //趁停留之际直接悄无声息的glitch回第一张，然后timer会继续,滚到第二张。。。and because 替补2 and 1st is the same image, glitching it, you aint gonna see nothing
        }else if(index < 0){//倒着走
            index=2;
            // 去掉过渡效果 这样让我们的ul 快速的跳到目标位置
            ul.style.transition='none';
            // 利用最新的索引号乘以宽度 去滚动图片
            let translatex = -(index * width);
            ul.style.transform= 'translateX(' + translatex + 'px)';
        }


        //小圆点跟随变化:注意上面只有到了最后一张才会执行而这里每次过度完都会执行！！！！！
        // 把ol里面li带有current类名的选出来 去掉类名 remove
        ol.querySelector('li.current').classList.remove('current');
        // 让当前索引号 的小li 加上 current   add
        ol.children[index].classList.add('current');
    });


    // 4. 手指滑动轮播图 
    // 触摸元素 touchstart： 获取手指初始坐标
    let startX=0; //default
    let moveX=0;// default;后面我们会使用这个移动距离所以要定义一个全局变量
    let flag = false;
    ul.addEventListener('touchstart',function(e){
        //更新初始x坐标
        startX=e.targetTouches[0].pageX;

        //手指触摸的时候就停止轮播图
        clearInterval(timer);
    });

    // 移动手指 touchmove： 计算手指的滑动距离， 并且移动盒子
    ul.addEventListener('touchmove',function(e){
        flag=true;//我们手指移动了！如果用户手指移动过我们再去判断否则不做判断效果
        //计算移动距离：持续更新（移动一像素就更新一次那样）
        moveX=(e.targetTouches[0].pageX) - startX;//新位置 - 初始位置

        // 移动盒子：  盒子原来的位置 + 手指移动的距离 
        //滚到某个图片是要index来计算的。我们再次用这个全局变量来计算:ul原来的位置 + 我们手指移动的距离
        let translatex = -(index * width) +moveX;
        // 手指拖动的时候，不需要动画效果 所以要取消过渡效果
        ul.style.transition = 'none';//不要过度否则移动一像素都要0.3秒这样子。
        ul.style.transform = 'translateX(' + translatex + 'px)';//每移动 <1px 就translate一像素，这就是过度效果！<1px 的生硬移动你是看不出来的！
        e.preventDefault(); // 阻止滚动屏幕的行为

        //思考时间：
        //手指往右滑：moveX为正，trans为正，ul一直往右侧translate
        //手指往左滑：moveX为负，trans为负，ul一直往左侧translate
    });

    // 手指离开 根据移动距离去判断是回弹还是播放上一张下一张
    ul.addEventListener('touchend',function(e){
        //假如用户按下，没有拖动任何px（没有访问touchmove事件），我们没有必要进行这么多计算
        if (flag) {
            //如果移动距离大于50像素我们就播放上一张或者下一张:如果往左滑动就是负值，往右滑动就是正值，都要播放上一张或者下一张
            if(Math.abs(moveX) > 50){
                //(1)如果移动距离大于50像素我们就播放上一张或者下一张
                if(moveX > 0){
                    //检测到moveX是正值，说明用户往右滑，ul要往右跑，实现播放上一张
                    index--;
                }else{
                    //检测到moveX是负值，说明用户往左滑，ul要往左跑，实现播放下一张
                    index++;
                }

                let translatex = -(index*width);
                ul.style.transition = 'all .3s';//如果不加，效果会很生硬！touchstart->touchmove(取消过度)->touchend(重新开始过度)。我们每次自动轮播的时候，每次都会重新设置transition，所以就算你能忍受生硬，没事不会影响自动轮播！
                ul.style.transform = 'translateX(' + translatex + 'px)';
            }else{
                //(2)如果移动距离小于50像素我们就回弹
                let translatex = -(index*width);
                ul.style.transition = 'all .1s';//我们每次自动轮播的时候，每次都会重新设置transition，所以就算你set to 0.1，没事不会影响自动轮播的0.3！
                ul.style.transform = 'translateX(' + translatex + 'px)';
            }
            //动画结束后照样调用transitionend：小圆点判断以及替补判断
        }
        flag=false;//回到原样,否则一次true后（touchmove设置的）次次true（因为没有设回false），然后就算没有拖动(只是点击)也进行判断了。g

        // 手指离开的时候就重新开启定时器
        clearInterval(timer);//开之前清除定时器，这样就能保证页面只有一个定时器在运行
        timer = setInterval(function() {
            index++;
            var translatex = -(index * width);
            ul.style.transition = 'all .3s';
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }, 2000);
    });



    // 返回顶部模块制作------------------------------------------
    let htmlElement = document.documentElement;
    let bodyElement = document.body;
    //获取元素
    let goBack = document.querySelector('.goBack');
    let nav = document.querySelector('nav');
    //添加页面滚动事件:每当页面滚动时就触发
    window.addEventListener('scroll',function(){
        if(window.pageYOffset>= nav.offsetTop){
            //如果页面被卷去的头部大于等于 nav距离顶部的距离
            goBack.style.display ='block';
        }else{
            goBack.style.display='none';
        }

    });
    goBack.addEventListener('click',function(){
        //快速返回
        htmlElement.scrollBehavior='smooth';
        bodyElement.scrollBehavior='smooth';
        window.scroll(0,0);
    });

    //无视300毫秒
    //移动端又个300ms延迟来判断你是否有双击，有了这个插件则不需要等300ms而是直接点击按钮（简单粗暴方法则是给html加user-scalable=no）
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(goBack);
        }, false);
    }
});

