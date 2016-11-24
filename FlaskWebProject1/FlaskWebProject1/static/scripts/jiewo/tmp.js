var webUrl = "";
var webImage = "";
jQuery(function ($) {
    $(function () {
        //个人中心头像
        var _scW = $(window).width();
        var _setH = (360 / 640) * _scW * 0.65625;
        var _perH = $("#perWap").height();
        var _perTop = (_setH - _perH) / 2
        $("#personal").css({ "height": _setH + "px" });
        $("#perWap").css({ "top": _perTop + "px" });

        var hasFocusList = $("#hasFocusList").val();//是否有轮播图
        if (hasFocusList == 1) {
            // 首页幻灯片
            var bullets = document.getElementById('scroll_position').getElementsByTagName('li');
            var slider = Swipe(document.getElementById('scroll_img'), {
                auto: 2000,
                continuous: true,
                callback: function (pos) {
                    var i = bullets.length;
                    while (i--) {
                        bullets[i].className = ' ';
                    }
                    bullets[pos].className = 'on';
                }
            });
        }

        //左侧菜单展示
        $("#perShow").click(function () {
            $("#homeSide").show();
            $("#sidewap").animate({ left: "0" });
        });
        $("#sidewap").click(function (e) {
            e ? e.stopPropagation() : event.cancelBubble = true;
        });
        $("#homeSide").click(function (e) {
            $(this).fadeOut();
            $("#sidewap").animate({ left: "-100%" });
        });

        $("#inputArea").click(function () {
            //$("#address_input").html('<input placeholder="请输入地点" autofocus id="customAddress"/>');
            $("#popsiteList").show();
            $("#popListUl").show();
            //$("#customAddress").prop("autofocus","autofocus");
        });

        $("#closeSpan").click(function () {
            $("#popsiteList").hide();
        });

        //城市切换
        $('#ciytList').on("click", "span#city", function () {
            var $this = $(this);
            var cityCode = $this.attr('data-cityCode');
            var oldCityCode = $("#cityCode").val();//设置之前的城市
            if (cityCode != oldCityCode) {//如果切换了城市
                SzLibAPI.setMemberCity(cityCode, function (data) {
                    if (data == false) {
                        //alert("设置失败！");
                    } else {
                        //alert("设置成功！");
                        $this.addClass("cur").siblings().removeClass("cur");
                        $("#cityCode").val(cityCode);
                        setHotTag($("#busType").val());
                    }
                });
            }
        });

        //日期选择
        $("#traveltab .select02").each(function () {
            var _this = $(this);
            var _click = $(this).find(".tit");
            var _popbg = $(this).find(".menu_popbg");
            var _tit = $(this).find(".tit");
            var _topic = $(this).find(".topic");
            var _menu = $(this).find(".menu");
            $(_click).click(function () {
                var _thisAttr = $(_this).attr("class");
                if (_thisAttr == "select02") {
                    $(_this).addClass("cur");
                    var _sameLi = $(_this).siblings();
                    $(_sameLi).removeClass("cur");
                    document.body.style.overflow = 'hidden';
                } else {
                    $(_this).removeClass("cur");
                    document.body.style.overflow = 'visible';
                }
            });
            $(_menu).find("span").each(function () {
                $(this).click(function () {
                    var _thisTopic = $(this).text();
                    _topic.text(_thisTopic);
                    $(_this).removeClass("cur");
                    document.body.style.overflow = 'visible';
                });
            });
            $(_popbg).click(function () {
                $(_this).removeClass("cur");
                document.body.style.overflow = 'visible';
            });
        })
        $("#traveltab .select02").click(function (e) {
            e ? e.stopPropagation() : event.cancelBubble = true;
        });
        $(document).click(function (e) {
            $("#traveltab .select02").each(function () {
                $(this).removeClass("cur");
                document.body.style.overflow = 'visible';
            });
        });
    });

    //弹屏广告
    var _scH = $(window).height();
    var _adH = $("#adArea").height();
    var _adPos = (_scH - _adH) / 2
    $("#adArea").css({ "top": _adPos + "px" })
    $("#adPic").click(function (e) {
        e ? e.stopPropagation() : event.cancelBubble = true;
    });
    $("#adPop").click(function (e) {
        $(this).fadeOut();
    });
    //切换主题
    /*$('#getMoreTourism').on("tap",function(e){
		e.preventDefault();
		getMoreTourismLines();
	});*/

    $("#myTicketListMain").click(function (e) {
        e.preventDefault();
        var busType = $("#busType").val();
        if (busType == '1' || busType == 1) {
            window.location.href = webUrl + "/ticket/auth_ticketListMain.do?ticketType=1";//班车
        } else {
            window.location.href = webUrl + "/ticket/auth_ticketListMain.do?ticketType=4";//摆渡车
        }
    });
});
function selectByOrderField(orderField) {
    $("#topic2").val(orderField);
    travel_order = orderField;
    getTourismLines();//获取旅游列表
}
function selectByDate() {
    travel_start_date = $("#dateSelect").val();
    if (travel_start_date == "" || travel_start_date == undefined) {
        $("#showDate").html("出发日期");
    } else {
        $("#showDate").html(travel_start_date);
        $("#dateSelect2").val(travel_start_date);//showDate
    }
    $("#traveltab .select02").removeClass("cur");
    getTourismLines();//获取旅游列表
}

