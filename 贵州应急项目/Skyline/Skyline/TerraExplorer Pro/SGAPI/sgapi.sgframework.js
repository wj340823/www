// JScript File

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SGFramework class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SGFramework.prototype._getSGS = _SGFramework_getSGS;
function SGFramework()
{
    if (SGAPI.SGFramework != undefined) return null;    // can not create more then one instance per document.
    if (SGAPI.SGWorld == null) { alert("SGAPI Error: SGWorld was not defined"); return null; }
    $SGAPI.prototype.SGFramework = this;
    this.lastError = "";
        
    this.globals   = new _$SGGlobal();    
    this.favorites = new _$SGFavorites();
    this.results   = new _$SGResults();
    this.events    = new _$SGEvents();
    this.account   = new _$SGAccount();        
    this.tools     = new _$SGTools();
    this._sgapifid = SGAPI.SGWorld._name;
    

    var arr = document.location.href.split("?");
    if (arr.length > 1)
    {
        arr = arr[1].split("&");        
        for (var i=0; i<arr.length; i++)
        {
            if (arr[i].indexOf("sgfid") == 0 && arr[i].indexOf("=") == 5)
            {
                arr = arr[i].split("=");
                this._sgapifid = arr[1];
                break;
            }
        }
    }
    
    
}
function _SGFramework_getSGS()
{
    return SGAPI.SGFramework.globals.getObject("SkylineGlobeService");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGGlobal class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
_$SGGlobal.prototype._globals         = null;
_$SGGlobal.prototype._onLoadFinished  = null;
_$SGGlobal.prototype._getGlobals      = _$SGGlobal_getGlobals;
_$SGGlobal.prototype.registerObject   = _$SGGlobal_registerObject;
_$SGGlobal.prototype.unregisterObject = _$SGGlobal_unregisterObject;
_$SGGlobal.prototype.getObject        = _$SGGlobal_getObject;
function _$SGGlobal()
{
}
function _$SGGlobal_onLoadFinished()    // this allows registration of framework objects before the load was finished.
{                                       // Since all globals are cleared from TE before the load, this handler will re-register them if they existed before the load.
    if (SGAPI.SGFramework.globals._globals != null)
    {
        var tempGlobals = null;
        try { tempGlobals = SGAPI.SGWorld.teCore.IScriptEngine.GetGlobalName("++__SGGlobals__"); } catch(e) { SGAPI.SGFramework.lastError = e; tempGlobals = null; }
        if (tempGlobals == null) try { SGAPI.SGWorld.teCore.IScriptEngine.RegisterGlobalName("__SGGlobals__", SGAPI.SGFramework.globals._globals); } catch(e) { SGAPI.SGFramework.lastError = e; SGAPI.SGFramework.globals._globals = null; }                
    }    
}
function _$SGGlobal_getGlobals()
{
    if (SGAPI.SGWorld == null) return null;
    if (SGAPI.SGWorld.teCore.ITerraExplorer.GetParam(400) != 1)
        return null;
        
    if (this._onLoadFinished == null) { this._onLoadFinished = _$SGGlobal_onLoadFinished; SGAPI.SGWorld.attachEvent("OnLoadFinished", this._onLoadFinished); } // this allows registration of framework objects before the load was finished.
    if (this._globals == null)
    {
        try { this._globals = SGAPI.SGWorld.teCore.IScriptEngine.GetGlobalName("++__SGGlobals__"); } catch(e) { SGAPI.SGFramework.lastError = e; this._globals; }
        if (this._globals == null)
        {
            this._globals = new Array();    // this is first framework that tries to use the globals
            try { SGAPI.SGWorld.teCore.IScriptEngine.RegisterGlobalName("__SGGlobals__", this._globals); } catch(e) { SGAPI.SGFramework.lastError = e; this._globals = null; }
        }
    }
    return this._globals;
}
function _$SGGlobal_registerObject(name, obj, overwriteExisting)
{
    try
    {
        var globals = this._getGlobals();
        if (globals == null) return false;
        if (overwriteExisting == null) overwriteExisting = true;
        if (globals[name] != null && overwriteExisting == false) throw "name already registered";            
        globals[name] = obj;
        return true;
    }
    catch(e) { SGAPI.SGFramework.lastError = e; }
    return false;    
}
function _$SGGlobal_unregisterObject(name)
{
    try
    {
        var globals = this._getGlobals();
        if (globals == null) return false;
        globals[name] = null;
        delete globals[name];
        return true;
    }
    catch(e) { SGAPI.SGFramework.lastError = e; }
    return false;    
}
function _$SGGlobal_getObject(name)
{
    try
    {
        var globals = this._getGlobals();
        if (globals == null) return null;
        return globals[name];
    }
    catch(e) { SGAPI.SGFramework.lastError = e; }
    return null;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGFavorites class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
_$SGFavorites.prototype.add    = _$SGFavorites_add;
_$SGFavorites.prototype.remove = _$SGFavorites_remove;
_$SGFavorites.prototype.show   = _$SGFavorites_show;
_$SGFavorites.prototype.hide   = _$SGFavorites_hide;
_$SGFavorites.prototype._init = _$SGFavorites_init;
function _$SGFavorites() { }
function _$SGFavorites_add(node, infoText, iconURL) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.favorites.add(node, infoText, iconURL); }
function _$SGFavorites_remove(node)                 { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.favorites.remove(node); }
function _$SGFavorites_show()                       { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.favorites.show(); }
function _$SGFavorites_hide()                       { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.favorites.hide(); }
function _$SGFavorites_init(filePreifx)             { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.favorites._init(filePreifx); }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGResults class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
_$SGResults.prototype.addPage             = _$SGResults_addPage;
_$SGResults.prototype.removePage          = _$SGResults_removePage;
_$SGResults.prototype.toggle              = _$SGResults_toggle;
_$SGResults.prototype.show                = _$SGResults_show;
_$SGResults.prototype.hide                = _$SGResults_hide;
_$SGResults.prototype.showHideResultGroup = _$SGResults_showHideResultGroup;
_$SGResults.prototype.setNext             = _$SGResults_setNext;
_$SGResults.prototype.setPrev             = _$SGResults_setPrev;
_$SGResults.prototype.setResult           = _$SGResults_setResult;
_$SGResults.prototype.attachNode          = _$SGResults_attachNode;
function _$SGResults() {}
function _$SGResults_addPage(URL, description) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return 0; else return sgs.results.addPage(URL, description); }
function _$SGResults_removePage(resultId) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.removePage(resultId); }
function _$SGResults_toggle() { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.toggle(); }
function _$SGResults_show()   { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.show(); }
function _$SGResults_hide()   { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.hide(); }
function _$SGResults_showHideResultGroup(forceHide)   { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.showHideResultGroup(forceHide); }
function _$SGResults_setNext() { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.setNext(); }
function _$SGResults_setPrev() { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.setPrev(); }
function _$SGResults_setResult(id) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.setResult(id); }
function _$SGResults_attachNode(sFrameName, node) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.results.attachNode(sFrameName, node); }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGEvents class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
_$SGEvents.prototype.attachEvent  = _$SGEvents_attachEvent;
_$SGEvents.prototype.detachEvent  = _$SGEvents_detachEvent;
function _$SGEvents() {}
function _$SGEvents_attachEvent(sEvent, fpNotify) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return false; else return sgs.events.attachEvent(sEvent+SGAPI.SGFramework._sgapifid, fpNotify); }
function _$SGEvents_detachEvent(sEvent, fpNotify) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return false; else return sgs.events.detachEvent(sEvent+SGAPI.SGFramework._sgapifid, fpNotify); }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGAccount class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
_$SGAccount.prototype.getKey  = _$SGAccount_getKey;
_$SGAccount.prototype.setKey  = _$SGAccount_setKey;
_$SGAccount.prototype.getUserId  = _$SGAccount_getUserId;
_$SGAccount.prototype.setUserId  = _$SGAccount_setUserId;
_$SGAccount.prototype.getUserName  = _$SGAccount_getUserName;
_$SGAccount.prototype.setUserName  = _$SGAccount_setUserName;
function _$SGAccount() {}
function _$SGAccount_getKey()    { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return ""; else return sgs.account.getKey();    }
function _$SGAccount_setKey(key) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.account.setKey(key); }
function _$SGAccount_getUserId()    { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return ""; else return sgs.account.getUserId();    }
function _$SGAccount_setUserId(userId) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.account.setUserId(userId); }
function _$SGAccount_getUserName()    { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return ""; return sgs.account.getUserName();    }
function _$SGAccount_setUserName(userName) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.account.setUserName(userName); }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGAccount class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
_$SGTools.prototype.showTool = _$SGTools_showTool;
_$SGTools.prototype.showToolById = _$SGTools_showToolById;
_$SGTools.prototype.addTool  = _$SGTools_addTool;
_$SGTools.prototype.addLocalTool  = _$SGTools_addLocalTool;
_$SGTools.prototype.removeToolById  = _$SGTools_removeToolById;
function _$SGTools() {}
function _$SGTools_showTool(toolName) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.tools.showTool(toolName); }
function _$SGTools_showToolById(toolId) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs != null) sgs.tools.showToolById(toolId); }
function _$SGTools_addLocalTool(name, iconURL, url, helpURL) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return 0; else return sgs.tools.addTool(-1, name, iconURL, url, helpURL); }
function _$SGTools_addTool(id) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return 0; else return sgs.tools.addTool(id, null, null, null, null); }
function _$SGTools_removeToolById(id) { var sgs = SGAPI.SGFramework._getSGS(); if (sgs == null) return false; else return sgs.tools.removeToolById(id); }
