/*

    DEVELOPED BY : DIMAS AWANG KUSUMA (Arjunane)

*/

(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(["jquery", "./version"], factory);
    } else {

        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var click = "click",
        dataJSON  = new Array();
    var no = 1;
    
    $.fn.table = function(obj)
    {
        tb.reset();
        $(this).each(function () {
            var url = obj.url,
                number = no; // number every each selector

            var ini = $(this);
            if(obj.thead)               tb.getThead(obj.thead);
            if(obj.search)              tb.getTheadSearch(obj.search);
            if(obj.order_by)            tb.order_by(obj.order_by);
            if(obj.checkable)           tb.getCheck(obj.checkable);
            if(obj.action_checkable)    tb.getActionCheckable(obj.action_checkable);
            if(obj.action)              tb.getAction(obj.action);
            if(obj.theadFixed)          tb.getTheadFixed(obj.theadFixed);
            if(obj.theadFixedTop)       tb.getTheadFixedTop(obj.theadFixedTop);
            if(obj.array_info)          tb.getArrayInfo(obj.array_info);

            if(obj.hidden_index)        tb.getHiddenIndex(obj.hidden_index);
            else if(obj.hide_index)     tb.getHiddenIndex(obj.hide_index);

            ini.html(tb.setTable());

            var container   = ini.find(".arjunane-table"),
                tbody       = ini.find(".a-table tbody"),
                container_table = ini.find(".container-a-table"),
                tFixed      = ini.find('.t-fixed'),
                th_fixed    = tFixed.find("th"),
                conf        = ini.find('.conf'),
                conf_body   = conf.find('.inner-conf'),
                conf_error  = conf.find('.--error-info'),
                text_error  = conf.find('.--error-info .--text-error'),
                btn_ok      = conf.find('.btn-ok'),
                table       = ini.find('.a-table'),
                entry       = ini.find(".table-entry"),
                search      = ini.find(".a-table .search"),
                td          = tbody.find("td"),
                pagination  = container.find(".--pagination"),
                checkable   = container.find(".--checkable"),
                th          = ini.find(".a-table thead th");

            if(typeof obj.json !== 'undefined')
            {
                $.getJSON(obj.json, function(data) {
                
                    if(data.length === 0) {ini.html("Data are empty.");}
                    else 
                    {
                        tb.getAllData(data);
                        tbody.html(tb.tbody(data));
                        pagination.html(tb.pagination());
                        if(th_fixed.length === 0)
                        {
                            container_table.addClass('--scrolled');
                        }
                        var group = tb.group_by();
                        for(var k in group)
                        {
                            search.find("th").eq(k).find("select").append(group[k]);
                        }
                    }

                });
            }
            else
            {
                $.ajax({
                    url : url,
                    type: "POST",
                    dataType: "json",
                    beforeSend: function ()
                    {
                        td.html("Please wait a moment...");
                    },
                    success: function (data) 
                    {
                        //var json = JSON.parse(data);
                        if(data.length === 0)
                        {
                            var empty = '<tr> <td colspan="' + tb.count_thead + '"> Data are empty </td> </tr>';
                            tb.getAllData(data);
                            tbody.html(empty); 
                        }
                        else
                        {
                            tb.getAllData(data);
                            tbody.html(tb.tbody(data));
                            pagination.html(tb.pagination());
                            if(th_fixed.length === 0)
                            {
                                container_table.addClass('--scrolled');
                            }
                            var group = tb.group_by();
                            for(var k in group)
                            {
                                search.find("th").eq(k).find("select").append(group[k]);
                            }
                        }
                        
                    },
                    error: function (xhr)
                    {
                        container_table.addClass('--scrolled');
                        td.html("Ops!!! Something went wrong, please try again...");
                        text_error.html(xhr.responseText);
                        conf.addClass('aktif');
                        conf_error.addClass('aktif');
                    }
                });
            }

            ini.find("span.--all-check-data").off('click').on(click, function () {
                var all_check   = ini.find('input[type="checkbox"]'),
                    main_check  = ini.find("input.--all-check-data");
                   
                if( !main_check.is(":checked"))
                {
                    
                    all_check.prop("checked", "checked");
                    
                    for(var i = 0; i < all_check.length; i++)
                    {
                        var ac = all_check.eq(i);
                        if(ac.hasClass("--check-data"))
                        {
                            var get_data = ac.attr('get-data');
                            tb.getCheckData(get_data);
                        }
                    }
                }
                else
                {
                    all_check.prop("checked", "");
                    tb.resetCheck();
                }
            });

            ini.find('input.--all-check-data').off("click").on("change", function () {
                var all_check   = ini.find('input[type="checkbox"]'),
                    main_check  = $(this);
                   
                if( main_check.is(":checked") )
                {
                    all_check.prop("checked", "checked");
                    
                    for(var i = 0; i < all_check.length; i++)
                    {
                        var ac = all_check.eq(i);
                        if(ac.hasClass("--check-data"))
                        {
                            var get_data = ac.attr('get-data');
                            tb.getCheckData(get_data);
                        }
                    }
                }
                else
                {
                    all_check.prop("checked", "");
                    tb.resetCheck();
                }
            });


            ini.on(click, 'a.--data-msg', function (x) {
                x.preventDefault();
                var ini         = $(this),
                    cls         = "",
                    index       = ini.index(),
                    get_data    = ini.attr("get-data"),
                    set_data    = ini.attr("set-data");
                conf_body.addClass('aktif');
                if(ini.hasClass("--action-column"))
                {
                    conf.addClass('aktif');
                    cls      = "--action-column";
                    var data = tb.getMessage(index, get_data);
                    conf.find(".conf-info").html(data.msg);
                    conf.find(".btn-ok").attr("get-data", get_data);
                    conf.find(".btn-ok").attr("set-data", set_data);
                    btn_ok.attr('href', $(this).attr('href'));
                }
                else if(ini.hasClass("--action-row"))
                {
                    
                    var data    = tb.setCheckData(set_data);
                    if(data.result)
                    {
                        conf.addClass('aktif');
                        cls         = "--action-row";
                        var msg     = tb.getMessage(set_data);
                        conf.find(".conf-info").html(msg.msg);
                        conf.find(".btn-ok").attr("set-data", set_data);
                        btn_ok.attr('href', $(this).attr('href') + data.url);
                    }
                }

                if(ini.hasClass("--change-data")) conf.find(".btn-ok").addClass("--change-data " + cls);

                var width       = $(window).innerWidth(),
                    height      = $(window).innerHeight(),
                    conf_height = conf_body.outerHeight(),
                    conf_width  = conf_body.outerWidth();

                conf_body.css({top: (height / 2) - (conf_height / 2), left: (width / 2) - (conf_width / 2)});
                
            });

            ini.on(click, '.close-confirmation, .close-conf', function () { 
                conf.removeClass('aktif');  
                conf.find(".btn-ok").removeClass("--change-data --action-column --action-row");
                conf.find(".btn-ok").attr('get-data', "");
                conf.find(".btn-ok").attr('set-data', "");
                setTimeout(function () {
                    conf_body.removeClass('aktif'); 
                    conf_error.removeClass('aktif');
                }, 100);
            });

            ini.on(click, ".--check-data", function () {
                var ini     = $(this),
                    index   = ini.attr("get-data");
                if(ini.is(":checked"))
                {
                    tb.getCheckData(index);
                }
                else
                {
                    tb.getCheckData(index, true);
                }
            });

            btn_ok.on(click, function () { 
                var ini = $(this);
                if(!ini.hasClass("--change-data"))
                {
                    conf.removeClass("aktif");
                    window.location.href = ini.attr('url');
                }
            });
            
            ini.find('.a-table th, .t-fixed th').off('click').on(click, '', function() {
                var _ini     = $(this),
                    ind     = _ini.attr("set-data"),
                    index   = parseInt(ind), // karena jika index === 0, maka akan di urutkan berdasarkan nomor
                    parent  = _ini.parent();
                if(_ini.attr('sort') !== 'action' && !parent.hasClass('search'))
                {
                    if(_ini.hasClass("asc")) 
                    {
                        _ini.attr('sort','desc');
                        _ini.removeClass('asc');
                        _ini.addClass("desc");
                    }
                    else                           
                    {
                        _ini.attr('sort','asc');
                        _ini.removeClass('desc');
                        _ini.addClass("asc");
                    }

                    tbody.html(tb.changeSort(index, _ini.attr('class')));
                    pagination.html(tb.pagination());
                    checkable.html(tb.setChecked());
                    tb.resetCheck();
                }
            });

            search.on("keyup", "input", function (x) {
                var ini   = $(this),
                    val   = ini.val(),
                    index = ini.attr("set-data");
                var data  = tb.onInput(index, val);
                tbody.html(data[0]);
                pagination.html(data[1]);
                
                tb.resetCheck();
            });

            ini.on(click, ".--change-data", function (x) {
                x.preventDefault();
                var ini         = $(this),
                    url         = ini.attr("href"),
                    indexTR     = ini.attr("get-data"),
                    indexButton = ini.attr("set-data");
                if(!ini.hasClass("--dis-change") && !ini.hasClass("--loading"))
                {
                    $.ajax({
                        url     : url,
                        method  : "POST",
                        dataType: "json",
                        beforeSend: function ()
                        {
                            ini.text("Loading ...");
                            ini.addClass("--loading");
                        },
                        success : function (data) 
                        {
                            if(!ini.hasClass("btn-ok"))
                            {
                                var text        = tb.getTextAction(indexButton);
                                ini.text(text);
                            }
                            else
                            {
                                conf.removeClass('aktif');
                                setTimeout(function () {
                                    conf_body.removeClass('aktif');
                                    conf_error.removeClass('aktif');
                                }, 100);
                                ini.text("OK");
                            }

                            ini.removeClass("--loading");

                            var all_check   = container.find('input[type="checkbox"]');

                            if(ini.hasClass("--action-column"))
                            {
                                var change  = tb.setChangeDataTD(indexTR, indexButton, data),
                                data        = change.data,
                                isRemove    = change.isRemove;
                                if(isRemove)
                                {
                                    tbody.find(".--tr-data-" + indexTR).remove();
                                    var all_tr = tbody.find("tr");
                                    
                                    for(var i = 0; i < all_tr.length; i++)
                                    {
                                        all_tr.eq(i).find("td input").attr("get-data", i);
                                        all_tr.eq(i).attr('class', '--tr-data-' + i);
                                    }
                                }
                                else
                                {
                                    for(var k in data)
                                    {
                                        tbody.find(".--tr-data-" + indexTR + " .--td-data-" + k).html(data[k]);
                                    }
                                }
                            }
                            else if(ini.hasClass("--action-row"))
                            {
                                var change  = tb.setChangeDataTD("", indexButton, data),
                                data        = change.data,
                                isRemove    = change.isRemove;
                                if(isRemove)
                                {
                                    for(var i in data)
                                    {
                                        tbody.find(".--tr-data-" + data[i]).remove();
                                    }
                                    var all_tr = tbody.find("tr");
                                    if(all_tr.length > 0)
                                    {
                                        for(var i = 0; i < all_tr.length; i++)
                                        {
                                            all_tr.eq(i).find("td input").attr("get-data", i);
                                            all_tr.eq(i).attr('class', '--tr-data-' + i);
                                        }
                                    }
                                    
                                }
                                else
                                {
                                    for(var k in data)
                                    {
                                        var data_td = data[k];
                                        for(var i = 0; i < data_td.length; i++)
                                        {
                                            var index_td= data_td[i][0],
                                                text_td = data_td[i][1];

                                            tbody.find(".--tr-data-" + k + " .--td-data-" + index_td).html(text_td);
                                        }
                                    }
                                }
                                
                                all_check.prop("checked", false);
                                
                                tb.resetCheck();
                            }
                            
                            conf.find(".btn-ok").removeClass("--change-data --action-column --action-row");
                            
                        },
                        error: function (xhr)
                        {
                            
                            conf.find(".btn-ok").removeClass("--change-data --action-column --action-row");
                            if(!ini.hasClass("btn-ok"))
                            {
                                var text        = tb.getTextAction(indexButton);
                                ini.text(text);
                            }
                            else
                            {
                                ini.text("OK");
                            }
                            var msg =   "Status : " + xhr.status + "<br>" +
                                        "Status Text : " + xhr.statusText + "<br>" +
                                        "Response Text :" + xhr.responseText;
                            text_error.html(msg);
                            conf.addClass('aktif');
                            conf_error.addClass('aktif');
                        }
                    });
                }
            });

            ini.on({
                mouseenter: function ()
                {
                    var ini   = $(this),
                        index = ini.index(),
                        parent = ini.parent(),
                        tr    = tbody.find("tr");
                    if(!parent.hasClass('search'))
                    {
                        for(var i = 0; i < tr.length; i++)
                        {
                            tr.eq(i).find("td").eq(index).addClass("hover");
                        }
                    }
                    
                },
                mouseleave: function ()
                {
                    var ini   = $(this),
                        index = ini.index(),
                        tr    = tbody.find("tr");
                    for(var i = 0; i < tr.length; i++)
                    {
                        tr.eq(i).find("td").eq(index).removeClass("hover");
                    }
                }
            }, '.a-table th, .t-fixed th');

            $(document).scroll(function () {
                var table_top     = table.offset().top,
                    table_left    = table.offset().left,
                    scrollTop     = $(this).scrollTop(),
                    top           = tb.setTheadFixedTop(),
                    scrollLeft    = $(this).scrollLeft();
                // jika scroll melebihi thead normal
                (scrollTop > table_top) ? tFixed.addClass('aktif') : tFixed.removeClass('aktif');
                
                for(var i = 0; i < th.length; i++)
                {
                    var width = th.eq(i).outerWidth(),
                        width_table = table.outerWidth();
                    tFixed.css("width", width_table + "px");
                    th_fixed.eq(i).css("width", width + "px");
                }
                (scrollLeft > 0) ? tFixed.css({left: (table_left - scrollLeft)}) : tFixed.css("left", table_left + "px");
                tFixed.css({top: top + "px"});
                var ini_height = ini.outerHeight() + ini.offset().top;
                // jika scroll melebihi content table
                if(ini_height < table_top) tFixed.removeClass('aktif');
                
            });

            th.on('change', 'select', function () {
                var ini   = $(this),
                    val   = ini.val(),
                    index = ini.attr("set-data");
                    
                var data  = tb.onInput(index, val, true);
                tbody.html(data[0]);
                pagination.html(data[1]);
                tb.resetCheck();
            });

            entry.on("change", function() {                
                var ini     = $(this),
                    data    = tb.changeRows(ini.val()),
                    _tbody  = data[0],
                    check   = data[1],
                    pg      = data[2];
                tbody.html(_tbody);
                checkable.html(check);
                pagination.html(pg);
                tb.resetCheck();
            });

            pagination.on(click, '.--page ', function() {
                var ini = $(this);
                if(!ini.hasClass('aktif') && !ini.hasClass('n-a'))
                {
                    pagination.html(tb.pagination(ini.attr('index-page')));
                    tbody.html(tb.changePage());
                }
                tb.resetCheck();
            });

            no++;
        });
    }

    var table = function() 
    {
        this.maxEntry       = 10; // default data of rows
        this.startEntry     = 0;
        this.dt_order_by    = [0, 'asc'];
        this.theadSearch    = null;
        this.action_checkable= {};
        this.count_thead    = 1;
        this.check_data     = {};
        this.time_load      = new Date().getTime();
        this.dt_thead       = null;
        this.midle_page     = 4;
        this.dt_theadFixedTop=0;
        this.order_last     = false;
        this.dt_all         = null;
        this.type_input     = new Array();
        this.dt_search      = new Array();
        this.array_info     = null;
        this.sort_search    = new Array();
        this.changeData     = new Array();
        this.val_search     = {};
        this.index_page     = 1;
        this.action         = null;
        this.theadFixed     = false;
        this.hidden_index   = new Array();
    };

    table.prototype.reset = function ()
    {
        this.maxEntry       = 10; // default data of rows
        this.startEntry     = 0;
        this.dt_order_by    = [0, 'asc'];
        this.theadSearch    = null;
        this.action_checkable= {};
        this.count_thead    = 1;
        this.check_data     = {};
        this.time_load      = new Date().getTime();
        this.dt_thead       = null;
        this.midle_page     = 4;
        this.dt_theadFixedTop=0;
        this.order_last     = false;
        this.dt_all         = null;
        this.type_input     = new Array();
        this.dt_search      = new Array();
        this.array_info     = null;
        this.sort_search    = new Array();
        this.changeData     = new Array();
        this.val_search     = {};
        this.index_page     = 1;
        this.action         = null;
        this.theadFixed     = false;
        this.hidden_index   = new Array();
    }

    table.prototype.setTable = function ()
    {
        var elem = '<div class="arjunane-table">' +
                        this.btnEntry() +
                        this.setConfirm() +
                        this.setTheadFixed() +
                        '<div class="container-a-table">' +
                            "<table class='a-table'>" +
                                this.thead() + 
                                this.tbody() +
                            "</table>" +
                        '</div>' +
                        '<div class="--checkable">' +
                            this.setChecked() +
                        "</div>" +
                        '<div class="--pagination"></div>' +
                    "</div>";
        return elem;
    }

    table.prototype.setTheadFixed = function ()
    {
        var elem = "";
        if(this.theadFixed)
        {
            var thead = this.dt_thead,
                order_by = this.dt_order_by;
            elem += "<table class='t-fixed'><thead>";
            // jika checkable bernilai false
            if(!this.isCheckable) 
            {   
                elem += "<tr><th set-data=\"0\" sort='desc' class=\"asc\"><span>No</span></th>";
            }
            else
            {                    
                elem += "<tr><th sort='desc'></th>";
            }
            for(var i = 0; i < thead.length; i++)
            {
                if(!this.isHidden(i))
                {
                    attr = (i === order_by[0]) ? (order_by[1].toString().toLowerCase() === "desc") ? "desc" : "asc" : 'asc';
                    elem += "<th set-data='" + (i + 1) + "' sort=\"" + attr + "\" class=\"" + attr+ "\"><span>" + thead[i] + "</span></th>";
                }
            }
            if(this.action !== null)
            {
                elem += '<th class="action" sort="action">Action</th>';
            }
            elem += "</tr></table>";
        }
        return elem;
    };

    table.prototype.setConfirm = function ()
    {
        var elem  = '<div class="conf">' + 
                        '<div class="inner-conf">' +
                            '<div class="conf-head">' +
                                'Confirm' +
                                '<div class="close-conf close"></div>' +
                            '</div>'+
                            '<div class="conf-info"></div>' +
                            '<div class="conf-button">' +
                                '<button get-data="" set-data="" href="" class="btn-ok">OK</button>' +
                                '<button class="close-confirmation">Cancel</button></div>' +
                        '</div>' +
                        '<div class="--error-info">' +
                            '<div>Error</div>' +
                            '<div class="--text-error"></div>' +
                            '<div><button class="close-confirmation">OK</button></div>' +
                        '</div>' +
                    "</div>";
        return elem;
    }

    table.prototype.btnEntry = function()
    {
        var arr = [10, 25, 50, 100, 250, 500],
            elem = '<span>Number of rows </span><select class="table-entry">';
        for(var i = 0; i < arr.length; i++)
        {
            elem += '<option val="' + arr[i] + '">' + arr[i] + '</option>';
        }
        elem += '</select>';
    
        return elem;
    };

    // element thead
    table.prototype.thead = function ()
    {
        var thead       = this.dt_thead, // mendapatkan data string array thead
            elem        = "",
            theadSearch = this.theadSearch,
            val_search  = this.val_search,
            order_by    = this.dt_order_by, // mendapatkan penyortiran (asc || desc)
            attr        = "";
        elem += "<thead>";
        // jika checkable bernilai false
        if(!this.isCheckable) 
        {   
            elem += "<tr><th set-data=\"0\" sort='desc' class=\"asc\"><span>No</span></th>";
        }
        else
        {                    
            elem += "<tr><th sort='desc'></th>";
        }
        for(var i = 0; i < thead.length; i++)
        {
            if(!this.isHidden(i))
            {
                this.count_thead += 1;
                attr = (i === order_by[0]) ? (order_by[1].toString().toLowerCase() === "desc") ? "desc" : "asc" : 'asc';
                elem += "<th set-data='" + (i + 1)  + "' sort=\"" + attr + "\" class=\"" + attr+ "\"><span>" + thead[i] + "</span></th>";
            }
        }
        if(this.action !== null)
        {
            elem += '<th class="action" sort="action">Action</th>';
        }
        
        elem += "</tr>";
        if(theadSearch !== null)
        {
            elem += '<tr class="search">';
            elem += '<th></th>';
            for(var t = 0 ; t < thead.length; t++)
            {
                if(!this.isHidden(t))
                {
                    var exists = false;
                    for(var ts = 0; ts < theadSearch.length; ts++)
                    {
                        var tSearch = theadSearch[ts],
                            type = tSearch.type,
                            search_index    = tSearch.index;
                        if(search_index === t)
                        {
                            exists = true;
                            elem += '<th>';
                            t += 1;
                            if(type === 'input')
                            {
                                elem += '<input set-data="' + t + '" placeholder="' + tSearch.placeholder + '">';
                            }
                            else if(type === 'select')
                            {
                                var set_data = (typeof(tSearch.group_by) !== 'undefined' && typeof(tSearch.group_by.key) !== 'undefined') ? tSearch.group_by.key + 1 : t;
                                elem += '<select set-data="' + set_data + '">';
                                if(typeof tSearch.value !== 'undefined' && typeof tSearch.group_by === 'undefined')
                                {
                                    for(var sel = 0; sel < tSearch.value.length; sel++)
                                    {
                                        elem += '<option value="' + tSearch.value[sel][0] + '">' + tSearch.value[sel][1] + '</option>';
                                    }
                                }
                                else  if(typeof tSearch.value === 'undefined' && typeof tSearch.group_by !== 'undefined')
                                {
                                    var group    = tSearch.group_by,
                                        def      = group.default;

                                    if(typeof def !== 'undefined')
                                    {
                                        elem += '<option value="' + def[0] + '">' + def[1] + '</option>';
                                    }
                                }
                                    
                                elem += '</select>';
                            }
                            elem += '</th>';
                            val_search[t] = false; 
                        }
                    }
                    if(!exists) {elem += '<th></th>';}
                }
                
            }
            if(this.action !== null)
            {
                this.count_thead += 1;
                elem += '<th></th>';
            }
            elem += '</tr>';
        }
        elem += "</thead>";
        return elem;
    };

    // element tbody
    table.prototype.tbody = function (data)
    {
        var elem = "";
        // ketika pertama kali tbody di append
        if(typeof data === 'undefined')
        {
            elem += "<tbody><tr><td colspan=\"" + this.dt_thead.length + 1 + "\"></td></tr></tbody>";
        }
        else
        {
            var sort = this.sortData();
            for(var i = this.startEntry; i < this.maxEntry; i++)
            {
                elem += this.setTD(sort, i);
            }
            
        }
        return elem;
    };

    table.prototype.changeSort = function(_index, attr)
    {
        var elem     = "",
            dt_ajax  = (this.dt_search.length === 0) ? this.dt_all : this.dt_search;
        this.index_page = 1;
        var index    = parseInt(_index);
        // jika th yang terklik adalah index 0 / number
        if(index === 0)
        {
            var max = dt_ajax.length - this.maxEntry;
            if(attr === 'desc')
            {
                for(var i = (dt_ajax.length - 1); max < i; i--)
                {
                    elem += this.setTD(dt_ajax, i);
                }
                // set index_page if order number is last
                this.index_page = Math.ceil(dt_ajax.length / this.maxEntry);
            }
            else
            {
                for(var i = 0; i < this.maxEntry; i++)
                {
                    elem += this.setTD(dt_ajax, i);
                }
                // set index_page if order number is first
                this.index_page = 1;
            }
        }
        else
        {
            var isDate = this.isDate;
            //index = this.normalizeHiddenIndex(index - 1);
            dt_ajax.sort(function (a, b) {
                var ind  = index - 1,
                    dt_1 = (isDate(a[ind])) ? new Date(a[ind]) : a[ind],
                    dt_2 = (isDate(b[ind])) ? new Date(b[ind]) : b[ind];
                if( ( isDate(a[ind]) && isDate(b[ind]) ) || ( !isNaN(a[ind]) && !isNaN(b[ind]) ) )
                {
                    return (attr === 'desc') ? dt_2 - dt_1 : dt_1 - dt_2;
                }
                else
                {
                    if(attr == 'asc')
                    {
                        if (a[ind] < b[ind]) return -1;
                        else if( a[ind] > b[ind]) return 1; 
                    }
                    else
                    {
                        if (a[ind] > b[ind]) return -1;
                        else if( a[ind] < b[ind]) return 1; 
                    }
                    return 0;
                    
                }
            });
            for(var i = this.startEntry; i < this.maxEntry; i++)
            {
                
                elem += this.setTD(dt_ajax, i);
            }
            // set all data where thead is clicked
            if(this.dt_search.length === 0)
            {
                this.dt_all = dt_ajax;
            }
            else
            {
                this.dt_search = dt_ajax;
            }
            // set index_page if order number is first
            this.index_page = 1;
        }
        
        return elem;
    };

    // group by select option
    table.prototype.group_by = function ()
    {
        var index   = 1,
            result  = {},
            thead   = this.dt_thead,
            _search = this.theadSearch;
        for(var th = 0; th < thead.length; th++)
        {
            if(!this.isHidden(th))
            {
                var groups  = {},
                    options = "";
                // jika pencarian tidak di isi/ kosong
                if(_search !== null)
                {
                    for(var s = 0; s < _search.length; s++)
                    {
                        var search = _search[s];
                        if(typeof search.value === 'undefined' && typeof search.group_by !== 'undefined' && th === search.index)
                        {
                            var group    = search.group_by,
                                isDate   = this.isDate
                                data     = this.dt_all,
                                key      = group.key    !== 'undefined' ? parseInt(group.key)     : parseInt(group.value),
                                value    = group.value  !== 'undefined' ? parseInt(group.value)   : parseInt(group.key);
                                
                            for(var i = 0; i < data.length; i++)
                            {
                                var dt      = data[i],
                                    k       = dt[key],
                                    v       = dt[value];
                                groups[k] = v;
                                
                            }
                            for(var k in groups)
                            {
                                options += '<option value="' + k + '">' + groups[k] + '</option>';
                            }
                            
                            result[index] = options;
                        }   
                    }
                    index ++;
                }
            }
        }
        
        return result;
    }

    table.prototype.getTextAction = function (index, is_single = true)
    {
        var text = "",
            btn  = is_single ? this.action : this.action_checkable;
        text     = btn[index].text;
        return text;
    }

    table.prototype.setTD     = function (dt_ajax, i)
    {
        if(this.dt_all === null) return false;
        var elem       = "",
            array_info = this.array_info;
        if(i < dt_ajax.length && i >= 0) 
        {
            elem += '<tr class="--tr-data-' + i + '">';
            // jika checkable bernilai false
            if(!this.isCheckable)
            { 
                elem += "<td>" + (i + 1) + ".</td>";
            }
            else
            { 
                
                elem += '<td><input get-data="' + i + '" class="--check-data" type="checkbox"></td>';
            }
            var dt        = dt_ajax[i],
                data_ajax = this.dataToArray(dt);
    
            for(var td = 0; td < data_ajax.length; td++)
            {
                if(!this.isHidden(td))
                {
                    var name = data_ajax[td];
                    if(array_info !== null)
                    {
                        if(Object.keys(array_info).length !== 0)
                        {
                            for(var k in array_info)
                            {
                                var key = array_info[k].index;
                                if(key === td)
                                {
                                    name = array_info[k].value[data_ajax[td]];
                                }
                            }
                        }
                    }
                    elem += '<td class="--td-data-' + td + '">' + name + "</td>";
                }
            }
    
            elem += this.setAction(data_ajax, i);
            elem += "</tr>";
        }
        return elem;
    };

    table.prototype.setAction = function (data, attr_index)
    {
        var elem = "";
        if(this.action !== null)
        {
            elem += "<td class='action'>";
            for(var i = 0; i < this.action.length; i++)
            {
                var action      = this.action[i],
                    cls         = "t-" + (typeof action.cls !== 'undefined' ? action.cls : "default"),
                    attr        = ' get-data="' + attr_index + '" set-data="' + i + '"',
                    dataChange  = action.changeData,
                    msg         = action.msg,
                    clsChange   = typeof dataChange !== 'undefined' || typeof action.isRemove !== 'undefined'? " --change-data" : "",
                    clsMsg      = typeof msg !== 'undefined' ? " --data-msg --dis-change" : "",
                    clsDisableChange = typeof dataChange !== 'undefined' && typeof msg !== 'undefined' ? " --dis-change" : "",
                    //action = action.act ? ' oncick="' + action.act + '"' : "",
                    text        = action.text ? action.text : action.cls.toString().toUpperCase(),
                    url         = action.url.substr(action.url.length - 1) === "/" || action.url.substr(action.url.length - 1) === "?" ? action.url : action.url + "/";
                    
                if(typeof action.params !== 'undefined')
                {
                    for(var p = 0; p < action.params.length; p++)
                    {
                        url    += data[action.params[p]] + "/";
                    }
                }
                elem += '<a class="' + cls + clsChange + clsMsg + clsDisableChange + ' --action-column" href="' + url + '" ' + attr + '>' + text + '</a>';

            }
            elem += "</td>";
        }
        return elem;
    }

    table.prototype.changeRows = function (val) 
    {
        this.index_page = 1;
        this.maxEntry   = parseInt(val);

        var index    = this.index_page,
            maxEntry = this.maxEntry,
            elem     = [],
            data     = (this.dt_search.length === 0 && this.sort_search.length === 0) ? this.dt_all : this.dt_search,
            tbody    = "";
            
        for(var i = (index - 1); i < maxEntry; i++)
        {
            tbody  += this.setTD(data, i);
        }

        elem[0] = tbody;
        elem[1] = this.setChecked();
        elem[2] = this.pagination();

        return elem;
        
    };

    table.prototype.changePage = function ()
    {
        var index    = (this.index_page === 1) ? 0 : (this.index_page - 1) * this.maxEntry,
            maxEntry = this.maxEntry * this.index_page,
            data     = (this.dt_search.length === 0) ? this.dt_all : this.dt_search,
            elem     = "";
        for(var i = index; i < maxEntry; i++)
        {
            elem  += this.setTD(data, i);
        }
        return elem;
    };

    // order_by yang aktif
    table.prototype.order_by = function (data)
    {
        this.dt_order_by = data;
        return this;
    };

    // thead bagian pencarian (jika ada)
    table.prototype.getTheadSearch = function (theadSearch)
    {
        this.theadSearch = theadSearch;
        return this;
    };

    // mendapatkan pesan data sesuai tombol action / action_all
    table.prototype.getMessage = function (index, data_column = "") 
    {
        var result  = {},
            thead   = this.dt_thead,
            newMsg  = "",
            index   = parseInt(index),
            data    = (this.dt_search.length === 0) ? this.dt_all : this.dt_search ;
        // tombol action [perintah untuk satu data] || data_column berisi index tombol
        if(data_column !== "")
        {
            var action  = this.action,
                msg     = action[index].msg,
                field   = action[index].field;
                
            if(msg.match(/{i}/g) && typeof field !== 'undefined')
            {
                newMsg = msg.replace(/{i}/g, thead[field]);
                
                if(newMsg.match(/{m}/g))
                {
                    newMsg = newMsg.replace(/{m}/g, data[data_column][field]);
                }
            }
            else
            {
                newMsg = msg;
            }
            result.msg = newMsg;

        }
        // tombol action_all [perintah untuk data  yang terseleksi [checked] ] || data_column == kosong
        else
        {
            var action      = this.action_checkable[index],
                data_check  = this.check_data,
                msg         = action.msg,
                col_msg     = action.col_msg,
                field       = action.field;
            if(typeof msg !== 'undefined' && typeof field !== 'undefined')
            {
                newMsg = msg;
                if(typeof col_msg !== 'undefined')
                {
                    newMsg += "</br></br>";
                    for(var k in data_check)
                    {
                        var wrap_msg = col_msg;
                        for(var p = 0; p < action.params.length; p++)
                        {
                            var param = action.params[p];
                            if(wrap_msg.match(/{i}/g))
                            {
                                wrap_msg = wrap_msg.replace(/{i}/g, thead[param]) + "</br>";
                            }
        
                            if(wrap_msg.match(/{m}/g))
                            {
                                wrap_msg = wrap_msg.replace(/{m}/g, data_check[k][param]) + "</br>";
                            }
                        }
                        newMsg += wrap_msg;
                    }
                }
            }
            else
            {
                newMsg = msg;
            }
            result.msg = newMsg;

        }
        return result;
    }

    table.prototype.resetCheck = function ()
    {
        this.check_data = {};
    }

    // apakah chekable 
    table.prototype.getCheck = function (check) 
    {
        this.isCheckable = check;
        return this;
    }

    // mendapatkan data input checkbox
    table.prototype.getCheckData = function (index, remove = false)
    {
        var check_data  = this.check_data,
            index       = parseInt(index),
            new_data    = {},
            data        = (this.dt_search.length === 0) ? this.dt_all : this.dt_search;
        if(remove)
        {
            for(var k in check_data)
            {
                if(index !== parseInt(k))
                { 
                    new_data[k] = data[k];
                }
            }
            check_data   = new_data;
        }
        else
        {
            check_data[index] = data[index];
            
        }
        return check_data;
    }

    // mendapatkan action para checkable
    table.prototype.getActionCheckable = function (data) 
    {
        this.action_checkable = data;
        return this;
    }

    table.prototype.onInput = function (ind, value, isFromSelect)
    {
        var data       = this.dt_all,
            elem       = [],
            sort_search=this.sort_search,
            type_input= this.type_input,
            string_type= isFromSelect ? "select" : "input",
            tbody      = "";
            
        this.index_page = 1;
        var index = parseInt(ind) - 1;

        if(sort_search.indexOf(index) === -1)
        { 
            sort_search.push(index);
            type_input.push(string_type);
        }
        
        this.val_search[index] = (value.length !== 0) ? value.toString() : false;
        if(sort_search.length > 0 && sort_search.indexOf(index) !== -1)
        {
            this.dt_search = [];
            if(typeof(isFromSelect) !== 'undefined')
            {
                for(var i = 0; i < data.length; i++)
                {
                    var dt     = data[i],
                        result = true;
                    for(var s = 0; s < sort_search.length; s++)
                    {
                        var sort= sort_search[s],
                            val = this.val_search[sort],
                            str = String(dt[sort]).match(new RegExp(val, "gi"));
                        // if( val.toString() !== dt[sort].toString() && type_input[s] === 'select' && value.length !== 0) result = false;
                        // else if(str === null && type_input[s] === 'input') result = false;
                        if(typeof val !== 'boolean' && str === null) result = false;
                    }
                    
                    if(result)
                    {
                        this.dt_search.push(dt);
                    }
                }
            }
            else
            {
                for(var i = 0; i < data.length; i++)
                {
                    var dt     = data[i],
                        result = true;
                    for(var s = 0; s < sort_search.length; s++)
                    {
                        var sort= sort_search[s],
                            val = this.val_search[sort],
                            str = String(dt[sort]).match(new RegExp(val, "gi"));

                        if(typeof val !== 'boolean' && str === null) result = false;
                    }
                    
                    if(result)
                    {
                        this.dt_search.push(dt);
                    }
                }
            }
        }
        
        if(this.isValuesNull()) this.dt_search = [];
          
        if(value.length === 0 && sort_search.indexOf(index) !== -1) 
        {
            sort_search.splice(sort_search.indexOf(index), 1);
            type_input.splice(type_input.indexOf(string_type), 1);
            
        }
        if(this.dt_search.length !== 0)
        {
            for(var i = 0; i < this.maxEntry; i++)
            {
                tbody += this.setTD(this.dt_search, i);
            }
        }
        else
        {
            for(var i = 0; i < this.maxEntry; i++)
            {
                tbody += this.setTD(data, i);
            }
        }
        elem[0] = tbody;
        elem[1] = this.pagination();

        return elem;
    };

    table.prototype.isValuesNull = function ()
    {
        var val = this.val_search;
        for(var v in val)
        {
          if(typeof val[v] === 'string') return false;
        }
        
      return true;
    };

    table.prototype.normalizeHiddenIndex = function (index) 
    {
        var ind  = index,
            plus = -1;
        if(this.hidden_index.length > 0)
        {
            for(var i = 0; i < this.dt_thead.length; i++)
            {
                for(var hid = 0; hid < this.hidden_index.length; hid++)
                {
                    if(i === hid)
                    { 
                        plus += 1;
                        ind = index + plus;
                    }
                }
            }
        }
        return ind;
    };

    table.prototype.pagination = function(val)
    {
        if(typeof val !== 'undefined')
        { 
            this.index_page = parseInt(val);
        } 
        var data            = (this.dt_search.length === 0) ? this.dt_all : this.dt_search,
            elem            = "",
            middle_page     = this.midle_page,
            index           = this.index_page,
            cls             = "",
            load            = "",
            maxEntry        = this.maxEntry * index,
            start_index     = (index <= middle_page) ? 1 : index,
            show            = (index === 1) ? 1 : (index - 1) * this.maxEntry, // index halaman
            // jumlah halaman dimana index halaman di kali jumlah entry data yang akan di tampilkan
            show_to         = 0, 
            last_page       = Math.ceil(data.length / this.maxEntry), // membulatkan pembagian
            last_index_plus = (index <= middle_page) ? 1 + middle_page : index + middle_page,
            last_index_min  = last_page - middle_page,
            previous        = (index !== 1) ? index - 1 : 1,
            cls_previous    = (index === 1) ? " aktif" : "",
            next            = (index !== last_page) ? index + 1 : last_page,
            cls_next        = (index === last_page) ? " aktif" : "";

        cls         = (index === 1) ? " aktif" : ""; 
        
        // mendapatkan jumlah pada halaman peratma
        if(index === 1)                 show_to = this.maxEntry;
        // jika jumlah data lebih kecil dari maxEntry
        else if(maxEntry > data.length) show_to = maxEntry - ( maxEntry - data.length );
        else                            show_to = index * this.maxEntry;

        if(this.time_load !== null) load = '  (Results took ' + ((new Date().getTime() - this.time_load) / 1000).toFixed(4) + " seconds.)";

        // info load data dari data ke- sampai data ke-
        elem += '<div class="i-page">Showing ' + show + ' to ' + show_to + ' of ' + data.length + load + '</div>';

        elem += '<div class="--page' + cls_previous + '" index-page="' + previous + '">Previous</div>';

        // jika index_page lebih dari middle_page (halaman tengah)
        if((index > middle_page && index !== last_page) || (index > middle_page && index === last_page)) 
        {
            elem += '<div class="--page" index-page="1">1</div>'
            elem += '<div class="--page n-a">...</div>';
        }

        if(index > (middle_page + 1)) start_index = index - 1;

        // jika halaman yang di tuju hampir halaman terakhir (dimana index_page di tambah dengan middle_page)
        if((index + middle_page) >= last_page) 
        {
            last_index_plus = last_page;
            start_index     = last_page - middle_page;
        }
        
        // jika hasil pengurangan start_index hasil nya lebih kecil dari 0 maka akan di set ke 1
        if(start_index <= 0) start_index = 1;

        for(var i = start_index; i <= last_index_plus; i++)
        {
            cls = (index === i) ? " aktif" : "";
            elem += '<div index-page="' + i + '" class="--page' + cls + '">' + i + '</div>';
        }

        if(index < last_index_min) 
        {
            elem += '<div class="--page n-a">...</div>';
            elem += '<div class="--page" index-page="' + last_page + '">' + last_page + '</div>'
        }
        elem += '<div class="--page' + cls_next + '" index-page="' + next + '">Next</div>';

        // jika data kosong
        if(data.length === 0) elem = "";
        
        // set waktu ke null supaya tidak ada kalkulasi waktu lagi
        this.time_load = null;
        return elem;
    }

    table.prototype.setTheadFixedTop = function ()
    {
        return this.dt_theadFixedTop;
    };

    // set data hasil check
    table.prototype.setCheckData = function (index)
    {
        var check_data  = this.check_data,
            res         = {result : false, url : ""},
            push_data   = new Array(),
            index       = parseInt(index),
            action      = this.action_checkable[index];
        for(var k in check_data)
        {
            var data        = check_data[k], 
                push_params = new Array();
            for(var x = 0; x < action.params.length; x++)
            {
                var param = action.params[x],
                    data_param = data[param];
                push_params.push(data_param);
            }
            var join = push_params.join(":");
            push_data.push(join);
            res.result  = true;
        }
        var isDate = this.isDate;
        
        push_data.sort(function (a, b) {
            var ind  = index,
                dt_1 = (isDate(a[ind])) ? new Date(a[ind]) : a[ind],
                dt_2 = (isDate(b[ind])) ? new Date(b[ind]) : b[ind];
            if( ( isDate(a[ind]) && isDate(b[ind]) ) || ( !isNaN(a[ind]) && !isNaN(b[ind]) ) )
            {
                return (dt_1 < dt_2) ? dt_2 - dt_1 : dt_1 - dt_2;
            }
            else
            {
                if (a[ind] < b[ind] || a[ind] > b[ind]) {return -1; }
                return 0;
            }
        });

        res.url     = push_data.join("~");
        
        return res;
    }

    // set konten check
    table.prototype.setChecked = function ()
    {
        var html = "",
            check = this.isCheckable;
            if(check)
            {
                html += "<input type='checkbox' class='--all-check-data'><span class='--all-check-data'>Check All</span>";
            }
            html += this.setCheckableAction();
        return html;
    }
    // aksi html untuk action checkable
    table.prototype.setCheckableAction = function ()
    {
        var html        = "",
            action_all  = this.action_checkable;
            if(action_all.length > 0)
            {
                if(this.isCheckable)
                {
                    html = '<span style="display:inline-block;padding-left:20px;">With selected : </span>';
                }
                
                for(var i = 0; i < action_all.length; i++)
                {
                    var action = action_all[i],
                        url    = action.url.substr(action.url.length - 1) === "/" || action.url.substr(action.url.length - 1) === "?" ? action.url : action.url + "/",
                        cls    = "t-" + (typeof action.cls !== 'undefined' ? action.cls : "default"),
                        clsChange= typeof action.changeData !== 'undefined' || typeof action.isRemove !== 'undefined' ? " --change-data --dis-change" : "",
                        clsMsg = typeof action.msg !== 'undefined' ? " --data-msg" : "";
                    html += '<a class="' + cls + clsMsg + clsChange + ' --action-row" href="' + url + '" set-data="' + i + '">' + action.text + '</a>'
                }
            }
        return html;
    }

    table.prototype.sortData = function () 
    {
        var dt_order = this.dt_order_by,
            index    = dt_order[0],
            order    = (typeof dt_order[1] !== 'undefined') ? dt_order[1].toString().toLowerCase() : "asc",
            dt_ajax  = this.dt_all;
            
        dt_ajax.sort(function (a, b) {
            return (order === 'desc') ? b[index] - a[index] : a[index] - b[index];
        });
        this.dt_all = dt_ajax;
        return dt_ajax;
    };

    table.prototype.isDate = function(val)
    {
        var result = false;
        // jika berupa integer bukan string, karena tanggal ialah string "2019-09-12"
        if(typeof (val) !== 'string') return result;

        var _date  = val.split(" "),
            date   = typeof _date[1] !== 'undefined' ? _date[0] + " " + _date[1] : _date[0],
            check  = new Date(date);
            
        if(!isNaN(check.getDate())) return true;
        return result;
    };

    // merubah perubahan pada td text
    table.prototype.setChangeDataTD = function (indexTR, indexButton, dataAjax)
    {
        var data        = (this.dt_search.length === 0) ? this.dt_all : this.dt_search,
            checks      = this.check_data,       
            // jika indexTR tidak sama kosong, maka berlaku untuk satu data <tr>
            _action     = indexTR !== "" ? this.action : this.action_checkable,
            // digunakan untuk meng-check apakah ada object changeData
            action      = typeof _action[indexButton].changeData !== 'undefined' && typeof _action[indexButton].isRemove === 'undefined' ? _action[indexButton].changeData.changeIndex : false,
            new_data    = new Array(),
            // is remove untuk menge-check apakah menghapus TR Table atau tidak
            isRemove    = typeof _action[indexButton].isRemove !== 'undefined' ? _action[indexButton].isRemove : false;

        var result = 
        { 
            data        : {}, 
            isRemove    : isRemove
        };
        if(indexTR !== "")
        {
            if(isRemove)
            {
                for(var d = 0 ; d < data.length; d++)
                {
                    var dt = data[d];
                    // untuk menghapus tr sesuai dengan indexTR === d
                    if(d !== parseInt(indexTR))
                    {
                        new_data.push(dt);
                    }
                }
            }
            else
            {
                // check apakah result data ajax bernilai 0
                if(dataAjax.length !== 0)
                {
                    for(var d = 0 ; d < data.length; d++)
                    {
                        var dt = data[d];
                        // untuk menghapus tr sesuai dengan indexTR === d
                        if(d === parseInt(indexTR))
                        {
                            for(var i = 0; i < action.length; i++)
                            {
                                var index_change = action[i],
                                    dt_ajax      = dataAjax[i],
                                    result_data  = null;
                                // jika dataAjax dengan index i bernilai undefined alias tidak ada
                                if(typeof dt_ajax === 'undefined')
                                { 
                                    console.error("Index data for 'Change Index' doesn't exist [ Index data : " + i  + " ]");
                                }
                                dt[index_change] = typeof dt_ajax !== 'undefined' ? dt_ajax.toString() : "";
                                result_data = dt_ajax;
                                if(this.array_info !== null)
                                {
                                    for(var _ai = 0; _ai < this.array_info.length; _ai++)
                                    {
                                        var ai = this.array_info[_ai];
                                        if(ai.index == index_change)
                                        {
                                            result_data = ai.value[dt_ajax];
                                        }
                                    }
                                }
                                result.data[index_change] = result_data;
                            }
                        }
                        //console.log(dt);
                        new_data.push(dt);
                    }
                }
                else
                {
                    console.error("Ops, your data is NULL");
                }
                
            }
        }
        else
        {
            if(isRemove)
            {
                var index_TR_remove = new Array();
                // mengurangi data yang tidak sesuai dengan index data yang akan di hapus
                for(var i = 0; i < data.length; i++)
                {
                    var dt = data[i];
                    /// jika data hasil check bernilai undefined dikarenakan checks dengan index i tidak ada
                    if(typeof checks[i] === 'undefined') new_data.push(dt);
                }

                // menambahkan data index tr yang akan di hapus
                // dimana akan digunakan untuk result pada HTML.find()
                for(var c in checks)
                {
                    index_TR_remove.push(c);
                }

                result.data = index_TR_remove;
            }
            else
            {
                if(dataAjax.length !== 0)
                {
                    // check multidimensional array [ [x, x], [x, x] ]
                    if(typeof dataAjax[1] !== 'undefined' && typeof dataAjax[1][0] !== 'undefined')
                    {
                        var ind = 0;
                        for(var d = 0 ; d < data.length; d++)
                        {
                            var dt               = data[d],
                                length           = action.length, // panjang index action_checkable
                                indexs_td_change = new Array();
                            if(typeof checks[d] !== 'undefined')
                            {
                                for(var i = 0; i < action.length; i++)
                                {
                                    try
                                    {
                                        var act     = action[i],
                                        dt_ajax = dataAjax[ind];
                                        var val_ajax= dt_ajax[i];
    
                                        indexs_td_change.push([act, val_ajax]);
                                    }
                                // panjang dt_ajax dengan index i bernilai undefined, dikarenakan melebihi atau kurang dari index action <i>
                                // panjang hasil [ [0,1], [1,1] ]
                                // index[0][2], dimana data kedua "out of array"
                                    catch(e)
                                    {
                                        console.error("Index data for 'Change Index' doesn't exist [ Index data : " + ind + " | Result Change for index <tr> : " + (ind + 1) + " (+1) ]. Length result data : " + length);
                                        console.error("Error : " + e);
                                    }
                                    
                                }
                                result.data[d] = indexs_td_change;
                                ind++;
                            }
                            
                            new_data.push(dt);
                        }
                    }
                    else
                    {
                        for(var d = 0 ; d < data.length; d++)
                        {
                            var dt = data[d],
                                indexs_td_change = new Array();
                            if(typeof checks[d] !== 'undefined')
                            {
                                for(var i = 0; i < action.length; i++)
                                {
                                    var index_change = action[i],
                                        dt_ajax      = dataAjax[i];
                                    if(typeof dt_ajax === 'undefined')
                                    { 
                                        console.error("Index data for 'Change Index' doesn't exist [ Index data : " + i  + " ]");
                                    }
                                    dt[index_change] = typeof dt_ajax !== 'undefined' ? dt_ajax : "";
                                    
                                    indexs_td_change.push([index_change, dt_ajax]);
                                }
                                result.data[d] = indexs_td_change;
                            }
                            
                            new_data.push(dt);
                        }
                    }
                }
                else
                {
                    console.error("Ops, your data is NULL");
                }
            }
        }
        
        if(this.dt_search.length === 0) this.dt_all    = new_data;
        else                            this.dt_search = new_data;
        return result;
    }

    table.prototype.isTheadFixed = function ()
    {
        return this.theadFixed;
    }

    table.prototype.getArrayInfo = function (data)
    {
        this.array_info = data;
        return this;
    };

    table.prototype.getTheadFixed = function (data)
    {
        this.theadFixed = data;
        return this;
    };

    table.prototype.getHiddenIndex = function (data) 
    {
        this.hidden_index = data;
        return this;
    };

    table.prototype.getTheadFixedTop = function (data) 
    {
        this.dt_theadFixedTop = data;
        return this;
    };

    // mendapatkan aksi button
    table.prototype.getAction  = function (data)
    {
        this.action            = data;
        return this;
    };
    // mendapatkan data hasil ajax
    table.prototype.getAllData  = function(data)
    {
        this.dt_all = data;
        return this;
    };

    table.prototype.isHidden = function (td) 
    {
        var hidden = this.hidden_index;
        if(hidden === null) return false;
        return (hidden.indexOf(td) !== -1) ? true : false;
    };

    // mengubah value setiap object ke bentuk array
    table.prototype.dataToArray     = function (obj)
    {
        var arr = new Array();
        for (key in obj) {
            if (obj.hasOwnProperty(key)) arr.push(obj[key]);
        }
        return arr;
    };

    // mendapatkan  namasetiap thead
    table.prototype.getThead = function (thead)
    {
        this.dt_thead = thead;
        return this;
    };
    var tb = new table();

}));