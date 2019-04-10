export function MP(ak){
    return new Promise(function (resolve, reject) {  
        window.onload = function () {  
          resolve(BMap)  
        }  
        var script = document.createElement("script");  
        script.type = "text/javascript";  
        script.src = "http://api.map.baidu.com/getscript?v=2.0&ak=7I6eFbjHbRo9PTClcG7VDzamxC9ct4il";  
        script.onerror = reject;  
        document.head.appendChild(script);  
      })
}