//加载旅游车的列表页
/*function getMoreTourismLines(){
	SzLibAPI.getTourismLineList(topic_search,travel_start_date,travel_end_date,
			travel_order,travel_page_no,function(data){
      if(data.length ==0){
         $("#tourism_line_list").html('');
         $("#tourism_line_list").hide();
         $("#no_tourism_line").show();
      }else{
      	 var tLineList = data.tLineList;
	  	 if( null == tLineList || tLineList.length == 0){
		  	 $("#tourism_line_list").html('');
	         $("#tourism_line_list").hide();
	         $("#no_tourism_line").show();
	  	 }else{
	  	 	$("#no_tourism_line").hide();
	         var html='';
	         for(var i=0;i<tLineList.length;i++){
	         	var tmp_head_pic = tLineList[i].HEAD_ICON;//用户头像
	         	var tmp_line_pic = tLineList[i].LINE_IMAGE_PATH;//展位图
	         	var isPraise = tLineList[i].IS_PRAISE;//是否赞过
	         	var zan_class = "zan";
	         	if( null == tmp_head_pic || '' == tmp_head_pic){
	         		tmp_head_pic = webImage+'/user_icon.png';//默认头像
	         	}else{
	         		tmp_head_pic = webUrl+'/user/'+tmp_head_pic;
	         	}
	         	if(null == tmp_line_pic || '' == tmp_line_pic){
	         		tmp_line_pic = webImage+'/travel.jpg';
	         	}else{
	         		tmp_line_pic = webUrl+'/upload/'+tmp_line_pic;
	         	}
	         	if(isPraise > 0){
	         		zan_class = "zan like";
	         	}
	         	html += '<li data-tourism-line-id='+tLineList[i].ID+'>'
        		 +'<div class="'+zan_class+'" id="zan_'+tLineList[i].ID+'" onClick="goPraise('+tLineList[i].ID+')"><span id="zanNum_'+tLineList[i].ID+'">'+tLineList[i].PRAISE_NUM+'</span></div>'
        		 +'<div onclick="location.href=\''+webUrl+'/tourism/tourismInfo.do?tourismId='+tLineList[i].ID+'&busType=3\'"><div class="pic">'
        		 +'<img src="'+tmp_line_pic+'" /></div>'
        		 +'<div class="tit">'+tLineList[i].TOURISM_NAME+'</div>'
        		 +'<div class="intro">'
        		 +'<span class="photo"><img src="'+tmp_head_pic+'" /></span>'
        		 +'<span class="name">'+tLineList[i].NICKNAME+'</span>'
        		 +'<span class="price">￥'+tLineList[i].PRE_PRICE+'/人</span>'
        		 +'</div></div></li>';
	         }
	         $("#tourism_line_list").append(html);
	         $("#tourism_line_list").show();
	         //显示加载更多
	         if(data.tourismPage.pageNo == data.tourismPage.nextPage){
	    		$('#getMoreTourism').hide();
	    	 }else{
	    		$('#getMoreTourism').show();
	    		travel_page_no = data.tourismPage.nextPage;
	    	 }
	  	 }
      }
      
   });
}*/
//加载摆渡车数据
function getFerryData() {
    SzLibAPI.getFerryData(currentLon, currentLat, function (data) {
        if (data == null || data.length == 0) {
            $("#user_ferry_data").html('');
            showBusTicketMenu(false, 4);
        } else {
            var myFerryTickets = data.myFerryTickets;//用户摆渡车车票
            var recommendLines = data.recommendLines;//推荐线路
            var hotTags = data.hotTags;//摆渡车热点
            if ((null == myFerryTickets || undefined == myFerryTickets || myFerryTickets.length == 0)
              && (null == recommendLines || undefined == recommendLines || recommendLines.length == 0)) {//显示热点信息
                $("#user_ferry_data").html('');
                showBusTicketMenu(false, 4);
            } else {
                var html = '';
                if (null != myFerryTickets && myFerryTickets.length > 0) {
                    showBusTicketMenu(true, 4);
                } else {
                    showBusTicketMenu(false, 4);
                }
                if (null != recommendLines && recommendLines.length > 0) {
                    for (var i = 0; i < recommendLines.length; i++) {
                        html += '<div class="bill">'
                            + '<div class="line_detail">'
                            + '<div class="title" onclick=\'location.href="' + webUrl + '/line/ferryLineMapInfo.do?ferryLineId=' + recommendLines[i].LINE_ID + '"\' >';
                        if ('' != getVaule(recommendLines[i].LINE_NAME)) {
                            html += '<span class="name">' + recommendLines[i].LINE_NAME + '</span>';
                        }
                        var _siteDeptime = getVaule(recommendLines[i].SITE_DEP_TIME);
                        if ('' != _siteDeptime) {
                            var _t = parseFloat(_siteDeptime).toFixed(2) - parseFloat(1200).toFixed(2);
                            var siteDeptime
                            if (_t < 0) {
                                //html+='<span class="am">AM</span>';
                                if (_siteDeptime.length == 4) {
                                    siteDeptime = _siteDeptime.substr(0, 2) + ":" + _siteDeptime.substr(_siteDeptime.length - 2, 2);
                                } else {
                                    siteDeptime = _siteDeptime.substr(0, 1) + ":" + _siteDeptime.substr(_siteDeptime.length - 2, 2);
                                }

                            } else {
                                siteDeptime = _siteDeptime.substr(0, 2) + ":" + _siteDeptime.substr(_siteDeptime.length - 2, 2);
                            }
                            html += '<span class="time">' + siteDeptime + '</span><span class="tip">下一班</span>';
                        }
                        html += '</div>'
                           + '<div class="line_intro" onclick=\'location.href="' + webUrl + '/line/ferryLineMapInfo.do?ferryLineId=' + recommendLines[i].LINE_ID + '"\'>'
                           + '<div class="address">'
                           + '<span class="place">' + getVaule(recommendLines[i].START_NAME) + '</span>'
                           + '<span class="place">' + getVaule(recommendLines[i].END_NAME) + '</span>'
                           + '</div>'
                           + '</div>';
                        var hasTicket = getVaule(recommendLines[i].HAS_TICKET_COUNT);
                        if (hasTicket == 0 || hasTicket == '0') {//无车票
                            html += '</div><div class="price" onClick="quickGotoBuy(' + recommendLines[i].LINE_ID + ')">￥' + getVaule(recommendLines[i].PRICE) + '</div></div>';
                        } else {
                            html += '</div><div class="price" onClick="quickGotoTicket(' + recommendLines[i].LINE_ID + ')">验票</div></div>';
                        }
                    }
                }
                $("#user_ferry_data").html(html);
                setUserHead();
            }
        }
    });
}

