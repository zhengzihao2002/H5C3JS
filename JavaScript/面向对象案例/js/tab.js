let tab_backup;
class Tab{
    constructor(id){
        // 获取元素

        // given最大盒子id=tab，我们将其获取过来，储存在对象里的main变量里
        this.main = document.querySelector(id);

        this.add=this.main.querySelector('.tabadd');

        // li父元素 和 section父元素
        this.ul=this.main.querySelector('.fisrstnav ul:first-child');
        this.contentArea=this.main.querySelector('.tabscon ');

        //调用 此类 中的init函数 而不是随便某个函数
        this.init();

        //this指向调用者，就是实例化对象，将其复制给tab_backup
        tab_backup=this;
    }
    init(){
        // contructor calls init，this=实例化对象(btw: constructor this = 实例化对象; cuz thats who call contrctor)

        //初始化：让相关的元素绑定事件
        this.updateNode();
        //给每个tab绑定事件
        for(let i=0;i<this.lis.length;i++){
            //给每个标签添加一个属性名字叫myIndex 储存引号
            this.lis[i].myIndex=i;
            this.lis[i].addEventListener('click',this.toggleTab);

            this.remove[i].addEventListener('click',this.removeTab);
            this.span[i].addEventListener('dblclick',this.editTab);
            this.contents[i].addEventListener('dblclick',this.editTab);

            //假如有新增tab，里面的内容要改为这个。对已有的没有影响。有个problem就是假如有1234，删掉3之后，124，添加一个->1234，3又回来了，因为下面两行会重新设置所有tab和content里面的内容
            // this.lis[i].querySelector('span').innerHTML='测试'+ (i+1);
            // this.contents[i].innerHTML='测试'+ (i+1)+' 的内容';
        }

        //给‘添加按钮’绑定事件
        this.add.addEventListener('click',this.addTab);
        if(this.lis.length>=8){
            this.add.style.display='none';
        }

        console.log('initialize conpleted',this);
    }
    // 因为我们动态添加元素 需要从新获取对应的元素
    updateNode(){
        //获取标签以及对应内容

        // console.log(this); //init calls, init this is 实例化对象，this‘ll be too
        // console.log(this.main);//每次添加一个标签然后要重新初始化时，都要来此更新一下shit然后初始化才能添加点击事件。事实证明，main，即使是第一次那时候就获取过来了，html结构发生变化时，再次访问main，里面是全新的。所以main是一个访问链接，非copy

        // 所有的li 伪数组
        this.lis = this.main.querySelectorAll('li');
        // 所有的content 伪数组
        this.contents = this.main.querySelectorAll('section');
        // 删除按钮伪数组
        this.remove=this.main.querySelectorAll('.icon-guanbi');
        // 标签 内容 伪数组
        this.span = this.main.querySelectorAll('.fisrstnav li span:nth-child(1)');
    }
    // 1. 切换功能
    toggleTab(){
        //this指向函数调用者（lis[i]）
        // console.log(this,this.myIndex);

        tab_backup.clearClass(tab_backup.lis,'liactive');
        this.classList.add('liactive');

        
        tab_backup.clearClass(tab_backup.contents,'conactive');
        tab_backup.contents[this.myIndex].classList.add('conactive');
    }
    // 2. 添加功能
    addTab(){
        //以前：1. createElement 2. innerHTML 3. appendChild

        //创建li元素 和 section元素
        let li = '<li class="liactive"><span>新选项卡</span><span class="iconfont icon-guanbi"></span</li>';
        let content = '<section class="conactive">新内容</section>';

        // 清除tab和content的active类：新增必须是active
        tab_backup.clearClass(tab_backup.lis,'liactive');
        tab_backup.clearClass(tab_backup.contents,'conactive');

        // 追加到父元素内部 将li和section追加到父元素最后面 相当于appendChild 
        tab_backup.ul.insertAdjacentHTML('beforeend',li);
        tab_backup.contentArea.insertAdjacentHTML('beforeend',content);
                
        //重新初始化
        tab_backup.init();
    }
    // 3. 删除功能
    removeTab(e){
        //who called me? the one of the remove buttons which had a event listener! this = the remove button
        let removeBtn = this;
        let li = removeBtn.parentNode;
        let index = li.myIndex;//每次init都会把for循环i的索引号写进li的myIndex属性

        //别忘了冒泡。点击了'叉号'之后会冒泡到li，li有点击事件，这个点击事件就会被触发
        e.stopPropagation();

        // 移除对应的 表现与内容
        tab_backup.contents[index].remove();
        tab_backup.lis[index].remove();

        tab_backup.init();
        // console.log(tab_backup.ul,tab_backup.lis);
        //如果不重新初始化，删除某些标签后lis依然保留原来的数值。虽然说先对于add后不初始化，这个不会对我们的程序造成伤害（add后不初始化无法添加对应的事件），但是保留着依然不好。ul会随着remove而自动变化因为他是链接不是copy。lis是固定的伪数组aka copy verison，需要更新。

        //如果删掉的是active，那么他的左边会变成新active
        if(li.classList.contains('liactive')){
            //当我们删除了选中状态这个li，让他的前一个li处于选定状态
            index--;// 更新本地储存的index
            if(index<0){
                //没有左边
                return;
            }
            tab_backup.lis[index].click();//手动调用点击事件(别忘了lis是querySelectorAll)
            console.log('NEW ACTIVE');
        }

        //pink: if first one is not true (Does not exist) then it will exit and will not execute second one
        //tab_backup.lis[index] && that.lis[index].click();
    }
    // 4. 修改功能
    editTab(){
        //文本域 双击后 会冒泡 到他的爸爸section，然后section有双击事件，这个双击事件就会被触发。解决方案：1.一下。2.外面声明一个节流阀 使用时设为true等。3. 给input添加一个双击事件并阻止冒泡
        if(this.children.length>0) return;

        // 双击 禁止选定 文本内容
        window.getSelection? window.getSelection().removeAllRanges():document.selection.empty();
        
        let originalMessage = this.innerText;
        
        if(this.tagName.toLowerCase() == 'span'){
            this.innerHTML = '<input type="text" />';
        }else{
            this.innerHTML = '<textarea></textarea>';
        }
        let input = this.children[0];
        input.value=originalMessage;
        //让文本框文字处于选定状态
        input.select();
        input.addEventListener('blur',function(){
            this.parentNode.innerHTML=this.value;
        });
        input.addEventListener('keyup',function(e){
            if(e.key=='Enter'){
                input.blur();
            }
        });
    }
    clearClass(array,removable){
        for(let i=0;i<array.length;i++){
            array[i].classList.remove(removable);
        }
    }
}
let tab = new Tab('#tab');




























