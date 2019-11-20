/*
 * @Author: yanglinylin.yang 
 * @Date: 2019-11-20 16:30:59 
 * @Last Modified by: yanglinylin.yang
 * @Last Modified time: 2019-11-20 16:46:24
 */

const request = {
    ajax: function(options) {
        options = options || {};
        options.type = (options.type || 'GET').toUpperCase();
        options.dataType = options.dataType || 'json';

        let xhr, timer, params = options.data;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = ActiveXObject('Microsoft.XMLHTTP');
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                let status = xhr.status;
                if (status >= 200 && status < 300) {
                    timer && clearTimeout(timer);
                    options.success && options.success(xhr.responseText, xhr);
                } else {
                    timer && clearTimeout(timer);
                    options.error && options.error(status);
                }
            }
        }
        if (options.type === 'GET') {
            params = formatParams(options.data);
            xhr.open('GET', options.url + '?' + params, true);
            xhr.withCredentials = true;
            xhr.send(null);
        } else if (options.type === 'POST') {
            xhr.open('POST', options.url, true);
            // xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            // xhr.withCredentials = true;
            xhr.send(JSON.stringify(params));
        }
        if (options.time) {
            timer = setTimeout(function() {
                xhr.abort();
                options.error && options.err({message: 'timeout'});
            }, options.time);
        }
    },
    jsonp: function(options) {
        options = options || {};
        if (!options.url || !options.callback) {
            throw new Error('error')
        }
        let callbackName = ('jsonp_' + Math.random()).replace('.', '');
        let oHead = document.getElementsByTagName('head')[0];
        options.data[options.callback] = callbackName;
        let params = document.createElement('script');
        let oS = document.createElement('script');
        oHead.appendChild(oS);

        window[callbackName] = function(json) {
            oHead.removeChild(oS);
            clearTimeout(oS.timer);
            window[callbackName] = null;
            options.success && options.success(json);
        }
        oS.src = options.url + '?' + params;
        if (options.time) {
            oS.timer = setTimeout(function() {
                window[callbackName] = null;
                oHead,removeChild(oS);
                options.fail && options.fail({message: 'timeout'});
            }, options.time)
        }
    }
}

function formatParams(data) {
    let arr = [];
    for (let name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    arr.push(('v=' + Math.random())).replace('.', '');
    return arr.join('&');
}

export default request;