//加载班车数据
function getBusLineData(currentLon, currentLat) {
    SzLibAPI.getBusLineData(currentLon, currentLat, function (data) {
        if (data == null || data.length == 0) {
            $("#line_hots_div").hide();
            $("#user_line_data").html('');
            showBusTicketMenu(false, 1);
        } else {
            var myBusTickets = data.myBusTickets;//用户班车车票
            var myBusLines = data.myBusLines;//用户买过的班车线路
            var hotTags = data.hotTags;//班车热点
            var newRecommendList = data.newRecommendList;//用户班车-推荐
            var html = '';
            if (null != myBusTickets && myBusTickets.length > 0) {//车票信息
                showBusTicketMenu(true, 1);
            } else {
                showBusTicketMenu(false, 1);
            }
            if (null != myBusLines && myBusLines.length > 0) {
                for (var i = 0; i < myBusLines.length; i++) {
                    html += '<div class="bill">'
                        + '<div class="line_detail" onclick=\'location.href="' + webUrl + '/line/lineMapInfo.do?lineId=' + myBusLines[i].LINE_ID + '&depId=' + myBusLines[i].DEP_ID + '"\' >'
                        + '<div class="title"><span class="name">' + getVaule(myBusLines[i].LINE_NAME) + '</span>'
                        + '<span class="time">' + getVaule(myBusLines[i].START_TIME) + '</span>'
                        + '</div>'
                        + '<div class="line_intro">'
                        + '<div class="address">'
                        + '<span class="place">' + myBusLines[i].START_ADDR + '</span>'
                        + '<span class="place">' + myBusLines[i].END_ADDR + '</span>'
                        + '</div></div>'
                        + '</div>';
                    var lineTicketId = getVaule(myBusLines[i].LINE_TICKET_ID);
                    if (null == lineTicketId || "" == lineTicketId || '' == lineTicketId) {//无车票
                        html += '<div class="price" onclick=\'location.href="' + webUrl
                            + '/line.do?lineInfo&depId=' + myBusLines[i].DEP_ID + '&lineID=' + myBusLines[i].LINE_ID
                            + '"\'>￥' + myBusLines[i].PRICE + '</div></div>';
                    } else {
                        html += '<div class="price"  onclick=\'location.href="' + webUrl
                         + '/ticket/auth_ticketElec.do?ticketId=' + lineTicketId
                         + '"\'>验票</div></div>';
                    }
                }
            }
            if (null != newRecommendList && undefined != newRecommendList
                    && newRecommendList.length > 0) {
                for (var i = 0; i < newRecommendList.length; i++) {
                    if (newRecommendList[i].CUSTOM_LINE_TYPE == "1" || newRecommendList[i].CUSTOM_LINE_TYPE == 1) {
                        html += '<div class="bill">'
                            + '<div class="line_detail" onclick=\'location.href="' + webUrl + '/line/lineMapInfo.do?lineId=' + newRecommendList[i].LINE_ID + '&depId=' + newRecommendList[i].ID + '"\' >'
                            + '<div class="title"><span class="name">'
                            + getVaule(newRecommendList[i].LINE_NAME)
                            + '</span>'
                            + '<span class="time">' + getVaule(newRecommendList[i].START_TIME) + '</span>'
                            + '</div>'
                            + '<div class="line_intro">'
                            + '<div class="address">'
                            + '<span class="place">' + newRecommendList[i].START_ADDR + '</span>'
                            + '<span class="place">' + newRecommendList[i].END_ADDR + '</span>'
                            + '</div></div></div>'
                            + '<div class="price" onclick=\'location.href="' + webUrl
                           + '/line.do?lineInfo&depId=' + newRecommendList[i].ID + '&lineID=' + newRecommendList[i].LINE_ID
                           + '"\'>￥' + newRecommendList[i].PRICE + '</div>'
                            + '</div>';
                    } else {//定制线路
                        var tip = "报名";
                        if ((newRecommendList[i].CUSTOM_LINE_TYPE == "3" || newRecommendList[i].CUSTOM_LINE_TYPE == 3)
                                && newRecommendList[i].ENLIST_STATUS > 0) {
                            tip = "已报名";
                        }
                        html += '<div class="bus_ticket">'
                            + '<div class="title">' + getVaule(newRecommendList[i].LINE_NAME)
                            + '<span class="time">' + getVaule(newRecommendList[i].START_TIME) + '</span>'
                            + '</div>'
                            + '<div class="ticket_paper">'
                            + '<div class="address">'
                            + '<span class="place">' + newRecommendList[i].START_ADDR + '</span>'
                            + '<span class="place">' + newRecommendList[i].END_ADDR + '</span>'
                            + '</div></div>'
                            + '<div class="tap2">￥<strong>' + newRecommendList[i].PRICE + '</strong></div>'
                            + '<div class="apply">'
                            + '<span class="num">' + newRecommendList[i].ENLIST + '人报名</span>'
                            + '<span class="btn" onclick="location.href=\'/customLine.do?enCustomLineInfo&customLineId='
                            + newRecommendList[i].ID + '\'">' + tip + '</span>'
                            + '</div>'
                            + '</div>';
                    }
                }
                html += '</div>';
            }
            $("#user_line_data").html(html);
            setUserHead();
        }
    });
}

function quickGotoBuy(ferryLineId) {
    window.location.href = webUrl + "/line.do?ferryLineInfo&ferryLineId=" + ferryLineId;
}
function quickGotoTicket(ferryLineId) {
    window.location.href = webUrl + "/ticket/auth_ferryTicketElec.do?ferryLineId=" + ferryLineId;
}
function getVaule(Obj) {
    if (null == Obj || undefined == Obj) {
        return '';
    } else {
        return Obj;
    }
}

/**
 * 我的车票菜单控制；
 * 无车票，灰色不可点击
 * 有车票，可点击
 * flag:是否有票，true-有票；flase-无票
 * type：切换到的频道
 */
