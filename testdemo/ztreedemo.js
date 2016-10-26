/**
 * Created by flr on 2016/10/24.
 */
 //数组去重
Array.prototype.unique = function()
{
    var n = {},r=[];
    for(var i = 0; i < this.length; i++)
    {
        if (!n[this[i]])
        {
            n[this[i]] = true;
            r.push(this[i]);
        }
    }
    return r;
}
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
        fontCss: getFontCss
    },
    callback: {
        beforeClick: beforeClick,
        onClick: onClick
    }

};
var rawTreeData = [
    {
        "id": 1,
        "pId": 0,
        "name": "老相集团",
        "callname": "项立业",
        "calltel": "17788888888",
        "t":"id=1"
    },
    {
        "id": 2,
        "pId": 1,
        "name": "总裁办",
        "callname": "项立业2",
        "calltel": "17788888888",
        "t":"id=2"
    },
    {
        "id": 3,
        "pId": 1,
        "name": "企划部",
        "callname": "",
        "calltel": "",
        "t":"id=3"
    },
    {
        "id": 4,
        "pId": 1,
        "name": "财务部",
        "callname": "老相3",
        "calltel": "17788888888",
        "t":"id=4"
    },
    {
        "id": 5,
        "pId": 1,
        "name": "开发部",
        "callname": "老相4",
        "calltel": "17788888888",
        "t":"id=5"
    },
    {
        "id": 51,
        "pId": 5,
        "name": "java开发",
        "callname": "老相5",
        "calltel": "17788888888",
        "t":"id=51"
    },
    {
        "id": 52,
        "pId": 5,
        "name": "web前端",
        "callname": "老相5",
        "calltel": "17788888888",
        "t":"id=52"
    },
    {
        "id": 53,
        "pId": 5,
        "name": "ios开发",
        "callname": "老相6",
        "calltel": "17788888888",
    },
    {
        "id": 54,
        "pId": 5,
        "name": "安卓",
        "callname": "老相7",
        "calltel": "17788888888",
        "t":"id=54"
    },
    {
        "id": 511,
        "pId": 51,
        "name": "java敢死队",
        "callname": "老相111",
        "calltel": "17788888888",
        "t":"id=54"
    },
    {
        "id": 512,
        "pId": 51,
        "name": "java送死队",
        "callname": "老相112",
        "calltel": "17788888888",
        "t":"id=512"
    },
    {
        "id": 521,
        "pId": 52,
        "name": "web敢死队",
        "callname": "老相111",
        "calltel": "17788888888",
        "t":"id=521"
    },
    {
        "id": 522,
        "pId": 52,
        "name": "web送死队",
        "callname": "老相112",
        "calltel": "17788888888",
        "t":"id=522"
    },
    {
        "id": 531,
        "pId": 53,
        "name": "ios敢死队",
        "callname": "老相111",
        "calltel": "17788888888",
        "t":"id=531"
    },
    {
        "id": 532,
        "pId": 53,
        "name": "ios送死队",
        "callname": "老相112",
        "calltel": "17788888888",
        "t":"id=532"
    },
    {
        "id": 5321,
        "pId": 532,
        "name": "test",
        "callname": "老相112",
        "calltel": "17788888888",
        "t":"id=5321"
    }
];
function beforeClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.checkNode(treeNode, !treeNode.checked, null, true);
    return false;
}
//多选点击
function onCheck(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        nodes = zTree.getCheckedNodes(true),
        v = "";
    for (var i=0, l=nodes.length; i<l; i++) {
        v += nodes[i].name + ",";
    }
    if (v.length > 0 ) v = v.substring(0, v.length-1);
    var cityObj = $("#citySel");
    cityObj.attr("value", v);
}
//单选点击
function onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        nodes = zTree.getSelectedNodes(),
        v = "";
    v=nodes[0].name;
    var cityObj = $("#citySel");
    cityObj.attr("value",v);
}
//显示
function showMenu() {
    var cityObj = $("#citySel");
    var cityOffset = $("#citySel").offset();
    $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
    $("body").bind("mousedown", onBodyDown);
}
//隐藏菜单
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideMenu();
    }
}
function focusKey(e) {
    if (key.hasClass("empty")) {
        key.removeClass("empty");
    }
}
function blurKey(e) {
    if (key.get(0).value === "") {
        key.addClass("empty");
    }
}
var lastValue = "", nodeList = [], fontCss = {};
function clickRadio(e) {
    lastValue = "";
    searchNode(e);
}
//搜索
function searchNode(e) {
    $.fn.zTree.init($("#treeDemo"), setting, rawTreeData);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var value = $.trim(key.get(0).value);
    var keyType = "name";
    if (key.hasClass("empty")) {
        value = "";
    }
    if (lastValue === value) return;
    lastValue = value;
    nodeList = zTree.getNodesByParamFuzzy(keyType, value);
    $.fn.zTree.init($("#treeDemo"), setting, rawTreeData);
    updateNodes(true);
}
//更新
function updateNodes(highlight) {
    var arr=[];
    var newtree=[];
    for (var i = 0; i < nodeList.length; i++) {
        var item = nodeList[i];
        var pointitem=item.id;
        var pointlev=0;
        while (pointlev <= item.level) {
            for(k=0;k<rawTreeData.length;k++){
                if(pointitem==rawTreeData[k].id){
                    arr.push(rawTreeData[k].id);
                    pointitem=rawTreeData[k].pId;
                }
            }
            pointlev++;
        }
    }
    arr=arr.unique().sort()
    for(i=0;i<arr.length;i++){
        for(j=0;j<rawTreeData.length;j++){
            if(arr[i]==rawTreeData[j].id){
                newtree.push(rawTreeData[j]);
            }
        }
    }
    $.fn.zTree.init($("#treeDemo"), setting, newtree);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.expandAll(true);
}
function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
function filter(node) {
    return !node.isParent && node.isFirstNode;
}
var key;
$(document).ready(function(){
    $.fn.zTree.init($("#treeDemo"), setting, rawTreeData);
    key = $("#key");
    key.bind("focus", focusKey)
        .bind("blur", blurKey)
        .bind("propertychange", searchNode)
        .bind("input", searchNode);
});