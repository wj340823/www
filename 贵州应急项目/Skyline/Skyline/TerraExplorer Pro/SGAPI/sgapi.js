// JScript File

var sgSGAPIURL = "skyline:";

if (sgSGAPIURL != "skyline:")
    sgSGAPIURL = sgSGAPIURL + "/SkylineGlobe/WebClient/PresentationLayer/sgapi/v2.0/";


function $InitSGAPI()
{
    document.write("<script language='jscript' src='" + sgSGAPIURL + "sgapi.sgworld.js'></script>");
    document.write("<script language='jscript' src='" + sgSGAPIURL + "sgapi.sgframework.js'></script>");
} $InitSGAPI();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SGAPI class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function $SGAPI()
{    
    this.lastError  = "";
    this.abspath    = _$SGAPI_abspath;
    this.toAbspath  = _$SGAPI_toAbspath;    
    this.__location = "";
    try { this.__location = window.location.href } catch(e) { var err = -1 };
}
function _$SGAPI_abspath()
{
    var abspath = "";
    try
    {
        abspath = unescape(window.location.href);
    }
    catch(e)
    {
        abspath = unescape(this.__location);
    }
    // Remove query String 
    var index=abspath.indexOf("?");
    if (index > 0) abspath = abspath.substr (0,index-1);    
        
    index=abspath.lastIndexOf("/");
    var index2 = abspath.lastIndexOf("\\");
    
    index = (index > index2) ? index : index2;
    if (index <= 0) return abspath;

    abspath = abspath.substring(0,index);

    if(abspath.substring(0,1) == "/") abspath = abspath.slice(1);    

    var re = /file:\/\/\//gi;
    if (abspath.match(re) != null) abspath = abspath.replace(re,""); // if this is indeed a local file, we strip the "file://" prefix from it.    

    return(abspath);
}
function _$SGAPI_toAbspath(src)
{
    var re = /^http:\/\/|^ftp:\/\/|^file:\/\/|^https:\/\//gi;
    if (src.match(re) == null)
    {
        if (src.indexOf("[TE Application Data]") != 0)
            return this.abspath() + '/' + src;
    }
    else
    {
        // if this is indeed a local file, we strip the "file://" prefix from it.    
        re = /file:\/\/\//gi;
        if (src.match(re) != null) 
            src = src.replace(re,""); 
        else
        {
            re = /file:\/\//gi;
            if (src.match(re) != null) src = src.replace(re,"");
        }
    }
        
    return src;
}

var SGAPI = new $SGAPI();