function showBusTicketMenu(flag, type) {
    var _href = webUrl + "/ticket/auth_ticketListMain.do?ticketType=4";//摆渡车
    if (type == 1) {
        _href = webUrl + "/ticket/auth_ticketListMain.do?ticketType=1";//班车
    }
    /*if(flag){
		$("#ticketMenuShow").attr("class","poper_tip02 ui-link");
        $("#ticketMenuShow").attr("href",_href);
	}else{
        $("#ticketMenuShow").attr("class","poper_tip01 ui-link");
        $("#ticketMenuShow").attr("href","javascript:;");
	}*/
}

function getUserSearchRecords(startOrEnd) {
    $("#popListUl").hide();
    SzLibAPI.getUserSearchRecords(startOrEnd, function (data) {
        if (data == null || data.length == 0) {
        } else {
            var searchRecords = data;//用户搜索记录
            var html = '';
            if (null != searchRecords && searchRecords.length > 0) {
                for (var i = 0; i < searchRecords.length; i++) {
                    html += '<li onClick="getSearchPoint(this)" data-place="' + searchRecords[i].KEY_WORD
                        + '" data-lon="' + searchRecords[i].LON
                        + '" data-lat="' + searchRecords[i].LAT + '" data-type="history">'
                        + '<span class="site_big" style="height:2.25rem;line-height:2.25rem;">'
                        + getVaule(searchRecords[i].KEY_WORD) + '</span></li>';
                }
            }
            $("#popListUl").html(html);
            $("#popListUl").show();
        }
    });
}



