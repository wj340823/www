// JScript File

function $InitSGAPI_SGWORLD()
{
    document.write("<script language='jscript' src='"+sgSGAPIURL+"sgapi.sgworld.constants.js'></script>");
    document.write("<script language='vbscript' src='"+sgSGAPIURL+"sgapi.sgworld.vbs'></script>");    
} $InitSGAPI_SGWORLD();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SGWorld class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SGAppData(name)
{
    var re = /^http:\/\/|^ftp:\/\/|^file:\/\/|^https:\/\//gi;
    if (name.match(re) == null)
    {
        name = name.toLowerCase();
        if (name.search(".fly") == -1) name += ".fly";        
        return ("[TE Application Data]\\" + name);
    }
    
    return name;
}

function SGParseFloat(x) 
{
    if (x == undefined) return x;
    var a = parseFloat(x);
    if (isNaN(a)) return undefined;
    return a; 
}


// If TE V5.1 or above is installed, the client do not need to use the clientOnInitFinishedHandler parameter.
// Instead they can simply instantiate a new SGWorld and start using it (it will already be initialized after the new).
function SGWorld(divID, clientOnInitFinishedHandler, referrerId)
{
    if (SGAPI.SGWorld != undefined) return null;    // can not create more then one instance per document.    
    $SGAPI.prototype.SGWorld = this;    
    this.lastError = null;
    this.bV510orGreater = false;
    this._after3DWindowCreation = _SGWorld_After3DWindowCreation;
    try
    {
        if (divID != undefined && divID != "")
        {
            var TE3DWindow = document.createElement("object");
            //var TEParam = document.createElement("param");
            //TEParam.name = "p1";
            //TEParam.value = 1;
            //TE3DWindow.appendChild(TEParam);
            TE3DWindow.onreadystatechange = function()
            {
                if (TE3DWindow.readyState == 4)
                    SGAPI.SGWorld._after3DWindowCreation(divID, clientOnInitFinishedHandler, referrerId);
            }
            
            document.getElementById(divID).appendChild(TE3DWindow);
            TE3DWindow.name     = "SGAPITE3DWindow";
            TE3DWindow.id       = "SGAPITE3DWindow";
            TE3DWindow.classid  = "clsid:3a4f9192-65a8-11d5-85c1-0001023952c1";
            TE3DWindow.width    = "100%";
            TE3DWindow.height   = "100%";
            TE3DWindow.BorderStyle = 0;
            TE3DWindow.Caption  = divID;            
        }
        else
        {
            this._after3DWindowCreation(divID, clientOnInitFinishedHandler, referrerId);
        }
    
    }
    catch(e) 
    { 
        if (e.number == SGERR_MULTIPLE_TABS) e.description = "Error: creating SGWorld in multiple tabs";
        this.lastError = e;        
        throw e;        
    }
}

function _SGWorld_After3DWindowCreation(divID, clientOnInitFinishedHandler, referrerId)
{
    try
    {
        try { document.getElementById("SGAPITE3DWindow").text = "@1"; } catch (e) { if (e.description == "@1") this.bV510orGreater = true; }
        var TEObj = document.createElement("object");

        // If body exists, then in IE9 durinig loading you can not mpdify document, only body. 
        // on the other side, (bug 15050) there are cases when body does not exists. So our only option is to add directly to document. Lets hope this covers all the cases
        if (document.body)
            document.body.appendChild(TEObj);
        else
            document.appendChild(TEObj);

        TEObj.name = "SGAPITEObj";
        TEObj.style.display = "none"
        TEObj.id   = "SGAPITEObj";
        //TEObj.onerror = _SGWorld_onSGAPITEObjError;
        TEObj.classid = "clsid:3a4f9191-65a8-11d5-85c1-0001023952c1";
        this.innerTEObj = TEObj;    
    }
    catch (e)
    {
        if (e.number == SGERR_MULTIPLE_TABS) e.description = "Error: creating SGWorld in multiple tabs";
        this.lastError = e;
        throw e;
    }
    ///////////////////////////////////////////////////////////////////////////
    // properties
    this._clientOnInitFinishedHandler = clientOnInitFinishedHandler;
    this._name = (divID == undefined) ? (new Date()).getTime() : divID;
    this._referrerId = referrerId;
    this._events = new $SGEvents();
    this.teCore = new $SGCore();
    this.navigate = new $SGNavigate();
    this.creator = new $SGCreator();
    this.window = new $SGWindow();
    ///////////////////////////////////////////////////////////////////////////
    // methods
    this.showPopup = _SGWorld_showPopup;
    this.removePopup = _SGWorld_removePopup;
    //this.messageBox     = _SGWorld_messageBox;
    this.attachEvent = this._events.attachEvent;
    this.detachEvent = this._events.detachEvent;

    this._onInitFinished = _SGWorld_onInitFinished;
    this._init = _SGWorld_init;
    this._uninit = _SGWorld_uninit;
    this._createTree = _SGWorld_createTree;
    this._xmlDOM = new ActiveXObject("msxml.DOMDocument");
    this._parser = new $SGWorldParser();

    // there is a bug in v6.0.1. SetParam 4100 does not work on GetObject and GEtObjectEx
    // however if there is a create call before calling GetObject and GEtObjectEx, the setparam does work.
    // so just perform the setparam and CreateCircle as first actions of API
    try
    {
        this.teCore.ITerraExplorer.SetParam(4100, 0);
        var circ = this.teCore.IObjectManager.CreateCircle(0, 0, 0, 100, 3);
        this.teCore.IInformationTree.DeleteItem(circ.InfoTreeItemID);
    }
    catch(e) // if fails, do nothing. 
    {}

    if (this.bV510orGreater && this._clientOnInitFinishedHandler == undefined)
        this._onInitFinished();
    else
    {
        if (divID != undefined && divID != "")
            setTimeout(this._onInitFinished, 0);
        else
            this._onInitFinished();
    }
}

