var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


function openListView(param) {
    var country = getUrlParameter("country");
    var list = getUrlParameter("list");
    var search = getUrlParameter("search");

    var url = window.location.pathname;

    if (country) {
        url += "?country=" + country;
    }

    if (search) {
        if (url.indexOf("?") < 0) {
            url += "?search=" + search;
        } else {
            url += "&search=" + search;
        }
    }

    if (param === "list") {
        if (url.indexOf("?") < 0) {
            url += "?list=list";
        } else {
            url += "&list=list";
        }
    } else {
        if (url.indexOf("?") < 0) {
            url += "?list=grid";
        } else {
            url += "&list=grid";
        }
    }
    window.location.href = url;

};