jQuery(function ($) {

    /**
	   * 解析URL中的参数
	   * @param {url路径} string
	   * @returns {返回object<key,value>} 
	   */
    $.extend({
        getUrlParam: function (string) {
            var obj = new Object();
            if (string.indexOf("?") != -1) {
                var string = string.substr(string.indexOf("?") + 1);
                var strs = string.split("&");
                for (var i = 0; i < strs.length; i++) {
                    var tempArr = strs[i].split("=");
                    obj[tempArr[0]] = tempArr[1];
                }
            }
            return obj;
        }
    });

    function getNotNullValue(value) {
        if (null == value || undefined == value || "null" == value || value.length == 0) {
            return "";
        } else {
            return value;
        }
    }

    //地图选址   
    //去程       
    $('#findSearch').on('click', function () {
        var fromAddressPlace = encodeURI(encodeURI($("#fromFind").val()));
        var fromAddressLon = $("#fromAddressLon").val();
        var fromAddressLat = $("#fromAddressLat").val();
        var toAddressLon = $("#toAddressLon").val();
        var toAddressLat = $("#toAddressLat").val();
        var toAddressPlace = encodeURI(encodeURI($("#toFind").val()));
        var busType = $("#busType").val();
        if (getNotNullValue(fromAddressPlace) == '' && getNotNullValue(toAddressPlace) == '') {
            alert('请至少输入一个地点');
        } else {
            window.location.href = "/line.do?lineListFirst&fromAddressLon=" + fromAddressLon + "&fromAddressLat=" + fromAddressLat + "&toAddressLon=" + toAddressLon + "&toAddressLat=" + toAddressLat + "&fromAddressPlace=" + fromAddressPlace + "&toAddressPlace=" + toAddressPlace + "&busType=" + busType;
        }
    });

    //摆渡车查询
    $('#findSearchFerry').on('click', function () {
        var findAddressPlace = encodeURI(encodeURI($("#fromFindFerry").val()));
        var ferryStartLon = $("#ferryStartLon").val();
        var ferryStartLat = $("#ferryStartLat").val();

        var ferryEndLon = $("#ferryEndLon").val();
        var ferryEndLat = $("#ferryEndLat").val();
        var toAddressPlace = encodeURI(encodeURI($("#toFindFerry").val()));
        if (getNotNullValue(findAddressPlace) == '' && getNotNullValue(toAddressPlace) == '') {
            alert('请至少输入一个地点');
        } else {
            window.location.href = "/line/FindFerryLines.do?startLon=" + ferryStartLon + "&startLat=" + ferryStartLat + "&startPlace=" + findAddressPlace + "&endLon=" + ferryEndLon + "&endLat=" + ferryEndLat + "&toAddressPlace=" + toAddressPlace;
        }
    });

    //报名       
    $('#customOriginate').on('tap', function () {
        var data = $.getUrlParam(window.location.href);
        var fromAddressLon = data.fromAddressLon;
        var fromAddressLat = data.fromAddressLat;
        var toAddressLon = data.toAddressLon;
        var toAddressLat = data.toAddressLat;
        window.location.href = "/customLine/auth_customLineSearchFirst.do?fromAddressLon=" + fromAddressLon + "&fromAddressLat=" + fromAddressLat + "&toAddressLon=" + toAddressLon + "&toAddressLat=" + toAddressLat;
    });

    //去程点击加载更多
    $('#goMore').on('click', function () {
        var data = $.getUrlParam(window.location.href);
        var fromAddressLon = data.fromAddressLon;
        var fromAddressLat = data.fromAddressLat;
        var toAddressLon = data.toAddressLon;
        var toAddressLat = data.toAddressLat;
        var busType = data.busType;
        var goLineListPageNo = $('#pageGoNo').val();
        SzLibAPI.getLineLists(fromAddressLon, fromAddressLat, toAddressLon, toAddressLat, busType, goLineListPageNo, function (data) {
            if (data.length == 0) {
                alert('网络异常！');
            } else {
                $('#pageGoNo').attr('value', data.page.nextPage);
                var lineLists = data.lineLists;
                var html = '';
                for (var i = 0; i < lineLists.length; i++) {
                    if (lineLists[i].customLineType == "1") {//班车               		
                        html += '<div class="bus_ticket" onclick=\'location.href="' + webUrl + '/line/lineMapInfo.do?lineId=' + lineLists[i].lineId + '&depId=' + lineLists[i].id + '"\' >'
                			+ '<div class="title">' + getNotNullValue(lineLists[i].lineName)
                			+ '<span class="time">' + lineLists[i].startTime + '</span>'
                			+ '</div>'
                			+ '<div class="ticket_paper">'
                			+ '<div class="address">'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].startSiteName) + '</span>'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].endSiteName) + '</span>'
							+ '</div>'
							+ '</div>'
							+ '<div class="tap2">￥<strong>' + lineLists[i].price + '</strong></div>'
							+ '</div>';
                    } else {
                        html += '<div class="bus_ticket">'
                			+ '<div class="title">' + getNotNullValue(lineLists[i].lineName)
                			+ '<span class="time">' + lineLists[i].startTime + '</span>'
                			+ '</div>'
                			+ '<div class="ticket_paper">'
                			+ '<div class="address">'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].startSiteName) + '</span>'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].endSiteName) + '</span>'
							+ '</div>'
							+ '</div>'
							+ '<div class="tap">￥<strong>' + getNotNullValue(lineLists[i].price) + '</strong></div>';
                        if (lineLists[i].customLineType == "2") {
                            html += '<div class="apply"><span class="num">' + lineLists[i].enList + '人报名</span>'
                				+ '<span class="btn" onclick="location.href=\'/customLine.do?enCustomLineInfo&customLineId='
                				+ lineLists[i].id + '\'">报名</span></div>'
                        } else if (lineLists[i].customLineType == "3") {
                            if (lineLists[i].enListStatus > 0) {
                                html += '<div class="apply"><span class="num">' + lineLists[i].enList + '人报名</span>'
                					+ '<span class="btn" onclick="location.href=\'/customLine.do?enCustomLineInfo&customLineId='
                    				+ lineLists[i].id + '\'">已报名</span></div>'
                            } else {
                                html += '<div class="apply"><span class="num">' + lineLists[i].enList + '人报名</span>'
                					+ '<span class="btn" onclick="location.href=\'/customLine.do?enCustomLineInfo&customLineId='
                    				+ lineLists[i].id + '\'">报名</span></div>'
                            }
                        }
                        html += '</div>';
                    }
                }
                $('#line_list_go').append(html);
                //显示加载更多
                if (data.page.pageNo == data.page.nextPage) {
                    $('#goMore').hide();
                }
            }
        });
    });

    //返程点击加载更多
    $('#backMore').on('click', function () {
        var data = $.getUrlParam(window.location.href);
        var fromAddressLon = data.fromAddressLon;
        var fromAddressLat = data.fromAddressLat;
        var toAddressLon = data.toAddressLon;
        var toAddressLat = data.toAddressLat;
        var backLineListPageNo = $('#pageBackNo').val();
        var busType = data.busType;
        SzLibAPI.getLineLists(toAddressLon, toAddressLat, fromAddressLon, fromAddressLat, busType, backLineListPageNo, function (data) {
            if (null == data || data.length == 0) {
                alert('网络异常！');
            } else {
                $('#pageBackNo').attr('value', data.page.nextPage);
                var lineLists = data.lineLists;
                var html = '';
                for (var i = 0; i < lineLists.length; i++) {
                    if (lineLists[i].customLineType == "1") {//班车               		
                        html += '<div class="bus_ticket"  onclick=\'location.href="' + webUrl + '/line/lineMapInfo.do?lineId=' + lineLists[i].lineId + '&depId=' + lineLists[i].id + '"\' >'
                			+ '<div class="title">' + getNotNullValue(lineLists[i].lineName)
                			+ '<span class="time">' + lineLists[i].startTime + '</span>'
                			+ '</div>'
                			+ '<div class="ticket_paper">'
                			+ '<div class="address">'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].startSiteName) + '</span>'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].endSiteName) + '</span>'
							+ '</div>'
							+ '</div>'
							+ '<div class="tap2">￥<strong>' + getNotNullValue(lineLists[i].price) + '</strong></div>'
							+ '</div>';
                    } else {
                        html += '<div class="bus_ticket">'
                			+ '<div class="title">' + getNotNullValue(lineLists[i].lineName)
                			+ '<span class="time">' + lineLists[i].startTime + '</span>'
                			+ '</div>'
                			+ '<div class="ticket_paper">'
                			+ '<div class="address">'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].startSiteName) + '</span>'
                			+ '<span class="place">' + getNotNullValue(lineLists[i].endSiteName) + '</span>'
							+ '</div>'
							+ '</div>'
							+ '<div class="tap">￥<strong>' + getNotNullValue(lineLists[i].price) + '</strong></div>';
                        if (lineLists[i].customLineType == "2") {
                            html += '<div class="apply"><span class="num">' + lineLists[i].enList + '人报名</span>'
                				+ '<span class="btn" onclick="location.href=\'/customLine.do?enCustomLineInfo&customLineId='
                				+ lineLists[i].id + '\'">报名</span></div>'
                        } else if (lineLists[i].customLineType == "3") {
                            if (lineLists[i].enListStatus > 0) {
                                html += '<div class="apply"><span class="num">' + lineLists[i].enList + '人报名</span>'
                					+ '<span class="btn" onclick="location.href=\'/customLine.do?enCustomLineInfo&customLineId='
                    				+ lineLists[i].id + '\'">已报名</span></div>'
                            } else {
                                html += '<div class="apply"><span class="num">' + lineLists[i].enList + '人报名</span>'
                					+ '<span class="btn" onclick="location.href=\'/customLine.do?enCustomLineInfo&customLineId='
                    				+ lineLists[i].id + '\'">报名</span></div>'
                            }
                        }
                        html += '</div>';
                    }
                }
                $('#line_list_back').append(html);
                //显示加载更多
                if (data.page.pageNo == data.page.nextPage) {
                    $('#backMore').hide();
                }
            }
        });
    });

    //报名       
    $('#backCustomOriginate').on('tap', function () {
        var data = $.getUrlParam(window.location.href);
        var fromAddressLon = data.fromAddressLon;
        var fromAddressLat = data.fromAddressLat;
        var toAddressLon = data.toAddressLon;
        var toAddressLat = data.toAddressLat;
        window.location.href = "http://web.jiewo.com/customLine/auth_customLineSearchFirst.do?fromAddressLon=" + fromAddressLon + "&fromAddressLat=" + fromAddressLat + "&toAddressLon=" + toAddressLon + "&toAddressLat=" + toAddressLat;
    });

    //返程点击加载更多
    $('#backLineMore').on('tap', function () {
        var data = $.getUrlParam(window.location.href);
        var fromAddressLon = data.fromAddressLon;
        var fromAddressLat = data.fromAddressLat;
        var toAddressLon = data.toAddressLon;
        var toAddressLat = data.toAddressLat;
        var backLineListPageNo = $('#pageBackLineNo').val();
        var busType = data.busType;
        SzLibAPI.getLineLists(fromAddressLon, fromAddressLat, toAddressLon, toAddressLat, busType, backLineListPageNo, function (data) {
            if (data.length == 0) {
                alert('网络异常！');
            } else {
                $('#pageBackLineNo').attr('value', data.page.nextPage);
                var lineIndexs = data.lineIndexs;
                var html = '';
                var web = $("#backline_web").val();
                for (var i = 0; i < lineIndexs.length; i++) {
                    html += "<li>"
                		+ "<a href='" + web + "/line.do?lineTurnList&lineListID=" + lineIndexs[i].id + "&lineID=" + lineIndexs[i].lineId + "' data-ajax='false'>"
                		+ "<p style='width:65%'>"
                		+ "<span class='am-badge am-badge-primary am-radius' style='margin:0 10 0 0;'>起</span>"
                		+ "<span>" + lineIndexs[i].startSiteName + "</span>"
                		+ "<span style='padding-right:10px;right: 10px;position: absolute;border-radius: 3px;color:red;font-size:1.5em;'>￥" + lineIndexs[i].price + "</span>"
                		+ "</p>"
                		+ "<p style='width:65%'>"
                		+ "<span class='am-badge am-badge-primary am-radius' style='margin:0 10 0 0;'>终</span>"
                		+ "<span>" + lineIndexs[i].endSiteName + "</span>"
                		+ "</p>"
                		+ "</a>"
                		+ "</li>";
                }
                $('#back_line_list ul.am-list-border').append(html);
                //显示加载更多
                if (data.page.pageNo == data.page.nextPage) {
                    $('#backLineMore').hide();
                }
            }
        });
    });
});



