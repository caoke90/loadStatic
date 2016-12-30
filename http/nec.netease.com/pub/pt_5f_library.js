I$(11,
    function() {
        function e() {
            t();
            p();
            window.onresize = s;
            s();
            $();
            b()
        }
        function t() {
            w._$addEvent("run", "click", n);
            w._$addEvent("reset", "click", i);
            w._$addEvent("togglev", "mousedown",
                function(e) {
                    D = "vertical";
                    a(e)
                });
            w._$addEvent("togglev", "drag",
                function(e) {
                    D = "vertical";
                    a(e)
                });
            w._$addEvent("toolbar", "dblclick",
                function(e) {
                    D = "vertical";
                    l(e)
                });
            w._$addEvent("toggleh", "mousedown",
                function(e) {
                    D = "horizontal";
                    a(e)
                });
            w._$addEvent("toggleh", "drag",
                function(e) {
                    D = "horizontal";
                    a(e)
                });
            w._$addEvent("toggleh", "dblclick",
                function(e) {
                    D = "horizontal";
                    l(e)
                })
        }
        function n(e) {
            m()
        }
        function i() {
            d();
            h();
            m()
        }
        function a(e) {
            r();
            w._$addEvent(document, "mousemove", _);
            w._$addEvent(document, "touchmove", _);
            w._$addEvent(document, "mouseup", u);
            w._$addEvent(document, "touchend", u)
        }
        function r() {
            var e = E._$get("mask");
            if (!e) {
                e = document.createElement("div");
                e.id = "mask";
                E._$addClassName(e, "m-mask");
                document.body.appendChild(e)
            }
            e.style.display = ""
        }
        function o() {
            var e = E._$get("mask");
            if (e) e.style.display = "none"
        }
        function s() {
            if (navigator.appVersion.indexOf("MSIE 6") != -1) {
                var e = E._$get("code").offsetHeight;
                E._$get("htmlSrc").style.height = e + "px";
                E._$get("cssSrc").style.height = e + "px"
            }
        }
        function l(e) {
            if ("vertical" == D) if ("0%" != E._$get("code").style.height) {
                E._$get("code").style.height = "0%";
                E._$get("preview").style.height = "99.99%"
            } else {
                E._$get("code").style.height = "";
                E._$get("preview").style.height = ""
            } else {
                E._$get("htmlCode").style.width = "";
                E._$get("cssCode").style.width = "";
                E._$get("cssCode").style.left = "";
                E._$get("toggleh").style.left = ""
            }
        }
        function _(e) {
            var t = c(e),
                n = document.documentElement || document.body,
                i = E._$get("code");
            if ("vertical" == D) {
                var a = 0,
                    r = E._$get("workspace"),
                    o = E._$get("preview"),
                    l = document.getElementById("toolbar");
                var _ = t.y - r.offsetTop,
                    u = r.offsetHeight - a;
                _ = _ < a ? a: _;
                _ = _ > u ? u: _;
                var f = _ / r.offsetHeight * 100;
                o.style.height = f + "%";
                i.style.height = 99.99 - f + "%";
                s()
            } else {
                var d = 100,
                    h = E._$get("htmlCode"),
                    p = E._$get("cssCode"),
                    v = E._$get("toggleh");
                var g = h.offsetLeft,
                    m = p.offsetLeft - v.offsetLeft,
                    $ = t.x - h.offsetLeft,
                    b = i.offsetWidth - d - g - m;
                $ = $ < d ? d: $;
                $ = $ > b ? b: $;
                h.style.width = $ + "px";
                var y = $ + g,
                    x = y + m,
                    w = i.offsetWidth - x;
                v.style.left = y + "px";
                p.style.left = x + "px";
                p.style.width = w + "px"
            }
            E._$addClassName(document.body, "f-usn")
        }
        function c(e) {
            if (e.pageX) return {
                x: e.pageX,
                y: e.pageY
            };
            else return {
                x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: e.clientY + document.body.scrollTop - document.body.clientTop
            }
        }
        function u(e) {
            o();
            f();
            E._$delClassName(document.body, "f-usn");
            w._$delEvent(document, "mousemove", _);
            w._$delEvent(document, "touchmove", _);
            w._$delEvent(document, "mouseup", u);
            w._$delEvent(document, "touchend", u)
        }
        function f() {
            w._$clearEvent(document, "mousemove");
            w._$clearEvent(document, "mousemup")
        }
        function d() {
            E._$get("htmlSrc").value = L
        }
        function h() {
            E._$get("cssSrc").value = M
        }
        function p() {
            S = k(window.library);
            O = new C._$$Combo(m);
            O._$add();
            x._$request(S.htmlsrc, {
                onload: v
            });
            O._$add();
            x._$request(S.csssrc, {
                onload: g
            })
        }
        function v(e) {
            var t = e.match(/([\s\S]*<body>\s*)([\s\S]*)(\s*<\/body>[\s\S]*)/);
            H = t[1].replace('<link rel="stylesheet" type="text/css" href="style.css"/>', "");
            L = t[2];
            I = t[3];
            var n = /framework\/([^\.]+)\.css/g;
            for (; _arr3 = n.exec(H);) if (_arr3[1]) {
                J = J || [];
                J.push(_arr3[1])
            }
            var i = /dfs\/([^\.]+)\/style\.css/g;
            for (; _arr4 = i.exec(H);) if (_arr4[1]) {
                J = J || [];
                J.push(_arr4[1])
            }
            if (J && J.length) {
                var a = [];
                for (var r = 0,
                         o; o = J[r]; r++) if (/\d{6}\/\d{1}/.test(o)) a.push('<a target="_blank" href="/library/' + o + '">' + o.split("/")[0] + "</a>");
                else a.push('<a target="_blank" href="/framework/css-' + o + '.html">' + o + "</a>");
                E._$get("introduction").innerHTML += "，依赖于" + a.join("、") + "。"
            }
            d();
            O._$finishOne()
        }
        function g(e) {
            M = e;
            h();
            O._$finishOne()
        }
        function m() {
            var e = E._$get("cssSrc").value,
                t = E._$get("htmlSrc").value;
            e = e.replace(/url\(([^\)]+)\)/g,
                function(e, t) {
                    if (t.indexOf("/") == -1) return "url(/dfs/" + S.name + "/" + version + "/" + t + ")";
                    else return e
                });
            var n = E._$get("previewIframe").contentWindow.document;
            n.open();
            n.write(H + t + I);
            n.close();
            var i = n.createElement("style");
            e = "html{_overflow-y:scroll;}" + e;
            var a = document.createTextNode(e);
            i.type = "text/css";
            var r = n.getElementsByTagName("head")[0].getElementsByTagName("style")[0];
            if (r) n.getElementsByTagName("head")[0].insertBefore(i, r);
            else n.getElementsByTagName("head")[0].appendChild(i);
            if (i.styleSheet) i.styleSheet.cssText = a.nodeValue;
            else i.appendChild(a)
        }
        function $() {
            var e = libraryList.length;
            var t = "";
            if (e > 1) {
                var n = E._$get("more");
                var i = E._$get("list");
                for (var a = 0; a < e; a++) if (libraryList[a].name != S.name) t += '<a href="/library/' + libraryList[a].name + '"><b>' + libraryList[a].title + "</b></a>";
                i.innerHTML = t;
                n.className = "more";
                n.onclick = function(e) {
                    if (e && e.stopPropagation) e.stopPropagation();
                    else window.event.cancelBubble = !0;
                    if ("none" == i.style.display) i.style.display = "";
                    else i.style.display = "none"
                };
                document.body.onclick = function() {
                    i.style.display = "none"
                }
            }
        }
        function b() {
            if (3 == version) {
                var e = function() {
                    var e = document.createElement("div"),
                        t = "webkit,moz,ms,o".split(","),
                        n = t.length;
                    return function(i) {
                        if (i in e.style) return ! 0;
                        _pt = i.replace(/^[a-z]/,
                            function(e) {
                                return e.toUpperCase()
                            });
                        for (; n--;) if (t[n] + _pt in e.style) return ! 0;
                        return ! 1
                    }
                } ();
                if (!e("animation")) {
                    var t = document.createElement("span");
                    t.className = "warm";
                    t.innerText = "您的浏览器可能看不到正确效果";
                    E._$get("js-tlt").appendChild(t)
                }
            }
        }
        var y = NEJ.P("nej.p"),
            E = NEJ.P("nej.e"),
            x = NEJ.P("nej.j"),
            w = NEJ.P("nej.v"),
            N = NEJ.P("nej.u"),
            j = NEJ.P("nej.ui"),
            C = NEJ.P("nec.g"),
            k = window.parseLibrary,
            T = "/dfs",
            S,
            H,
            L,
            I,
            J,
            M,
            O,
            A,
            P,
            D;
        e()
    },
    2, 10, 5, 8);