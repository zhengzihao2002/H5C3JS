window.addEventListener('load',function(){
    //当页面全部加载完我们再执行
    let preview_img = document.querySelector('.preview_img');
    let mask = document.querySelector('.mask');//获取遮挡层
    let big = document.querySelector('.big');//获取装下大图的盒子

    // 1.当我们鼠标经过 preview_img 就显示和隐藏 mask 遮挡层 和big大盒子
    preview_img.addEventListener('mouseover', function() {
        mask.style.display = 'block';
        big.style.display = 'block';
    });
    preview_img.addEventListener('mouseout',function(){
        mask.style.display='none';
        big.style.display='none';
    });

    // 2. 鼠标移动的时候，让黄色的盒子跟着鼠标来走
    preview_img.addEventListener('mousemove', function(e){
        // 1. 先计算出鼠标在盒子内的坐标
        let x = e.pageX - this.offsetLeft;
        let y = e.pageY - this.offsetTop;
        // console.log(x,y);

        // 2. 减去盒子高度(300)的一半 —>（150）为了我们的鼠标在黄色盒子的中央：盒子高度的一半是150
        //如果不加mask.offset，那么鼠标不会再黄色盒子的中心，而是左上角（持续呆在左上角因为盒子内xy坐标是持续获得的）
        // (3) 我们mask 移动的距离：鼠标在盒子内的坐标减去我们mask移动的距离（为了让我们鼠标在mask中心显示）
        let maskX = x - (mask.offsetWidth/2);
        let maskY = y - (mask.offsetHeight/2);
        // (4) 如果x 坐标小于了0 就让他停在0 的位置：设置最大移动距离
        let maskMax = preview_img.offsetWidth - mask.offsetWidth;// 遮挡层的最大移动距离:400-300=100
        if (maskX <= 0) {
            maskX = 0;
        } else if (maskX >= maskMax) {
            maskX = maskMax;
        }
        if(maskY <=0){
            maskY=0;
        }else if(maskY >= maskMax){
            //疑问：为什么可以重新利用maskMax，准确来说maskMax-X？应该新的maskMax-y是preview_img.offsetHeight - mask.offsetHeight;可是你要知道我们的mask和preview都是四方形！
            maskY = maskMax;
        }
        mask.style.left = maskX+'px';
        mask.style.top = maskY+'px';


        // 遮挡层移动距离            大图片移动距离
        //---------------   =    ---------------
        //遮挡层最大移动距离        大图片最大移动距离

        // 3. 大图片的移动距离 = 遮挡层移动距离 * 大图片最大移动距离 / 遮挡层的最大移动距离 
        //遮挡层移动距离 = maskX 或者 maskY
        //遮挡层的最大移动距离 maskMax = preview_img.offsetWidth - mask.offsetWidth;
        //大图片最大移动距离 = 800大图片宽度 - 500大图片盒子宽度 = 300

        // 大图<img>
        let bigImg = document.querySelector('.bigImg');
        // 大图片最大移动距离
        let bigMax = bigImg.offsetWidth- big.offsetWidth;
        // 大图片的移动距离 X Y
        let bigX = (maskX * bigMax) / maskMax;
        let bigY = (maskY * bigMax) / maskMax;
        bigImg.style.left= -bigX + 'px';
        bigImg.style.top= -bigY + 'px';
        //为什么是负数？因为假如是正数，我们鼠标往右走（left值增大），我们的大图也是往右走。我们往右走是为了看到右侧的部分，但是大图也往右走是会让我们看到左侧的部分毕竟left值增大，所以得反着来
    });
});
