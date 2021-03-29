(function (a, b) {
    
    var kalender = function() {
        var _d = 'days',
            _m = 'months',
            _f = 'format',
            _t = 'time',
            _h = 'hour',
            _mi = 'min',
            _se = 'sec',
            _fmt = {
                a: ['yyyy-mm-dd', 'mm-dd-yyyy', 'dd-mm-yyyy'],
                b: ['yyyy/mm/dd', 'mm/dd/yyyy', 'dd/mm/yyyy']
            },
            _yr = 'year_range';
        this._d = _d;
        this._m = _m;
        this._f = _f;
        this._t = _t;
        this._h = _h;
        this._mi = _mi;
        this._fmt = _fmt;
        this._se = _se;
        this._yr = _yr;
        this.cho = '';
        this._cur_elem;
        this.xxx = this.y1;
    }

    kalender.prototype = {

        //mendapatkan element DOM
        dom: function(e) {
            this.elem = document.querySelectorAll(e);
            return this;
        },

        //validasi data object
        data: function(obj) {
            if (Object.keys(obj).length > 0) {
                for (var key in obj) {
                    if (!obj.hasOwnProperty(key)) continue;
                    var o = obj[key];
                    key = key.toLowerCase();

                    //hari
                    (key === this._d && Object.keys(o).length === 7) ? this._days = o : kalender.gDays();

                    //bulan
                    (key === this._m && Object.keys(o).length === 12) ? this._month = o : kalender.gMonth();

                    //format tanggal
                    (key === this._f) ? kalender.cFormat(o) : kalender.gFormat();

                    //jarak tahun
                    (key === this._yr) ? kalender.cRange(o) : kalender.gRangeYear();

                    //waktu
                    (key === this._t) ? kalender.cTime(o) : kalender.gTime();

                    //warna
                    if(key === this._color) kalender.cColor(o) ;
                }
                return this;
            }
        },


        cFormat: function (f) {
            
            //mendapatkan format tanggal sesuai dengan pada variable function
            var a = this._fmt.a,
                b = this._fmt.b,
                fm = f.toString().toLowerCase(),
                ia = a.indexOf(fm),
                ib = b.indexOf(fm),
                type, format, bool = false;
            
            //jika parameter f (format) ada di dalam index (array) format a ataupun b
            
            //format tipe a
            if (ia != -1) {
                this._format_type = 'a';
                this._format = fm;
                bool = true;
            }
            
            //format tipe b
            if (ib != -1) {
                this._format_type = 'b';
                this._format = fm;
                bool = true;
            }

            //jika format yang dimasukkan tidak sesuai maka akan di atur default
            if (!bool) {
                this._format_type = 'a';
                this._format = 'yyyy-mm-dd';
            }

            return this;
        },

        //check perubahan pada function onclick
        cChange: function(year, month) {
            year = year === null ? this._tahun : year;
            month = month === null ? this._bulan : month;

            //set bahwa terjadi perubahan
            this._change = true;

            //menyesuaikan data tanggal
            var dt = new Date(year, month + 1, 0),
                days = [],
                date = [],
                x = 0;
            
            //mendapatkan hari (1-6)
            for (i = 1; i <= dt.getDate(); i++) {
                date.push(x);
                days.push(i);
                if (x == 6) x = 0;
                x++;
            }

            // hari dalam tanggal (1-6)
            this._hari = days;

            //mendapatkan tanggal hari
            this._date_ = dt.getDate();

            // hari dalam tanggal (1-30)
            this._day_ = date;

            // mendapatkan bulan
            this._bulan = dt.getMonth();

            // mendapatkan tahun
            this._tahun = dt.getFullYear();

            return [this, kalender.setElement(true)];
        },

        //check warna
        cColor: function(obj) {
            if (typeof obj !== 'undefined') { 
                if (Object.keys(obj).length > 0) { 
                    for (var key in obj) {
                        if (!obj.hasOwnProperty(key)) continue;
                        var o = obj[key];

                        key = key.toLowerCase();

                        value = o.trim();

                        //check warna background header
                        this._set_bg_header = (key === this._bg_header && value.length > 0 && kalender.vColor(value)) ? o : null;
                    }
                }    
            }    
        },

        //check perubahan pada onclick
        change: function() {
            return this._change;
        },

        //input type range
        cInput: function(e) {
            var attr = e.getAttribute('data-name'),
                dom = document.querySelector('.kalender.arjunane-kalender .time .value #time-kalender');
            
            //menyesuaikan sesuai dengan attribute data-name
            if (attr === this._h) this._hour = e.value < 10 ? '0' + e.value : e.value;
            if (attr === this._mi) this._min = e.value < 10 ? '0' + e.value : e.value;
            if (attr === this._se) this._sec = e.value < 10 ? '0' + e.value : e.value;
            dom.innerHTML = this._hour + " : " + this._min + " : " + this._sec;
            return [this._hour, this._min, this._sec];
        },
        //check range year
        cRange: function (x) {
            var n = x.split(':'),
                y1, y2;
            
            //jika hasil pemisahan (split) lebih dari satu (terjadi split)
            if (n.length > 1) {
                y1 = kalender.vYear(n[0]) ? n[0] : this._bulan;
                y2 = kalender.vYear(n[1]) ? n[1] : this._bulan;
                this.y1 = y1;
                this.y2 = y2;
            } else {
                y1 = kalender.vYear(x.toString()) ? x.toString() : this._bulan;
                y2 = typeof this._tahun === 'undefined' ? new Date().getFullYear() : this._tahun;
                this.y1 = y1;
                this.y2 = y2;
            }
            return [this.y1, this.y2];
        },

        //validasi waktu, apakah bernilai FALSE atau TRUE
        cTime: function(x) {
            var bool = (typeof x === 'boolean') ? x : true;
            return this._time = bool;
        },

        //mendapatkan perubahan setelah onclick
        gChange: function() {
            return kalender.setElement(true);
        },

        //mendapatkan function hari
        gDays: function() {
            if (typeof this._days === 'undefined' || this._days === null)
                this._days = { 'Minggu': 'Ming', 'Senin': 'Sen', 'Selasa': 'Sel', 'Rabu': 'Rab', 'Kamis': 'Kam', "Jum'at": 'Jum', 'Sabtu': 'Sab' };
            return this._days;
        },

        //mendapatkan DOM Elementn setelah click
        gDom: function() {
            return this._cho;
        },
        gFormat: function () { 
            this._format_type = 'a';
            this._format = 'yyyy-mm-dd';
            return this;
        },

        //jika tidak terdapat range/jarak tahun
        gRangeYear: function () { 
            var date = new Date();
            this.y1 = date.getFullYear();
            this.y2 = date.getFullYear() + 1;
            return [this.y1, this.y2];
        },
        gTime: function() {
            return this._time;
        },
        //mendapatkan value input
        gInput: function() {
            var dt = this._cho.value;
            if (kalender.vDate(dt.toString())) return true;
            return false;
        },
        gMonth: function() {
            if (typeof this._month === 'undefined')
                this._month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            return this._month;
        },
        getOffset: function(e) {
            el = e;
            var widthX          = window.innerWidth,
                scrollY         = window.scrollY,
                height          = window.innerHeight,
                pos             = el.getBoundingClientRect(),
                width_scroll    = 17,
                calc_left       = pos.left + 300, 
                calc_top        = pos.top + 300,
                left            = calc_left > widthX ? (pos.left - width_scroll) - (calc_left - widthX) : pos.left,
                top             = calc_top > pos.top ? pos.top : pos.top + pos.height;
                
            return {
                left: left,
                top: top
            }
        },
        addClass: function(elem, selector) {
            elem = document.querySelector(elem);
            return elem.classList.add(selector);
        },
        removeClass: function(elem, selector) {
            elem = document.querySelector(elem);
            return elem.classList.remove(selector);
        },
        hasClass: function(elem, selector) {
            var elem = document.querySelector(elem),
                className = " " + selector + " ",
                bool = false;
            if ((" " + elem.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1) {
                bool = true;
            }
            return bool;
        },
        parseDOM: function(e) {
            var parser = new DOMParser();
            return parser.parseFromString(e, "body")
        },
        pInt: function(x) {
            var n = isNaN(parseInt(x)) ? 0 : parseInt(x);
            return n;
        },
        setNameMonth: function(index) {
            month = kalender.gMonth()[index];
            return month;
        },
        setKalender: function() {
            if (this._time) {
                t = this._cho.value.split(' '),
                    time = '';
                this._hour = '00';
                this._min = '00';
                this._sec = '00';
                if (t.length == 2) {
                    time = t[1];
                    var waktu = time.split(':');
                    if (waktu.length == 3) {
                        this._hour = waktu[0];
                        this._min = waktu[1];
                        this._sec = waktu[2];
                    } else if (waktu.length == 2) {
                        this._hour = waktu[0];
                        this._min = waktu[1];
                    }
                }
            }
            if (!kalender.gInput()) {
                var tgl = new Date(),
                    dt = new Date(tgl.getFullYear(), tgl.getMonth() + 1, 0),
                    days = [],
                    date = [],
                    x = 0;
                for (i = 1; i <= dt.getDate(); i++) {
                    date.push(x);
                    days.push(i);
                    if (x == 6) x = 0;
                    x++;
                }
                this._hari = days;
                this._hari_ini = tgl.getDate();
                this._bulan_ini = tgl.getMonth();
                this._tahun_ini = tgl.getFullYear();
                this._curr_hari = tgl.getDate();
                this._date_ = dt.getDate();
                this._day_ = date;
                this._bulan = dt.getMonth();
                this._tahun = dt.getFullYear();
                this._curr_bulan = dt.getMonth();
                this._curr_tahun = dt.getFullYear();
                return this;
            } else {
                var val = this._cho.value,
                    tgl = new Date(),
                    d = new Date(val.toString()),
                    dt = new Date(d.getFullYear(), d.getMonth() + 1, 0),
                    days = [],
                    date = [],
                    x = 0;
                for (i = 1; i <= dt.getDate(); i++) {
                    days.push(i);
                }
                for (i = 1; i <= dt.getDay(); i++) {
                    date.push(x);
                    if (x == 6) x = 0;
                    x++;
                }
                this._hari = days;
                this._hari_ini = tgl.getDate();
                this._bulan_ini = tgl.getMonth();
                this._tahun_ini = tgl.getFullYear();
                this._curr_hari = d.getDate();
                this._date_ = d.getDate();
                this._day_ = date;
                this._bulan = d.getMonth();
                this._tahun = d.getFullYear();
                this._curr_bulan = d.getMonth();
                this._curr_tahun = d.getFullYear();
                return this;
            }
        },
        gSubDay: function() {
            var i = [];
            Object.entries(this._days).forEach(([index, val]) => {
                i.push(index);
            });
            return i;
        },
        setSubDate: function() {
            var day = "",
                i = 0,
                aktif = '';
            Object.entries(this._days).forEach(([index, val]) => {
                aktif = i == 0 ? ' week' : '';
                day += '<div class="date' + aktif + '" title="' + index + '"><span>' + val + '</span></div>';
                i++;
            });
            return day;
        },
        setSubDay: function() {
            var day = new Date(this._tahun, this._bulan),
                d = '',
                aktif = '',
                week = '',
                today,
                x = day.getDay();
            x = x == 0 ? 1 : x;
            for (i = 0; i < x; i++) {
                d += '<div class="d"></span></span></div>';
            }
            for (i = 1; i <= this._hari.length; i++) {
                aktif = (i == this._curr_hari && this._bulan == this._curr_bulan && this._curr_tahun == this._tahun) ? ' aktif' : '';
                today = (i == this._hari_ini && this._bulan == this._bulan_ini && this._tahun == this._tahun_ini) ? ' today' : '';
                week = x == 0 ? ' week' : '';
                d += '<div onclick="kalender.setValue(' + i + ')" class="d true' + aktif + week + today + '" title="Hari ' + kalender.gSubDay()[x] + '"></span>' + i + '</span></div>';
                if (x == 6) x = -1;
                x++
            }
            return d;
        },
        setSubYear: function() {
            var y1 = this.y1,
                y2 = this.y2,
                m = "",
                parent = '<div class="sub-content kalender-sm-year" style="left:125px;top:40px;">',
                close_parent = '</div>',
                bulan = "",
                aktif = "";
            for (i = y2; i >= y1; i--) {
                aktif = i == this._tahun ? ' aktif' : '';
                x = '<div onclick="kalender.cChange(' + i + ',null)" class="sc' + aktif + '" data-index="' + i + '" title="Tahun ' + i + '" data-name="' + i + '"><span>' + i + '</span></div>';
                m += x;
            }
            bulan = parent + m + close_parent;
            return bulan;
        },
        setSubMonth: function() {
            var month = this._month,
                m = "",
                parent = '<div class="sub-content kalender-sm-month" style="left:35px;top:40px;">',
                close_parent = '</div>',
                bulan = "",
                aktif = "";
            for (i = 0; i < month.length; i++) {
                i == this._bulan ? aktif = ' aktif' : aktif = '';
                var name = month[i],
                    x = '<div onclick="kalender.cChange(' + this._tahun + ',' + i + ')" class="sc' + aktif + '" data-index="' + i + '" title="' + name + '" data-name="' + name + '"><span>' + name + '</span></div>';
                m += x;
            }
            bulan = parent + m + close_parent;
            return bulan;
        },
        setSubTime: function() {
            var h = this._hour,
                m = this._min,
                s = this._sec,
                time = h + " : " + m + " : " + s;
            var parent = '<div class="time">' +
                '<div class="value"><span>Waktu : </span><span id="time-kalender">' + time + '</span></div>' +
                '<div class="input"><span>Jam</span>: <input data-name="hour" oninput="kalender.cInput(this)" value="' + h + '" type="range" min="0" max="23"></div>' +
                '<div class="input"><span>Menit</span>: <input data-name="min" oninput="kalender.cInput(this)" value="' + m + '" type="range" min="0" max="59"></div>' +
                '<div class="input"><span>Detik</span>: <input data-name="sec" oninput="kalender.cInput(this)" value="' + s + '" type="range" min="0" max="59"></div>' +
                '</div>';
            return parent;
        },
        setElemTitle: function() {
            var bulan_prev = this._bulan - 1,
                bulan_next = this._bulan + 1,
                tahun_prev = this._tahun;
            tahun_next = this._tahun;
            if (bulan_prev < 0) {
                tahun_prev = this._tahun - 1;
                bulan_prev = 11;
            }
            if (bulan_next > 11) {
                tahun_next = this._tahun + 1;
                bulan_next = 0;
            }

            var bg_header, header, color_header;

            //HEADER
            bg_header = (this._set_bg_header !== null) ? 'background:' + this._set_bg_header + ';' : null;
            color_header = (this._set_color_header !== null) ? 'color:' + this._set_color_header + ';' : null;
            header = (bg_header !== null || color_header !== null) ? 'style="' + bg_header + color_header + '"' : "";



            var a = '<div ' + header + ' class="title"><div onclick="kalender.cChange(' + tahun_prev + ',' + bulan_prev + ')"  class="left previous"></div>',
                b = '<div class="month" onclick="kalender.showMonth()" title="' + kalender.setNameMonth(this._bulan) + '"><span>' + kalender.setNameMonth(this._bulan) + '</span></div>' + kalender.setSubMonth(),
                c = '<div class="year" onclick="kalender.showYear()" title="' + this._tahun + '"><span>' + this._tahun + '</span></div>' + kalender.setSubYear(),
                d = '<div onclick="kalender.cChange(' + tahun_next + ',' + bulan_next + ')" class="right next"></div></div>',
                merge = a.concat(b, c, d);
            return merge;
        },
        setElemBody: function () {
            var body = '<div class="body"><div class="day">' + kalender.setSubDate() + '</div><div class="day">' + kalender.setSubDay() + '</div>';
            if (kalender.gTime()) body += kalender.setSubTime();
            body += '</div>';
            return body;
        },
        setDom: function(x) {
            return this._cho = x;
        },
        setElement: function(x) {
            var d = x !== undefined ? true : false;
            var c = document.querySelector('.kalender.arjunane-kalender');
            if (!d) {
                if (c !== null) c.parentNode.removeChild(c);
                var dom = document.createElement('div'),
                    elem = this._cho,
                    height = elem.offsetHeight,
                    width = elem.offsetWidth / 2;
                dom.className = 'kalender arjunane-kalender';
                dom.id = 'arjunane-kalender';
                var offset = kalender.getOffset(elem);
                dom.style.left = (offset.left) + 'px';
                dom.style.top = (offset.top) + 'px';
                dom.innerHTML = kalender.setElemTitle();
                dom.innerHTML += kalender.setElemBody();
                document.body.appendChild(dom);
            } else {
                dom = document.querySelector('.kalender.arjunane-kalender');
                dom.innerHTML = kalender.setElemTitle();
                dom.innerHTML += kalender.setElemBody();
                document.body.appendChild(dom);
            }
        },
        setValue: function (d) {
            var el = this._cho,
                b, dy,
                year = parseInt(this._tahun),
                month = parseInt(this._bulan),
                hari = d,
                jam = parseInt(this._hour),
                menit = parseInt(this._min),
                detik = parseInt(this._sec),
                doc = document.querySelector('.kalender.arjunane-kalender');
            if (typeof d === 'undefined') {
                doc.parentNode.removeChild(doc);
                return false;
            }
            
            if (this._time) {
                if (month == 0 || month < 10) b = '0' + (month + 1);
                dy = hari < 10 && hari > 0 ? '0' + hari : hari;
                if (hari == 0) dy = '00';
                var date = year + '-' + b + '-' + dy,
                    hour = jam < 10 && jam > 0 ? '0' + jam : jam,
                    min = menit < 10 && menit > 0 ? '0' + menit : menit,
                    sec = detik < 10 && detik > 0 ? '0' + detik : detik;
                if (hour > 23) hour = 23;
                if (min > 59) min = 59;
                if (sec > 59) sec = 59;
                if (hour == 0) hour = '00';
                if (min == 0) min = '00';
                if (sec == 0) sec = '00';
                var time = hour + ":" + min + ":" + sec;
                console.log("bulan : " + parseInt(b));
                doc.parentNode.removeChild(doc);
                return [el.value = date + ' ' + time ];
            } else {
                if (month === 0 || month <= 10) b = '0' + (month + 1);
                dy = hari < 10 && hari > 0 ? '0' + hari : hari;
                var date = year + '-' + b + '-' + dy;
                doc.parentNode.removeChild(doc);
                return el.value = date;
            }
        },
        showMonth: function() {
            elem = '.kalender-sm-month', month = '.kalender .title .month', year = '.kalender .title .year', y = '.kalender .kalender-sm-year';
            if (kalender.hasClass(year, 'aktif')) {
                kalender.removeClass(year, 'aktif');
                kalender.removeClass(y, 'aktif');
            }
            if (kalender.hasClass(elem, 'aktif')) {
                kalender.removeClass(elem, 'aktif');
                kalender.removeClass(month, 'aktif');
            } else {
                kalender.addClass(elem, 'aktif');
                kalender.addClass(month, 'aktif');
            }
        },
        showYear: function() {
            elem = '.kalender-sm-year', month = '.kalender .title .month', year = '.kalender .title .year', m = '.kalender .kalender-sm-month';
            if (kalender.hasClass(month, 'aktif')) {
                kalender.removeClass(month, 'aktif');
                kalender.removeClass(m, 'aktif');
            }
            if (kalender.hasClass(elem, 'aktif')) {
                kalender.removeClass(elem, 'aktif');
                kalender.removeClass(year, 'aktif');
            } else {
                kalender.addClass(elem, 'aktif');
                kalender.addClass(year, 'aktif');
            }
        },
        //Untuk validasi element, apakah element tipe Input atau Textarea;
        vElement: function() {
            c = this._cho.tagName.toString().toLowerCase();
            if (c === 'input' || c === 'textarea') return true;
        },
        vColor: function (x) { 

            //validasi panjang string apakah 6 atau 3
            var check = /(^#[0-9A-Fa-f]{6}$)|(^#[0-9A-Fa-f]{3}$)/i.test(x.toString());

            return check ? true : false;
        },
        vDate: function(x) {
            var date = new Date(x);
            return date.getTime() === date.getTime();
        },
        //Untuk validasi tahun, apakah tahun sama dengan 4;
        vYear: function(x) {
            var y = (x.length == 4 && kalender.pInt(x)) ? true : false;
            return y;
        },
        ex: function(obj) {
            for (var i = 0; i < this.elem.length; i++) {
                this.elem[i].addEventListener("click", function(x) {
                    if (kalender.vElement) {
                        //obj.call(this);
                        kalender.data(obj);
                        kalender.setDom(this);
                        kalender.setKalender();
                        kalender.setElement();
                        return this;
                    }
                }, false);
            }
        }
    }
    var kalender = new kalender(),
        che = false,
        g;
    a.kalender = kalender
    if (!!(window.addEventListener)) {
        window.addEventListener("DOMContentLoaded", execute);
    } else {
        window.attachEvent("onload", execute);
    }   
    function execute() {    
        document.body.addEventListener('click', function(x) {
            var doc = document.querySelectorAll('.kalender.arjunane-kalender *'),
                t = x.target,
                node = document.querySelector('#arjunane-kalender'),
                re = false;
            if (node !== null) {
                if (document.getElementById('arjunane-kalender').contains(t)) re = true;
                if (!re) kalender.setValue();
            }
        }, true);
    }
})(window);