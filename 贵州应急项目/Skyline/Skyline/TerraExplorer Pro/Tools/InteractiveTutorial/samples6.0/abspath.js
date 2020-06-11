
function toAbspath(src)
{
    var abspath = function ()
    {
        var abspath = "";
        try
        {
            abspath = unescape(window.location.href);
        }
        catch (e)
        {
            abspath = unescape(this.__location);
        }
        // Remove query String 
        var index = abspath.indexOf("?");
        if (index > 0) abspath = abspath.substr(0, index - 1);

        index = abspath.lastIndexOf("/");
        var index2 = abspath.lastIndexOf("\\");

        index = (index > index2) ? index : index2;
        if (index <= 0) return abspath;

        abspath = abspath.substring(0, index);

        if (abspath.substring(0, 1) == "/") abspath = abspath.slice(1);

        var re = /file:\/\/\//gi;
        if (abspath.match(re) != null) abspath = abspath.replace(re, ""); // if this is indeed a local file, we strip the "file://" prefix from it.    

        return (abspath);

    }

    var re = /^http:\/\/|^ftp:\/\/|^file:\/\/|^https:\/\//gi;
    if (src.match(re) == null)
    {
        if (src.indexOf("[TE Application Data]") != 0)
            return abspath() + '/' + src;
    }
    else
    {
        // if this is indeed a local file, we strip the "file://" prefix from it.    
        re = /file:\/\/\//gi;
        if (src.match(re) != null)
            src = src.replace(re, "");
        else
        {
            re = /file:\/\//gi;
            if (src.match(re) != null) src = src.replace(re, "");
        }
    }

    return src;

}