// // let tab_backup;
// class Tab{
//     constructor(id){
//         // 获取元素

//         // given最大盒子id=tab，我们将其获取过来，储存在对象里的main变量里
//         this.main = document.querySelector(id);

//         this.add=this.main.querySelector('.tabadd');

//         // li父元素 和 section父元素
//         this.ul=this.main.querySelector('.fisrstnav ul:first-child');
//         this.contentArea=this.main.querySelector('.tabscon ');

//         //调用 此类 中的init函数 而不是随便某个函数
//         this.init();

//         //this指向调用者，就是实例化对象，将其复制给tab_backup
//         // tab_backup=this;
//     }
//     init(){
//         // contructor calls init，this=实例化对象(btw: constructor this = 实例化对象; cuz thats who call contrctor)

//         //初始化：让相关的元素绑定事件
//         this.updateNode();
//         //给每个tab绑定事件
//         for(let i=0;i<this.lis.length;i++){
//             //给每个标签添加一个属性名字叫myIndex 储存引号
//             this.lis[i].myIndex=i;
//             this.lis[i].removeEventListener('click',this.toggleTab().bind(this.lis[i],this));
//             this.lis[i].addEventListener('click',this.toggleTab.bind(this.lis[i],this));//第一参数就是不要改变函数内部this因为函数内部有使用到this，第二参数就是将this以参数的形式传递过去

//             this.remove[i].removeEventListener('click',this.removeTab().bind(this.remove[i],this));
//             this.remove[i].addEventListener('click',this.removeTab.bind(this.remove[i],this));
//             this.span[i].addEventListener('dblclick',this.editTab);
//             this.contents[i].addEventListener('dblclick',this.editTab);

//             //假如有新增tab，里面的内容要改为这个。对已有的没有影响。有个problem就是假如有1234，删掉3之后，124，添加一个->1234，3又回来了，因为下面两行会重新设置所有tab和content里面的内容
//             // this.lis[i].querySelector('span').innerHTML='测试'+ (i+1);
//             // this.contents[i].innerHTML='测试'+ (i+1)+' 的内容';
//         }

//         //给‘添加按钮’绑定事件
//         this.add.removeEventListener('click',this.addTab.bind(this.add,this));
//         this.add.addEventListener('click',this.addTab.bind(this.add,this));
//         if(this.lis.length>=8){
//             this.add.style.display='none';
//         }

//         console.log('initialize conpleted',this);
//     }
//     // 因为我们动态添加元素 需要从新获取对应的元素
//     updateNode(){
//         //获取标签以及对应内容

//         // console.log(this); //init calls, init this is 实例化对象，this‘ll be too
//         // console.log(this.main);//每次添加一个标签然后要重新初始化时，都要来此更新一下shit然后初始化才能添加点击事件。事实证明，main，即使是第一次那时候就获取过来了，html结构发生变化时，再次访问main，里面是全新的。所以main是一个访问链接，非copy

//         // 所有的li 伪数组
//         this.lis = this.main.querySelectorAll('li');
//         // 所有的content 伪数组
//         this.contents = this.main.querySelectorAll('section');
//         // 删除按钮伪数组
//         this.remove=this.main.querySelectorAll('.icon-guanbi');
//         // 标签 内容 伪数组
//         this.span = this.main.querySelectorAll('.fisrstnav li span:nth-child(1)');
//     }
//     // 1. 切换功能
//     toggleTab(tab_backup){
//         // tab_backup 也被称为 constructorThis，也就是实例对象

