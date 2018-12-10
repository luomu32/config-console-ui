
const _isIE11 = () => {
    let iev = 0;
    const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    const trident = !!navigator.userAgent.match(/Trident\/7.0/);
    const rv = navigator.userAgent.indexOf('rv:11.0');

    if (ieold) {
        iev = Number(RegExp.$1);
    }
    if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
        iev = 10;
    }
    if (trident && rv !== -1) {
        iev = 11;
    }

    return iev === 11;
}
const _isEdge = () => {
    return /Edge/.test(navigator.userAgent);
}
const getBrowserType = () => {

    var ua = navigator.userAgent.toLowerCase();
    var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
    var m = ua.match(re);
    console.log(m[1].replace(/version/, "'safari"))
    console.log(m[2])
    let type, version;
    if (_isIE11) {
        type = 'ie', version = 11
    }
    else if (_isEdge) {
        type = 'ie', version = 1
    }
    else {
        type='other',version=1
    }

    return {
        type: type,
        version: version
    }
}
export default getBrowserType