function _SGWorld_onSGAPITEObjError(ErrorCode)
{
    alert(ErrorCode);
}
function _SGWorld_init()
{
    try
    {        
        if ($createGroupID == -1)
        {
            // Create the root node
            var time = new Date();
            var name = "ROOT:" + SGAPI.SGWorld._name + ":" + time.getTime();                        
            var itemID = SGAPI.SGWorld.teCore.IInformationTree.CreateLockedGroup(name);            
            SGAPI.SGWorld.root = new SGNode(itemID);
                            
            // Create the creation group
			var createGroupRoot = $createGroupRoot;
			var createGroupRootParent = 0;

			if (SGAPI.SGWorld.bV510orGreater)
			{
				var hiddenGroup = SGAPI.SGWorld.teCore.ITerraExplorer.GetParam(450);
				createGroupRoot = hiddenGroup + "\\" + $createGroupRoot;
				createGroupRootParent = SGAPI.SGWorld.teCore.ITerraExplorer.GetParam(451);
				if (hiddenGroup == undefined) { createGroupRoot = $createGroupRoot; createGroupRootParent = 0; }
			}

            itemID = SGAPI.SGWorld.teCore.IInformationTree.FindItem(createGroupRoot);
            if (itemID == 0) itemID = SGAPI.SGWorld.teCore.IInformationTree.CreateLockedGroup($createGroupRoot, createGroupRootParent);

            $createGroupID = SGAPI.SGWorld.teCore.IInformationTree.CreateLockedGroup(name, itemID);                                    
            // NOTE: on viewer without proper licence, the above create function would fail (and any attempt to create anything else will fail as well).            
            var tmpNode = new SGNode(itemID);
            tmpNode.innerObj.setSaveInFlyFile(0);    // Do not save the temp sgapi folder
        }        
        SGAPI.SGWorld._events.init();
    } 
    catch(e) { SGAPI.SGWorld.lastError = e; }
}
function _SGWorld_uninit()
{
    try
    {   
        if (SGAPI.SGWorld.navigate._flyThrough != null)
            SGAPI.SGWorld.navigate._flyThrough.finish();
                    
        if ($createGroupID != -1)
        {
            try
            {
                var eventsName = SGAPI.SGWorld._name + "Events_";        
                SGAPI.SGWorld.teCore.IScriptEngine.UnregisterName(eventsName + "teMessageHandler");
                SGAPI.SGWorld.teCore.IScriptEngine.UnregisterName(eventsName + "mouseHandler");
            }
            catch(e) {a=0;}
        
            // Remove the nodes that where created by this instance of SGWorld            
            SGAPI.SGWorld.teCore.IInformationTree.DeleteItem(SGAPI.SGWorld.root._itemID);
            SGAPI.SGWorld.teCore.IInformationTree.DeleteItem($createGroupID);
            SGAPI.SGWorld.root._itemID = -1;
            $createGroupID = -1;
        }        
    }         
    catch(e) { SGAPI.SGWorld.lastError = e; }
    // If monitor frame exists for this instance, clean it.
    var monitorFrame = document.all[SGAPI.SGWorld._name+"_monitorFrm"];
    if (monitorFrame != null) monitorFrame.src = "about:blank";
    
}
/*
function _SGWorld_testProAPI()
{
    try
    {
        if (SGAPI.SGWorld.teCore.ITerraExplorer.Type != "Pro")
        {
            var test = SGAPI.SGWorld.teCore.IInformationTree.CreateGroup("___SGAPI_TEST_GROUP___");
            SGAPI.SGWorld.teCore.IInformationTree.DeleteItem(test);
        }
    }
    catch(e) { if (e.number == -2147220992) return false; }
    return true;
}
*/
function _SGWorld_onInitFinished()    
{                
    //if (_SGWorld_testProAPI() == false)
    //    throw "No License";    
    
    try
    {                       
        SGAPI.SGWorld.innerTEObj.attachEvent("OnLoadFinished", SGAPI.SGWorld._events.onLoadFinished);
        SGAPI.SGWorld.version = vbGetTEVersion();
        window.attachEvent("onunload", SGAPI.SGWorld._uninit);
        if (SGAPI.SGWorld.teCore.ITerraExplorer.FlyName != "NO_FLY") SGAPI.SGWorld._init(); // there is already fly file loaded. init the SGWorld object        
        if (SGAPI.SGWorld._clientOnInitFinishedHandler != undefined) SGAPI.SGWorld._clientOnInitFinishedHandler();    

        if (SGAPI.SGWorld._referrerId != null && SGAPI.SGWorld._referrerId != "")
        {        
            var iframeObj = document.createElement("iframe");
            iframeObj.id     = SGAPI.SGWorld._name+"_monitorFrm";
            iframeObj.width  = "1px";
            iframeObj.height = "1px";
            iframeObj.style.visibility = "hidden";
            iframeObj.style.display = "none";
            document.body.appendChild(iframeObj);
            iframeObj.src = sgRootURL + "/WebClient/PresentationLayer/Monitor/MonitorLaunchFrame.htm?referrerId="+SGAPI.SGWorld._referrerId;                
        }           
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
}    
function _SGWorld_showPopup(thePopup)
{
    try
    {  
        var ret = _SGPopup_process(thePopup);
              
        if (ret != null)
        {               
            this.teCore.IContainer.HTMLPopup (ret.msgType,ret.left,ret.top,ret.width,ret.height,ret.caption, ret.content, ret.flags, ret.timeout);            
            return true;
        }
    }
    catch(e) { this.lastError = e; }
    return false;
}
function _SGWorld_removePopup(popup)
{
    try
    {    
        var id;
    
        if (popup instanceof SGNotification || popup == null) id = "__sgNotifyMessage__";
        else if (typeof(popup) == "string") id = popup;
        else if (popup._ID != undefined) id = popup._ID;

        if (id != undefined)
        {        
            this.teCore.IContainer.RemoveURL(5, id);
            return true;            
        }
    }
    catch(e) { this.lastError = e; }    
    return false;
}
function _SGWorld_messageBox(prompt, buttons, title)
{
    if (buttons == null) buttons = sgOKOnly;
    if (title == null) title = "SkylineGlobe";
    return vbMsgBox(prompt, buttons, title);
}
function _SGWorld_createTree(divID)
{
    var TEInformationWindow = document.createElement("object");
    document.getElementById(divID).appendChild(TEInformationWindow);
    TEInformationWindow.name     = "SGAPI_TEInformationWindow";
    TEInformationWindow.id       = "SGAPI_TEInformationWindow";
    TEInformationWindow.classid  = "clsid:3a4f9193-65a8-11d5-85c1-0001023952c1";
    TEInformationWindow.width    = "100%";
    TEInformationWindow.height   = "100%";    
    TEInformationWindow.BorderStyle = 0;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGCore class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function $SGCore()
{
    try
    {
        this.ITerraExplorer   = SGAPI.SGWorld.innerTEObj.Interface("ITerraExplorer51");
        if (this.ITerraExplorer != null) SGAPI.SGWorld.bV510orGreater = true;
    }
    catch (e) { SGAPI.SGWorld.bV510orGreater = false; }        

    try
    {
        if (SGAPI.SGWorld.bV510orGreater == false) this.ITerraExplorer   = SGAPI.SGWorld.innerTEObj.Interface("ITerraExplorer5");
        this.IInformationTree = SGAPI.SGWorld.innerTEObj.Interface("IInformationTree5");    
        this.IPlane           = SGAPI.SGWorld.innerTEObj.Interface("IPlane5");
        this.ITerrain         = SGAPI.SGWorld.innerTEObj.Interface("ITerrain4");
        this.IObjectManager   = SGAPI.SGWorld.innerTEObj.Interface("IObjectManager5");
        this.IRender          = SGAPI.SGWorld.innerTEObj.Interface("IRender5");
        this.IContainer       = SGAPI.SGWorld.innerTEObj.Interface("IContainer2");
        this.ICoordSys        = SGAPI.SGWorld.innerTEObj.Interface("ICoordSys3");
        this.ISnapShot        = SGAPI.SGWorld.innerTEObj.Interface("ISnapShot2");
        this.IMenu            = SGAPI.SGWorld.innerTEObj.Interface("IMenu");
        this.IScriptEngine    = SGAPI.SGWorld.innerTEObj.Interface("IScriptEngine5");        
    }
    catch (e) 
    { 
        e.number = SGERR_NO_LICENSE;           
        throw e;
    }

    try // Try to get interfaces that are not in v5.1.1 but are available both to pro and basic.
    {
        this.IDateTime = SGAPI.SGWorld.innerTEObj.Interface("IDateTime5");  // Only in v5.1.2
    }
    catch (e) 
    {
        this.IDateTime = null;
    }
    
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGEvents class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$SGEvents.prototype.isLoadFinished         = false;
$SGEvents.prototype.arrOnLoadFinished      = null;
$SGEvents.prototype.arrOnFrame             = null;
$SGEvents.prototype.arrOnNodeAction        = null;
$SGEvents.prototype.arrOnTerraExplorerMessage = null;
$SGEvents.prototype.arrMouseEventsArrays   = null;

$SGEvents.prototype.onLoadFinished         = _$SGEvents_onLoadFinished;
$SGEvents.prototype.onFrame                = _$SGEvents_onFrame;
$SGEvents.prototype.onTerraExplorerMessage = _$SGEvents_onTerraExplorerMessage;// Needed to make translation of arguments (from TEObjID to SGNode)
$SGEvents.prototype.onObjectAction         = _$SGEvents_onObjectAction;        // Needed to make translation of arguments (from TEObjID to SGNode)
$SGEvents.prototype.onInfoTreeAction       = _$SGEvents_onInfoTreeAction;      // Needed to make translation of arguments (from ItemID to SGNode)
$SGEvents.prototype.mouseHandler           = _$SGEvents_mouseHandler
$SGEvents.prototype.attachEvent            = _$SGEvents_attachEvent;
$SGEvents.prototype.detachEvent            = _$SGEvents_detachEvent;
$SGEvents.prototype.init                   = _$SGEvents_init;
$SGEvents.prototype._detachFromArray       = _$SGEvents_detachFromArray;
$SGEvents.prototype._getElapseTime         = _$SGEvents_ElapseTimeOld;
$SGEvents.prototype._ElapseTimeNew         = _$SGEvents_ElapseTimeNew;
$SGEvents.prototype._lastOnFrameTime       = 0;
$SGEvents.prototype._simulateOnClick       = false;
$SGEvents.prototype._onClickSimulationCameraPos = null;
$SGEvents.prototype._funcDummy             = function(){}

$SGEvents.prototype.onLButtonDown          = _$SGEvents_onLButtonDown;
$SGEvents.prototype.onLButtonUp            = _$SGEvents_onLButtonUp;
$SGEvents.prototype.onMButtonDown          = _$SGEvents_onMButtonDown;
$SGEvents.prototype.onMButtonUp            = _$SGEvents_onMButtonUp;
$SGEvents.prototype.onRButtonDown          = _$SGEvents_onRButtonDown;
$SGEvents.prototype.onRButtonUp            = _$SGEvents_onRButtonUp;
$SGEvents.prototype.onMouseWheel           = _$SGEvents_onMouseWheel;

function $SGEvents()
{       
    this.arrOnLoadFinished    = new Array();     // FIX:0 - order in which events are called. we want to make sure our handler is called first.    
    this.arrMouseEventsArrays = new Array();        
}
function _$SGEvents_init()
{
    if (SGAPI.SGWorld.bV510orGreater == false)   // If ITerraExplorer51 interface is not supported (TE versions prior to 5.1), we have to use an alternate way of using events
    {
        // Temporary solution for the bHandled argument in some of the events.
        var iframeObj = document.createElement("iframe");
        iframeObj.id     = SGAPI.SGWorld._name + "Events_";
        iframeObj.width  = "1px";
        iframeObj.height = "1px";
        iframeObj.style.visibility = "hidden";
        iframeObj.style.display = "none";
        document.appendChild(iframeObj);
        iframeObj.src = sgSGAPIURL + "sgapi.eventsTE.htm?fid="+iframeObj.id;                
            
        try
        {
            SGAPI.SGWorld.teCore.IScriptEngine.RegisterGlobalName(iframeObj.id + "teMessageHandler", this.onTerraExplorerMessage);
            SGAPI.SGWorld.teCore.IScriptEngine.RegisterGlobalName(iframeObj.id + "mouseHandler", this.mouseHandler);
        }
        catch(e) { SGAPI.SGFramework.lastError = e; }
    }

    
    SGAPI.SGWorld._events.isLoadFinished = true;
}
function _$SGEvents_onLoadFinished()
{    

    if (SGAPI.SGWorld._events.isLoadFinished) return;
    
    SGAPI.SGWorld._init();
    var _This = SGAPI.SGWorld._events;
    for (var i = 0; _This.arrOnLoadFinished != null && i < _This.arrOnLoadFinished.length; i++)    // calling the clients "OnLoadFinished"
    {
        if (_This.arrOnLoadFinished[i] != null) _This.arrOnLoadFinished[i]();
    }    
}
function _$SGEvents_onFrame()
{
    var _This = SGAPI.SGWorld._events;
    if (_This.isLoadFinished && _This.arrOnFrame != null)   // FIX:1 - make sure the first onFrame will not be called before OnLoadFinished
    {
        var elapsed = _This._getElapseTime();
        for (var i = 0; _This.arrOnFrame != null && i < _This.arrOnFrame.length; i++)
        {
            if (_This.arrOnFrame[i] != null) _This.arrOnFrame[i](elapsed/1000.0);
        }
    }
}
function _$SGEvents_onObjectAction(ObjectID, Action)
{
    var _This = SGAPI.SGWorld._events;
    for (var i = 0; _This.arrOnNodeAction != null && i < _This.arrOnNodeAction.length; i++)
    {
        if (_This.arrOnNodeAction[i] != null)
        {
            var node = null;
            try
            {
                var Obj = SGAPI.SGWorld.teCore.IObjectManager.GetObject(ObjectID);
                node = new SGNode(Obj);
            }
            catch(e) { continue; }                
            
            _This.arrOnNodeAction[i](node, Action, null);
        }
    }
}
function _$SGEvents_onInfoTreeAction(ItemID, Action, Param)
{
    var _This = SGAPI.SGWorld._events;
    for (var i = 0; _This.arrOnNodeAction != null && i < _This.arrOnNodeAction.length; i++)
    {
        if (_This.arrOnNodeAction[i] != null)
        {
            _This.arrOnNodeAction[i](new SGNode(ItemID), Action, null);
        }
    }
}
function _$SGEvents_onTerraExplorerMessage(TEMessageID, SourceObjectID)
{
    var _This = SGAPI.SGWorld._events;
    if (_This.arrOnTerraExplorerMessage == null) return false;
    
    var bHandled = false;
    for (var i = 0; _This.arrOnTerraExplorerMessage != null && i < _This.arrOnTerraExplorerMessage.length; i++)
    {
        if (_This.arrOnTerraExplorerMessage[i] != null)
        {
            var messageObj = null;
            var ownerObj   = null;
            
            var messageNode = null;
            var ownerNode   = null;
            
            var bErr = false;
            
            try
            {                                                
                messageObj = SGAPI.SGWorld.teCore.IObjectManager.GetObject(TEMessageID);
                ownerObj   = SGAPI.SGWorld.teCore.IObjectManager.GetObject(SourceObjectID);
                
                messageNode = new SGNode(messageObj);
                ownerNode   = new SGNode(ownerObj);                                                
            }
            catch(e) 
            { 
                bErr = true;
                if (_This.arrOnTerraExplorerMessage[i](TEMessageID, SourceObjectID) == true)
                    bHandled = true;
            }
            
            if (bErr == false)
            {            
                if (_This.arrOnTerraExplorerMessage[i](messageNode, ownerNode) == true)
                    bHandled = true;            
            }
        }
    }   
    return bHandled;
}
function _$SGEvents_mouseHandler(name, Flags, X, Y, zDelta)
{
    var _This = SGAPI.SGWorld._events;    
    if (_This.arrMouseEventsArrays[name] == null) return false;
    
    var bHandled = false;
    
    if (name != "OnMouseWheel")
    {
        if (name == "OnLButtonDown")
        {
            _This._onClickSimulationCameraPos = SGAPI.SGWorld.navigate.getPosition();
        }
        else if (_This._onClickSimulationCameraPos != null)
        {
            if (name != "OnLButtonUp" || !_This._onClickSimulationCameraPos.isEqual(SGAPI.SGWorld.navigate.getPosition()))
                _This._onClickSimulationCameraPos = null;
        }
    
        for (var i = 0; _This.arrMouseEventsArrays[name] != null && i < _This.arrMouseEventsArrays[name].length; i++)
        {
            if (_This.arrMouseEventsArrays[name][i] != null) { if (_This.arrMouseEventsArrays[name][i](Flags, X, Y)) bHandled = true; }
        }
            
        if (_This._onClickSimulationCameraPos != null && name == "OnLButtonUp")
        {
            // If we are here, we got OnLButtonDown and then OnLButtonUp on the exact same position. Simulate OnClick event
            _This._onClickSimulationCameraPos = null;
            for (var i = 0; _This.arrMouseEventsArrays["OnClick"] != null && i < _This.arrMouseEventsArrays["OnClick"].length; i++)
            {
                _This.arrMouseEventsArrays["OnClick"][i](Flags, X, Y)                                    
            }
        }                
    }
    else
    {                                
        for (var i = 0; _This.arrMouseEventsArrays[name] != null && i < _This.arrMouseEventsArrays[name].length; i++)
            if (_This.arrMouseEventsArrays[name][i] != null) { if (_This.arrMouseEventsArrays[name][i](Flags, zDelta, X, Y)) bHandled = true; }                
    }
    
    return bHandled;       
}
function _$SGEvents_attachEvent(sEvent, fpNotify)
{
    var _This = SGAPI.SGWorld._events;
        
    if (sEvent == "" || sEvent == null) return;
    if (sEvent.toLowerCase().indexOf("on") == 0) sEvent = "O" + sEvent.slice(1);
    
    if (sEvent == "OnLoadFinished") // This will make sure that SGWorld "OnLoadFinished" will be called before the client "OnLoadFinished"
    {
        _This.arrOnLoadFinished.push(fpNotify);
        return;
    }
    else if (sEvent == "OnFrame")
    {
        if (_This.arrOnFrame == null)
        {
            _This.arrOnFrame = new Array();
            if (SGAPI.SGWorld.version >= "5.0.1") _This._getElapseTime = _This._ElapseTimeNew;                            
            SGAPI.SGWorld.innerTEObj.attachEvent(sEvent, _This.onFrame); 
        }            
        _This.arrOnFrame.push(fpNotify);
        return;    
    }
    else if (sEvent == "OnTerraExplorerMessage")
    {            
        if (SGAPI.SGWorld.bV510orGreater && _This.arrOnTerraExplorerMessage == null) 
            SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onTerraExplorerMessage);
            
        if (_This.arrOnTerraExplorerMessage == null) _This.arrOnTerraExplorerMessage = new Array();
        _This.arrOnTerraExplorerMessage.push(fpNotify);
        return;            
    }
    else if (sEvent == "OnNodeAction" || sEvent == "OnObjectAction" || sEvent == "OnInfoTreeAction")
    {
        if (_This.arrOnNodeAction == null)
        {
            _This.arrOnNodeAction = new Array();
            SGAPI.SGWorld.innerTEObj.attachEvent("OnObjectAction", _This.onObjectAction); 
            SGAPI.SGWorld.innerTEObj.attachEvent("OnInfoTreeAction", _This.onInfoTreeAction); 
        }            
        _This.arrOnNodeAction.push(fpNotify);
        return;                
    }
    else if (sEvent == "OnLButtonDown" || sEvent == "OnLButtonUp" || sEvent == "OnMButtonDown" || sEvent == "OnMButtonUp" || sEvent == "OnRButtonDown" || sEvent == "OnRButtonUp" || sEvent == "OnMouseWheel" || sEvent == "OnClick")
    {   
        if (sEvent == "OnClick")
        {        
            // we need to add internal "OnLButtonDown" and "OnLButtonUp" to simulate it.
           _This.attachEvent("OnLButtonDown", _This._funcDummy);
           _This.attachEvent("OnLButtonUp", _This._funcDummy);
        }
    
        if (SGAPI.SGWorld.bV510orGreater)
        {        
            if (sEvent == "OnLButtonDown" && _This.arrMouseEventsArrays[sEvent] == null) SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onLButtonDown);
            if (sEvent == "OnLButtonUp"   && _This.arrMouseEventsArrays[sEvent] == null) SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onLButtonUp);
            if (sEvent == "OnMButtonDown" && _This.arrMouseEventsArrays[sEvent] == null) SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onMButtonDown);
            if (sEvent == "OnMButtonUp"   && _This.arrMouseEventsArrays[sEvent] == null) SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onMButtonUp);
            if (sEvent == "OnRButtonDown" && _This.arrMouseEventsArrays[sEvent] == null) SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onRButtonDown);
            if (sEvent == "OnRButtonUp"   && _This.arrMouseEventsArrays[sEvent] == null) SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onRButtonUp);
            if (sEvent == "OnMouseWheel"  && _This.arrMouseEventsArrays[sEvent] == null) SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, _This.onMouseWheel);
        }
    
        if (_This.arrMouseEventsArrays[sEvent] == null) _This.arrMouseEventsArrays[sEvent] = new Array();
        _This.arrMouseEventsArrays[sEvent].push(fpNotify);
        
        return;
    }
    
    if (SGAPI.SGWorld.bV510orGreater)
        SGAPI.SGWorld.teCore.ITerraExplorer.AttachEvent(sEvent, fpNotify);        
    else    
        SGAPI.SGWorld.innerTEObj.attachEvent(sEvent, fpNotify);        
}
function _$SGEvents_detachEvent(sEvent, fpNotify)
{
    if (sEvent == "" || sEvent == null) return;
    if (sEvent.toLowerCase().indexOf("on") == 0) sEvent = "O" + sEvent.slice(1);

    var _This = SGAPI.SGWorld._events;
    if (sEvent == "OnLoadFinished")
    {
        _This._detachFromArray(sEvent, fpNotify, _This.arrOnLoadFinished, null);
    }
    else if (sEvent == "OnFrame")
    {
        if (_This._detachFromArray(sEvent, fpNotify, _This.arrOnFrame, _This.onFrame)) _This.arrOnFrame = null;
    }
    else if (sEvent == "OnTerraExplorerMessage")
    {
        if (_This._detachFromArray(sEvent, fpNotify, _This.arrOnTerraExplorerMessage, null)) _This.arrOnTerraExplorerMessage = null;
    }
    else if (sEvent == "OnNodeAction" || sEvent == "OnObjectAction" || sEvent == "OnInfoTreeAction")
    {
        if (_This._detachFromArray(sEvent, fpNotify, _This.arrOnNodeAction, null)) _This.arrOnNodeAction = null;
    }
    else if (sEvent == "OnLButtonDown" || sEvent == "OnLButtonUp" || sEvent == "OnMButtonDown" || sEvent == "OnMButtonUp" || sEvent == "OnRButtonDown" || sEvent == "OnRButtonUp" || sEvent == "OnMouseWheel" || sEvent == "OnClick")
    {
        if (sEvent == "OnClick")
        {
            // we need to add internal         
           _This.detachEvent("OnLButtonDown", _This._funcDummy);
           _This.detachEvent("OnLButtonUp", _This._funcDummy);
        }   
             
        if (_This._detachFromArray(sEvent, fpNotify, _This.arrMouseEventsArrays[sEvent], null)) _This.arrMouseEventsArrays[sEvent] = null;
    }
    else    
        SGAPI.SGWorld.innerTEObj.detachEvent(sEvent, fpNotify);
}
function _$SGEvents_detachFromArray(sEvent, fpNotify, arr, myHandler)
{
    if (arr == null) return false;    
    var _This = SGAPI.SGWorld._events;
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i] == fpNotify)
        {
            arr.splice(i,1);
            if (arr.length == 0)
            {
                if (sEvent == "OnNodeAction")
                {
                    SGAPI.SGWorld.innerTEObj.detachEvent("OnObjectAction",   _This.onObjectAction);
                    SGAPI.SGWorld.innerTEObj.detachEvent("OnInfoTreeAction", _This.onInfoTreeAction);
                }
                else if (myHandler != null)
                {
                    SGAPI.SGWorld.innerTEObj.detachEvent(sEvent, myHandler);
                }
                else if (SGAPI.SGWorld.bV510orGreater)
                {                
                    if (sEvent == "OnLButtonDown")  SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onLButtonDown);
                    if (sEvent == "OnLButtonUp")    SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onLButtonUp);
                    if (sEvent == "OnMButtonDown")  SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onMButtonDown);
                    if (sEvent == "OnMButtonUp")    SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onMButtonUp);
                    if (sEvent == "OnRButtonDown")  SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onRButtonDown);
                    if (sEvent == "OnRButtonUp")    SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onRButtonUp);
                    if (sEvent == "OnMouseWheel")   SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onMouseWheel);
                    if (sEvent == "OnTerraExplorerMessage") SGAPI.SGWorld.teCore.ITerraExplorer.DetachEvent(sEvent, _This.onTerraExplorerMessage);
                }                    
                    
                return true;
            }
            return false;
        }
    }
    return false;
}
function _$SGEvents_ElapseTimeOld()
{
    var _This = SGAPI.SGWorld._events;
    var t = new Date();
    var currentTime = t.getTime();
    if (_This._lastOnFrameTime == 0) _This._lastOnFrameTime = currentTime; 
    var elapsed = currentTime - _This._lastOnFrameTime;
    _This._lastOnFrameTime = currentTime;
    return elapsed;
}
function _$SGEvents_ElapseTimeNew()
{
    var _This = SGAPI.SGWorld._events;
    
    try
    {
        var currentTime = SGAPI.SGWorld.teCore.ITerraExplorer.GetParam(510);
        if (_This._lastOnFrameTime == 0) _This._lastOnFrameTime = currentTime; 
        var elapsed = currentTime - _This._lastOnFrameTime;
        _This._lastOnFrameTime = currentTime;
        return elapsed;        
    }
    catch(e)
    {
        _This._getElapseTime = _$SGEvents_ElapseTimeOld;
        return _This._getElapseTime();
    }
}
function _$SGEvents_onLButtonDown(flags,x,y)        { return SGAPI.SGWorld._events.mouseHandler("OnLButtonDown", flags,x,y); }
function _$SGEvents_onLButtonUp(flags,x,y)          { return SGAPI.SGWorld._events.mouseHandler("OnLButtonUp", flags,x,y); }
function _$SGEvents_onMButtonDown(flags,x,y)        { return SGAPI.SGWorld._events.mouseHandler("OnMButtonDown", flags,x,y); }
function _$SGEvents_onMButtonUp(flags,x,y)          { return SGAPI.SGWorld._events.mouseHandler("OnMButtonUp", flags,x,y); }
function _$SGEvents_onRButtonDown(flags,x,y)        { return SGAPI.SGWorld._events.mouseHandler("OnRButtonDown", flags,x,y); }
function _$SGEvents_onRButtonUp(flags,x,y)          { return SGAPI.SGWorld._events.mouseHandler("OnRButtonUp", flags,x,y); }
function _$SGEvents_onMouseWheel(flags,delta,x,y)   { return SGAPI.SGWorld._events.mouseHandler("OnMouseWheel", flags,x,y,delta); }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGWorldParser class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$SGWorldParser.prototype.attachParser   = _SGWorldParser_attachParser;
$SGWorldParser.prototype.parse          = _SGWorldParser_parse;
$SGWorldParser.prototype._arrSig        = new Array();
$SGWorldParser.prototype._arrParsers    = new Array();
function $SGWorldParser()
{
    this.attachParser("SGPosition(" , _SGWorld_parse_SGPosition);
    this.attachParser("<SGPosition>", _SGWorld_parse_SGPositionXML);
    this.attachParser("SGCoord3D("  , _SGWorld_parse_SGCoord3D);
    this.attachParser("<SGCoord3D>" , _SGWorld_parse_SGCoord3DXML);
    this.attachParser("SGCoord2D("  , _SGWorld_parse_SGCoord2D);
    this.attachParser("<SGCoord2D>" , _SGWorld_parse_SGCoord2DXML);
}
function _SGWorldParser_attachParser(strSig, funcParser)
{
    this._arrParsers[strSig] = funcParser;
    this._arrSig.push(strSig);
}
function _SGWorldParser_parse(str)
{
    if (typeof(str) != "string") return null;

    var strSig;
    for (var i=0; i < this._arrSig.length; i++)
    {
        strSig = this._arrSig[i];
        if (str.indexOf(strSig) == 0) return this._arrParsers[strSig](str);
    }

    return null;
}
function _SGWorld_parse_SGPosition(str)
{
    var pos = new SGPosition();    
    var str = str.slice(11, str.length-1);
    var arr = str.split(",");
    if (arr[0] != "null") pos.x = new Number(arr[0]);
    if (arr[1] != "null") pos.y = new Number(arr[1]);
    if (arr[2] != "null") pos.height = new Number(arr[2]);
    if (arr[3] != "null") pos.yaw = new Number(arr[3]);
    if (arr[4] != "null") pos.pitch = new Number(arr[4]);
    if (arr[5] != "null") pos.distance = new Number(arr[5]);
    if (arr[6] != "null") pos.heightType = new Number(arr[6]);
    if (arr[7] != "null") pos.roll = new Number(arr[7]);        
    return pos;
}
function _SGWorld_parse_SGPositionXML(str)
{
    SGAPI.SGWorld._xmlDOM.loadXML(str);
    var SGPositionNode = SGAPI.SGWorld._xmlDOM.firstChild;
    var xmlNode = null;
    if (SGPositionNode.nodeName != "SGPosition") return null;    
    var pos = new SGPosition();    
    xmlNode = SGPositionNode.selectSingleNode("x");
    if (xmlNode != null) pos.x = new Number(xmlNode.text);
    xmlNode = SGPositionNode.selectSingleNode("y");
    if (xmlNode != null) pos.y = new Number(xmlNode.text);
    xmlNode = SGPositionNode.selectSingleNode("height");
    if (xmlNode != null) pos.height = new Number(xmlNode.text);
    xmlNode = SGPositionNode.selectSingleNode("yaw");
    if (xmlNode != null) pos.yaw = new Number(xmlNode.text);
    xmlNode = SGPositionNode.selectSingleNode("pitch");
    if (xmlNode != null) pos.pitch = new Number(xmlNode.text);
    xmlNode = SGPositionNode.selectSingleNode("roll");
    if (xmlNode != null) pos.roll = new Number(xmlNode.text);
    xmlNode = SGPositionNode.selectSingleNode("distance");
    if (xmlNode != null) pos.distance = new Number(xmlNode.text);
    xmlNode = SGPositionNode.selectSingleNode("heightType");
    if (xmlNode != null) pos.heightType = new Number(xmlNode.text); else pos.heightType = sgHeightRelative;
    return pos;
}
function _SGWorld_parse_SGCoord3D(str)
{
    var coord = new SGCoord3D();    
    var str = str.slice(10, str.length-1);
    var arr = str.split(",");
    if (arr[0] != "null") coord.x = new Number(arr[0]);
    if (arr[1] != "null") coord.y = new Number(arr[1]);
    if (arr[2] != "null") coord.height = new Number(arr[2]);
    if (arr[3] != "null") coord.heightType = new Number(arr[3]);
    return coord;
}
function _SGWorld_parse_SGCoord3DXML(str)
{
    SGAPI.SGWorld._xmlDOM.loadXML(str);
    var SGCoordNode = SGAPI.SGWorld._xmlDOM.firstChild;
    var xmlNode = null;
    if (SGCoordNode.nodeName != "SGCoord3D") return null;
    var coord = new SGCoord3D();            
    xmlNode = SGCoordNode.selectSingleNode("x");
    if (xmlNode != null) coord.x = new Number(xmlNode.text);
    xmlNode = SGCoordNode.selectSingleNode("y");
    if (xmlNode != null) coord.y = new Number(xmlNode.text);
    xmlNode = SGCoordNode.selectSingleNode("height");
    if (xmlNode != null) coord.height = new Number(xmlNode.text);
    xmlNode = SGCoordNode.selectSingleNode("heightType");
    if (xmlNode != null) coord.heightType = new Number(xmlNode.text); else coord.heightType = sgHeightRelative;
    return coord;
}
function _SGWorld_parse_SGCoord2D(str)
{
    var coord = new SGCoord2D();    
    var str = str.slice(10, str.length-1);
    var arr = str.split(",");
    if (arr[0] != "null") coord.x = new Number(arr[0]);
    if (arr[1] != "null") coord.y = new Number(arr[1]);
    return coord;
}
function _SGWorld_parse_SGCoord2DXML(str)
{
    SGAPI.SGWorld._xmlDOM.loadXML(str);
    var SGCoordNode = SGAPI.SGWorld._xmlDOM.firstChild;
    var xmlNode = null;    
    if (SGCoordNode.nodeName != "SGCoord2D") return null;
    var coord = new SGCoord2D();    
    xmlNode = SGCoordNode.selectSingleNode("x");
    if (xmlNode != null) coord.x = new Number(xmlNode.text);
    xmlNode = SGCoordNode.selectSingleNode("y");
    if (xmlNode != null) coord.y = new Number(xmlNode.text);
    return coord;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SGNode class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
SGNode.prototype.getAttribute     = _SGNode_getAttribute;
SGNode.prototype.setAttribute     = _SGNode_setAttribute;
SGNode.prototype.getData          = _SGNode_getData;
SGNode.prototype.setData          = _SGNode_setData;
SGNode.prototype.nodeType         = _SGNode_nodeType;
SGNode.prototype.nodeId           = _SGNode_nodeId;
SGNode.prototype.getName          = _SGNode_getName;
SGNode.prototype.setName          = _SGNode_setName;
SGNode.prototype.appendChild      = _SGNode_appendChild;
SGNode.prototype.removeChild      = _SGNode_removeChild;
SGNode.prototype.parentNode       = _SGNode_parentNode;
SGNode.prototype.hasChildNodes    = _SGNode_hasChildNodes;
SGNode.prototype.firstChild       = _SGNode_firstChild;
SGNode.prototype.lastChild        = _SGNode_lastChild;
SGNode.prototype.nextSibling      = _SGNode_nextSibling;
SGNode.prototype.childNodes       = _SGNode_childNodes;
SGNode.prototype.selectSingleNode = _SGNode_selectSingleNode;
SGNode.prototype.setVisibility    = _SGNode_setVisibility;
SGNode.prototype.getVisibility    = _SGNode_getVisibility;
SGNode.prototype.sort             = _SGNode_sort;
SGNode.prototype.save             = _SGNode_save;
SGNode.prototype.load             = _SGNode_load;
SGNode.prototype.getPosition      = _SGNode_getPosition;
SGNode.prototype.setPosition      = _SGNode_setPosition;
SGNode.prototype.setMessage       = _SGNode_setMessage;
SGNode.prototype.isEqual          = _SGNode_isEqual;
SGNode.prototype.innerObj         = null;
SGNode.prototype._fromItemID      = _SGNode_fromItemID;
SGNode.prototype._fromTerraObj    = _SGNode_fromTerraObj;
SGNode.prototype._clear           = _SGNode_clear;
SGNode.prototype._itemID          = -1;
SGNode.prototype._type            = undefined;
function SGNode(source)
{
    try
    {
        if (typeof(source) == "number")      // creating the node from item id in the iformation tree
            this._fromItemID(source);
        else if (typeof(source) == "string")
        {
            if (source.indexOf("0_") == 0) this._fromTerraObj(SGAPI.SGWorld.teCore.IObjectManager.GetObject(source));// assume creating the node from TerraExplorer object.
        }
        else if (typeof(source) == "object") // assume creating the node from TerraExplorer object.
            this._fromTerraObj(source);
        else                                 // creating an uninitialized node.
            this._clear();
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
}
function _SGNode_clear()
{
    this._itemID = -1;
    this._type   = undefined;
    this.innerObj= null;   
}
function _SGNode_fromItemID(itemID)
{
    if (typeof(itemID) == "number")
    {   
        if (Math.floor(itemID)+0.1 == itemID)
        {
            // This is a "fake item id". It is actually an inner objectID.
            itemID = "0_" + itemID.toFixed(0);
            this._fromTerraObj(SGAPI.SGWorld.teCore.IObjectManager.GetObject(itemID));
            return;
        }
    
        this._itemID = itemID;
        if (SGAPI.SGWorld.teCore.IInformationTree.IsGroup(itemID) || itemID == 0)  // the item represents a group or a layer
        {
            this.innerObj = null;  
            this._type    = sgNodeTypeGroup;
            if (itemID != 0)
            {
                this._type = (SGAPI.SGWorld.teCore.IInformationTree.IsLayer(itemID)) ? sgNodeTypeLayer : sgNodeTypeGroup;
                this.innerObj = new $SGGroupObj(this);
            }
        }
        else // this is TerraExplorer object.
            this._fromTerraObj(SGAPI.SGWorld.teCore.IInformationTree.GetObjectEx(this._itemID));
    }
}
function _SGNode_fromTerraObj(teObj)
{
    try
    {
        if (typeof(teObj) != "object") return false;        
        teObj.KeepAliveOnRelease = true;        
        this._itemID = teObj.InfoTreeItemID;
        this._type   = teObj.ObjectType;
        this.innerObj= teObj;            
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
}
function _SGNode_getAttribute(attName)
{
    if (this._itemID == -1) return undefined;    
    if (this._itemID == 0)  return "";    
    try
    {        
        var bGISAtt = (attName.toLowerCase().indexOf("gis:") == 0);    
        var att = this.getData( (bGISAtt == true) ? "" : "_nodeAttributes_" );
                    
        if (bGISAtt == true)
        {
            attName = attName.slice(4);
            SGAPI.SGWorld._xmlDOM.loadXML(att);
            var xmlNode = SGAPI.SGWorld._xmlDOM.selectSingleNode("FieldsData/"+attName);
            if (xmlNode == null) return undefined;
            att = xmlNode.text;
        }
        else if (att != "")
        {            
            SGAPI.SGWorld._xmlDOM.loadXML(att);
            att = SGAPI.SGWorld._xmlDOM.firstChild.getAttribute(attName);
        }
    
        return att;      
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return undefined;        
}
function _SGNode_setAttribute(attName, data)
{
    if (this._itemID == -1) return false;    
    if (this._itemID == 0)  return false;    
    try
    {   
        var bGISAtt = (attName.toLowerCase().indexOf("gis:") == 0);
        var name = (bGISAtt == true) ? "" : "_nodeAttributes_";     
        var current = this.getData(name);                
                
        if (bGISAtt == true)
        {
            attName = attName.slice(4);
            SGAPI.SGWorld._xmlDOM.loadXML(current);
            var xmlNode = SGAPI.SGWorld._xmlDOM.selectSingleNode("FieldsData/"+attName);
            if (xmlNode == null) return false;
            xmlNode.text = data;
        }
        else
        {            
            if (current == "") current = "<nodeAttributes></nodeAttributes>";                
            SGAPI.SGWorld._xmlDOM.loadXML(current);
            SGAPI.SGWorld._xmlDOM.firstChild.setAttribute(attName, data);
        }
        
        this.setData(name, SGAPI.SGWorld._xmlDOM.xml);
                    
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return false;        
}
function _SGNode_getData(datName)
{
    if (this._itemID == -1) return undefined;    
    if (this._itemID == 0)  return "";    
    try
    {
        var att = "";
        if (this._type == sgNodeTypeGroup || this._type == sgNodeTypeLayer)
            att = SGAPI.SGWorld.teCore.IInformationTree.GetClientDataEx(this._itemID, datName);
        else
            att = this.innerObj.ClientDataEx(datName);
            
        return att;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return undefined;        
}
function _SGNode_setData(datName, data)
{
    if (this._itemID == -1) return false;    
    if (this._itemID == 0)  return false;    
    try
    {
        if (this._type == sgNodeTypeGroup || this._type == sgNodeTypeLayer)
            SGAPI.SGWorld.teCore.IInformationTree.SetClientDataEx(this._itemID, datName, data);
        else
            this.innerObj.ClientDataEx(datName) = data;
            
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return false;
}
function _SGNode_nodeType() { return this._type; }
function _SGNode_nodeId() 
{ 
    // nodeId() always return a number.
    // This number can later be used as an argument for other SGAPI methods like navigate.flyTo() or creating new SGNode.
    // For TE groups, this is the information tree item ID.
    // For node innerObj that derived from ITerraExplorerObject, this is floating point representation of the innerObj ID
    try
    {    
        if (this._type == sgNodeTypeGroup || this._type == sgNodeTypeLayer)
        {
            if (this._itemID != -1 && this._itemID != 0)    // make sure that the itemID is still valid.
            {
                if (this.getName() == undefined) 
                    throw "Invalid item ID";
            }
        }
        else if (this.innerObj != null) // try to update the id from the inner obj
        {        
            this._itemID = this.innerObj.InfoTreeItemID;
            var fakeId = new Number(this.innerObj.ID.slice(2)) + 0.1; // "0_XXXXX" -> XXXXX.1
            return fakeId;
        }
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    

    return this._itemID; 
}
function _SGNode_getName()
{    
    if (this._itemID == -1) return undefined;    
    if (this._itemID == 0)  return "";        
    try
    {
        var name = SGAPI.SGWorld.teCore.IInformationTree.GetItemName(this._itemID);
        return name;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return undefined;        
}
function _SGNode_setName(name)
{
    if (this._itemID == -1) return false;   
    if (this._itemID == 0)  return false; // can't change the name of the TE root
    if (this._itemID == $createGroupID) return false; // can not change the name of the creator group
    try
    {
        if (this._type == sgNodeTypeGroup || this._type == sgNodeTypeLayer)
            SGAPI.SGWorld.teCore.IInformationTree.RenameGroup(this._itemID, name);
        else
            this.innerObj.Description =  name;               
    }
    catch(e) { SGAPI.SGWorld.lastError = e; return false; }    
    return true;    
}
function _SGNode_appendChild(node)
{
    if (this._itemID == -1) return false;            
    if (!(node instanceof SGNode)) return false;
    if (this._type != sgNodeTypeGroup) return false; // can only append items to groups.
    if (node._itemID == $createGroupID) return false; // can not move the creator group
    try
    {
        node._itemID = vbSetParent(node._itemID, this._itemID);
        if (!(node._type == sgNodeTypeGroup || node._type == sgNodeTypeLayer))
            node.innerObj.KeepAliveOnRelease = true;
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return false;    
}
function _SGNode_removeChild(node)
{
    if (this._itemID == -1) return false;            
    if (!(node instanceof SGNode)) return false;
    if (this._type != sgNodeTypeGroup) return false; // can only remve items from a group.
    if (node._itemID == $createGroupID) return false; // can not remove the creator group.    
    try
    {
        SGAPI.SGWorld.teCore.IInformationTree.DeleteItem(node._itemID);
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return false;            
}
function _SGNode_parentNode()
{
    if (this._itemID == -1) return null;        
    try
    {
        var parentID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(this._itemID, 15);
        return new SGNode(parentID);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _SGNode_hasChildNodes()
{
    if (this._itemID == -1) return false;        
    try
    {
        var childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(this._itemID, 11);            
        return (childID != 0);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return false;    
}
function _SGNode_firstChild()
{
    if (this._itemID == -1) return null;
    try
    {
        var childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(this._itemID, 11);
        if (childID != 0)
            return new SGNode(childID);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;        
}
function _SGNode_lastChild() // little expensive
{
    if (this._itemID == -1) return null;
    try
    {            
        var childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(this._itemID, 11);
        var lastChildID = childID;
        while (childID != 0)
        {
            childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(childID, 13);
            if (childID != 0) lastChildID = childID;
        }
        
        if (lastChildID != 0) return (new SGNode(lastChildID));
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;        
}
function _SGNode_nextSibling()
{
    if (this._itemID == -1) return null;
    try
    {            
        var childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(this._itemID, 13);
        if (childID != 0) return (new SGNode(childID));
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;            
}
function _SGNode_childNodes()
{
    if (this._itemID == -1) return null;
    try
    {   
        var length = 0;
        var arr = new Array();                 
        var childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(this._itemID, 11);
        while (childID != 0)
        {
            arr[length++] = childID;                
            childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(childID, 13);
        }        
        var nodeList = new SGNodeList(arr);
        return nodeList;        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;    
}
function _SGNode_selectSingleNode(queryString)
{
    if (this._itemID == -1) return null;    
    try
    {               
        if (queryString == "?SELECTED")
        {
            // Special case. The TE current selected group is needed.
            var selectedItem = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(0, 10);
            if (selectedItem != 0)
                return (new SGNode(selectedItem));
            return null;                
        }    
    
        var qs = queryString;        
        var retries = 2;    // We first try to find the string "as is". if this fails, we try to replace the '/' with '\'.     
        do
        {
            if (qs.charAt(0) == '\\') qs = qs.slice(1);
            var basePath = this.getName();
            var parentID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(this._itemID, 15);            
            while (parentID != 0)
            {
                var name = SGAPI.SGWorld.teCore.IInformationTree.GetItemName(parentID);
                basePath = name + "\\" + basePath;
                parentID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(parentID, 15);
            }                        
            qs = basePath + "\\" + qs;                
            var itemID = SGAPI.SGWorld.teCore.IInformationTree.FindItem(qs);
            if (itemID != 0) return (new SGNode(itemID));

            retries--;
            var re = /\//g;   
            qs = queryString.replace(re, "\\");            
        }
        while (retries > 0)
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;            
}
function _SGNode_setVisibility(visible)
{
    if (this._itemID == -1) return null;
    try
    {            
        SGAPI.SGWorld.teCore.IInformationTree.SetVisibility(this._itemID, visible);
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }        
    return false;
}
function _SGNode_getVisibility()
{
    if (this._itemID == -1) return false;
    try
    {
        return SGAPI.SGWorld.teCore.IInformationTree.GetVisibility(this._itemID);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return false;
}
function _SGNode_sort(sortMethod)
{
    if (this._itemID == -1) return false;
    try
    {
        if (sortMethod == null) sortMethod = sgSortAlphabeticallyAZ;
        return SGAPI.SGWorld.teCore.IInformationTree.SortGroup(this._itemID, sortMethod);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return false;
}
function _SGNode_save(name)
{
    if (this._itemID == -1) return false;
    if (this._type != sgNodeTypeGroup) return false; // can only save groups.
    try
    {            
        SGAPI.SGWorld.teCore.IInformationTree.SaveFlyLayer(name,this._itemID);
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }        
    return false;    
}
function _SGNode_load(layerURL)
{
    if (this._itemID == -1) return false;
    if (this._type != sgNodeTypeGroup) return false; // can only load into groups.

    try
    {                        
        if (layerURL != undefined && layerURL != "")
        {
            layerURL = SGAppData(layerURL);
            if (layerURL.toLowerCase().search(".fly") != -1)
            {
                var itemID = SGAPI.SGWorld.teCore.IInformationTree.LoadFlyLayerEx(layerURL, $createGroupID);
                if (itemID != 0)
                {
                    var childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(itemID, 11);                    
                    var siblingID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(childID, 13);
                    if (siblingID == 0) // this fly file contain only one group/item
                    {
                        itemID = childID;
                        childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(itemID, 11);
                    }
                    
                    while(childID != 0)
                    {
                        vbSetParent(childID, this._itemID);                                        
                        childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(itemID, 11);
                    }
                    SGAPI.SGWorld.teCore.IInformationTree.DeleteItem(itemID);
                    return true;
                }
            }
        }
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return false;
}
function _SGNode_getPosition(heightType, ignoreAngles)
{
    try
    {
        var pos = null;
        
        if (this._type == sgNodeTypeGroup || this._type == sgNodeTypeLayer)
        {
            pos = this.innerObj.getPosition();
        }
        else
        {   
            var pos = new SGPosition();
            pos.distance = this.innerObj.Distance; // for non ITerrainLocation derived objects, this will throw an exception
            vbObjectGetPosition(this.innerObj, pos);            
        }
        
        if (heightType != null) pos.changeHeightType(heightType);
        if (ignoreAngles == true) { pos.yaw = null; pos.pitch = null; pos.roll = null; } 
        
        return pos;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return null;
}
function _SGNode_setPosition(pos)
{
    try
    {
        var bSGCoord = (pos instanceof SGPosition || pos instanceof SGCoord3D || pos instanceof SGCoord2D);
        if (!bSGCoord) throw "Type Error";
                
        var x = 0,y = 0,height = 0,yaw = 0,pitch = 0,roll = 0,flags = 0;
        
        if (pos.x == null) flags |= 1; else x = pos.x;
        if (pos.y == null) flags |= 4; else y = pos.y;        
        if (pos instanceof SGPosition || pos instanceof SGCoord3D)
        {            
            if (pos.height == null) flags |= 2; else { height = pos.height; if (pos.heightType == sgHeightAbsolute) flags |= 8192; else flags |= 4096; }            
            if (pos instanceof SGPosition)
            {
                if (pos.yaw == null) flags |= 8; else yaw = pos.yaw;
                if (pos.pitch == null) flags |= 16; else pitch = pos.pitch;
                if (pos.roll == null) flags |= 32; else roll = pos.roll;
            }
            else
                flags |= 56;                        
        }
        else
            flags |= 2 + 56;
        
        if (this._type == sgNodeTypeGroup)
        {
            SGAPI.SGWorld.teCore.IInformationTree.SetGroupLocation(this._itemID, x, y, height, yaw, pitch, roll, flags);
        }
        else if (this._type == sgNodeTypeLayer)
        {
        
        }
        else
        {   
            this.innerObj.SetPosition(x, y, height, yaw, pitch, roll, flags);
        }
        
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return false;
}
function _SGNode_setMessage(node)
{
    try
    {
        if (node == null) { this.innerObj.MessageID = ""; return true; }        
        if (node instanceof SGPopup || node instanceof SGNotification) node = SGAPI.SGWorld.creator.createMessage(node, null, sgMessageClientPopup);
        if (!(node instanceof SGNode)) throw "Type Error";
        if (node._type != sgNodeTypeMessage) throw "Type Error";
        if (this._type == sgNodeTypeGroup || this._type == sgNodeTypeLayer || this._type == sgNodeTypeMessage) throw "Type Error"; // for now. future version will support messages for groups.        
        this.innerObj.MessageID = node.innerObj.ID;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
}
function _SGNode_isEqual(node)
{
    try
    {
        if (node == null || !(node instanceof SGNode)) throw "Type Error";
        var isNodeGroup = (node._type == sgNodeTypeGroup || node._type == sgNodeTypeLayer);
        var isMeGroup = (this._type == sgNodeTypeGroup || this._type == sgNodeTypeLayer);
        if (isMeGroup != isNodeGroup) return false;
        if (isMeGroup) { return (this.nodeId() == node.nodeId()); }        
        if (this.innerObj.ID == node.innerObj.ID) return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return false;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  $SGGroupObj class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$SGGroupObj.prototype.getPosition       = _$SGGroupObj_getPosition;
$SGGroupObj.prototype.setSaveInFlyFile  = _$SGGroupObj_setSaveInFlyFile;
$SGGroupObj.prototype.getSaveInFlyFile  = _$SGGroupObj_getSaveInFlyFile;

function $SGGroupObj(ownerNode)
{
    this._ownerNode = ownerNode;
}
function _$SGGroupObj_getPosition()
{
    try
    {
    
        if (SGAPI.SGWorld.bV510orGreater)
        {
            var groupPos = new SGPosition();
            vbGetGroupLocation(this._ownerNode._itemID, groupPos);
            
            if (groupPos.x == 0 && groupPos.y == 0 && groupPos.height == 0 && groupPos.distance == 0)
                return null;

            return groupPos;
        }
                
        // For versions lesser then v5.1 we need to calculate position for the group ourselves 
        if (this._ownerNode._type == sgNodeTypeGroup)
        {
            var groupPos = new SGPosition();
            vbGetGroupLocation(this._ownerNode._itemID, groupPos);
            if (groupPos.x == 0 && groupPos.y == 0 && groupPos.height == 0 && groupPos.distance == 0)
            {
                var arr = new Array();
                var maxNodes = 10;
                var node = this._ownerNode.firstChild();
                while (node != null && maxNodes > 0)
                {
                    if (node._type != sgNodeTypeGroup && node._type != sgNodeTypeLayer) arr.push(node);                                            
                    node = node.nextSibling();
                    maxNodes--;
                }
                
                if (arr.length > 0)
                    return new SGPosition(arr);
                else      
                    return null; // this group do not have position
            }
            return groupPos;
        }
        else if (this._ownerNode._type == sgNodeTypeLayer)
        {
            var lbi = this._ownerNode.getAttribute("LayerBaseInfo");
            if (lbi != "" && lbi != undefined)
            {
                xmldoc = new ActiveXObject("Msxml2.DOMDOcument.3.0");
                xmldoc.async = false;
                xmldoc.loadXML("<root>"+lbi+"</root>");
                var n = xmldoc.selectSingleNode("root/PlugData/GroupKey");
                if (n != null)
                {
                    if (n.text == "LAT-LONG")
                    {
                        var minX = new Number(xmldoc.selectSingleNode("root/PlugData/UserBoundingBox/MinX").text);
                        var minY = new Number(xmldoc.selectSingleNode("root/PlugData/UserBoundingBox/MinY").text);
                        var maxX = new Number(xmldoc.selectSingleNode("root/PlugData/UserBoundingBox/MaxX").text);
                        var maxY = new Number(xmldoc.selectSingleNode("root/PlugData/UserBoundingBox/MaxY").text);                        
                        var from = new SGCoord2D(minX, minY);
                        var to   = new SGCoord2D(maxX, maxY);
                        var dist = sgLevelGlobe;                        
                        if ((minX==-180 && minY==-90 && maxX==180 && maxY==90) || (minX==0 && minY==0 && maxX==0 && maxY==0)) // 
                        {
                            // try to retrive the first object of the layer                            
                        }
                        else { dist = SGAPI.SGWorld.coordinates.getDistance(from, to); }                        
                        var layerPos = new SGPosition(minX + (maxX - minX)/2, minY+(maxY - minY)/2, 100.0, 0.0, -75.0, dist*0.8);
                        return layerPos;                                                
                    }
                    else    // need conversion
                    {
                    }
                }
            }
        }
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return null;
}

function _$SGGroupObj_setSaveInFlyFile(bSave)
{
    try
    {
        if (SGAPI.SGWorld.bV510orGreater == false)
            return;

        if (this._ownerNode._type == sgNodeTypeGroup)
        {
            if (bSave == 0)
                this._ownerNode.setData("_SaveOptions_", "1");
            else
                this._ownerNode.setData("_SaveOptions_", "");
        }
        else if (this._ownerNode._type == sgNodeTypeLayer)
        {
        
        }
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
}
function _$SGGroupObj_getSaveInFlyFile()
{
    try
    {
        if (SGAPI.SGWorld.bV510orGreater == false)
            return 1;
    
        if (this._ownerNode._type == sgNodeTypeGroup)
        {
            if (this._ownerNode.getData("_SaveOptions_") == "1")
                return 0;
            else
                return 1;
        }
        else if (this._ownerNode._type == sgNodeTypeLayer)
        {
        
        }
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return 1;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SGNodeList class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function SGNodeList(arr)
{    
    this._arr     = arr;
    this._current = 0;
    this.length   = arr.length;
        
    this.item     = _SGNodeList_item;    
    this.nextNode = _SGNodeList_nextNode;
    this.reset    = _SGNodeList_reset;
}
function _SGNodeList_item(index)
{
    try
    {   
        var itemID = 0;      
        if (typeof(index) == "number")
        {
            itemID = this._arr[index];
            return new SGNode(itemID);
        }
        else if (typeof(index) == "string")
        {
            for (var i=0; i < this.length; i++)
            {
                itemID = this._arr[i];
                var name = SGAPI.SGWorld.teCore.IInformationTree.GetItemName(itemID);
                if (name == index)
                    return new SGNode(itemID);
            }
        }
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;    
}
function _SGNodeList_nextNode()
{
    try
    {                
        if (this._current >= this.length) return null;            
        return this.item(this._current++);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;            
}
function _SGNodeList_reset() { this._current = 0; }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SGNavigate class
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$SGNavigate.prototype.getPosition = _$SGNavigate_getPosition;
$SGNavigate.prototype.setPosition = _$SGNavigate_setPosition;
$SGNavigate.prototype.flyTo       = _$SGNavigate_flyTo;
$SGNavigate.prototype.jumpTo      = _$SGNavigate_jumpTo;
$SGNavigate.prototype.flyThrough  = _$SGNavigate_flyThrough;
$SGNavigate.prototype.zoomTo      = _$SGNavigate_zoomTo;
$SGNavigate.prototype.zoomIn      = _$SGNavigate_zoomIn;
$SGNavigate.prototype.zoomOut     = _$SGNavigate_zoomOut;
$SGNavigate.prototype.stop        = _$SGNavigate_stop;

$SGNavigate.prototype._flyToPos   = _$SGNavigate_flyToPos;
$SGNavigate.prototype._flyToNode  = _$SGNavigate_flyToNode;
$SGNavigate.prototype._flyToArray = _$SGNavigate_flyToArray;
$SGNavigate.prototype._flyThrough = null;

function $SGNavigate()
{
}
function _$SGNavigate_getPosition(heightType)
{
    var pos = new SGPosition();
    try
    {                    
        pos.heightType = (heightType == undefined) ? sgHeightRelative : heightType;        
        vbPlaneGetPosition(pos);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; return null; }    
    return pos;
}
function _$SGNavigate_setPosition(pos)
{
    try
    {    
        var flag = 0;
        if (pos.x           == undefined) flag |= 1;  // ignore x
        if (pos.y           == undefined) flag |= 4;  // ignore y
        if (pos.height      == undefined) flag |= 2;  // ignore height
        if (pos.yaw         == undefined) flag |= 8;  // ignore yaw
        if (pos.pitch       == undefined) flag |= 2048; // ignore camera pitch
        flag |= (pos.heightType  == sgHeightAbsolute) ? 8192 : 4096; // absolute height:relative height        
        SGAPI.SGWorld.teCore.IPlane.MovePosition(pos.x, pos.y, pos.height, pos.yaw, 0, 0, 0, pos.pitch, flag);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; return false; }    
    return true;
}
function _$SGNavigate_flyTo(obj, pattern)
{
    try
    {        
        if (pattern == undefined) pattern = sgPatternFlyto;
        if (obj instanceof SGPosition)
        {
            return this._flyToPos(obj, pattern);
        }
        else if (obj instanceof SGCoord3D || obj instanceof SGCoord2D)
        {
            var pos = new SGPosition(obj);
            pos.distance = 500;
            return this._flyToPos(pos, pattern);
        }
        else if (obj instanceof SGNode)
        {
            return this._flyToNode(obj, pattern);
        }
        else if (typeof(obj) == "string")
        {
            if (obj.indexOf("0_") == 0) { SGAPI.SGWorld.teCore.IPlane.FlyToObject(obj, _arrPatternToAC[pattern]); return true; }
            else { var pos = new SGPosition(obj); return this._flyToPos(pos, pattern); }
        }
        else if (typeof(obj) == "number")
        {
            return this._flyToNode(new SGNode(obj), pattern);
        }
        else if (obj instanceof Array)
        {
            return this._flyToArray(obj, pattern);
        }
        
        throw "Unknown object type for 'flyTo' operation";
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }                    
    return false;
}
function _$SGNavigate_flyThrough(obj)
{
    if (obj instanceof SGFlyThrough)
        obj.start();
    else
    {
        this._flyThrough = new SGFlyThrough(obj)
        this._flyThrough.start();
    }        
}
function _$SGNavigate_jumpTo(obj)
{
    this.flyTo(obj, sgPatternJump);
}
function _$SGNavigate_zoomTo(distanceFromPOI)
{
    try
    {
        SGAPI.SGWorld.teCore.IPlane.Zoom(distanceFromPOI,0);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; return false; }                    
    return true;        
}
function _$SGNavigate_zoomIn(delta)
{
    try
    {
        var ret = SGAPI.SGWorld.window.pixelToWorld();
        if (ret == null) { throw "Zoom point is not defined"; }
        var pos = this.getPosition();
        if (delta == null)
            delta = pos.distanceTo(ret.coord) / 3.0;
        else
            delta = pos.distanceTo(ret.coord) - delta;        
        SGAPI.SGWorld.teCore.IPlane.Zoom(delta,0);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; return false; }                    
    return true;
}
function _$SGNavigate_zoomOut(delta)
{
    try
    {
        var ret = SGAPI.SGWorld.window.pixelToWorld();
        if (ret == null) { throw "Zoom point is not defined"; }
        var pos = this.getPosition();
        if (delta == null)
            delta = pos.distanceTo(ret.coord) * 3.0;
        else
            delta = pos.distanceTo(ret.coord) + delta;        
        SGAPI.SGWorld.teCore.IPlane.Zoom(delta,0);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; return false; }                    
    return true;
}
function _$SGNavigate_stop()
{
    try
    {
        if (this._flyThrough != null) this._flyThrough.finish();
            
        // Temp non-elegant implementation of stop (due to lack of an appropriate interface in TE)
        pos = this.getPosition(sgHeightAbsolute);
        pos.distance = 1;
        this.jumpTo(pos);
        this.setPosition(pos);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; return false; }                    
    return true;              
}
function _$SGNavigate_flyToPos(pos, pattern)
{
    if (!(pos instanceof SGPosition)) return false;        
    if (pos.x == null || pos.y == null) return false;
    
    var absPos = new SGPosition(pos);
    var currPos = this.getPosition(sgHeightAbsolute);            
    if (absPos.yaw   == null) absPos.yaw   = currPos.yaw;
    if (absPos.pitch == null) absPos.pitch = currPos.pitch;
    if (absPos.height== null) { absPos.height= currPos.height; absPos.heightType = sgHeightAbsolute; }
    if (absPos.distance== null) absPos.distance = 1.0;
    absPos.changeHeightType(sgHeightAbsolute);
    SGAPI.SGWorld.teCore.IPlane.FlyTo(absPos.x, absPos.y, absPos.height, absPos.distance, absPos.yaw, absPos.pitch, pattern);
    return true;
}
function _$SGNavigate_flyToNode(node, pattern)
{
    if (!(node instanceof SGNode)) return false;
    
    if (node._type == sgNodeTypeGroup || node._type == sgNodeTypeLayer)   // node is a group.
    {
        var pos = null;
        if (pattern != sgPatternFlyThrough)
            var pos = node.getPosition();
            
        if (pos == null) // the location of this group was not set. try to find an actuall loaction to fly to within this group
        {
            var arr = new Array();
            var limit = (pattern == sgPatternFlyThrough) ? 99999999 : 10;
            var childNode = node.firstChild();
            for (var i = 0; i < limit && childNode != null; i++, childNode = childNode.nextSibling())
                if (childNode.getPosition() != null) arr.push(childNode);
            return this._flyToArray(arr, pattern);
        }
        else
            return this._flyToPos(pos, pattern);
    }
    else if (node.getPosition())
    {
        SGAPI.SGWorld.teCore.IPlane.FlyToObject(node.innerObj.ID, _arrPatternToAC[pattern]);
        return true;
    }
    
    return false;
}
function _$SGNavigate_flyToArray(arr, pattern)
{
    if (!(arr instanceof Array)) return false;
    if (arr.length < 1) return false;
    
    if (pattern == sgPatternFlyThrough)
    {    
        if (this._flyThrough == null)
            this._flyThrough = new SGFlyThrough();
            
        this._flyThrough._arr = arr;
        this._flyThrough._next();
        
        return true;
    }
    else
    {        
        // Fly to a position which is the center of all the positions boundig box.
        var arrPos = new SGPosition(arr);
        if (arrPos.x != null)
            return this._flyToPos(arrPos, pattern);
    }
        
    return false;    
}

////////////////////////////////////////////////////
//
//  SGFlyThrough class
//
////////////////////////////////////////////////////
SGFlyThrough.prototype.start                    = _SGFlyThrough_start;
SGFlyThrough.prototype.finish                   = _SGFlyThrough_finish;
SGFlyThrough.prototype.viewingDistance          = undefined;
SGFlyThrough.prototype.viewingDirection         = undefined;
SGFlyThrough.prototype.waitOnPoint              = 1500;
SGFlyThrough.prototype.onFlyTo                  = null;
SGFlyThrough.prototype.onFinish                 = null;
SGFlyThrough.prototype._next                    = _SGFlyThrough_next;
SGFlyThrough.prototype._onNodeAction            = _SGFlyThrough_onNodeAction;
SGFlyThrough.prototype._onInputModeChanged      = _SGFlyThrough_onInputModeChanged;
SGFlyThrough.prototype._onLButtonDown           = _SGFlyThrough_onLButtonDown;
SGFlyThrough.prototype._prepareLocation         = _SGFlyThrough_prepareLocation;
SGFlyThrough.prototype._ftObj                   = null;
SGFlyThrough.prototype._arr                     = null;
SGFlyThrough.prototype._currentDestinationIndex = 0;
SGFlyThrough.prototype._waiting                 = false;
SGFlyThrough.prototype._timeoutId               = undefined;
SGFlyThrough.prototype._nodeLocation            = null;

function SGFlyThrough(obj, waitOnPoint, viewingDistance, viewingDirection)
{
    this._ftObj = obj;
    
    if (waitOnPoint != undefined) 
        this.waitOnPoint = waitOnPoint;        

    if (viewingDistance != undefined) 
        this.viewingDistance = viewingDistance;            
        
    if (viewingDirection != undefined) 
        this.viewingDirection = viewingDirection;                    
}
function _SGFlyThrough_start()
{
    SGAPI.SGWorld.navigate._flyThrough = this;
    SGAPI.SGWorld.navigate.flyTo(this._ftObj, sgPatternFlyThrough);
}
function _SGFlyThrough_prepareLocation(i)
{
    var _This = SGAPI.SGWorld.navigate._flyThrough;        
    
    var pos = null;    
    var realLocation = false;    
    var obj = _This._arr[i];
    
    if (obj instanceof SGNode)
    {
        pos = obj.getPosition();
        if (obj.nodeType() == sgNodeTypeLocation) realLocation = true;
    }
    else
        pos = new SGPosition(obj);        
    
    if (_This.viewingDirection != undefined)
        pos.yaw = _This.viewingDirection;
    
    if (realLocation == false)
    {
        if (_This.viewingDirection == undefined)
        {
            if (i < _This._arr.length - 1 && (pos.yaw == undefined || pos.yaw == 0))
            {
                var nextPos = null;
                var nextObj = _This._arr[i+1];
                
                if (nextObj instanceof SGNode)
                    nextPos = nextObj.getPosition();
                else
                    nextPos = new SGPosition(nextObj);
                            
                var angles = pos.anglesTo(nextPos);
                pos.yaw = angles.yaw;
            }
        }
                
        if (pos.pitch == undefined || pos.pitch == 0)
            pos.pitch = -30;
    }    
    
    if (_This.viewingDistance != undefined)
        pos.distance = _This.viewingDistance;
    else if (pos.distance == undefined)
        pos.distance = 500;
    
    try 
    { 
        if (_This._nodeLocation != null)
            SGAPI.SGWorld.teCore.IInformationTree.DeleteItem(_This._nodeLocation._itemID); 
            
        _This._nodeLocation = SGAPI.SGWorld.creator.createLocation(pos);
    } 
    catch(e) { SGAPI.SGWorld.lastError = e; }
            
}
function _SGFlyThrough_next()
{
    var _This = SGAPI.SGWorld.navigate._flyThrough;
    if (_This == null) return;

    
    var skipPoint = false;
    
    do
    {
        skipPoint = false;
        
        if (_This._currentDestinationIndex >= _This._arr.length)
        {
            _This.finish();
            return;
        }

        var ret = true; 
        if (_This.onFlyTo != null)
            ret = _This.onFlyTo(_This._arr[_This._currentDestinationIndex]);     // this can be the result of the client calling SGWorld.navigate.stop();
        
        if (SGAPI.SGWorld.navigate._flyThrough == null)
        {
            if (_This.onFinish != null)
            {   
                if (_This.onFinish() == true) { _This._currentDestinationIndex = 0; _This.start(); }            
            }        

            return;
        }             
        
        if (ret == false)
        {            
            _This._currentDestinationIndex++;
            skipPoint = true;
        }
    }
    while (skipPoint == true);
    
        
    _This._waiting = false;
        
    SGAPI.SGWorld.detachEvent("onNodeAction", _This._onNodeAction);
    SGAPI.SGWorld.detachEvent("onInputModeChanged", _This._onInputModeChanged);
    SGAPI.SGWorld.detachEvent("onLButtonDown", _This._onLButtonDown);    
                
    _This._prepareLocation(_This._currentDestinationIndex)
    SGAPI.SGWorld.navigate.flyTo(_This._nodeLocation);
            
    SGAPI.SGWorld.attachEvent("onNodeAction", _This._onNodeAction);
    SGAPI.SGWorld.attachEvent("onInputModeChanged", _This._onInputModeChanged);   
    SGAPI.SGWorld.attachEvent("onLButtonDown", _This._onLButtonDown);      
}
function _SGFlyThrough_finish()
{
    var _This = SGAPI.SGWorld.navigate._flyThrough;    
    if (_This == null) return;
    
    SGAPI.SGWorld.navigate._flyThrough = null;    
        
    clearTimeout(_This._timeoutId);

    _This._waiting = false;

    SGAPI.SGWorld.detachEvent("onNodeAction", _This._onNodeAction);
    SGAPI.SGWorld.detachEvent("onInputModeChanged", _This._onInputModeChanged);
    SGAPI.SGWorld.detachEvent("onLButtonDown", _This._onLButtonDown);
                    
    _This._arr = null;
    
    if (_This.onFinish != null)
    {   
        if (_This.onFinish() == true) { _This._currentDestinationIndex = 0; _This.start(); }            
    }        
        
}
function _SGFlyThrough_onNodeAction(node, action)
{
    var _This = SGAPI.SGWorld.navigate._flyThrough;    
    if (_This == null) return;

    if (action == sgActionCodeStop && node.isEqual(_This._nodeLocation))
    {     
        _This._waiting = true;
        _This._currentDestinationIndex++;
        _This._timeoutId = setTimeout(_This._next, _This.waitOnPoint);
    }
}
function _SGFlyThrough_onInputModeChanged(newMode)
{
    var _This = SGAPI.SGWorld.navigate._flyThrough;    
    if (_This == null) return;
        
    if (_This._waiting == true)
        _This.finish();    
}
function _SGFlyThrough_onLButtonDown(Flags, X, Y)
{    
    var _This = SGAPI.SGWorld.navigate._flyThrough;
    if (_This == null) return;
    
    _This.finish();   
}

////////////////////////////////////////////////////
//
//  SGPosition class
//
////////////////////////////////////////////////////
SGPosition.prototype.changeHeightType = _SGPosition_changeHeightType;
SGPosition.prototype.toAbsolute       = _SGPosition_toAbsolute;
SGPosition.prototype.toRelative       = _SGPosition_toRelative;
SGPosition.prototype.move             = _SGPosition_move;
SGPosition.prototype.distanceTo       = _SGPosition_distanceTo;
SGPosition.prototype.anglesTo         = _SGPosition_anglesTo;
SGPosition.prototype.aimTo            = _SGPosition_aimTo;
SGPosition.prototype.moveToward       = _SGPosition_moveToward;
SGPosition.prototype.lerp             = _SGPosition_lerp;
SGPosition.prototype.copy             = _SGPosition_copy;
SGPosition.prototype.toString         = _SGPosition_toString;
SGPosition.prototype.toXML            = _SGPosition_toXML;
SGPosition.prototype.isEqual          = _SGPosition_isEqual;
SGPosition.prototype.x                = undefined;
SGPosition.prototype.y                = undefined;
SGPosition.prototype.height           = undefined;
SGPosition.prototype.heightType       = undefined;
SGPosition.prototype.yaw              = undefined;
SGPosition.prototype.pitch            = undefined;
SGPosition.prototype.roll             = undefined;
SGPosition.prototype.distance         = undefined;
function SGPosition(x,y,height,yaw,pitch,distance,heightType, roll)
{       
    if (typeof(x) == "string") { if (isNaN(x)) x = SGAPI.SGWorld._parser.parse(x); }

    if (x instanceof SGPosition)
    {        
        this.copy(x); 
        return;
    }
    else if (x instanceof SGCoord3D)
    {
        this.x = x.x; 
        this.y = x.y;
        this.height = x.height;
        this.heightType = x.heightType;
        this.yaw = undefined;
        this.pitch = undefined;
        this.roll = 0.0;
        this.distance = undefined;
        return;
    }
    else if (x instanceof SGCoord2D)
    {
        this.x = x.x; 
        this.y = x.y;    
        this.height = 0;
        this.heightType = sgHeightAbsolute;
        this.yaw = undefined;
        this.pitch = undefined;
        this.roll = 0.0;
        this.distance = undefined;    
        return;
    }
    else if (x instanceof Array)
    {
        var pos = _SGCoord_fromArray(x);
        this.copy(pos);
        return;
    }

    this.x = SGParseFloat(x);
    this.y = SGParseFloat(y);
    this.height = SGParseFloat(height);
    this.yaw = SGParseFloat(yaw);
    this.pitch = SGParseFloat(pitch);
    this.roll = (roll == null) ? 0.0 : SGParseFloat(roll);
    this.distance = SGParseFloat(distance);
    this.heightType = (heightType == undefined) ? sgHeightRelative : heightType;
}
function _SGPosition_changeHeightType(newHeightType)
{
    if (newHeightType == this.heightType)
        return;
    
    this.height = _SGCoord_convertHeight(this.x, this.y, this.height, newHeightType)
    this.heightType = newHeightType;
}
function _SGPosition_toAbsolute()
{
    var coord = (this instanceof SGPosition) ? new SGPosition(this) : new SGCoord3D(this)
    coord.changeHeightType(sgHeightAbsolute);
    return coord;
}
function _SGPosition_toRelative()
{
    var coord = (this instanceof SGPosition) ? new SGPosition(this) : new SGCoord3D(this)
    coord.changeHeightType(sgHeightRelative);
    return coord;
}
function _SGPosition_copy(pos)
{
    if (pos == null) return;
    
    this.x = pos.x; 
    this.y = pos.y;
    this.height = pos.height;
    this.yaw = pos.yaw;
    this.pitch = pos.pitch;
    this.roll = pos.roll;        
    this.distance = pos.distance;
    this.heightType = pos.heightType;
}
function _SGPosition_aimTo(coord)
{
    var angles = this.anglesTo(coord, true);
    var pos = new SGPosition(this);
    pos.yaw = angles.yaw; pos.pitch = angles.pitch; 
    return pos;
}
function _SGPosition_move(distance,yaw,pitch)    { return _SGCoord_move(this, distance,yaw,pitch); }
function _SGPosition_moveToward(coord, distance) { return _SGCoord_moveToward(this, distance, coord); }
function _SGPosition_lerp(coord, percentage)     { return _SGCoord_lerp(this, percentage, coord); }
function _SGPosition_distanceTo(coord)           { return _SGCoord_distanceTo(this, coord); }
function _SGPosition_anglesTo(coord, bCartesian) { return _SGCoord_anglesTo(this, coord, bCartesian); }
function _SGPosition_toString()
{
    var str = "SGPosition(";
    str += (this.x != null)         ? this.x            : "null";
    str += (this.y != null)         ? ","+this.y        : ",null";
    str += (this.height != null)    ? ","+this.height   : ",null";
    str += (this.yaw != null)       ? ","+this.yaw      : ",null";
    str += (this.pitch != null)     ? ","+this.pitch    : ",null";
    str += (this.distance != null)  ? ","+this.distance : ",null";
    str += (this.heightType != null)? ","+this.heightType:",null";
    str += (this.roll != null)      ? ","+this.roll     : ",null";
    str += ")";
    return str;
}
function _SGPosition_toXML()
{
    var str = "<SGPosition>";
    if (this.x != null)         str += "<x>"+this.x+"</x>";
    if (this.y != null)         str += "<y>"+this.y+"</y>";
    if (this.height != null)    str += "<height>"+this.height+"</height>";
    if (this.yaw != null)       str += "<yaw>"+this.yaw+"</yaw>";
    if (this.pitch != null)     str += "<pitch>"+this.pitch+"</pitch>";
    if (this.roll != null)      str += "<roll>"+this.roll+"</roll>";
    if (this.distance != null)  str += "<distance>"+this.distance+"</distance>";
    if (this.heightType != null)str += "<heightType>"+this.heightType+"</heightType>";
    str += "</SGPosition>";
    return str;
}
function _SGPosition_isEqual(coord)
{
    if (coord instanceof SGPosition)
    {
        if (coord.x == this.x &&
            coord.y == this.y && 
            coord.height == this.height && 
            coord.yaw == this.yaw && 
            coord.pitch == this.pitch && 
            coord.roll == this.roll &&
            coord.distance == this.distance && 
            coord.heightType == this.heightType)
            return true;
    }
    return false;
}
function _SGCoord_convertHeight(x,y,height, toHeightType)
{
    try
    {
        var groundHeight = SGAPI.SGWorld.teCore.ITerrain.GetGroundHeight(x, y, $groundHeightAccuracyConversion);
        return (toHeightType == sgHeightAbsolute) ? (height+groundHeight) : (height-groundHeight);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return 0;
}
function _SGCoord_move(coord, distance,yaw,pitch)
{
    try
    {
        var ret = null;
        if (distance == undefined) throw "distance is not defined";
        if (coord instanceof SGCoord2D)
        {
            if (yaw == undefined) throw "yaw must be defined for moving SGCoord2D";
            if (pitch == undefined) pitch = 0;
            ret = new SGCoord3D(coord);
            vbMoveCoordEx(ret, distance, yaw, pitch);
            ret = new SGCoord2D(ret);
        }
        else if (coord instanceof SGCoord3D)
        {
            if (yaw == undefined) throw "yaw must be defined for moving SGCoord3D";
            if (pitch == undefined) pitch = 0;
            ret = new SGCoord3D(coord);
            vbMoveCoordEx(ret, distance, yaw, pitch);
        }
        else if (coord instanceof SGPosition)
        {
            if (yaw == undefined) yaw = coord.yaw;
            if (pitch == undefined) pitch = coord.pitch;
            ret = new SGPosition(coord);
            ret.yaw = vbMoveCoordEx(ret, distance, yaw, pitch);
        }
        return ret;
    }        
    catch(e) { SGAPI.SGWorld.lastError = e; }                    
    return null;           
}
function _SGCoord_moveToward(coord, distance, destCoord)
{
    var angles = _SGCoord_anglesTo(coord, destCoord);
    return _SGCoord_move(coord, distance, angles.yaw, angles.pitch);
}
function _SGCoord_lerp(coord, percentage, destCoord)
{
    var dist = _SGCoord_distanceTo(coord, destCoord);
    return _SGCoord_moveToward(coord, Math.min(1.0, Math.max(percentage, 0)) * dist , destCoord);
}
function _SGCoord_distanceTo(from, to)
{
    try
    {
        var fromX = from.x,fromY = from.y, fromH = 0;
        var toX = to.x,toY = to.y, toH = 0;    
        if (from instanceof SGCoord3D || from instanceof SGPosition) { fromH = (from.heightType != sgHeightAbsolute) ? _SGCoord_convertHeight(fromX,fromY,from.height, sgHeightAbsolute) : from.height; }
        if (to instanceof SGCoord3D || to instanceof SGPosition) { toH = (to.heightType != sgHeightAbsolute) ? _SGCoord_convertHeight(toX,toY,to.height, sgHeightAbsolute) : to.height; }        
        return SGAPI.SGWorld.teCore.ICoordSys.GetDistanceEx(fromX,fromY,fromH, toX,toY,toH);
    }        
    catch(e) { SGAPI.SGWorld.lastError = e; }                    
    return null;           
}
function _SGCoord_anglesTo(from, to, bCartesian)
{
    try
    {
        if (bCartesian == null) bCartesian = false;
        var fromX = from.x,fromY = from.y, fromH = 0;
        var toX = to.x,toY = to.y, toH = 0;    
        if (from instanceof SGCoord3D || from instanceof SGPosition) { fromH = (from.heightType != sgHeightAbsolute) ? _SGCoord_convertHeight(fromX,fromY,from.height, sgHeightAbsolute) : from.height; }
        if (to instanceof SGCoord3D || to instanceof SGPosition) { toH = (to.heightType != sgHeightAbsolute) ? _SGCoord_convertHeight(toX,toY,to.height, sgHeightAbsolute) : to.height; }
        var ret = new Object();
        ret.yaw = 0; ret.pitch = 0;        
        vbGetAimingAnglesEx(fromX, fromY, fromH, toX, toY, toH, bCartesian ? 1 : 0 ,ret);
        return ret;
    }        
    catch(e) { SGAPI.SGWorld.lastError = e; }                    
    return null;           
}
function _SGCoord_fromArray(arr)
{
    if (!(arr instanceof Array)) return null;
    if (arr.length < 1) return null;
    if (arr.length == 1) return ( (arr[0] instanceof SGNode) ? arr[0].getPosition() : new SGPosition(arr[0]) );
    
    var entry = (arr[0] instanceof SGNode) ? arr[0].getPosition() : arr[0];
    var bSGCoord = (entry instanceof SGPosition || entry instanceof SGCoord3D || entry instanceof SGCoord2D);

    var minX, minY, maxX, maxY, tmpH, maxH = 0;
    var step = (bSGCoord) ? 1 : 3;
    for (var i = 0; i < arr.length; i+=step)
    {
        if (bSGCoord)
        {
            tmpH = 0;        
            var pos = (arr[i] instanceof SGNode) ? arr[i].getPosition() : arr[i];
            if (pos instanceof SGCoord3D || pos instanceof SGPosition) { tmpH = (pos.heightType != sgHeightAbsolute) ? _SGCoord_convertHeight(pos.x,pos.y,pos.height, sgHeightAbsolute) : pos.height; }
            if (i == 0) { minX = maxX = pos.x; minY = maxY = pos.y; maxH = tmpH; continue; }
            
            if (minX > pos.x) minX = pos.x;
            if (maxX < pos.x) maxX = pos.x;
            if (minY > pos.y) minY = pos.y;
            if (maxY < pos.y) maxY = pos.y;
            if (maxH < tmpH) maxH = tmpH;                        
        }
        else
        {
            var x = SGParseFloat(arr[i * 3 + 0]); var y = SGParseFloat(arr[i * 3 + 2]); var h = SGParseFloat(arr[i * 3 + 1]);
            if (i == 0) { minX = maxX = x; minY = maxY = y; maxH = h; continue; }
            
            if (minX > x) minX = x;
            if (maxX < x) maxX = x;
            if (minY > y) minY = y;
            if (maxY < y) maxY = y;
            if (maxH < h) maxH = h;        
        }                        
    }
    var p1 = new SGCoord3D(minX,minY,maxH/2);            
    var p2 = new SGCoord3D(maxX,maxY,maxH/2);
    var dist = p1.distanceTo(p2);
    var midP = p1.moveToward(p2, dist/2);
    var newPos = new SGPosition(midP.x, midP.y, midP.height, 0, -50, Math.max(maxH,2*dist), sgHeightAbsolute);
    //newPos = newPos.move(Math.max(maxH,dist*1.2), 180.0, 50.0).aimTo(midP);
    return newPos;
}
////////////////////////////////////////////////////
//
//  SGCoord2D class
//
////////////////////////////////////////////////////
SGCoord2D.prototype.move       = _SGCoord2D_move;
SGCoord2D.prototype.moveToward = _SGCoord2D_moveToward;
SGCoord2D.prototype.lerp       = _SGCoord2D_lerp;
SGCoord2D.prototype.distanceTo = _SGCoord2D_distanceTo;
SGCoord2D.prototype.anglesTo   = _SGCoord2D_anglesTo;
SGCoord2D.prototype.toString   = _SGCoord2D_toString;
SGCoord2D.prototype.toXML      = _SGCoord2D_toXML;
SGCoord2D.prototype.isEqual    = _SGCoord2D_isEqual;
SGCoord2D.prototype.x          = null;
SGCoord2D.prototype.y          = null;
function SGCoord2D(x,y)
{    
    if (typeof(x) == "string") { if (isNaN(x)) x = SGAPI.SGWorld._parser.parse(x); }

    if (x instanceof SGCoord2D || x instanceof SGCoord3D || x instanceof SGPosition)
    {
        this.x = SGParseFloat(x.x);
        this.y = SGParseFloat(x.y);
        return;
    }
    else if (x instanceof Array)
    {
        var pos = _SGCoord_fromArray(x);
        if (pos != null)
        {
            this.x = pos.x;
            this.y = pos.y;        
        }
        return;
    }

    this.x = SGParseFloat(x);
    this.y = SGParseFloat(y);
}
function _SGCoord2D_move(distance,yaw,pitch)    { return _SGCoord_move(this, distance,yaw,pitch); }
function _SGCoord2D_moveToward(coord, distance) { return _SGCoord_moveToward(this, distance, coord); }
function _SGCoord2D_lerp(coord, percentage)     { return _SGCoord_lerp(this, percentage, coord); }
function _SGCoord2D_distanceTo(coord)           { return _SGCoord_distanceTo(this, coord); }
function _SGCoord2D_anglesTo(coord, bCartesian) { return _SGCoord_anglesTo(this, coord, bCartesian); }
function _SGCoord2D_toString()
{
    var str = "SGCoord2D(";
    str += (this.x != null) ? this.x     : "null";
    str += (this.y != null) ? ","+this.y : ",null";
    str += ")";
    return str;
}
function _SGCoord2D_toXML()
{
    var str = "<SGCoord2D>";
    if (this.x != null) str += "<x>"+this.x+"</x>";
    if (this.y != null) str += "<y>"+this.y+"</y>";
    str += "</SGCoord2D>";
    return str;
}
function _SGCoord2D_isEqual(coord)
{
    if (coord instanceof SGCoord2D)
    {
        if (coord.x == this.x &&
            coord.y == this.y) 
            return true;
    }
    return false;
}
////////////////////////////////////////////////////
//
//  SGCoord3D class
//
////////////////////////////////////////////////////
SGCoord3D.prototype.changeHeightType = _SGPosition_changeHeightType;
SGCoord3D.prototype.toAbsolute       = _SGPosition_toAbsolute;
SGCoord3D.prototype.toRelative       = _SGPosition_toRelative;
SGCoord3D.prototype.move             = _SGCoord3D_move;
SGCoord3D.prototype.moveToward       = _SGCoord3D_moveToward;
SGCoord3D.prototype.lerp             = _SGCoord3D_lerp;
SGCoord3D.prototype.distanceTo       = _SGCoord3D_distanceTo;
SGCoord3D.prototype.anglesTo         = _SGCoord3D_anglesTo;
SGCoord3D.prototype.aimTo            = _SGCoord3D_aimTo;
SGCoord3D.prototype.toString         = _SGCoord3D_toString;
SGCoord3D.prototype.toXML            = _SGCoord3D_toXML;
SGCoord3D.prototype.isEqual          = _SGCoord3D_isEqual;
SGCoord3D.prototype.x                = null;
SGCoord3D.prototype.y                = null;
SGCoord3D.prototype.height           = null;
SGCoord3D.prototype.heightType       = null;
function SGCoord3D(x,y,height,heightType)
{    
    if (typeof(x) == "string") { if (isNaN(x)) x = SGAPI.SGWorld._parser.parse(x); }

    if (x instanceof SGCoord3D || x instanceof SGPosition)
    {
        this.x = SGParseFloat(x.x); this.y = SGParseFloat(x.y); this.height = SGParseFloat(x.height); this.heightType = x.heightType;
        return;
    }
    else if (x instanceof SGCoord2D)
    {
        this.x = SGParseFloat(x.x); this.y = SGParseFloat(x.y); this.height = 0; this.heightType = sgHeightAbsolute;
        return;
    }
    else if (x instanceof Array)
    {
        var pos = _SGCoord_fromArray(x);
        if (pos != null) { this.x = pos.x; this.y = pos.y; this.height = pos.height; this.heightType = pos.heightType; }
        return;
    }

    this.x = SGParseFloat(x);
    this.y = SGParseFloat(y);
    this.height = SGParseFloat(height);
    this.heightType = heightType;
}
function _SGCoord3D_move(distance,yaw,pitch)    { return _SGCoord_move(this, distance,yaw,pitch); }
function _SGCoord3D_moveToward(coord, distance) { return _SGCoord_moveToward(this, distance, coord); }
function _SGCoord3D_lerp(coord, percentage)     { return _SGCoord_lerp(this, percentage, coord); }
function _SGCoord3D_distanceTo(coord)           { return _SGCoord_distanceTo(this, coord); }
function _SGCoord3D_anglesTo(coord, bCartesian) { return _SGCoord_anglesTo(this, coord, bCartesian); }
function _SGCoord3D_aimTo(coord)                { var pos = new SGPosition(this); return pos.aimTo(coord); }
function _SGCoord3D_toString()
{
    var str = "SGCoord3D(";
    str += (this.x != null)         ? this.x            : "null";
    str += (this.y != null)         ? ","+this.y        : ",null";
    str += (this.height != null)    ? ","+this.height   : ",null";
    str += (this.heightType != null)? ","+this.heightType:",null";
    str += ")";
    return str;
}
function _SGCoord3D_toXML()
{
    var str = "<SGCoord3D>";
    if (this.x != null)         str += "<x>"+this.x+"</x>";
    if (this.y != null)         str += "<y>"+this.y+"</y>";
    if (this.height != null)    str += "<height>"+this.height+"</height>";    
    if (this.heightType != null)str += "<heightType>"+this.heightType+"</heightType>";
    str += "</SGCoord3D>";
    return str;
}
function _SGCoord3D_isEqual(coord)
{
    if (coord instanceof SGCoord3D)
    {
        if (coord.x == this.x &&
            coord.y == this.y && 
            coord.height == this.height && 
            coord.heightType == this.heightType)
            return true;
    }
    return false;
}

////////////////////////////////////////////////////
//
//  SGPopup class
//
////////////////////////////////////////////////////
SGPopup.prototype.left      = undefined;
SGPopup.prototype.top       = undefined;
SGPopup.prototype.width     = undefined;
SGPopup.prototype.height    = undefined;
SGPopup.prototype.caption   = undefined;
SGPopup.prototype.src       = undefined;
SGPopup.prototype.timeout   = undefined;
SGPopup.prototype.innerHTML = undefined;
SGPopup.prototype.innerText = undefined;
SGPopup.prototype.allowResize = true;
SGPopup.prototype.allowDrag = true;
SGPopup.prototype.anchorToView = true;
SGPopup.prototype.focusToRender = false;
SGPopup.prototype.align     = "";
SGPopup.prototype.hideContentUntilLoaded = false;
SGPopup.prototype._ID       = undefined;
SGPopup.prototype.callback  = null;
function SGPopup(caption, src, left,top,width,height, timeout)
{
    this.left   = left;
    this.top    = top;
    this.width  = width;
    this.height = height;
    this.caption= caption;
    this.src    = src;
    this.timeout= timeout;
}

function _SGPopup_process(thePopup, autoRemoveOldPopup)
{
    try
    {    
        if (autoRemoveOldPopup == null) autoRemoveOldPopup = true;
        
        var popup = thePopup;
        if (thePopup instanceof SGNotification)
        {
            popup = new SGPopup("__sgNotifyMessage__");
            popup.height = 30;
            popup.width = Math.max(thePopup.text.length * 7.7, 150);
            popup.align = (thePopup.align == null) ? "BottomLeft" : thePopup.align;
            if (thePopup.timeout != null) popup.timeout = thePopup.timeout;
            var imgSrc = sgSGAPIURL + "sgapi.DeleteIcon.gif";
            popup.innerText = "<html><body topmargin=0 bottommargin=0 leftmargin=0 rightmargin=0 style='border-width=1px; border-style=solid; border-color=lightgrey; overflow:hidden;'>" +                                
                                "<table width=100% height=100%><tr><td align=left>" + thePopup.text + "</td><td width='15px'><a style='cursor:pointer' onclick='javascript:closeMsg();'><img src='"+imgSrc+"'/></a></td></tr></table>" +
                                "<object id='TE' classid='clsid:3a4f9191-65a8-11d5-85c1-0001023952c1'></object>" +                                
                                "<script language='javascript'> function closeMsg() { var pIContainer = TE.Interface('IContainer2'); pIContainer.RemoveURL(5,'__sgNotifyMessage__'); } <" + "/" + "script>" +
                              "</body></html>";            
        }
    
        var rect   = SGAPI.SGWorld.window.getRect();
        var flags  = 0;                
        // Calculating position (if not defined)
        var width  = (popup.width  == undefined) ? Math.max(rect.width /2, 100) : popup.width;
        var height = (popup.height == undefined) ? Math.max(rect.height/2, 50 ) : popup.height;                                    
        var left   = (popup.left   == undefined) ? Math.round(rect.width /2 - width /2) : popup.left;
        var top    = (popup.top    == undefined) ? Math.round(rect.height/2 - height/2) : popup.top;        
        if (typeof(width) == "string" && width.charAt(width.length - 1) == '%')
        {
            width = new Number(width.slice(0, width.length-1));
            width = width/100 * (rect.width - 10);
            if (popup.left   == undefined) left = Math.round(rect.width /2 - width /2);
        }
        if (typeof(height) == "string" && height.charAt(height.length - 1) == '%')
        {
            height = new Number(height.slice(0, height.length-1));
            height = height/100 * (rect.height - 10);
            if (popup.top == undefined) top  = Math.round(rect.height/2 - height/2);
        }
        
        if (autoRemoveOldPopup) SGAPI.SGWorld.removePopup(popup); // if the same popup was open, it will be removed.
        
        // initializing the caption (even hidden popups gets temporary caption)        
        if (popup.caption == "__sgNotifyMessage__") flags |= 0x04;
        if (popup.caption == undefined) { flags |= 0x04; if (popup._ID == undefined) popup._ID = "popup:" + SGAPI.SGWorld._name + ":" + (new Date()).getTime(); } else popup._ID = popup.caption;                            
                
        var msgType = 0, content = "", newLine = '\n';
        if (popup.src != undefined && popup.src != "")  // if this popup uses html source, use it.
        {            
            content = SGAPI.toAbspath(popup.src); msgType = 1;
        }
        else
        {
            if (popup.innerHTML != undefined)  // Try to use the innerHTML
            {
                content = popup.innerHTML; newLine = "<br>";        
            }
            else if (popup.innerText != undefined)   // otherwise, try use the innerText
            {
                content = popup.innerText; var re = /\n/g; content = content.replace(re, "\r\n");            
            }
            
            var oldHTMLSupport = (content.length > 6 && content.slice(0,6).toLowerCase().indexOf("<html>") == 0);
                            
            if (content.length > 0 && !oldHTMLSupport)
            {
                var i = 0, extralines = 0, maxLineLength = 0, previ = 0;
                while((i = content.indexOf(newLine,i+1)) != -1) { extralines++; maxLineLength = Math.max(maxLineLength, i-previ); previ = i + ((newLine == "<br>") ? 3 : 1); }                    
                maxLineLength = (extralines == 0) ? content.length : Math.max(maxLineLength, content.length-previ);
                var callbackSupport = "";
                var minHeight = ((flags & 0x04) ? 21 : 36);
                if (popup.innerHTML != undefined)
                {
                    minHeight = ((flags & 0x04) ? 36 : 80);
                    if (extralines == 0)
                        content = "<html><body topmargin=0 bottommargin=0 leftmargin=0 rightmargin=0 style='border-width=1px; border-style=solid; border-color=lightgrey; overflow:auto;'><table width=100% height=100%><tr><td align=center>" + content + "</td></tr></table>" + callbackSupport + "</body></html>";
                    else
                        content = "<html><body topmargin=0 bottommargin=0 leftmargin=15px rightmargin=0 style='border-width=1px; border-style=solid; border-color=lightgrey; overflow:auto;'><table width=100% height=100%><tr><td align=left>" + content + "</td></tr></table>" + callbackSupport + "</body></html>";
                }
                
                if (popup.width  == undefined) width  = Math.max(Math.min(maxLineLength*7.5, rect.width - 10), 80);
                if (popup.height == undefined) height = minHeight + extralines*16;
                if (popup.left   == undefined) left   = rect.width/2  - width/2;
                if (popup.top   == undefined)  top    = rect.height/2 - height/2;
            }
        }
        // check popup alignment
        if (popup.align.toLowerCase().match("top"))  top  = 5;
        if (popup.align.toLowerCase().match("left")) left = 5;
        if (popup.align.toLowerCase().match("bottom")) top = rect.height - height - 5;
        if (popup.align.toLowerCase().match("right")) left = rect.width - width - 5;
        // setting up the rest of the flags.                               
        if (popup.allowResize  == true && popup.caption != undefined) flags |= 0x20;                        
        if (popup.allowDrag    == true && popup.caption != undefined) flags |= 0x02;
        if (popup.anchorToView == false) flags |= 0x01;
        if (popup.focusToRender == true) flags |= 0x100;

        if (popup.hideContentUntilLoaded == true && msgType == 1)
            content = sgSGAPIURL + "sgapi.loading.html?showimage=0&framesrc=" + escape(content);
                            
        var ret = new Object();
        ret.msgType = msgType;
        ret.left = left;
        ret.top = top;
        ret.width = width;
        ret.height = height;
        ret.content = content;
        ret.flags = flags;
        ret.timeout = (popup.timeout == undefined) ? -1 : popup.timeout;
        ret.caption = popup._ID;

        return ret;
    }
    catch(e) { this.lastError = e; }
    return null;
}
////////////////////////////////////////////////////
//
//  SGNotification class
//
////////////////////////////////////////////////////

SGNotification.prototype.text    = undefined;
SGNotification.prototype.timeout = undefined;
SGNotification.prototype.align   = "";

function SGNotification(text, timeout, align)
{
    this.text = (text == null) ? "" : text;
    this.timeout = timeout;
    this.align = align;
}
////////////////////////////////////////////////////
//
//  $SGWindow class
//
////////////////////////////////////////////////////
function $SGWindow()
{
    this.getRect                = _$SGWindow_getRect;
    this.getSnapShot            = _$SGWindow_getSnapShot;    
    this.pixelToWorld           = _$SGWindow_pixelToWorld;
    this.pixelFromWorld         = _$SGWindow_pixelFromWorld;
    this.getMouseInfo           = _$SGWindow_getMouseInfo;
    this.getInputMode           = _$SGWindow_getInputMode;
    this.setInputMode           = _$SGWindow_setInputMode;
    this.showControls           = _$SGWindow_showControls;
    this.getControls            = _$SGWindow_getControls;
}
function _$SGWindow_getRect()
{
    try
    {
        var rect = new Object();
        rect.left = 0; rect.top = 0; rect.width = 0; rect.height = 0;
        vbGetRenderRect(rect);
        return rect;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return null;
}
function _$SGWindow_getSnapShot(width, height, toFile)
{
    try
    {
        var rect = this.getRect();
        if (width  == undefined) width  = rect.width;
        if (height == undefined) height = rect.height;
        if (toFile == undefined) toFile = false;
        SGAPI.SGWorld.teCore.ISnapShot.Format = "JPeg75";
        SGAPI.SGWorld.teCore.ISnapShot.SnapshotWidth  = width;
        SGAPI.SGWorld.teCore.ISnapShot.SnapshotHeight = height;
        if (toFile)
            return SGAPI.SGWorld.teCore.ISnapShot.SaveRenderToFile();
        else
            SGAPI.SGWorld.teCore.IMenu.Invoke(32783);                
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return "";
}
function _$SGWindow_pixelToWorld(pixelX,pixelY, type)
{
    try
    {
        if (type == null) type = sgPixelToWorldTypeAll;
        var rect = this.getRect();
        if (pixelX == undefined) pixelX = rect.width / 2;
        if (pixelY == undefined) pixelY = rect.height / 2;
        var coord3D = new SGCoord3D();
        var objID = vbScreenToWorld(pixelX,pixelY, type, coord3D);
        if (objID == "sky") throw "the pixel hit the sky";
       
        var ret = new Object();
        ret.coord = coord3D;
        ret.distance = SGAPI.SGWorld.navigate.getPosition().distanceTo(coord3D);
        ret.node = null;
        if (objID != "") ret.node = new SGNode(SGAPI.SGWorld.teCore.IObjectManager.GetObject(objID));
        return ret;
    }    
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return null;
}
function _$SGWindow_pixelFromWorld(obj)
{
    try
    {
        var coord3D = new SGCoord3D( (obj instanceof SGNode) ? obj.getPosition() : obj);            
        coord3D.changeHeightType(sgHeightAbsolute);
        var coord2D = new SGCoord2D(0,0);
        if (vbWorldToScreen(coord3D.x, coord3D.y, coord3D.height, coord2D))
            return coord2D;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return null;
}
function _$SGWindow_getMouseInfo(coord2D)
{
    try
    {
        return vbGetMouseInfo(coord2D);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return false;
}
function _$SGWindow_getInputMode()
{
    try
    {
        return SGAPI.SGWorld.teCore.IRender.GetMouseInputMode();
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return false;
}
function _$SGWindow_setInputMode(inputMode, cursorURL, usePanBars)
{
    try
    {
        var oldInputMode = this.getInputMode();
        SGAPI.SGWorld.teCore.IRender.SetMouseInputMode(inputMode);
        
        if (inputMode == sgInputModeComClient)
        {
            if (cursorURL != undefined) SGAPI.SGWorld.teCore.IRender.SetMouseCursor(SGAPI.toAbspath(cursorURL)); // This will only take effect when in sgInputModeComClient mode
            if (usePanBars == true) { this.showControls( this.getControls() | 0x20); }        
        }
        else if (oldInputMode == sgInputModeComClient)
        {
            this.showControls( 0xFFFFFFDF & this.getControls() ); // removing the pan bars (if existed)
        }
        
        return true;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return false;
}
function _$SGWindow_showControls(controlsFlag)
{
    try
    {
        var oldControlsFlag = this.getControls();
        SGAPI.SGWorld.teCore.ITerraExplorer.SetParam(1000, controlsFlag);
        return oldControlsFlag;
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return 0;
}
function _$SGWindow_getControls()
{
    try { return SGAPI.SGWorld.teCore.ITerraExplorer.GetParam(1000); }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return -1;
}
////////////////////////////////////////////////////
//
//  SGColor class
//
////////////////////////////////////////////////////
SGColor.prototype.fromHTMLColor = _SGColor_fromHTMLColor;
SGColor.prototype.toHTMLColor   = _SGColor_toHTMLColor;
SGColor.prototype.fromBGRColor  = _SGColor_fromBGRColor;
SGColor.prototype.toBGRColor    = _SGColor_toBGRColor;
SGColor.prototype.fromABGRColor = _SGColor_fromABGRColor;
SGColor.prototype.toABGRColor   = _SGColor_toABGRColor;
SGColor.prototype.fromRGBColor  = _SGColor_fromRGBColor;
SGColor.prototype.toRGBColor    = _SGColor_toRGBColor;
SGColor.prototype.fromARGBColor = _SGColor_fromARGBColor;
SGColor.prototype.toARGBColor   = _SGColor_toARGBColor;
SGColor.prototype.getAlpha      = _SGColor_getAlpha;
SGColor.prototype.setAlpha      = _SGColor_setAlpha;
SGColor.prototype.toInnerObjColor=_SGColor_toBGRColor;
function SGColor(r,g,b,alpha)
{
    this.abgrColor = 0xFFFFFFFF;
    
    if (typeof(r) == "number" && g == undefined) // initializing from bgrColor
    {
        this.abgrColor = r;
        return;
    }
    else if (typeof(r) == "string")  // from HTML string
    {
        this.fromHTMLColor(r);
        return;
    }
    else if (r instanceof SGColor)
    {
        this.abgrColor = r.toABGRColor();
        return;
    }
    
    if (alpha == undefined) alpha = 0xFF;
    if (b == undefined)     b     = 0x00;
    if (g == undefined)     g     = 0xFF;
    if (r == undefined)     r     = 0x00;
    
    alpha = Math.max(0, Math.min(0xFF, Math.round(alpha*255)));
    r = Math.max(0, Math.min(0xFF, r));
    g = Math.max(0, Math.min(0xFF, g));
    b = Math.max(0, Math.min(0xFF, b));
    
    this.abgrColor = 16777216*alpha + b*65536 + g*256 + r;
}
function _SGColor_fromHTMLColor(htmlColor)
{
    if (typeof(htmlColor) != "string") return;
    var d = (htmlColor.charAt(0) == '#') ? 1 : 0;
    var r = new Number("0x"+htmlColor.slice(d,d+2));
    var g = new Number("0x"+htmlColor.slice(d+2,d+4));
    var b = new Number("0x"+htmlColor.slice(d+4,d+6));    
    this.fromBGRColor(b*65536 + g*256 + r);
}
function _SGColor_toHTMLColor() 
{   
    var bgrColor = this.toBGRColor();    
    var b = Math.floor(bgrColor/65536);
    bgrColor = bgrColor - b*65536;
    var g = Math.floor(bgrColor/256);
    var r = bgrColor - g*256;
    return vbTEColor2HTMLColor(r,g,b); 
}
function _SGColor_fromBGRColor(bgrColor) { this.abgrColor = 0xFF000000 + bgrColor; }
function _SGColor_toBGRColor() { return (this.abgrColor & 0x00FFFFFF); }
function _SGColor_fromABGRColor(abgrColor) { this.abgrColor = abgrColor; }
function _SGColor_toABGRColor() { return this.abgrColor; }
function _SGColor_fromRGBColor(rgbColor)
{
    rgbColor = 0x00FFFFFF & rgbColor;
    var r = Math.floor(rgbColor/65536);
    rgbColor = rgbColor - r*65536;
    var g = Math.floor(rgbColor/256);
    var b = rgbColor - g*256;
    this.fromBGRColor(b*65536 + g*256 + r);
}
function _SGColor_toRGBColor()
{
    var bgrColor = this.toBGRColor();    
    var b = Math.floor(bgrColor/65536);
    bgrColor = bgrColor - b*65536;
    var g = Math.floor(bgrColor/256);
    var r = bgrColor - g*256;
    return (r*65536 + g*256 + b);
}

function _SGColor_fromARGBColor(argbColor)
{
    this.fromRGBColor(argbColor);
    this.abgrColor &= 0x00FFFFFF;
    var alpha = argbColor - (argbColor & 0x00FFFFFF)
    this.abgrColor += alpha;
}
function _SGColor_toARGBColor()
{
    var rgbColor = this.toRGBColor();
    return ( (Math.round(this.getAlpha()*255))*16777216 + rgbColor );
}

function _SGColor_getAlpha() 
{ 
    var alpha = ((this.abgrColor - this.toBGRColor())/16777216);
    return Math.max(0.0, Math.min(1.0, alpha/255));
}
function _SGColor_setAlpha(alpha)
{
    alpha = Math.max(0, Math.min(255, Math.round(alpha*255)));
    this.abgrColor = 16777216*alpha + this.toBGRColor()
}

////////////////////////////////////////////////////
//
//  SGLabelStruct class
//
////////////////////////////////////////////////////
SGLabelStruct.prototype.LineToGroundType = 0;
SGLabelStruct.prototype.LineColor        = 0xFFFFFF;
SGLabelStruct.prototype.LineLength       = -1;
SGLabelStruct.prototype.Text             = "";
SGLabelStruct.prototype.FgColor          = 0xFFFFFF;
SGLabelStruct.prototype.BgColor          = 0x808080;
SGLabelStruct.prototype.Alpha            = 0;
SGLabelStruct.prototype.FontName         = "Arial";
SGLabelStruct.prototype.FontSize         = 12;
SGLabelStruct.prototype.FontStyle        = 0;
SGLabelStruct.prototype.ImageFileName    = "";
SGLabelStruct.prototype.FrameFileName    = "";
SGLabelStruct.prototype.FrameIndex       = 0;
SGLabelStruct.prototype.Scale            = 7000;
SGLabelStruct.prototype.LimitGrowth      = true;
SGLabelStruct.prototype.MinimumViewingHeight = 0;
SGLabelStruct.prototype.MinimumSize      = 7;
SGLabelStruct.prototype.TextOnImage      = true;
SGLabelStruct.prototype.AlignTextHorizontal = 2;
SGLabelStruct.prototype.AlignTextVertical = 1;
SGLabelStruct.prototype.TextJustification = 2;
SGLabelStruct.prototype.AlignLabelHorizontal = 2;
SGLabelStruct.prototype.AlignLabelVertical = 1;
SGLabelStruct.prototype.LockMode         = 0;
function SGLabelStruct(text, labelStyle)
{
    this.Text = (text != null) ? text : "";
        
    this.LineToGroundType = (labelStyle.lineToGround == true) ? 1 : 0;
    var color = new SGColor(labelStyle.lineColor);
    this.LineColor = color.toBGRColor();
    
    color = new SGColor(labelStyle.textColor);
    this.FgColor = color.toBGRColor();
    color = new SGColor(labelStyle.backgroundColor);
    this.BgColor = color.toBGRColor();
    this.Alpha = color.getAlpha();
    this.FontName = labelStyle.fontName;
    this.FontSize = labelStyle.fontSize;
    
    if (labelStyle.bold) this.FontStyle |= 1; else this.FontStyle &= ~1; 
    if (labelStyle.italic) this.FontStyle |= 2; else this.FontStyle &= ~2;
    if (labelStyle.underline) this.FontStyle |= 4; else this.FontStyle &= ~4;
    
    this.FrameFileName = labelStyle.frameFileName;
    this.FrameIndex = labelStyle.frameIndex;
    this.Scale = labelStyle.maxViewingHeight / 650;
    this.MinimumViewingHeight = labelStyle.minViewingHeight;
    
    this.TextOnImage = labelStyle.textOnImage;
    
    if (labelStyle.textAlignment.toLowerCase().match("left"))    
        this.AlignTextHorizontal = 0;
    else if (labelStyle.textAlignment.toLowerCase().match("right"))
        this.AlignTextHorizontal = 1;
    else
        this.AlignTextHorizontal = 2;
        
    if (labelStyle.textAlignment.toLowerCase().match("top"))    
        this.AlignTextVertical = 0;
    else if (labelStyle.textAlignment.toLowerCase().match("bottom"))
        this.AlignTextVertical = 1;
    else
        this.AlignTextVertical = 2;
        
    if (labelStyle.multilineJustification.toLowerCase().match("left"))
        this.TextJustification = 0;
    else if (labelStyle.multilineJustification.toLowerCase().match("right"))
        this.TextJustification = 1;
    else
        this.TextJustification = 2;
        
    if (labelStyle.pivotAlignment.toLowerCase().match("left"))    
        this.AlignLabelHorizontal = 0;
    else if (labelStyle.pivotAlignment.toLowerCase().match("right"))
        this.AlignLabelHorizontal = 1;
    else
        this.AlignLabelHorizontal = 2;

    if (labelStyle.pivotAlignment.toLowerCase().match("top"))    
        this.AlignLabelVertical = 0;
    else if (labelStyle.pivotAlignment.toLowerCase().match("bottom"))
        this.AlignLabelVertical = 1;
    else
        this.AlignLabelVertical = 2;
        
    this.LockMode = labelStyle.lockMode;
}

////////////////////////////////////////////////////
//
//  SGLabelStyle class
//
////////////////////////////////////////////////////
SGLabelStyle.prototype.lineToGround     = false;
SGLabelStyle.prototype.lineColor        = 0xFFFFFF;
SGLabelStyle.prototype.textColor        = 0xFFFFFF;
SGLabelStyle.prototype.backgroundColor  = 0x808080;
SGLabelStyle.prototype.fontName         = "Arial";
SGLabelStyle.prototype.fontSize         = 12;
SGLabelStyle.prototype.bold             = false;
SGLabelStyle.prototype.italic           = false;
SGLabelStyle.prototype.underline        = false;
SGLabelStyle.prototype.frameFileName    = "";
SGLabelStyle.prototype.frameIndex       = 0;
SGLabelStyle.prototype.maxViewingHeight = 4000000.0; //sgLevelCountry
SGLabelStyle.prototype.minViewingHeight = 0;
SGLabelStyle.prototype.textOnImage      = true;
SGLabelStyle.prototype.multilineJustification = "";
SGLabelStyle.prototype.textAlignment    = "Bottom";
SGLabelStyle.prototype.pivotAlignment   = "Bottom"
SGLabelStyle.prototype.lockMode         = 0;

function SGLabelStyle(textColor, backgroundColor)
{        
    if (textColor != null) this.textColor = textColor; else this.textColor = sgDefaultLabelTextColor;
    if (backgroundColor != null) this.backgroundColor = backgroundColor; else this.backgroundColor = sgDefaultLabelBackgroundColor;
}
////////////////////////////////////////////////////
//
//  SGWaypoint class
//
////////////////////////////////////////////////////
function SGWaypoint(x,y,height,speed,yaw,pitch)
{
    this.x = x;
    this.y = y;
    this.height = height;
    this.yaw = yaw;
    this.pitch = pitch;
    this.speed = speed;
}
////////////////////////////////////////////////////
//
//  $SGCreator class
//
////////////////////////////////////////////////////
$SGCreator.prototype.createGroup        = _$SGCreator_createGroup;
$SGCreator.prototype.createLayer        = _$SGCreator_createLayer;   
$SGCreator.prototype.createLine         = _$SGCreator_createLine;
$SGCreator.prototype.createPolyline     = _$SGCreator_createPolyline;
$SGCreator.prototype.createPolygon      = _$SGCreator_createPolygon;
$SGCreator.prototype.createRectangle    = _$SGCreator_createRectangle;
$SGCreator.prototype.createCircle       = _$SGCreator_createCircle;
$SGCreator.prototype.createEllipse      = _$SGCreator_createEllipse;
$SGCreator.prototype.createArc          = _$SGCreator_createArc;
$SGCreator.prototype.createArrow        = _$SGCreator_createArrow;
$SGCreator.prototype.create3DPolygon    = _$SGCreator_create3DPolygon;
$SGCreator.prototype.createBuilding     = _$SGCreator_createBuilding;
$SGCreator.prototype.createBox          = _$SGCreator_createBox;
$SGCreator.prototype.createPyramid      = _$SGCreator_createPyramid;
$SGCreator.prototype.createCylinder     = _$SGCreator_createCylinder;
$SGCreator.prototype.createCone         = _$SGCreator_createCone;
$SGCreator.prototype.create3DArrow      = _$SGCreator_create3DArrow;
$SGCreator.prototype.createSphere       = _$SGCreator_createSphere;
$SGCreator.prototype.createModel        = _$SGCreator_createModel;
$SGCreator.prototype.createLabel        = _$SGCreator_createLabel;
$SGCreator.prototype.createTextLabel    = _$SGCreator_createTextLabel
$SGCreator.prototype.createImageLabel   = _$SGCreator_createImageLabel;
$SGCreator.prototype.createLocation     = _$SGCreator_createLocation;
$SGCreator.prototype.createMessage      = _$SGCreator_createMessage;
$SGCreator.prototype.createDynamic      = _$SGCreator_createDynamic;
$SGCreator.prototype.createThreatDome   = _$SGCreator_createThreatDome;
$SGCreator.prototype.createImageryLayer = _$SGCreator_createImageryLayer;
$SGCreator.prototype.createElevationLayer=_$SGCreator_createElevationLayer;
$SGCreator.prototype.createVideoOnTerrain=_$SGCreator_createVideoOnTerrain;
$SGCreator.prototype._internalOrientObject = _$SGCreator_internalOrientObject;
$SGCreator.prototype._internalCreateRectBased3D = _$SGCreator_internalCreateRectBased3D;
$SGCreator.prototype._internalCreateCircleBased3D = _$SGCreator_internalCreateCircleBased3D;
$SGCreator.prototype._prepareTempVBArray = _$SGCreator_prepareTempVBArray;
$SGCreator.prototype._setDefaultViewDist = _$SGCreator_setDefaultViewDist;
// Helper function to support old te versions (prior to 5.1.0
$SGCreator.prototype._CreatePolylineHelper = _$SGCreator_CreatePolylineHelper;
$SGCreator.prototype._CreatePolygonHelper = _$SGCreator_CreatePolygonHelper;
$SGCreator.prototype._Create3DPolygonHelper = _$SGCreator_Create3DPolygonHelper;
$SGCreator.prototype._CreateBuildingHelper = _$SGCreator_CreateBuildingHelper;

function $SGCreator()
{    
    
}
function $SGCreatorInitParams(pivot, fgColor, bgColor, name, b3D)
{
    if (b3D == null) b3D = false;
    var heightType;
    if (pivot instanceof SGPosition || pivot instanceof SGCoord3D || pivot instanceof SGCoord2D)
    {
        this.x = pivot.x;
        this.y = pivot.y;
        this.height = (pivot instanceof SGCoord2D) ? 0 : pivot.height;
        if (!(pivot instanceof SGCoord2D)) heightType = pivot.heightType;
        if (pivot instanceof SGPosition)
        {
            if (pivot.yaw != null) this.yaw = pivot.yaw;
            if (pivot.pitch != null) this.pitch = pivot.pitch;
            if (pivot.distance != null) this.distance = pivot.distance;
        }
    }
/*    
    else if (pivot instanceof Array)
    {
        if (pivot.length == 3)
        {
            this.x = pivot[0];
            this.y = pivot[2];
            this.height = pivot[1];
        }
    } */
    else// assume pivot represents only height type
        heightType = pivot;
        
    this.heightType = (heightType == null) ? ((b3D) ? sgHeightRelative : sgHeightOnTerrain) : heightType;            
    this.name = (name == null) ? "" : name;
    
    this.fgBGRColor = sgDefaultForegroundColor;
    this.fgAlpha  = 1;        
    this.bgBGRColor = sgDefaultBackgroundColor;
    this.bgAlpha  = 0;        
    if (fgColor != null)
    {
        if (!(fgColor instanceof SGColor)) fgColor = new SGColor(fgColor);
        this.fgBGRColor = fgColor.toBGRColor();
        this.fgAlpha  = fgColor.getAlpha();    
    }
    if (bgColor != null)
    {
        if (!(bgColor instanceof SGColor)) bgColor = new SGColor(bgColor);
        this.bgBGRColor = bgColor.toBGRColor();
        this.bgAlpha  = bgColor.getAlpha();
    }
    //make sure we are numbers
    this.x = SGParseFloat(this.x);
    this.y = SGParseFloat(this.y);
    if (this.height != null) this.height = SGParseFloat(this.height);
    if (this.yaw != null) this.yaw = SGParseFloat(this.yaw);
    if (this.pitch != null) this.pitch = SGParseFloat(this.pitch);
    if (this.distance != null) this.distance = SGParseFloat(this.distance);
    

}
function _$SGCreator_internalOrientObject(obj, stdInit)
{
    var yaw = 0, pitch = 0, flags = 7+8+16+32;        
    if ("yaw" in stdInit) { yaw = stdInit.yaw; flags-=8 };
    if ("pitch" in stdInit) { pitch = stdInit.pitch; flags-=16 };
    if (flags < 7+8+16+32) obj.SetPosition(0,0,0,yaw,pitch,0,flags)           
}
function _$SGCreator_prepareTempVBArray(arr)
{
    if (arr == null || arr == undefined)
        vbInitTempArr(0);
    else
    {        
        var bSGCoord = false;
        if (arr.length > 0) bSGCoord = (arr[0] instanceof SGPosition || arr[0] instanceof SGCoord3D || arr[0] instanceof SGCoord2D);
        var length = (bSGCoord == true) ? arr.length*3 : arr.length;
        vbInitTempArr(length);
        for (var i=0; i<arr.length; i++)
        {
            if (bSGCoord)
            {
                vbInsertDoubleToTempArray(i*3+0, arr[i].x);
                vbInsertDoubleToTempArray(i*3+1, "height" in arr[i] ? arr[i].height : 0.0);
                vbInsertDoubleToTempArray(i*3+2, arr[i].y);
            }
            else
                vbInsertDoubleToTempArray(i, arr[i]);
        }
    }
}
function _$SGCreator_setDefaultViewDist(obj, extraParam)
{
    try
    {
        var objType = obj.ObjectType;
        switch(objType)
        {
            case sgNodeTypePolyline:
            case sgNodeTypePolygon:
            case sgNodeType3DPolygon:
            case sgNodeTypeBuilding:
                if (extraParam instanceof Array)
                {
                    var pos = new SGPosition(extraParam);
                    if (pos == null) return;
                    obj.Distance = pos.distance;                        
                }                
                if (objType == sgNodeType3DPolygon || objType == sgNodeTypeBuilding) obj.Distance = Math.max(obj.Distance, 2*obj.Height);                
                break;
            
            default:
                if (extraParam != null) obj.Distance = extraParam;
                break;
        }
        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }
    return;

}
function _$SGCreator_createGroup(groupName)
{
    try
    {                        
        var itemID = SGAPI.SGWorld.teCore.IInformationTree.CreateLockedGroup(groupName, $createGroupID);
        return new SGNode(itemID);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createLayer(layerURL,layerName)
{
    try
    {                        
        if (layerURL != undefined && layerURL != "")
        {
            layerURL = SGAPI.toAbspath(layerURL);
            if (layerURL.toLowerCase().search(".fly") != -1)
            {
                var displayErrorStatus = SGAPI.SGWorld.teCore.ITerraExplorer.DisplayErrorMessages;
                SGAPI.SGWorld.teCore.ITerraExplorer.DisplayErrorMessages = false;                        
                var itemID = SGAPI.SGWorld.teCore.IInformationTree.LoadFlyLayerEx(layerURL, $createGroupID);
                SGAPI.SGWorld.teCore.ITerraExplorer.DisplayErrorMessages = displayErrorStatus;
                if (itemID != 0)
                {
                    var childID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(itemID, 11);
                    if (childID != 0)
                    {
                        var siblingID = SGAPI.SGWorld.teCore.IInformationTree.GetNextItem(childID, 13);
                        if (siblingID == 0) // this fly file contain only one group/item
                        {
                            childID = vbSetParent(childID, $createGroupID);
                            SGAPI.SGWorld.teCore.IInformationTree.DeleteItem(itemID);
                            itemID = childID;
                        }
                        var node = new SGNode(itemID);
                        if (layerName != undefined && layerName != "")
                            node.setName(layerName);                        
                        return node;
                    }
                }
            }
        }
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createLine(from,to,lineColor, name)
{
    var x1 = from.x;
    var y1 = from.y;
    var h1 = (from instanceof SGCoord2D) ? 0 : from.height;
    var x2 = to.x;
    var y2 = to.y;
    var h2 = (to instanceof SGCoord2D) ? 0 : to.height;
    var heightType = (from instanceof SGCoord2D) ? sgHeightOnTerrain : from.heightType;
    
    return this.createPolyline([x1,h1,y1,x2,h2,y2],lineColor, name, heightType);
}
function _$SGCreator_createPolyline(vertices, lineColor, name, heightType)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(heightType, lineColor, null, name);        
        var obj = this._CreatePolylineHelper(vertices, stdInit.fgBGRColor, stdInit.heightType, $createGroupID, stdInit.name);        
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._setDefaultViewDist(obj, vertices);
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createPolygon(vertices, lineColor, fillColor, name, heightType)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(heightType, lineColor, fillColor, name);
        var obj = this._CreatePolygonHelper(vertices, stdInit.fgBGRColor, stdInit.bgAlpha, stdInit.bgBGRColor, stdInit.heightType, $createGroupID, stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._setDefaultViewDist(obj, vertices);
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createRectangle(pivot,width,depth, lineColor, fillColor, name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, lineColor, fillColor, name);
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateRectangle(stdInit.x,stdInit.y,stdInit.height,width,depth,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        if ("yaw" in stdInit) obj.SetPosition(0,0,0,stdInit.yaw,0,0,7+16+32);
        this._setDefaultViewDist(obj, 2*Math.max(width,depth));
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createCircle(pivot,radius,lineColor,fillColor,name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, lineColor,fillColor, name);
        var circumference = 2*Math.PI*radius;
        var numSegments = Math.max(20, Math.min(100, circumference/1000));
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateCircle(stdInit.x,stdInit.y,stdInit.height,radius,numSegments,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._setDefaultViewDist(obj, 4*radius);
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createEllipse(pivot,radiusX,radiusY,lineColor,fillColor,name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, lineColor,fillColor, name);
        var circumference = 2*Math.PI*Math.max(radiusX, radiusY);
        var numSegments = Math.max(20, Math.min(100, circumference/1000));
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateEllipse(stdInit.x,stdInit.y,stdInit.height,radiusX,radiusY,numSegments,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._internalOrientObject(obj, stdInit);
        this._setDefaultViewDist(obj, 4*Math.max(radiusX,radiusY));
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createArc(pivot,radiusX,radiusY,startAngle,endAngle,lineColor,fillColor,name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, lineColor,fillColor, name);
        var circumference = 2*Math.PI*Math.max(radiusX, radiusY);
        var numSegments = Math.max(20, Math.min(100, circumference/1000));
        if (startAngle == null) startAngle = -90;
        if (endAngle == null) endAngle = 90;
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateArc(stdInit.x,stdInit.y,stdInit.height,radiusX,radiusY,startAngle,endAngle,numSegments,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._internalOrientObject(obj, stdInit);
        this._setDefaultViewDist(obj, 4*Math.max(radiusX,radiusY));
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createArrow(head, direction, length, arrowStyle,lineColor,fillColor,name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(head, lineColor,fillColor, name);
        if (arrowStyle == null) arrowStyle = sgArrowStyleWideAngular;
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateArrow(stdInit.x,stdInit.y,stdInit.height,direction,length,arrowStyle,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._setDefaultViewDist(obj, 3*length);
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;    
}
function _$SGCreator_create3DArrow(head, direction, length, height, arrowStyle, lineColor,fillColor,name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(head, lineColor,fillColor, name, true);
        if (arrowStyle == null) arrowStyle = sgArrowStyleWideAngular;        
        var obj = SGAPI.SGWorld.teCore.IObjectManager.Create3DArrow(stdInit.x,stdInit.y,stdInit.height,direction,length,arrowStyle,height,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;        
        this._setDefaultViewDist(obj, 2*Math.max(1.5*length, 2*height));
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;    
}
function _$SGCreator_createSphere(pivot,radius,sphereStyle,lineColor,fillColor,name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, lineColor,fillColor, name, true);
        if (sphereStyle == null) sphereStyle = sgSphereStyleNormal;        
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateSphere(stdInit.x,stdInit.y,stdInit.height,radius,sphereStyle,10,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._setDefaultViewDist(obj, 4*radius);
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_create3DPolygon(vertices, height, lineColor,fillColor, name, heightType)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(heightType, lineColor,fillColor, name, true);
        var obj = this._Create3DPolygonHelper(vertices, height,stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._setDefaultViewDist(obj, vertices);
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createBuilding(vertices, roofHeight, name, heightType)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(heightType, null,null, name, true);
        var obj = this._CreateBuildingHelper(vertices, roofHeight,1,stdInit.heightType,$createGroupID,stdInit.name);
        this._setDefaultViewDist(obj, vertices);
        return new SGNode(obj);
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_internalCreateRectBased3D(pivot, width,depth,height, lineColor,fillColor, name, b2Bases)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, lineColor,fillColor, name, true);
        var obj = null;
        if (b2Bases)
            obj = SGAPI.SGWorld.teCore.IObjectManager.CreateBox(stdInit.x,stdInit.y,stdInit.height, width,depth,height, 0, stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        else
            obj = SGAPI.SGWorld.teCore.IObjectManager.CreatePyramid(stdInit.x,stdInit.y,stdInit.height, width,depth,height, 0, stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._internalOrientObject(obj, stdInit);
        this._setDefaultViewDist(obj, 2*Math.max(width, Math.max(depth,2*height)));
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;

}
function _$SGCreator_internalCreateCircleBased3D(pivot, radius,height, lineColor,fillColor, name, b2Bases)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, lineColor,fillColor, name, true);
        var circumference = 2*Math.PI*radius;
        var numSegments = Math.max(20, Math.min(50, circumference/1000));
        var obj = null;
        if (b2Bases)
            obj = SGAPI.SGWorld.teCore.IObjectManager.CreateCylinder(stdInit.x,stdInit.y,stdInit.height, radius,height, numSegments, stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);
        else
            obj = SGAPI.SGWorld.teCore.IObjectManager.CreateCone(stdInit.x,stdInit.y,stdInit.height, radius,height, numSegments, stdInit.fgBGRColor,stdInit.bgAlpha,stdInit.bgBGRColor,stdInit.heightType,$createGroupID,stdInit.name);       
        if (stdInit.fgAlpha < 1.0) obj.FgAlpha = stdInit.fgAlpha;
        this._internalOrientObject(obj, stdInit);
        this._setDefaultViewDist(obj, 4*Math.max(radius, height));
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createBox(pivot,width,depth,height,lineColor,fillColor,name) { return this._internalCreateRectBased3D(pivot, width,depth,height, lineColor,fillColor, name, true); }
function _$SGCreator_createPyramid(pivot,width,depth,height,lineColor,fillColor,name) { return this._internalCreateRectBased3D(pivot, width,depth,height, lineColor,fillColor, name, false); }
function _$SGCreator_createCylinder(pivot,radius,height,lineColor,fillColor,name) { return this._internalCreateCircleBased3D(pivot, radius,height, lineColor,fillColor, name, true); }    
function _$SGCreator_createCone(pivot,radius,height,lineColor,fillColor,name) { return this._internalCreateCircleBased3D(pivot, radius,height, lineColor,fillColor, name, false); }

function _$SGCreator_createModel(pivot, modelURL, scale, name)
{
    try
    {
        if (modelURL == null || modelURL == "") throw "Model url is missing";
        var stdInit = new $SGCreatorInitParams(pivot,null,null,name,true);        
        modelURL = SGAPI.toAbspath(modelURL);
        if (scale == null) scale = 1;
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateModel(stdInit.x,stdInit.y,stdInit.height, modelURL, 0,0,0, scale, stdInit.heightType,0,$createGroupID,stdInit.name);
        this._internalOrientObject(obj, stdInit);
        //this._setDefaultViewDist(obj, scale*500); ??
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createTextLabel(pivot, text, labelStyle, name) { return _$SGCreator_createLabel(pivot, text, null, labelStyle, name); }
function _$SGCreator_createLabel(pivot, text, imageURL, labelStyle, name)
{
    try
    {
        if (labelStyle == null) labelStyle = new SGLabelStyle();
        if (!(labelStyle instanceof SGLabelStyle)) throw "Error: type mismatch in labelStyle parameter";        
        var labelStruct = new SGLabelStruct(text, labelStyle);
        if (imageURL != null) labelStruct.ImageFileName = SGAPI.toAbspath(imageURL);
        var stdInit = new $SGCreatorInitParams(pivot,null,null,name,true);                
        if (labelStruct.Text != "") { var re = /(\r)?\n/g; labelStruct.Text = labelStruct.Text.replace(re,"\r\n"); }
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateLabel(labelStruct, stdInit.x,stdInit.y,stdInit.height, stdInit.heightType,$createGroupID,stdInit.name);        
        if (labelStruct.LockMode != sgLabelLockModeDecal) obj.LockMode = labelStruct.LockMode;
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createImageLabel(pivot, imageURL, name)
{
    try
    {
        if (imageURL == null || imageURL == "") throw "Image url is missing";
        imageURL = SGAPI.toAbspath(imageURL);
        var stdInit = new $SGCreatorInitParams(pivot,null,null,name,true);        
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateImageLabel(stdInit.x,stdInit.y,stdInit.height, imageURL, stdInit.heightType,$createGroupID,stdInit.name);
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createLocation(location, name)
{
    try
    {
        if (location == null)   // create location a the current position
        {
            var currentPos = SGAPI.SGWorld.navigate.getPosition();            
            var viewCenter = SGAPI.SGWorld.window.pixelToWorld();
            if (viewCenter == null) viewCenter = currentPos.move(Math.max(100, currentPos.height)); else viewCenter = viewCenter.coord;
            location = new SGPosition(viewCenter);
            location.distance = location.distanceTo(currentPos);
            var angles = currentPos.anglesTo(location);
            location.yaw = angles.yaw;
            location.pitch = angles.pitch;
        }
        else if (!(location instanceof SGPosition)) throw "Error: type mismatch in location parameter (must be SGPosition)" 
        var stdInit = new $SGCreatorInitParams(location,null,null,name,true);        
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateLocation(stdInit.x,stdInit.y,stdInit.height,stdInit.yaw,stdInit.pitch,stdInit.distance,stdInit.heightType,$createGroupID,stdInit.name);        
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createMessage(msgData, msgType, msgClient)
{
    try
    {
        var msgObj = null;
        if (typeof(msgData) == "string" && msgClient != sgMessageClientPopup)
            msgObj = SGAPI.SGWorld.teCore.IObjectManager.CreateMessage(msgClient, msgData, msgType);
        else if (msgData instanceof SGPopup || msgData instanceof SGNotification || msgClient == sgMessageClientPopup)
        {
            var popup = msgData;
            if (typeof(msgData) == "string") { popup = new SGPopup(); if (msgType == sgMessageTypeURL) popup.src = msgData; else popup.innerText = msgData; }            
            var ret = _SGPopup_process(popup, false);            
            msgObj = SGAPI.SGWorld.teCore.IObjectManager.CreateMessage(sgMessageClientPopup, ret.content, ret.msgType, ret.flags, ret.caption, ret.timeout, ret.left, ret.top, ret.left+ret.width, ret.top+ret.height, false);
        }
        return new SGNode(msgObj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createDynamic(waypoints, motionStyle, objectType, fileNameOrText, scale, name, heightType)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(heightType, null, null, name, true);
        if (motionStyle == null) motionStyle = sgMotionStyleAirplane;
        if (objectType  == null) objectType  = sgDynamicObjectTypeVirtual;
        if (scale == null) scale = 1.0;
        if (fileNameOrText != null && objectType != sgDynamicObjectTypeText) fileNameOrText = SGAPI.toAbspath(fileNameOrText);        
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateDynamicObject(motionStyle,objectType,fileNameOrText,scale,stdInit.heightType,$createGroupID,stdInit.name);        
        if (waypoints != null)
        {
            for (var i = 0; i < waypoints.length; i++) { obj.AddWaypoint(waypoints[i].x, waypoints[i].height, waypoints[i].y, waypoints[i].speed); }
            obj.RestartRoute(0);
        }
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createThreatDome(pivot, color, range, angularStep, radialStep, direction, horizontalFOV, elevationAngle, name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(pivot, color, null, name, true);
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateThreatDome(pivot.x, pivot.y, pivot.height, stdInit.fgBGRColor, range, angularStep, radialStep, direction, horizontalFOV, elevationAngle,$createGroupID,stdInit.name);
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createImageryLayer(imageryFileName, upperLeftX, upperLeftY, lowerRightX, lowerRightY, initParam, plugName, name)
{
    try
    {
        name = (name == null) ? "" : name;
        
        if (plugName == null || plugName == "")
        {
            plugName = "";
            var a = imageryFileName.split(".");            
            if (a.length > 0)
            {
                 a = a[a.length-1].toLowerCase();
                 if (a == "bmp" || a == "gif" || a == "jpg" || a == "jpeg")
                    plugName = "picplg.rct,";
            }
        }
        
        initParam = (initParam == null) ? 0 : initParam;
        imageryFileName = SGAPI.toAbspath(imageryFileName);
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateImageryLayer(imageryFileName,upperLeftX, upperLeftY, lowerRightX, lowerRightY, initParam, plugName,$createGroupID,name);
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createElevationLayer(elevationFileName, upperLeftX, upperLeftY, lowerRightX, lowerRightY, initParam, plugName, name)
{
    try
    {
        name = (name == null) ? "" : name;
        plugName = (plugName == null) ? "" : plugName;
        initParam = (initParam == null) ? 0 : initParam;
        elevationFileName = SGAPI.toAbspath(elevationFileName);
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateElevationLayer(elevationFileName,upperLeftX, upperLeftY, lowerRightX, lowerRightY, initParam, plugName,$createGroupID,name);
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_createVideoOnTerrain(videoFileName, position, name)
{
    try
    {
        var stdInit = new $SGCreatorInitParams(position, null, null, name, true);
        videoFileName = SGAPI.toAbspath(videoFileName);
        var yaw = ("yaw" in stdInit) ? stdInit.yaw : 0;
        var pitch = ("pitch" in stdInit) ? stdInit.pitch : -80;
        var obj = SGAPI.SGWorld.teCore.IObjectManager.CreateVideoOnTerrain(videoFileName,stdInit.x,stdInit.y,stdInit.height,yaw,pitch,stdInit.heightType,$createGroupID,stdInit.name);
        return new SGNode(obj);        
    }
    catch(e) { SGAPI.SGWorld.lastError = e; }    
    return null;
}
function _$SGCreator_CreatePolylineHelper(vertices, lineColor, HeightStyle, GroupID, Description)
{
    var obj = null;
    if (SGAPI.SGWorld.bV510orGreater == false)
    {
        this._prepareTempVBArray(vertices);  // support for versions older then 5.1.0        
        obj = vbCreatePolyline(lineColor, HeightStyle, GroupID, Description);
    }
    else
        obj = SGAPI.SGWorld.teCore.IObjectManager.CreatePolyline(vertices, lineColor, HeightStyle, GroupID, Description);
        
    return obj;
}
function _$SGCreator_CreatePolygonHelper(vertices, lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description)
{
    var obj = null;
    if (SGAPI.SGWorld.bV510orGreater == false)
    {
        this._prepareTempVBArray(vertices);  // support for versions older then 5.1.0        
        obj = vbCreatePolygon(lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description);
    }
    else
        obj = SGAPI.SGWorld.teCore.IObjectManager.Create2DPolygon(vertices, lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description);
        
    return obj;
}
function _$SGCreator_Create3DPolygonHelper(vertices, objectHeight, lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description)
{
    var obj = null;
    if (SGAPI.SGWorld.bV510orGreater == false)
    {
        this._prepareTempVBArray(vertices);  // support for versions older then 5.1.0        
        obj = vbCreate3DPolygon(objectHeight, lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description);
    }
    else
        obj = SGAPI.SGWorld.teCore.IObjectManager.Create3DPolygon(vertices, objectHeight, lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description);
        
    return obj;
}
function _$SGCreator_CreateBuildingHelper(vertices, roofHeight, buildingStyle, HeightStyle, GroupID, Description)
{
    var obj = null;
    if (SGAPI.SGWorld.bV510orGreater == false)
    {
        this._prepareTempVBArray(vertices);  // support for versions older then 5.1.0        
        obj = vbCreateBuilding(roofHeight, buildingStyle, HeightStyle, GroupID, Description);
    }
    else
        obj = SGAPI.SGWorld.teCore.IObjectManager.CreateBuilding(vertices, roofHeight, buildingStyle, HeightStyle, GroupID, Description);
        
    return obj;
}