//         //this指向函数调用者（lis[i]）
//         // console.log(this,this.myIndex);

//         tab_backup.clearClass(tab_backup.lis,'liactive');
//         this.classList.add('liactive');

        
//         tab_backup.clearClass(tab_backup.contents,'conactive');
//         tab_backup.contents[this.myIndex].classList.add('conactive');
//     }
//     // 2. 添加功能
//     addTab(tab_backup){
//         //以前：1. createElement 2. innerHTML 3. appendChild

//         //创建li元素 和 section元素
//         let li = '<li class="liactive"><span>新选项卡</span><span class="iconfont icon-guanbi"></span</li>';
//         let content = '<section class="conactive">新内容</section>';

//         // 清除tab和content的active类：新增必须是active
//         tab_backup.clearClass(tab_backup.lis,'liactive');
//         tab_backup.clearClass(tab_backup.contents,'conactive');

//         // 追加到父元素内部 将li和section追加到父元素最后面 相当于appendChild 
//         tab_backup.ul.insertAdjacentHTML('beforeend',li);
//         tab_backup.contentArea.insertAdjacentHTML('beforeend',content);
                
//         //重新初始化
//         tab_backup.init();
//     }
//     // 3. 删除功能
//     removeTab(tab_backup,e){
//         //who called me? the one of the remove buttons which had a event listener! this = the remove button
//         let removeBtn = this;
//         let li = removeBtn.parentNode;
//         let index = li.myIndex;//每次init都会把for循环i的索引号写进li的myIndex属性

//         //别忘了冒泡。点击了'叉号'之后会冒泡到li，li有点击事件，这个点击事件就会被触发
//         e.stopPropagation();

//         // 移除对应的 表现与内容
//         tab_backup.contents[index].remove();
//         tab_backup.lis[index].remove();

//         tab_backup.init();
//         // console.log(tab_backup.ul,tab_backup.lis);
//         //如果不重新初始化，删除某些标签后lis依然保留原来的数值。虽然说先对于add后不初始化，这个不会对我们的程序造成伤害（add后不初始化无法添加对应的事件），但是保留着依然不好。ul会随着remove而自动变化因为他是链接不是copy。lis是固定的伪数组aka copy verison，需要更新。

//         //如果删掉的是active，那么他的左边会变成新active
//         if(li.classList.contains('liactive')){
//             //当我们删除了选中状态这个li，让他的前一个li处于选定状态
//             index--;// 更新本地储存的index
//             if(index<0){
//                 //没有左边
//                 return;
//             }
//             tab_backup.lis[index].click();//手动调用点击事件(别忘了lis是querySelectorAll)
//             console.log('NEW ACTIVE');
//         }

//         //pink: if first one is not true (Does not exist) then it will exit and will not execute second one
//         //tab_backup.lis[index] && that.lis[index].click();
//     }
//     // 4. 修改功能
//     editTab(){
//         //文本域 双击后 会冒泡 到他的爸爸section，然后section有双击事件，这个双击事件就会被触发。解决方案：1.一下。2.外面声明一个节流阀 使用时设为true等。3. 给input添加一个双击事件并阻止冒泡
//         if(this.children.length>0) return;

//         // 双击 禁止选定 文本内容
//         window.getSelection? window.getSelection().removeAllRanges():document.selection.empty();
        
//         let originalMessage = this.innerText;
        
//         if(this.tagName.toLowerCase() == 'span'){
//             this.innerHTML = '<input type="text" />';
//         }else{
//             this.innerHTML = '<textarea></textarea>';
//         }
//         let input = this.children[0];
//         input.value=originalMessage;
//         //让文本框文字处于选定状态
//         input.select();
//         input.addEventListener('blur',function(){
//             this.parentNode.innerHTML=this.value;
//         });
//         input.addEventListener('keyup',function(e){
//             if(e.key=='Enter'){
//                 input.blur();
//             }
//         });
//     }
//     clearClass(array,removable){
//         for(let i=0;i<array.length;i++){
//             array[i].classList.remove(removable);
//         }
//     }
// }
// let tab = new Tab('#tab');

// //返回原版：取消注释1和19行(声明tabbackup和在init里给tabbackup赋值)，删除所有bind操作，删除所有函数的tab_backup参数,删除所有removeEventListener。事实证明bind和addEventListener不匹配（onclick就可以因为onclick同时只能绑定一个事件）。原因可能是给带有bind的事件添加事件时，他会以为我们给的函数每次都是不一样的（毕竟带bind和莫名其妙的参数）所以随着addeventLister的性子 会给同个click添加多个事件，重复添加相同的事件，导致比如addtab第一次正常，第二次一下添加俩（但是lis检测不到），第三次添加4个，第四次8个。。。而且还无法给事件解绑（他都无法识别出我们再次绑定时是同一个函数了，怎么解绑 已经丢了链接无法访问当时那个事件了，要是能识别出来就覆盖了而不是创建新的事件在同一个按钮身上）onclick能解决一切毕竟任何添加事件都是覆盖（同时只能绑定一个事件）。除非能找到 ‘修改事件’ 而不是‘添加事件’

