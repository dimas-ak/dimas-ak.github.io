(function (window) {

    "use strict";

    var links       = document.getElementsByTagName("link"),
        isCSS_exist = false;

    if(links.length !== 0)
    {
        for(var l = 0; l < links.length; l++)
        {
            if(links[l].getAttribute("href") !== null && (links[l].getAttribute("href").indexOf("arjunane-syntax-highlight.min.css") !== -1 || links[l].getAttribute("href").indexOf("arjunane-syntax-highlight.css") !== -1)) isCSS_exist = true;
        }
    }
    
    if(!isCSS_exist)
    {
        var _path       = "";
        if(typeof document.currentScript === 'undefined')
        {
            for(var i = 0; i < document.scripts.length; i++)
            {
                if(document.scripts[i].src.indexOf("arjunane-syntax-highlight") !== -1) _path = document.scripts[i].src.split("/");
            }
        }
        else
        {
            _path       = document.currentScript.src.split("/");
        }
        var script      = document.createElement("link"),
            currentName = _path[_path.length -1].length,
            path        = _path.join("/").slice(0, -currentName);
            script.rel  = "stylesheet";
            script.href = path + "arjunane-syntax-highlight.min.css";
        document.head.appendChild(script);
    }

    var arjunaneSyntax = function () 
    {
        this.selector = null;
        this.version  = "v 1.0.0";
        this.developed_by = "Dimas Awang Kusuma || Arjunane Syntax";
        this.name = "Arjunane Syntax";
    }

    arjunaneSyntax.prototype.init =  function (selector, language) 
    {
        var _selector = document.querySelectorAll(selector);
        if(_selector === null || _selector.length === 0) throw new Error("Ops, cannot find element with '" + selector + "'");
        
        this.selector = _selector;
        this.setSyntax(language);
    }


    arjunaneSyntax.prototype.setSyntax = function (language) {
        
        for(var i = 0; i < this.selector.length; i++) 
        {
            var ini = this.selector[i];
            var html = "";
            ini.classList.add("syntax-highlight");
            
            switch(language.toLowerCase())
            {
                case "javascript" :
                    html = regexJavascript(ini.innerText);
                break;
                case "c#" :
                    html = regexCSharp(ini.innerText);
                break;
                case "dart" :
                    html = regexDart(ini.innerText);
                break;
                case "global" :
                    html = regexGlobal(ini.innerText);
                break;
            }
            var style = window.getComputedStyle(ini, null).getPropertyValue('font-size');
            var fontSize = parseFloat(style); 
            
            ini.innerHTML = setHTML(html, this.name, this.version, ini.innerHTML, fontSize);
        }
    }

    arjunaneSyntax.prototype.syntaxDart = function () {
        for(var i = 0; i < this.selector.length; i++) 
        {
            var ini = this.selector[i];
            ini.classList.add("syntax-highlight");
            ini.innerHTML = setHTML(regexDart(ini.innerText), this.developed_by, this.version);
        }
    }

    function setHTML(text, developed_by, version, txt, fontSize) 
    {
        var html = '';
        // var width = getMaxOfText(text) + (70 * fontSize);
        // console.log(width)
        html += '<a class="--arjunane-title">' + developed_by + ' (' + version + ')</a>';
        html += '<div class="--syntax-number">' + setNumberSyntax(text) + '</div>';
        html += '<div class="--syntax-container"><div class="--syntax-wrap"><div class="--syntax-inner">' + text + "</div></div></div>";
        return html;
    }

    function setNumberSyntax(text) 
    {
        var html = "";
        var length = text.split(/\r\n|\r|\n/).length;
        for(var i = 0; i < length; i++)
        {
            html += '<span>' + (i + 1) + '</span>';
        }
        return html;
    }

    function getMaxOfText(text) 
    {
        var split = text.split(/\r\n|\r|\n/g);
        
        var arr = new Array();
        for(var i = 0; i < split.length; i++)
        {
            //console.log(split[i].length + " = " + split[i]);
            arr.push(split[i].length)
        }
        return Math.max.apply(null, arr);
    }

    function regexJavascript(text) {

        var regexGreen      = /([^\s]+\w)(?=\=)|\b(?!for)(?!if)(?!while)[\w]+?(?=\()/g,
            regexRed        = /(<[a-z]+)|(<\/[a-z]+)|(&&)|(\|\|)|(\!)|(<)|(>)|(\+)|(\+\+)|(-)|(=)|(\*)|\b(\/)|(:)|(\?)|\b(if|else|for|new|return|typeof|break|default|import|export|extends|try|catch|continue)\b/g,
            regexYellow     = /``|`[\s\S\w]+?`|""|"[\s\S\w]+?"|''|'[\s\S\w]+?'/g,
            regexBlack      = /(?:[a-z]+:)?\/\/.*|(\/\*)[\s\S\W\w\d\D]+?(\*\/)/g,
            regexPurple     = /\b(?!\W)[\d.]+|\b((false)|(true)|(null))\b/g,
            regexOrange     = /\b(this|super)\b/g,
            regexBlue       = /\b(var|constructor|const|class|let|function|function\(| Array)\b/g;

        var matchBlack      = text.match(regexBlack);

        var tmpMatchs       = new Array(),
            indexTmpMatchs  = 0;

        if(matchBlack !== null)
        {
            setMatch(text, matchBlack, tmpMatchs, indexTmpMatchs, 'comment', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }

        var matchYellow     = text.match(regexYellow),
            matchGreen      = text.match(regexGreen),
            matchRed        = text.match(regexRed),
            matchPurple     = text.match(regexPurple),
            matchOrange     = text.match(regexOrange),
            matchBlue       = text.match(regexBlue);

        if(matchYellow !== null)
        {
            setMatch(text, matchYellow, tmpMatchs, indexTmpMatchs, 'yellow', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }
        
        if(matchBlue !== null)
        {
            setMatch(text, matchBlue, tmpMatchs, indexTmpMatchs, 'blue', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }

        if(matchGreen !== null)
        {
            setMatch(text, matchGreen, tmpMatchs, indexTmpMatchs, 'green', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }
        
        if(matchRed !== null)
        {
            setMatch(text, matchRed, tmpMatchs, indexTmpMatchs, 'red', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }
        
        if(matchOrange !== null)
        {
            setMatch(text, matchOrange, tmpMatchs, indexTmpMatchs, 'orange', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }
        
        if(matchPurple !== null)
        {
            var matchPurples = removeDuplicate(matchPurple);
            
            for(var key in matchPurples)
            {
                var match = matchPurples[key];
                var regexMatch = "\\b(?!_)" + match + "+(?!}|\\d)\\b|\\b(?!_)" + match + "\\b";
                
                //text = text.replace(new RegExp(escapeRegExp(match), 'g'), '<span class="--red">' + match + "</span>");
                text = text.replace(new RegExp(regexMatch, 'g'), '{__purple_' + indexTmpMatchs + "}");
                tmpMatchs.push(match);
                indexTmpMatchs++;
            }
        }
        
        var cleanTexts = text.match(/{__(yellow|green|red|comment|purple|blue|orange)_[\d]+}/g);
        
        if(cleanTexts !== null)
        {
            var removeDoubleCleanTexts = removeDuplicate(cleanTexts);
            
            for(var key in removeDoubleCleanTexts) 
            {
                var cleanText   = removeDoubleCleanTexts[key];
                var _replace    = cleanText.replace(/{|}/g, "");
                var cls         = _replace.replace(/_[\d]+/g, "").replace("__", "--");
                var number      = _replace.split("_")[3];

                var result      = "";
                var match       = tmpMatchs[parseInt(number)];
                var isHTMLtag   = match.match(/(<[a-z]+)|(<\/[a-z]+)/g);
                
                
                if(cls === "--red" && isHTMLtag !== null) 
                {
                    var tagName         = isHTMLtag[0].split(/<\/|</g)[1];
                    var tagOpenOrClose  = isHTMLtag[0].split(/[\w]+/g)[0].split("");

                    for(var tags in tagOpenOrClose)
                    {
                        var tag = tagOpenOrClose[tags];
                        result += '<span class="--white">' + tag + '</span>';
                    }
                    
                    result += '<span class="--red">'+ tagName +'</span>';
                }
                else 
                {
                    result = '<span class="' + cls + '">' + match + '</span>';
                }
                text = text.replace(new RegExp(cleanText, 'g'), result);
            }
        }


        return text;
    }

    function regexGlobal(text) 
    {
        var regexRed        = /(<[a-z]+)|(<\/[a-z]+)|(&&)|(\|\|)|(\!)|(<)|(>)|(\+)|(\+\+)|(-)|(=)|(\*)|\b(\/)|(:)|(\?)/g,
            regexBlack      = /(?:[a-z]+:)?\/\/.*|(\/\*)[\s\S\W\w\d\D]+?(\*\/)/g;

        var matchRed        = text.match(regexRed),
            matchBlack      = text.match(regexBlack);

        var tmpMatchs       = new Array(),
            indexTmpMatchs  = 0;

        if(matchBlack !== null)
        {
            setMatch(text, matchBlack, tmpMatchs, indexTmpMatchs, 'comment', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }
        
        if(matchRed !== null)
        {
            setMatch(text, matchRed, tmpMatchs, indexTmpMatchs, "red", function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }
        

        var cleanTexts = text.match(/{__(yellow|green|red|comment|purple|blue|orange)_[\d]+}/g);
        
        
        if(cleanTexts !== null)
        {
            var removeDoubleCleanTexts = removeDuplicate(cleanTexts);
            
            for(var key in removeDoubleCleanTexts) 
            {
                var cleanText   = removeDoubleCleanTexts[key];
                var _replace    = cleanText.replace(/{|}/g, "");
                var cls         = _replace.replace(/_[\d]+/g, "").replace("__", "--");
                var number      = _replace.split("_")[3];

                var result      = "";
                var match       = tmpMatchs[parseInt(number)];
                
                result = '<span class="' + cls + '">' + match + '</span>';
                
                text = text.replace(new RegExp(cleanText, 'g'), result);
            }
        }
        return text;
    }

    function regexDart(text) 
    {
        var regexGreen      = /([^\s]+\w)(?=\=)|\b(?!(?:\b(for|while|if)\b))[\w]+?(?=\(|<)/g,
            regexRed        = /(<[a-z]+)|(<\/[a-z]+)|(&&)|(\|\|)|(\!)|(<)|(>)|(\+)|(\+\+)|(-)|(=)|(\*)|\b(\/)|(:)|(\?)|\b(if|async|else|for|new|return|typeof|break|default|public|class|extends|string|final|static|import|throw|assert|try|catch|factory|await)\b|\b(is)\b/g,
            regexYellow     = /``|`[\s\S\w]+?`|""|"[\s\S\w]+?"|''|'[\s\S\w]+?'/g,
            regexBlack      = /(?:[a-z]+:)?\/\/.*|(\/\*)[\s\S\W\w\d\D]+?(\*\/)/g,
            regexPurple     = /\b(?!\W)[\d.]+|\b((false)|(true)|(null))\b/g,
            regexOrange     = /\b(this|super)\b/g,
            regexBlue       = /\b([A-Z][a-z]*)+?(?=\()|\b([A-Z][a-z]*)+\b|\b[_]([A-Z][a-z]*)+\b|void|bool|double|dynamic|var|int|(function|function\()\b|(\@override)|(\@protected)|(\@mustCallSuper)|(\@required)/g;

        var matchGreen      = text.match(regexGreen),
            matchRed        = text.match(regexRed),
            matchBlack      = text.match(regexBlack),
            matchYellow     = text.match(regexYellow),
            matchPurple     = text.match(regexPurple),
            matchOrange     = text.match(regexOrange),
            matchBlue       = text.match(regexBlue);

        var tmpMatchs       = new Array(),
            indexTmpMatchs  = 0;

        if(matchBlack !== null)
        {
            setMatch(text, matchBlack, tmpMatchs, indexTmpMatchs, 'comment', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }

        if(matchYellow !== null)
        {
            setMatch(text, matchYellow, tmpMatchs, indexTmpMatchs, 'yellow', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }

        if(matchOrange !== null)
        {
            setMatch(text, matchOrange, tmpMatchs, indexTmpMatchs, 'orange', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }

        if(matchBlue !== null)
        {
            setMatch(text, matchBlue, tmpMatchs, indexTmpMatchs, 'blue', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, false, function(match, regex, cls) {
                if(cls === 'blue' && ( match === "@required" || match === "@override" || match === "@protected" || match === "@mustCallSuper")) 
                {
                    regex = match;
                }
                return regex;
            });
        }

        if(matchPurple !== null)
        {
            setMatch(text, matchPurple, tmpMatchs, indexTmpMatchs, 'purple', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }

        if(matchGreen !== null)
        {
            setMatch(text, matchGreen, tmpMatchs, indexTmpMatchs, 'green', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }
        
        if(matchRed !== null)
        {
            setMatch(text, matchRed, tmpMatchs, indexTmpMatchs, "red", function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true, function(match, regex, cls) {
                if(match === 'is') 
                {
                    regex = "\\b"+ match + "\\b";
                }
                return regex;
            });
        }

        var cleanTexts = text.match(/{__(yellow|green|red|comment|purple|blue|orange)_[\d]+}/g);
        
        if(cleanTexts !== null)
        {
            var removeDoubleCleanTexts = removeDuplicate(cleanTexts);
            
            for(var key in removeDoubleCleanTexts) 
            {
                var cleanText   = removeDoubleCleanTexts[key];
                var _replace    = cleanText.replace(/{|}/g, "");
                var cls         = _replace.replace(/_[\d]+/g, "").replace("__", "--");
                var number      = _replace.split("_")[3];

                var result      = "";
                var match       = tmpMatchs[parseInt(number)];
                
                result = '<span class="' + cls + '">' + match + '</span>';
                
                text = text.replace(new RegExp(cleanText, 'g'), result);
            }
        }

        var _variableInStrings = text.match(/(?:\$)([\w\d])+|\${([\w\d]).+?(?=})/g);

        if(_variableInStrings !== null) 
        {
            var variableInStrings = removeDuplicate(_variableInStrings);
            for(var key in variableInStrings)
            {
                var match = variableInStrings[key];
                var newData = match.replace(/([\w\d]).+/g, '<span class="--orange">' + match.match(/([\w\d]).+/g)[0] + '</span>');
                
                text = text.replace(match, newData );
            }
        }
        return text;
    }

    function regexCSharp(text) 
    {
        var regexGreen      = /([^\s]+\w)(?=\=)|\b(?!for)(?!if)(?!while)[\w]+?(?=\()/g,
            regexRed        = /(<[a-z]+)|(<\/[a-z]+)|(&&)|(\|\|)|(\!)|(<)|(>)|(\+)|(\+\+)|(-)|(=)|(\*)|\b(\/)|(:)|(\?)|\b(if|else|for|new|return|typeof|break|default|using|public|class|extends|int|string|float|namespace|void|private|protected|foreach|in|bool|partial|readonly|override|try|catch)\b/g,
            regexYellow     = /``|`[\s\S\w]+?`|""|"[\s\S\w]+?"|''|'[\s\S\w]+?'/g,
            regexBlack      = /(?:[a-z]+:)?\/\/.*|(\/\*)[\s\S\W\w\d\D]+?(\*\/)/g,
            regexPurple     = /\b(?!\W)[\d.]+|\b((false)|(true)|(null))\b/g,
            regexOrange     = /\b(this|super)\b/g,
            regexBlue       = /\b(?!new )([A-Z][a-z0-9_]*)+(?!\()\b|\b(var)\b|(function|function\()\b/g;

        var matchGreen      = text.match(regexGreen),
            matchRed        = text.match(regexRed),
            matchBlack      = text.match(regexBlack),
            matchYellow     = text.match(regexYellow),
            matchPurple     = text.match(regexPurple),
            matchOrange     = text.match(regexOrange),
            matchBlue       = text.match(regexBlue);

        var tmpMatchs       = new Array(),
            indexTmpMatchs  = 0;

        if(matchBlack !== null)
        {
            setMatch(text, matchBlack, tmpMatchs, indexTmpMatchs, 'comment', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }

        if(matchYellow !== null)
        {
            setMatch(text, matchYellow, tmpMatchs, indexTmpMatchs, 'yellow', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }

        if(matchBlue !== null)
        {
            setMatch(text, matchBlue, tmpMatchs, indexTmpMatchs, 'blue', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }

        if(matchPurple !== null)
        {
            setMatch(text, matchPurple, tmpMatchs, indexTmpMatchs, 'purple', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }

        if(matchGreen !== null)
        {
            setMatch(text, matchGreen, tmpMatchs, indexTmpMatchs, 'green', function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            });
        }
        
        if(matchRed !== null)
        {
            setMatch(text, matchRed, tmpMatchs, indexTmpMatchs, "red", function (data) {
                text = data.text;
                tmpMatchs = data.tmpMatchs;
                indexTmpMatchs = data.indexTmpMatchs;
            }, true);
        }

        var cleanTexts = text.match(/{__(yellow|green|red|comment|purple|blue|orange)_[\d]+}/g);
        
        
        if(cleanTexts !== null)
        {
            var removeDoubleCleanTexts = removeDuplicate(cleanTexts);
            
            for(var key in removeDoubleCleanTexts) 
            {
                var cleanText   = removeDoubleCleanTexts[key];
                var _replace    = cleanText.replace(/{|}/g, "");
                var cls         = _replace.replace(/_[\d]+/g, "").replace("__", "--");
                var number      = _replace.split("_")[3];

                var result      = "";
                var match       = tmpMatchs[parseInt(number)];
                
                result = '<span class="' + cls + '">' + match + '</span>';
                
                text = text.replace(new RegExp(cleanText, 'g'), result);
            }
        }
        return text;
    }

    function setMatch(text, _matchs, tmpMatchs, indexTmpMatchs, cls, callback, isEscape, callbackOverrideRegex)
    {
        var resultCallback = {};
        var matchs = removeDuplicate(_matchs);
        matchs.sort(function(a, b){
            // ASC  -> a.length - b.length
            // DESC -> b.length - a.length
            return b.length - a.length;
        });
        
        for(var key in matchs)
        {
            var match = matchs[key];
            
            if(cls === 'comment' && match.match(/^(?:[a-z]+:)\/\/.*/g) !== null)
            { 
                continue;
            }
            var escapeFirst = match === "+" || match === "?" || match === "@"  || match === "*" ? "\\" + match : match;
            var regex = typeof isEscape !== 'undefined' && isEscape ? escapeRegExp(match) : "\\b" + escapeFirst + "\\b";

            if(typeof callbackOverrideRegex !== 'undefined') regex = callbackOverrideRegex(match, regex, cls);
            
            text = text.replace(new RegExp(regex, 'g'), '{__' + cls + '_' + indexTmpMatchs + "}");
            tmpMatchs.push(match);
            indexTmpMatchs++;
        }

        resultCallback['text'] = text; 
        resultCallback['tmpMatchs'] = tmpMatchs; 
        resultCallback['indexTmpMatchs'] = indexTmpMatchs; 
        
        return callback(resultCallback);
    }

    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    function foreach(arr, callback) {
        for(var i = 0; i < arr.length; i++) 
        {
            callback(arr[i], i);
        }
    }

    function getText(span, color)
    {
        var result = span.replace("####"+ color+ "####", '<span class="--' + color + '">');
        result = result.replace("####close####", "</span>");
        return result;
    }

    function removeDuplicate(arr) {
        var seen = {};
        var ret_arr = [];
        for (var i = 0; i < arr.length; i++) {
            if (!(arr[i] in seen)) {
                ret_arr.push(arr[i]);
                seen[arr[i]] = true;
            }
        }
        return ret_arr;
    
    }

    window.arSyntax = new arjunaneSyntax;

})(window);