; (function () {
    var _baseUrl = "http://web.jiewo.com/";
    var _get = function (url, param, success, error) {
        _ajax_local('get', url, param, success, error);
    }
    var _get_async = function (url, param, success, error) {
        _ajax_async('get', url, param, success, error);
    }
    var _post = function (url, param, success, error) {
        _ajax_local('post', url, param, success, error);
    }
    var _ajax_async = function (type, url, param, success, error) {
        url = _baseUrl + url;
        var options = {
            url: url,
            type: type || 'get',
            async: false,
            data: param,
            timeout: 120000,//超时时间默认2分钟
            success: success,
            cache: type == 'get' ? false : true,
            error: function (xhr, type) {
                if (error) {
                    error(xhr, type);
                } else {
                    _parseError(xhr, type, url);
                }
            },
            dataType: 'json'
        }
        $.ajax(options);
    }

    var _ajax_local = function (type, url, param, success, error) {
        url = _baseUrl + url;
        var options = {
            url: url,
            type: type || 'get',
            data: param,
            timeout: 120000,//超时时间默认2分钟
            success: success,
            cache: type == 'get' ? false : true,
            error: function (xhr, type) {
                if (error) {
                    error(xhr, type);
                } else {
                    _parseError(xhr, type, url);
                }
            },
            dataType: 'json'
        }
        $.ajax(options);
    }

    function _parseError(xhr, type, url) {
        if (type == 'timeout') {
            alert('连接服务器超时,请检查网络是否畅通！');
        } else if (type == 'parsererror') {
            alert('解析返回结果失败！');
        } else if (type == 'error') {
            var data;
            try {
                data = JSON.parse(xhr.responseText);
                if (data.code && data.message) {
                    alert(data.message);
                } else {
                    //alert('连接服务器失败！');
                }
            } catch (e) {
                //alert('连接服务器失败！');
            }
        } else {
            alert('未知异常');
        }
    }

    window.SzLibAPI = {
        'getFerryLineLists': function (startLon, startLat, pageNo, success, error) {
            _get('line/ajax/FindFerryLines.do', { startLon: startLon, startLat: startLat, pageNo: pageNo }, success, error);
        },
        'getLineLists': function (fromAddressLon, fromAddressLat, toAddressLon, toAddressLat, busType, lineListPageNo, success, error) {
            _get('line/ajax/lineList.do', { fromAddressLon: fromAddressLon, fromAddressLat: fromAddressLat, toAddressLon: toAddressLon, toAddressLat: toAddressLat, busType: busType, pageNo: lineListPageNo }, success, error);
        },
        'getLineInfo': function (indexId, success, error) {
            _get('line.do?lineInfo', { indexId: indexId }, success, error);
        },
        'getTicketLists': function (turnDate, success, error) {
            _get('ticket/ajax/ticketList.do', { turnDate: turnDate }, success, error);
        },
        'changeTicketDate': function (changeDate, success, error) {
            _get_async('ticket/ajax/changeTicketDate.do', { changeDate: changeDate }, success, error);
        },
        'getTicket': function (orderId, success, error) {
            _get('ticket.do?myTicket', { orderId: orderId }, success, error);
        },
        'sendCaptcha': function (mobile, success, error) {
            _get('member/ajax/sendCaptcha.do', { mobile: mobile }, success, error);
        },
        'login': function (mobile, captcha, success, error) {
            _get('member/ajax/checkCaptcha.do', { mobile: mobile, captcha: captcha }, success, error);
        },
        'loginBrowser': function (mobile, captcha, registFrom, success, error) {
            _get('member/ajax/checkCaptchaBrowser.do', { mobile: mobile, captcha: captcha, registFrom: registFrom }, success, error);
        },
        'addOrder': function (payMent, lineId, onSiteId, onSiteName, offSiteId, offSiteName, buyNum, startDate, timeId, success, error) {
            _post('order/ajax/auth_addOrder.do', { payMent: payMent, lineId: lineId, onSiteId: onSiteId, onSiteName: onSiteName, offSiteId: offSiteId, offSiteName: offSiteName, buyNum: buyNum, startDate: startDate, timeId: timeId }, success, error);
        },
        'addTourismOrder': function (tourismId, ticketCount, discount, userName, userCard, userMobile, success, error) {
            _post('order/ajax/auth_addTourismOrder.do', { tourismId: tourismId, ticketCount: ticketCount, discount: discount, userName: userName, userCard: userCard, userMobile: userMobile }, success, error);
        },
        'findCanUseCoupons': function (ticketType, productType, success, error) {
            _get('coupon/ajax/findCanUseCoupons.do', { ticketType: ticketType, productType: productType }, success, error);
        },
        'updateOrder': function (orderId, success, error) {
            _get('order/ajax/auth_updateOrder.do', { orderId: orderId }, success, error);
        },
        'ferryUpdateOrder': function (orderId, success, error) {
            _get('order/ajax/ferryUpdateOrder.do', { orderId: orderId }, success, error);
        },
        'cancelOrder': function (orderId, success, error) {
            _get('order/ajax/auth_cancelOrder.do', { orderId: orderId }, success, error);
        },
        'ferryCancelOrder': function (orderId, success, error) {
            _get('order/ajax/ferryCancelOrder.do', { orderId: orderId }, success, error);
        },
        'confirmPay': function (orderId, payType, success, error) {
            _get('order/ajax/auth_confirmPay.do', { orderId: orderId, payType: payType }, success, error);
        },
        'ferryConfirmPay': function (orderId, payType, success, error) {
            _get('order/ajax/ferryConfirmPay.do', { orderId: orderId, payType: payType }, success, error);
        },
        'rechargeConfirmPay': function (orderId, payType, success, error) {
            _get('order/ajax/rechargeConfirm.do', { orderId: orderId, payType: payType }, success, error);
        },
        'findMoreMyOrder': function (pageNo, success, error) {
            _get('order/ajax/auth_findMoreMyOrder.do', { pageNo: pageNo }, success, error);
        },
        'findMoreOrderList': function (pageNo, success, error) {
            _get('order/ajax/auth_findMoreOrderList.do', { pageNo: pageNo }, success, error);
        },
        'findMoreMyCoupon': function (pageNo, success, error) {
            _get('coupon.do?findMoreMyCoupon', { pageNo: pageNo }, success, error);
        },
        'findSite': function (siteId, success, error) {
            _get('site/ajax/findSite.do', { siteId: siteId }, success, error);
        },
        'exChangeCoupon': function (activationCode, success, error) {
            _get('coupon.do?exchangeCoupon', { activationCode: activationCode }, success, error);
        },
        'lineSites': function (lineId, success, error) {
            _get_async('site/ajax/lineSites.do', { lineId: lineId }, success, error);
        },
        'addEnList': function (customLineId, success, error) {
            _get('customLine/ajax/enListCustom.do', { customLineId: customLineId }, success, error);
        },
        'customLineLists': function (fromAddressLon, fromAddressLat, toAddressLon, toAddressLat, pageNo, success, error) {
            _get('customLine/ajax/customLineSearch.do', { fromAddressLon: fromAddressLon, fromAddressLat: fromAddressLat, toAddressLon: toAddressLon, toAddressLat: toAddressLat, pageNo: pageNo }, success, error);
        },
        'updateCustomLineName': function (customLineName, customLineId, success, error) {
            _get('customLine/ajax/updateCustomLineName.do', { customLineName: customLineName, customLineId: customLineId }, success, error);
        },
        'isOutoutApplyCustom': function (id, success, error) {
            _get('customLine/ajax/outApplyCustom.do', { id: id }, success, error);
        },
        'isOutEnCustom': function (id, success, error) {
            _get('customLine/ajax/outEnCustom.do', { id: id }, success, error);
        },
        'checkTicket': function (ticketId, success, error) {
            _get('ticket/ajax/checkTicket.do', { ticketId: ticketId }, success, error);
        },
        'getRecommendList': function (recommendPageNo, success, error) {
            _get('index.do?recommendList', { recommendPageNo: recommendPageNo }, success, error);
        },
        'checkInviteCaptcha': function (mobile, captcha, isWX, success, error) {
            _get('invitation/ajax/checkInviteCaptcha.do', { mobile: mobile, captcha: captcha, isWX: isWX }, success, error);
        },
        'getInviteRecordList': function (inviteRecordPageNo, userID, success, error) {
            _get('invitation/ajax/getInviteRecordList.do', { inviteRecordPageNo: inviteRecordPageNo, userID: userID }, success, error);
        },
        'setMemberCity': function (cityCode, success, error) {
            _get('index/ajax/setMemberCity.do', { cityCode: cityCode }, success, error);
        },
        'getPositionRecommends': function (currentLon, currentLat, success, error) {
            _get('index/ajax/getPositionRecommends.do', { currentLon: currentLon, currentLat: currentLat }, success, error);
        },
        'getSysRecommends': function (success, error) {
            _get('index/ajax/getPositionRecommends.do', {}, success, error);
        },
        'findMoreMessages': function (pageNo, success, error) {
            _get('message/ajax/findMoreMessages.do', { pageNo: pageNo }, success, error);
        },
        'turnTicketList': function (startTime, lineID, orderType, selectMonth, success, error) {
            _get('line/ajax/turnTicketList.do', { startTime: startTime, lineID: lineID, orderType: orderType, selectMonth: selectMonth }, success, error);
        },
        'realLocation': function (lineId, success, error) {
            _get_async('driver/ajax/realLocation.do', { lineId: lineId }, success, error);
        },
        'getHotTag': function (busType, success, error) {
            _get('line/findHotTag.do', { busType: busType }, success, error);
        },
        'getTourismTopic': function (success, error) {
            _get('tourism/getTourismTopic.do', {}, success, error);
        },
        'getTourismLineList': function (topic_search, travel_start_date, travel_end_date,
    			travel_order, travel_page_no, success, error) {
            _get('tourism/findTourismLineList.do', {
                topicId: topic_search, startDate: travel_start_date,
                endDate: travel_end_date, orderField: travel_order, pageNo: travel_page_no
            }, success, error);
        },
        'dealTravelRefund': function (orderId, refundSeatCount, success, error) {
            _get_async('order/ajax/auth_dealTravelRefund.do', { orderId: orderId, refundSeatCount: refundSeatCount }, success, error);
        },
        'findTravelTakeLines': function (takePageNo, success, error) {
            _get('tourism/ajax/myTravelTakeLines.do', { takePageNo: takePageNo }, success, error);
        },
        'findTravelOriginateLines': function (originatePageNo, success, error) {
            _get('tourism/ajax/myTravelOriginateLines.do', { originatePageNo: originatePageNo }, success, error);
        },
        'goPraise': function (tourismId, success, error) {
            _get('tourism/ajax/praiseTourismLine.do', { tourismId: tourismId }, success, error);
        },
        'checkTourismTicket': function (tourismId, turnId, success, error) {
            _get('ticket/ajax/checkTourismTicket.do', { tourismId: tourismId, turnId: turnId }, success, error);
        },
        'loginOut': function (success, error) {
            _get('about/ajax/loginOut.do', {}, success, error);
        },
        'getFerryData': function (currentLon, currentLat, success, error) {
            _get('index/getFerryData.do', { currentLon: currentLon, currentLat: currentLat }, success, error);
        },
        'ferryLineSites': function (ferryLineId, siteGroup, success, error) {
            _get_async('site/ajax/ferryLineSites.do', { ferryLineId: ferryLineId, siteGroup: siteGroup }, success, error);
        },
        'getNewTicketList': function (ticketType, pageNo, success, error) {
            _get('ticket/ajax/getNewTicketListData.do', {
                ticketType: ticketType,
                pageNo: pageNo
            }, success, error);
        },
        'checkFerryTicket': function (ferryLineId, checkNum, success, error) {
            _post('ticket/ajax/checkFerryTicket.do', { ferryLineId: ferryLineId, checkNum: checkNum }, success, error);
        },
        'lotteryPromotion': function (url, success, error) {
            _post(url, {}, success, error);
        },
        'setFerryTicketNotice': function (noticeType, success, error) {
            _get('ticket/ajax/setFerryTicketNotice.do', { noticeType: noticeType }, success, error);
        },
        'getGaudCouponList': function (mobile, success, error) {
            _get('gaudActivity/ajax/couponList.do', { mobile: mobile }, success, error);
        },
        'checkGaudCaptcha': function (mobile, captcha, success, error) {
            _get('gaudActivity/ajax/checkGaudCaptcha.do', { mobile: mobile, captcha: captcha }, success, error);
        },
        'getRechargeRecordList': function (recordType, pageNo, success, error) {
            _get('recharge/ajax/recordList.do', { recordType: recordType, pageNo: pageNo }, success, error);
        },
        'rechargeUpdateOrder': function (orderId, success, error) {
            _get('recharge/ajax/rechargeUpdateOrder.do', { orderId: orderId }, success, error);
        },
        'getBusLineData': function (currentLon, currentLat, success, error) {
            _get('index/getBusLineData.do', { currentLon: currentLon, currentLat: currentLat }, success, error);
        }, 'rechargeBusConfirmPay': function (orderId, payType, success, error) {
            _get('order/ajax/auth_rechargeBusConfirmPay.do', { orderId: orderId, payType: payType }, success, error);
        }, 'dealShake': function (success, error) {
            _get_async('shake/dealShake.do', {}, success, error);
        }, 'dealJieWoShake': function (success, error) {
            _get_async('shake.do?dealJieWoShake', {}, success, error);
        }, 'realBusLocation': function (lineId, driverId, depId, lineType, turnId, success, error) {
            _get_async('driver/ajax/realBusLocation.do', { lineId: lineId, driverId: driverId, depId: depId, lineType: lineType, turnId: turnId }, success, error);
        }, 'realFerryBusLocation': function (ferryLineId, lineType, success, error) {
            _get_async('driver/ajax/realFerryBusLocation.do', { ferryLineId: ferryLineId, lineType: lineType }, success, error);
        }, 'findSearchLines': function (geo, success, error) {
            _get_async('searchLine/searchLines.do', { geo: geo }, success, error);
        }, 'findShakeCoupons': function (pageNo, success, error) {
            _get('shake/ajax/auth_findJieWoShakeCoupons.do', { pageNo: pageNo }, success, error);
        }, 'dealSmash': function (success, error) {
            _get_async('smash/dealSmash.do', {}, success, error);
        }, 'getSubPositionList': function (pid, success, error) {
            _post('companyBus/ajax/getSubPositionList.do', { pid: pid }, success, error);
        }, 'getUserSearchRecords': function (startOrEnd, success, error) {
            _get('index/ajax/getUserSearchRecords.do', { startOrEnd: startOrEnd }, success, error);
        }, 'hasFerryBusLocation': function (ferryLineId, lineType, success, error) {
            _get_async('driver/ajax/hasFerryBusLocation.do', { ferryLineId: ferryLineId, lineType: lineType }, success, error);
        }, 'getSiteDuration': function (ferryLineId, lineType, siteId, success, error) {
            _post('driver/ajax/getSiteDuration.do', { ferryLineId: ferryLineId, lineType: lineType, siteId: siteId }, success, error);
        }, 'findGongJiaoPoints': function (nearGeos, distance, success, error) {
            _get_async('searchLine/ajax/findGongJiaoPoints.do', { nearGeos: nearGeos, distance: distance }, success, error);
        }, 'getLineSiteDuration': function (lineId, driverId, depId, turnId, siteId, success, error) {
            _get_async('driver/ajax/getLineSiteDuration.do', { lineId: lineId, driverId: driverId, depId: depId, turnId: turnId, siteId: siteId }, success, error);
        }, 'dealShareLineLottery': function (snKey, success, error) {
            _get_async('ticket/ajax/dealLotteryShare/' + snKey + '.do', {}, success, error);
        }
    };
})();