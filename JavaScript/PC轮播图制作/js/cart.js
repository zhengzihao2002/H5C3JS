//入口函数
$(function(){
    // 1. 全选 全不选功能模块：就是把全选按钮（checkall）的状态赋值给 三个小的按钮（j-checkbox）就可以了。事件可以使用change发生了变化:checkall是全选按钮类名
    $(".checkall").change(function(){
        //固有属性用prop否则用attr
        // console.log($(this).prop("checked"));

        //三个小按钮（each product's button）和 所有全选按钮:给他们赋上全选按钮的状态！
        $(".j-checkbox , .checkall").prop("checked",$(this).prop("checked"))

        //如果全选了就得给所有items附上背景颜色
        if($(this).prop("checked")==true){
            // 让所有的商品添加 check-cart-item 类名
            $(".cart-item").addClass("check-cart-item");
        }else{
            // check-cart-item 移除
            $(".cart-item").removeClass("check-cart-item");
        }

        //更新总件数和总价钱(修复了checkmark effects)
        getSum();
        
    });

    // 2. 如果小复选框被选中的个数等于3 就应该把全选按钮选上，否则全选按钮不选。
    $(".j-checkbox").change(function(){
        //给所有小按钮添加change事件：有j-checkbox类的就给我添加上
        //每当 一个小按钮 发生变化 都会 触发
        
        //查看小框被选中数量是否与总量相等
        if($(".j-checkbox:checked").length === $(".j-checkbox").length) {
            //如果小按钮被选中的数量等于总量
            $(".checkall").prop("checked",true);
        }else{
            //如果小按钮被选中的数量 不等于 总量
            $(".checkall").prop("checked",false);
        }

        //如果这个 复选框 被选了 就得给 这个item 附上背景颜色：也可以用toggle
        //this : 触发这个事件的对象 -> 肯定是j-checkbox类的
        if($(this).prop("checked")==true){
            // 让当前的商品添加 check-cart-item 类名
            $(this).parents(".cart-item").addClass("check-cart-item");
        }else{
            // check-cart-item 移除
            $(this).parents(".cart-item").removeClass("check-cart-item");
        }

        //更新总件数和总价钱(修复了checkmark effects)
        getSum();
    });

    // 3. 增减商品数量模块 首先声明一个变量，当我们点击+号（increment），就让这个值++，然后赋值给文本框。
    $(".increment").click(function(){
        let items = $(this).siblings(".itxt").val();
        //注意这边是用val来送值，因为我们设的是value，而不是显示的文本
        items++;
        $(this).siblings(".itxt").val(items);//行内改
        $(this).siblings(".itxt").attr("value",items);//行内字面改; more like 行内改 大部分情况下字面改
        //we need both at the same time. AFTER you manually enter a number into the textbox, idk why but if only attr not val, ONLY inner change, outer will not change(remain same as entered). if no manually enter, just attr will work fine 
        //after you manually enter, the number is like sticking there and will not move even if you change inner value with attr. we then need val.



        //更新价格：找到爷爷的兄弟 不用.parent().parent()来找爷爷 用所有父级选择器来找.parents()
        let price = $(this).parents(".p-num").siblings(".p-price").html();
        price = price.substr(1);//从索引号1到最后:去掉rmb符号
        price = (price * items).toFixed(2);//保留两位数
        $(this).parent().parent().siblings(".p-sum").html('￥'+price);


        //一旦用户增减商品数量 -> 更新总件数和总价钱
        getSum();
    });
    $(".decrement").click(function(){
        let items = $(this).siblings(".itxt").val();
        //小于1就不要剪了！除非你想直接删除
        if(items > 1){
            //注意这边是用val来送值，因为我们设的是value，而不是显示的文本
            items--;
            $(this).siblings(".itxt").val(items);//行内改
            $(this).siblings(".itxt").attr("value",items);//行内字面改



            //更新价格
            let price = $(this).parent().parent().siblings(".p-price").html();
            price = price.substr(1);//从索引号1到最后:去掉rmb符号
            price = (price * items).toFixed(2);//保留两位数
            $(this).parent().parent().siblings(".p-sum").html('￥'+price);


            //一旦用户增减商品数量 -> 更新总件数和总价钱
            getSum();
        }
    });


    //  4. 用户修改文本框的值（等价于修改了value但是行内不会显示更新，除非用attr） 计算 小计模块: input 的 value值就是框中显示的值
    $(".itxt").change(function(){
        // 先得到 '文本框的里面的值 - value值' 乘以 当前商品的单价
        $(this).attr("value",$(this).val());
        let items = $(this).val();
        

        //更新价格：找到爷爷的兄弟 不用.parent().parent()来找爷爷 用所有父级选择器来找.parents()
        let price = $(this).parents(".p-num").siblings(".p-price").html();
        price = price.substr(1);//从索引号1到最后:去掉rmb符号
        price = (price * items).toFixed(2);//保留两位数
        $(this).parent().parent().siblings(".p-sum").html('￥'+price);

        //一旦用户修改文本框的值 -> 更新总件数和总价钱
        getSum();
    });

    // 5. 计算总计和总额模块:页面一打开就立刻调用（修复了一打开显示错误价格以及数量）
    getSum();
    function getSum() {
        console.log('运行计算总价和总件一次');
        let items = 0; // 计算总件数 
        let price = 0; // 计算总价钱
        
        //遍历每一个 文本框 得到其值， 加到总件数里去
        $(".itxt").each(function(index,element){
            //检测是否被选中否则别他妈更新
            if($(element).parents(".cart-item").find(".j-checkbox").prop("checked")== true){
                //别忘了value也是字符型的

                // items += parseInt($(ele).val());
                items += parseInt(element.value);//DOM元素
            }
        })

        //更新总件数
        $(".amount-sum>em").text(items);

        //遍历每一个 小计（subtotal） 得到其值， 加到总价钱里去
        $(".p-sum").each(function(i,element){
            //检测是否被选中否则别他妈更新
            if($(element).parents(".cart-item").find(".j-checkbox").prop("checked")== true){
                //得到小计
                let localPrice = $(element).text().substr(1);//得到价格值，然后从索引号1到最后:去掉rmb符号。已经是两位数了

                //更新总价格:别忘了是字符串否则你无法使用substr
                price += parseFloat(localPrice);
            }
        })
        $(".price-sum>em").text("￥"+price.toFixed(2));

        //如果 更新后 商品 数量 等于 0， 取消全选
        if(items==0){
            $(".checkall")[0].checked=false;
            $(".checkall")[1].checked=false;
        }
        
    }

    // 6. 删除商品模块
    // (1) 商品后面的删除按钮：删除当前商品
    $(".p-action>a").click(function(){
        // 删除的是当前的商品
        $(this).parents(".cart-item").remove();

        //更新总件数和总价钱(修复了选中多样商品后删除商品而总价总件不变问题)
        getSum();
    });
    // (2) 删除选中的商品 (底下按钮)
    $(".remove-batch").click(function(){
        // 删除的是小的复选框选中的商品
        $(".j-checkbox:checked").parents(".cart-item").remove();

        // $(".j-checkbox").each(function(index,domEle){
        //     //domEle转成jQuery对象
        //     if($(domEle).prop("checked")==true){
        //         $(domEle).parents(".cart-item").remove();
        //     }
        // })

        //更新总件数和总价钱(修复了选中多样商品后删除商品而总价总件不变问题)
        getSum();
    });
    // (3) 清空购物车（底下按钮） 删除全部商品
    $(".clear-all").click(function(){
        //隐式迭代：做相应的操作jQuery隐式迭代很方便 -> 只要是有cartitem类的给我删掉
        $(".cart-item").remove();

        //更新总件数和总价钱(修复了选中多样商品后删除商品而总价总件不变问题)
        getSum();
    })


    //默认 系统自动 点击 第一个 全选按钮
    $(".checkall")[0].click();

})
