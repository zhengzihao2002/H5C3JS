
window.addEventListener('load',function(e){
    // 1. 获取元素
    let arrow_l = document.querySelector('.arrow-l');
    let arrow_r = document.querySelector('.arrow-r');
    let focus = document.querySelector('.focus');
    let focusWidth = focus.offsetWidth;//这是盒子（中间轮播图盒子）的宽度，也是图片的宽度

    // 2. 鼠标经过focus 就显示隐藏左右按钮
    focus.addEventListener('mouseenter',function(){
        arrow_l.style.display='block';
        arrow_r.style.display='block';
        //清除定时器变量
        clearInterval(timer);
        timer=null;
    });
    focus.addEventListener('mouseleave', function() {
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';

        //从新添加定时器
        timer = setInterval(function(){
            //类似于点击了右侧按钮:手动调用事件
            arrow_r.click();
        },2000);
    });

    // 3. 动态生成小圆圈  有几张图片，我就生成几个小圆圈
    let ul = focus.querySelector('ul');
    let ol = focus.querySelector('.circle');
    for(let i=0;i<ul.children.length;i++){
        // 创建一个小li 
        let li = document.createElement('li');

        // 记录当前小圆圈的索引号 通过自定义属性来做 :后面轮播图移动是要用他来乘
        li.setAttribute('index',i);
        // li.innerHTML=li.getAttribute('index');
        // li.style.color='red';

        // 把小li插入到ol 里面:后面因为是append不是insertBefore（chidren[0]）
        ol.appendChild(li);

        // 4. 小圆圈的排他思想 我们可以直接在生成小圆圈的同时直接绑定点击事件
        li.addEventListener('click',function(){
            // 干掉所有人 把所有的小li 清除 current 类名 (也同时清除掉了自己)
            // for(let j=0;j<ol.children.length;j++){
            //     ol.children[j].className='';
            // }
            // function paita(obj,current,name)
            paita(ol,this,'current');

            // 留下我自己  当前的小li 设置current 类名 （可以说是把自己复活了）
            this.className='current';

            // 5. 点击小圆圈，移动图片 当然移动的是 ul 
            // ul 的移动距离 = 小圆圈的索引号 乘以 图片的宽度 (注意是负值!)
            // 当我们点击了某个小li 就拿到当前小li 的索引号
            let index = this.getAttribute('index');
            // 当我们点击了某个小li 就要把这个li 的索引号给 num:否则num不变将会影响arrow点击时切换的图片  
            num = index;//num是全局变量，当我们使用这个点击事件时，下面num已经被声明了。打个比方，如果没有赋值吗，我们用小圆圈点击到了第三张，没有改变num，num=0，点击arrow会让num++，让后会跳到第二张图片，而不是我们想要的第四张
            // 当我们点击了某个小li 就要把这个li 的索引号给 circle，让圆点也跟着变，否则下面点击arrow时也会乱。num和circle其中一个功能就是让circle.click 和 arrow.clikc 同步。第二就是成功应对克隆的图片
            circle = index;
            // animate(obj,target,function(){});
            animate(ul,-(index*focusWidth));
        });
    }
    // 把ol里面的第一个小li设置类名为 current
    ol.children[0].className='current';

    // 6. 克隆第一张图片(li)放到ul 最后面：不会有新的小圆点冒出来因为上面创建的时候，这个还不存在。
    let first = ul.children[0].cloneNode(true);//true = 1-1 copy
    ul.appendChild(first);
    // 7. 点击右侧按钮， 图片滚动一张:num为目前图片引号
    let num = 0;
    // circle 控制小圆圈的播放：cirle代表小圆圈引号。小圆圈数量<图片数量 by1
    let circle=0;
    // flag 节流阀:防止连续点击导致轮播图过快的问题,就连自动播放也无法突破，毕竟自动播放相当于是每两秒点击一次右侧按钮
    var flag = true;
    arrow_r.addEventListener('click',function(){
        if(flag==true){
            flag=false;//关闭节流阀

            //如果走到了最后复制的最后一张图片，此时我们的ul要快速复原 把left值改成0。执行过程：每次点击都会移动到下一张图片，点击滚到最后一张时（克隆的那一张，用户以为我们已经是在第一张是则不是），这个时候我们还没有返回原点，因为if是在事件头部而我们是尾部进行滚动的。再次点击下一张（用户期待播放到第二张），我们if检测到我们已经是最后一张，立刻（我们肉眼看不见的速度）返回第一张(这个时候if已经执行完毕了)，然后再滚动到第二张。也就是说除了第一次，我们再也不会在第一张停留（可能一毫秒为了完成移动过程）
            if(num== ul.children.length-1){//最后一张（克隆的）
                //复原位置
                ul.style.left=0;
                num=0;
                //目前在克隆那一张（伪第一张）而且要到下一张？我给你先返回第一张（这个时候不要停留因为我们已经在克隆停留了）再滚到第二张！
            }
            num++;
            // animate(obj,target,callback);
            animate(ul,-(num*focusWidth),function(){
                flag=true;//打开节流阀
            });
            // 8. 点击右侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
            circle++;
            // 如果circle == 4 说明走到最后我们克隆的这张图片了 我们就复原
            if(circle == ol.children.length){//这边是ol不是ul，ol是小圆圈父亲，不是图片父亲
                circle=0;
            }
            //让其自己变成current其他滚开:如果把排他放在if前面，会出错。因为当我们从实际最后一张滚到克隆那一张时，circle是4，而假如把排他放在if前面，我们排出所有然后再让ol.children[4]变成转为current，这是我们会发现我们的索引号只到3，长度才是4，所以设置current失败。然后再去执行if把circle改为0，这个时候已经没有任何用处了。正确做法是，当我们从实际最后一张滚到克隆时，if先检测我们已经到了克隆，先返回0（这样用户即使在克隆那一张，circle也显示为第一张）,再排他，把current负值给第一个child，而不是不存在的child（如果把if放在排他后面就会出现这个情况）。
            paita(ol,ol.children[circle],'current');
            }
    });


    // 9. 左侧按钮做法
    arrow_l.addEventListener('click',function(){
        if(flag==true){
            flag=false;
            //改图片移动
            if (num == 0) {
                num = ul.children.length - 1;//跳到最后一张图片(克隆)
                console.log(num+1);
                ul.style.left = -(num) * focusWidth + 'px';
            }
            num--;//再往左跳（跳出克隆）
            animate(ul,-(num*focusWidth),function(){
                flag=true;//打开节流阀
            });

            //改小圆圈
            circle--;
            if(circle <0){
                //说明第一张图片要往左挑，跳回第四张
                circle=ol.children.length-1;
            }
            paita(ol,ol.children[circle],'current');
        }
    });

    //排他思想 函数
    function paita(obj,current,name){
        //排他思想
        //此函数会将所有的obj孩子改为无类名,并且将current改为某一个类名
        for(let j=0;j<obj.children.length;j++){
            obj.children[j].className='';
        }
        current.className=name;
    }


    // 10. 自动播放轮播图:每隔两秒
    let timer = setInterval(function(){
        //类似于点击了右侧按钮:手动调用事件
        arrow_r.click();
    },5000);
});
