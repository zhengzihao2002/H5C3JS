$(function(){
    // 一加载就load shit from 数据库 to list
    loadToList();

    //（1） 按下回车 把完整数据 存储到本地存储里面
    // 存储的数据格式  var todolist = [{title: "xxx", done: false}]
    $("#title").on("keyup",function(event){
        if(event.key == 'Enter' || event.keyCode == 13){
            // ASCII 码 13 -> 回车
            
            // 先读取本地存储原来的数据：形式为数组 -> getData
            let local = getData();
            console.log(local);

            //检测是否输入为空：不能是null因为默认value都是“”而不是null，所以value不存在null格式，只有 ‘空’ 或 ‘字符串’
            if($(this).val()!= ""){
                // 把local数组进行更新数据 把最新的数据追加给local数组 -> ChangeData
                local.push({title:$(this).val(),done:false});

                // 把这个数组local 存储给 本地存储空间 -> UpdateData
                saveData(local);

                //（2） toDoList 本地存储数据渲染加载到页面
                loadToList();
                
                //清空输入框
                $(this).val("");
            }else{
                alert("请输入您要的操作");
            }
        }
    });

    // (3) toDoList 删除操作 : 获取数据，删除对应数据，保存数据，重新加载
    $("ol,ul").on("click","li a" ,function(){
        //获取本点击到li到索引号
        let targetIndex = $(this).attr("data-id");

        // 1. 获取本地储存数据
        let data = getData();

        // 2. 修改数据 : 不要把以下复制给data，因为返回的是删除的项目
        data.splice(targetIndex,1);

        // 3. 保存到本地数据库 ： 后台更新
        saveData(data);

        // 4. 重新渲染页面 ：视觉更新
        loadToList();
    });

    // (4) toDoList 正在进行和已完成选项操作
    $("ol , ul").on("click", "input",function(){
        //ol和ul又添加了一个事件，触发对象为其内部的input复选框
        //当我们检测到我们点击了复选框，我们就要将其 选中的状态 更新到数组里

        // 先获取本地储存的数据
        let data = getData();

        //修改数据 
        let targetIndex = $(this).siblings("a").attr("data-id");
        data[targetIndex].done = $(this).prop("checked");//正或反

        //将新数组 保存到本地储存空间
        saveData(data);

        //重新渲染页面
        loadToList();
    });

    // 读取本地存储的数据 
    function getData(){
        //获取我们属于todolist的数据
        let data = localStorage.getItem("todolist");
        //查看是否是空的
        if(data != null){
            //有数据：从字符串转为对象格式
            return JSON.parse(data);
        }else{
            // 无数据：返回空数组
            return [];
        }
    }

    // 保存本地存储数据 : stringify
    function saveData(data){
        //将获取到的数据保存到 本地储存 空间
        localStorage.setItem("todolist",JSON.stringify(data));
    }

    // 渲染加载数据：把本地存储的数据加载到list当中
    function loadToList(){
        let unfinished = 0;//未完成 的个数
        let finished = 0;//已完成 的个数

        //获取数据：已经转成字符串格式了!
        let data = getData();
    
        //遍历之前先要清空ol和ul里面的元素内容->杀掉所有孩子：页面一加载就load所有li，按下回车后再次load所有li（这次增加了一个新的），导致ol和ul里面的li重复了
        $("ol").empty();//data里面所有未完成的归类
        $("ul").empty();//data里面所有已完成的归类

        // 遍历这个数据:这种each方法可以用于dom（副）也能用于普通数据（主）
        $.each(data,function(index,element){
            //生成一个小li，里面包含：checkbox，p，a。
            //css已经写好了
            //每一个element都是array's items: object

            if(element.done == false){
                // 方法1
                // let li = $("<li></li>");
                // $("ol").prepend(li);

                //方法2
                $("ol").prepend("<li><input type='checkbox'><p>"+element.title+"</p><a href='javascript:;' data-id="+index+"></a></li>");

                unfinished++;
            }else{
                // 方法1
                // let li = $("<li></li>");
                // $("ul").prepend(li);

                //方法2
                $("ul").prepend("<li><input type='checkbox'checked><p>"+element.title+"</p><a href='javascript:;' data-id="+index+"></a></li>")
                
                finished++;
            }
            
        })
        
        $("#todocount").text(unfinished);
        $("#donecount").text(finished);
    }

})


//无法使用：data不是dom（$(".xxx")）数据
// data.each(function(index,element){
//     console.log(element);
// });
