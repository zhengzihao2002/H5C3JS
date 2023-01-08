$(function(){
    let status = true;
    function toggeTool(){
        //如果我们文档滚动的距离超过了 推荐模块顶部的距离：进入推荐模块
        if($(document).scrollTop() >= $(".recommend").offset().top){
            $(".fixedtool").fadeIn();
        }else{
            $(".fixedtool").fadeOut();
        }
    }
    toggeTool();//页面一加载就调用，这样不用滚动也能判断（一次，但也够了）：防止一刷新没滚动，及时出生在下面那段距离，电梯也不显示

    //如果页面发生了滚动，会立刻触发这个事件：显示隐藏电梯导航栏
    $(window).scroll(function(){
        //如果我们文档滚动的距离超过了 推荐模块顶部的距离：进入推荐模块
        toggeTool();

        //只有节流阀 开启时，我们才 遍历楼层：当我们滚动进某个楼层后，电梯要跟着变换颜色 
        if(status==true){
            //遍历楼层：当我们滚动进某个楼层后，电梯要跟着变换颜色 id=hhh
            $(".floor .w:even").each(function(index,element){
                //每次滚动这个就会触发，遍历楼层，然后查看滚动的距离是否大于 每个楼层距离顶部的距离。首先遍历的是一楼，每次滚动一楼都会先变红色（电梯），然后再检查后面，随之变化到别的楼去。但是太快了我们看不到。同时永远无法达到最后一层因为fixedtool楼层 > 实际楼层
                if($(document).scrollTop() >= $(element).offset().top){
                    $(".fixedtool li").eq(index).addClass("current").siblings().removeClass("current");
                }
            });
        }
    })

    //点击电梯导航栏页面可以滚动到相应内容区域:给每个li绑定点击事件
    $(".fixedtool li").click(function(){
        status=false;//关闭节流阀：防止电梯瞬移
        console.log(status);
        // 1. 获取当前被点击的小li的索引号
        let index = $(this).index();
        if(index==$(this).siblings().length){
            //不用 length+1 否则its unreachable. this is perfect. eg fixedtool has length 5, then it has 4 siblings, index 4 is last of of fixedtool. +1 to legnth will get you to fixedtool legnth (not amount of siblings), but the length-1 will be index cuz it start at 0!

            //如果是最后一个选项 -> 返回顶部 
            $("body,html").stop().animate({
                scrollTop:0
            },function(){
                status=true;//重新开启节流阀
            });

            //更改颜色为原始
            console.log($(this).parent().children().eq(0).addClass("current").siblings().removeClass("current"));

            // status=true;//重新开启节流阀
            return;
        }

        //当我们每次点击小li 就需要计算出页面要去往的位置

        // 2. 用index得到对应的内容区域(前提导航栏长度 <= floor长度)
        //也可以 $(".floor w").eq(index);//update:不可以，还是要再w后面加even因为楼层下面的品牌小楼层也有w类
        let content = $(".floor").children(":even").eq(index);
        
        // 3. 用对应内容 计算其 距离顶部的距离
        let distance = content.offset().top;
        
        // 4. 去往 计算出来的位置:页面动画滚动效果
        $("body,html").stop().animate({
            // 注意，这边会触发上面 为id=hhh 的事件！我们上面只要滚动了就会查看我们滚动过的距离是否超过了某些楼层的 距离顶部的距离。如果有，则将电梯内部对应变成红色，而我们正好这边滚动了，导致了’跳电梯bug‘
            //解决方案：当我们点击了小li 此时不需要执行 页面滚动事件里面的 电梯li 的背景选择 添加current类（id=hhh）。节流阀 互斥锁。而且必须写进animate回调函数。animate会交给另外一条线来处理，而js直接跳到下面去了。如果写在外面，比如下面的最后，则animate还没过完锁又给开了，则bug没解决
            scrollTop:distance
        },function(){
            status=true;//重新开启节流阀
        });
        

        // 5. 点击之后，让当前小li添加current类名,兄弟移除current
        $(this).addClass("current").siblings().removeClass("current");

        // status=true;//重新开启节流阀
    })
})

//智商低就别说话！按你这么说美国是和美国中国适合中国，我以后去中国岂不是不是废了？再说了有多少美国研究生是在中国上的大学，来美国难道要重新学起？代码重新学，数学重新学，是不是1+1都要学？代码是通用的，不分国界！没听过中国的软件要求多吗，学了中国的只会变得更强！学代码不分用哪个语言来教，只看你懂不懂，理不理解！打个比方我在贫民窟里出生，你非要我在贫民窟里上学，不让我去大城市，说大城市的教育不适合贫民窟？？？