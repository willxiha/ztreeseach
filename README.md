# ztreeseach
  最近项目中用到了tree显示组织架构，然后就选择了ztree，然而蛋疼的发现ztree的搜索功能只能将搜索到的内容高亮显示，不支持只显示相关节点的部门，网上也搜了下，也没发现有人专门写过此类的功能，所以就自己写了个。
  
  
  
之后可能会再上传个用angularjs 写的指令，来显示table里 显示整个树的，看吧

封装了angular,做了指令
myRouterApp.directive("zTree",function (passData,getDictData,myDialog,ngDialog,$timeout) {
    return {
        restrict: 'E',
        template:' <div id="menuContent" class="menuContent">'+
        '<input id="key" class="key" ng-change="searchNode()" type="text" placeholder="搜索" ng-model="keyvalue" autocomplete="off"/>'+
        '<ul id="treeDemo" class="tree"></ul>'+
        '</div>',
        replace: true,
        scope: {
            thisnode:'=',
        },
        controller: function($scope, $element) {
            $timeout(function () {
                if($element.attr("ismore")){
                    var setting = {
                        data: {
                            key: {
                                title: "t"
                            },
                            simpleData: {
                                enable: true
                            }
                        },
                        view: {
                            showLine: true
                        },
                        callback: {
                            onClick: onMouseDown
                        }

                    };
                }else{
                    var setting = {
                        check: {
                            enable: true,
                            chkboxType: {"Y":"s", "N":"s"}
                        },
                        view: {
                            dblClickExpand: false
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            onCheck: onCheck
                        }
                    };
                }
                var lastValue = "", nodeList = [], fontCss = {};
                passData.postData('','ent/Im/api/entPersonnel/getUserOrgList.htm')
                    .then(function (result) {
                        if(result.suc){
                            result.data.push({
                                guid:0,
                                name:localStorage.getItem("entName"),
                                open:true
                            })
                            $scope.rawTreeData=result.data;
                            showtwo($scope.rawTreeData)
                            $.fn.zTree.init($("#treeDemo"), setting, $scope.rawTreeData);
                        }
                    },function (err) {
                        myDialog.showCenterBox('网络错误!');
                    })

                //默认展现2级处理
                function showtwo(data){
                    var parentid=""
                    for(i=0;i<data.length;i++){
                        if(data[i].parentId==0||data[i].parentId==null){
                            parentid=data[i].guid;
                            data[i].open=true;
                        }
                    }
                    for(i=0;i<data.length;i++){
                        if(data[i].parentId==parentid){
                            data[i].open=true;
                        }
                    }
                }

                $scope.showname="";
                $scope.showid="";

                //节点搜索
                $scope.searchNode = function () {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    var value = $scope.keyvalue;
                    var keyType = "name";
                    if (lastValue === value) return;
                    lastValue = value;
                    nodeList = zTree.getNodesByParamFuzzy(keyType, value);
                    updateNodes();
                };

                //更新
                function updateNodes() {
                    var arr=[];
                    for (var i = 0; i < nodeList.length; i++) {
                        var item = nodeList[i];
                        var pointitem=item.guid;
                        var pointlev=0;
                        while (pointlev <= item.level) {
                            for(k=0;k<$scope.rawTreeData.length;k++){
                                if(pointitem==$scope.rawTreeData[k].guid){
                                    arr.push($scope.rawTreeData[k].guid);
                                    pointitem=$scope.rawTreeData[k].parentId;
                                }
                            }
                            pointlev++;
                        }
                    }
                    arr=arr.unique().sort();
                    var temptree=$scope.rawTreeData;
                    if(arr.length!=temptree.length){
                        for(i=0;i<arr.length;i++){
                            for(j=0;j<temptree.length;j++){
                                if(arr[i]==temptree[j].guid){
                                    temptree[j].ismark=false;
                                }
                            }
                        }
                        rload(temptree);
                        temptree=inittree($scope.rawTreeData);
                    }else{
                        for(j=0;j<$scope.rawTreeData.length;j++){
                            temptree.ismark=true;
                        }
                        showrload(temptree)
                    };
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    zTree.expandAll(true);
                }
                function inittree(data){
                    for(i=0;i<data.length;i++){
                        data[i].ismark=true;
                    }
                    return data;
                }
                //隐藏不符合搜素的树
                function rload(data){
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    for(i=0;i<data.length;i++){
                        if(data[i].ismark==false){
                            var node = zTree.getNodeByParam("guid", data[i].guid, null);
                        }else{
                            data[i].ismark=true;
                            var node = zTree.getNodeByParam("guid", data[i].guid, null);
                            zTree.hideNode(node);
                        }
                    }
                }

                //显示所有树
                function showrload(data){
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    for(i=0;i<data.length;i++){
                        var node = zTree.getNodeByParam("guid", data[i].guid, null);
                        zTree.showNode(node);
                    }

                }
                function filter(node) {
                    return (node.checked==true);
                }

                //多选点击
                function onCheck(e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                        nodes = zTree.getNodesByFilter(filter)
                    var isparent=[];
                    $scope.showname = "";
                    $scope.thisnode =[];
                    for (i = 0; i < nodes.length; i++) {
                        //跟节点
                        if (nodes[i].parentId == null) {
                            if (nodes[i].check_Child_State == 2 && nodes[i].checked == true) {
                                isparent.push(nodes[i].guid);
                                $scope.showname += nodes[i].name + ",";
                                $scope.thisnode.push(nodes[i]);
                            }
                        }
                        if (nodes[i].check_Child_State == 2) {
                            var pointlev = 0;
                            var kk = true;
                            var item = nodes[i];
                            while (pointlev < nodes[i].level) {
                                if (item.getParentNode().check_Child_State == 2 && item.getParentNode().checked == true) {
                                    kk = true;
                                    break;
                                } else {
                                    kk = false;
                                    item = nodes[i].getParentNode();
                                }
                                pointlev++;
                            }
                            if (kk == false) {
                                isparent.push(nodes[i].guid)
                                $scope.showname += nodes[i].name + ",";
                                $scope.thisnode.push(nodes[i]);
                            }
                        } else if (nodes[i].check_Child_State == -1) {
                            var pointlev = 0;
                            var kk = true;
                            var item = nodes[i];

                            while (pointlev < nodes[i].level) {
                                if (item.getParentNode().check_Child_State == 2 && item.getParentNode().checked == true) {
                                    kk = true;
                                    break;
                                } else {
                                    kk = false;
                                    item = nodes[i].getParentNode();
                                }
                                pointlev++;
                            }
                            if (kk == false) {
                                isparent.push(nodes[i].guid)
                                $scope.showname += nodes[i].name + ",";
                                $scope.thisnode.push(nodes[i]);
                            }

                        }
                    }
                    $("#selected").val($scope.showname);
                }

                //单击点击
                function onMouseDown(event, treeId, treeNode) {
                    $('#selected').val(treeNode.name.toString());
                    $("#menuContent").fadeOut("fast");
                    $("#showTree").html('﹀');
                    $("body").unbind("mousedown", onBodyDown);
                    $scope.thisnode = treeNode;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                }

                $scope.showMenu = function () {
                    if($('#menuContent').is(":hidden")){
                        $('#menuContent').show();
                        $("#showTree").html('︿');
                        $("body").bind("mousedown", onBodyDown);
                    }else{
                        $("#menuContent").fadeOut("fast");
                        $("#showTree").html('﹀');
                        $("body").unbind("mousedown", onBodyDown);
                    }
                }

                function onBodyDown(event) {
                    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
                        $scope.showMenu();
                    }
                }

                $('#showTree').on('click',$scope.showMenu);
            },100)
        }
    }
})
