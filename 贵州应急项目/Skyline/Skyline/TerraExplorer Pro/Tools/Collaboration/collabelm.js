/********************************************************************************************/
//Help Functions
/********************************************************************************************/

//help function
//function string WrapTag(string CommandSTR, string TagSTR)
function WrapTag(CommandSTR,TagSTR)
{
    return "<" + TagSTR + ">" + CommandSTR + "<" + TagSTR + ">";
}


function StripTag(InputStr)// As String
{
    var Command;// As String
    var Message;// As String

    var Location = InputStr.indexOf(">");
    if (Location < 0)
    {
       obj=new Object();
       alert("2DO: return Illegal String");
       obj.Command = "";
       return obj;
    }

    obj=new Object();
    obj.Message=InputStr.substr(Location+1,InputStr.length-Location*2-2);
    obj.Command=InputStr.substr(1,Location-1);
    return obj;
}

function GetTickCount()
{
    return new Date().getTime();
}
//Private Function GetGroupID(FromNick As String)
function GetGroupID(GroupName, Component,FromNick)
{
//'The function was taken from the Annotation module, and using the same
//'group convention under the "Collaboration Annotation"
    var GroupID = 0; // As Long
    if (SGWorld.Project.Name == "")
        return GroupID;
    var path = "\\" + GroupName + "\\" + FromNick + "\\";
    if (Component)
        path += Component;
    GroupID = this.IInformationTree.FindItem(path);
    if (GroupID == 0)
    {
        if (this.IInformationTree.FindItem("\\" + GroupName + "\\") == 0)
        {
            this.IInformationTree.CreateGroup(GroupName, 0);
        }
        if (this.IInformationTree.FindItem("\\" + GroupName + "\\" + FromNick) == 0)
        {
            GroupID = this.IInformationTree.FindItem("\\" + GroupName)
            GroupID = this.IInformationTree.CreateGroup(FromNick, GroupID);
        }
        if (Component && this.IInformationTree.FindItem("\\" + GroupName + "\\" + FromNick + "\\" + Component) == 0)
        {
            GroupID = this.IInformationTree.FindItem("\\" + GroupName + "\\" + FromNick);
            GroupID = this.IInformationTree.CreateLockedGroup(Component, GroupID);
        }
    }
    return GroupID;
}
/********************************************************************************************/
//ContinuousMotion
/********************************************************************************************/
function ContinuousMotion()
{
    //'******Flow Declarations

    ///PUBLIC
    this.cX=0.0;// As Double
    this.cY=0.0;// As Double
    this.cZ=0.0;// As Double
    this.cPITCH=0.0;// As Double
    this.cYAW=0.0;// As Double
    this.cROLL=0.0;// As Double
    this.cDeltaPITCH=0.0;// As Double
    this.cDeltaYAW=0.0;// As Double

    //'***Can make these 2 exposed as a public boolean
    this.pStartTime=0.0;// As Double
    this.pLength=0.0;// As Double

    //PRIVATE
    this.StartX=0.0;// As Double
    this.StartY=0.0;// As Double
    this.StartZ=0.0;// As Double
    this.StartPITCH=0.0;// As Double
    this.StartYAW=0.0;// As Double
    this.StartROLL=0.0;// As Double
    this.StartDeltaPITCH=0.0;// As Double
    this.StartDeltaYAW=0.0;// As Double

    ///PUBLIC
    this.EndX=0.0;// As Double
    this.EndY=0.0;// As Double
    this.EndZ=0.0;// As Double
    this.EndPITCH=0.0;// As Double
    this.EndYAW=0.0;// As Double
    this.EndROLL=0.0;// As Double
    this.EndDeltaPITCH=0.0;// As Double
    this.EndDeltaYAW=0.0;// As Double

    this.TimeStamp1=0.0;// As Double
    this.TimeStamp2=0.0;// As Double

    this.minX=-180;// As Double
    this.minY= -90;// As Double
    this.maxX= 180;// As Double
    this.maxY=  90;// As Double

    //PUBLIC
    this.PositionChangedInLastCalcFlow=false;// As Boolean
    this.ReachedEndPoint=true;// As Boolean
    this.TerrainIsGlobe=true;// As Boolean
    //Private
    this.bFirstTime=true;// As Boolean
    //'******End Flow Declarations

    this.SlowFactor=0.0;


    ///METHODS
    this.CalculateFlow=_ContinuousMotion_CalculateFlow;
    this.StartFlow    =_ContinuousMotion_StartFlow;

}

//Public Function CalculateFlow()
function _ContinuousMotion_CalculateFlow()
{
    var sX = this.cX;
    var sY = this.cY;
    var sZ = this.cZ;
    var sPITCH = this.cPITCH;
    var sYAW = this.cYAW;
    var sROLL = this.cROLL;
    var sDeltaPITCH = this.cDeltaPITCH;
    var sDeltaYAW = this.cDeltaYAW;

    //Static SlowFactor As Double
    this.TimeStamp = GetTickCount();
    var lRatio=1.0;

    if (this.TimeStamp < this.pStartTime + this.pLength)
    {
        lRatio = (this.TimeStamp - this.pStartTime) / this.pLength;
        this.SlowFactor = 0;

    }
    else
    {

        if (lRatio <= 1.0)  
            lRatio = 1.0;
    }

    var lX = this.StartX * (1.0 - lRatio) + this.EndX * lRatio;
    var lY = this.StartY * (1.0 - lRatio) + this.EndY * lRatio;
    var lZ = this.StartZ * (1.0 - lRatio) + this.EndZ * lRatio;

    var lPITCH = this.StartPITCH * (1.0 - lRatio) + this.EndPITCH * lRatio;

    var lYAW =        this.StartYAW        * (1.0 - lRatio) + this.EndYAW        * lRatio;
    var lROLL =       this.StartROLL       * (1.0 - lRatio) + this.EndROLL       * lRatio;
    var lDeltaPITCH = this.StartDeltaPITCH * (1.0 - lRatio) + this.EndDeltaPITCH * lRatio;
    var lDeltaYAW =   this.StartDeltaYAW   * (1.0 - lRatio) + this.EndDeltaYAW   * lRatio;
    
    if (lPITCH > 360)      lPITCH = lPITCH - 360;
    if (lYAW > 360)        lYAW = lYAW - 360;
    if (lDeltaPITCH > 360) lDeltaPITCH = lDeltaPITCH - 360;
    if (lDeltaYAW > 360)   lDeltaYAW = lDeltaYAW - 360;
    if (lROLL > 360)       lROLL = lROLL - 360;
    
    if (this.TerrainIsGlobe)
    {
        if (lX > this.maxX) lX = lX - (this.maxX - this.minX);
        if (lX < this.minX) lX = lX + (this.maxX - this.minX);
        if (lY > this.maxY) lY = lY - (this.maxY - this.minY);
        if (lY < this.minY) lY = lY + (this.maxY - this.minY);
    }
    
    
    this.cX = lX;
    this.cY = lY;
    this.cZ = lZ;
    this.cPITCH = lPITCH;
    this.cYAW = lYAW;
    this.cROLL = lROLL;
    this.cDeltaPITCH = lDeltaPITCH;
    this.cDeltaYAW = lDeltaYAW;
    
    this.PositionChangedInLastCalcFlow = !((this.cX + this.cY + this.cZ + this.cPITCH + this.cYAW + this.cROLL + this.cDeltaPITCH + this.cDeltaYAW - sX - sY - sZ - sPITCH - sYAW - sROLL - sDeltaPITCH - sDeltaYAW) == 0)
    
    
    if (lRatio >= 1.0)
    {
        //'Debug.Print "ReachedEndPoint = True"
        this.ReachedEndPoint = true;
    }
    else
    {
        //'Debug.Print "ReachedEndPoint = False"
        this.ReachedEndPoint = false;
    }
    
}

//Public Function StartFlow(X As Double, Y As Double, Z As Double, Pitch As Double, Yaw As Double, Roll As Double, DeltaPITCH As Double, DeltaYAW As Double)
function _ContinuousMotion_StartFlow(X, Y , Z , Pitch, Yaw , Roll , DeltaPITCH , DeltaYAW )
{
    var lStartTime;// As Double
    var lLength;// As Double

    this.ReachedEndPoint = false;

    this.TimeStamp2 = this.TimeStamp1;
    this.TimeStamp1 = GetTickCount();
    
    var lStartTime = this.TimeStamp1;
    var lLength = this.TimeStamp1 - this.TimeStamp2;
    
    if  (lStartTime == lLength               ) lLength = 1000;
    if ((Pitch - this.cPITCH) > 180          ) Pitch = Pitch - 360;
    if ((Yaw - this.cYAW) > 180              ) Yaw = Yaw - 360;
    if ((DeltaPITCH - this.cDeltaPITCH) > 180) DeltaPITCH = DeltaPITCH - 360;
    if ((DeltaYAW - this.cDeltaYAW) > 180    ) DeltaYAW = DeltaYAW - 360;
    if ((Roll - this.cROLL) > 180            ) Roll = Roll - 360;
    if (this.TerrainIsGlobe)
    {
        if ((X - this.cX) > (this.maxX - this.minX) / 2.0) X = X - (this.maxX - this.minX);
        if ((Y - this.cY) > (this.maxY - this.minY) / 2.0) Y = Y - (this.maxY - this.minY);
    }
    
    if ((this.cPITCH - Pitch) > 180)           Pitch = Pitch + 360;
    if ((this.cYAW - Yaw) > 180)               Yaw = Yaw + 360;
    if ((this.cDeltaPITCH - DeltaPITCH) > 180) DeltaPITCH = DeltaPITCH + 360;
    if ((this.cDeltaYAW - DeltaYAW) > 180)     DeltaYAW = DeltaYAW + 360;
    if ((this.cROLL - Roll) > 180)             Roll = Roll + 360;
    if (this.TerrainIsGlobe)
    {
        if ((this.cX - X) > (this.maxX - this.minX) / 2.0) X = X + (this.maxX - this.minX);
        if ((this.cY - Y) > (this.maxY - this.minY) / 2.0) Y = Y + (this.maxY - this.minY);
    }
    
    if (this.bFirstTime)
    {
        this.bFirstTime = false;
        this.StartX = X;
        this.StartY = Y;
        this.StartZ = Z;
        this.StartPITCH = Pitch;
        this.StartYAW = Yaw;
        this.StartROLL = Roll;
        this.StartDeltaPITCH = DeltaPITCH;
        this.StartDeltaYAW = DeltaYAW;
    }
    else
    {
        this.StartX = this.cX;
        this.StartY = this.cY;
        this.StartZ = this.cZ;
        this.StartPITCH = this.cPITCH;
        this.StartYAW = this.cYAW;
        this.StartROLL = this.cROLL;
        this.StartDeltaPITCH = this.cDeltaPITCH;
        this.StartDeltaYAW = this.cDeltaYAW;
    }

    
    this.EndX = X;
    this.EndY = Y;
    this.EndZ = Z;
    this.EndPITCH = Pitch;
    this.EndYAW = Yaw;
    this.EndROLL = Roll;
    this.EndDeltaPITCH = DeltaPITCH;
    this.EndDeltaYAW = DeltaYAW;
    
    this.pStartTime = lStartTime;
    this.pLength = lLength;
}

/********************************************************************************************/
//TEPosition
/********************************************************************************************/
function TEPosition()
{
    this.X=0.0;// As Double 'local copy
    this.Y=0.0;// As Double 'local copy
    this.Height=0.0;// As Double 'local copy
    this.Yaw=0.0;// As Double 'local copy
    this.Pitch=0.0;// As Double 'local copy
    this.Roll=0.0;// As Double 'local copy
    this.CameraDeltaYaw=0.0;// As Double 'local copy
    this.CameraDeltaPitch=0.0;// As Variant 'local copy
    //method
    this.Equal=_TEPosition_Equal;
    this.Copy=_TEPosition_Copy;
}

function _TEPosition_Equal(pos)
{
    return (this.X == pos.X &&
            this.Y == pos.Y && 
            this.Height == pos.Height &&
            this.Yaw == pos.Yaw &&
            this.Pitch == pos.Pitch &&
            this.Roll == pos.Roll &&
            this.CameraDeltaYaw == pos.CameraDeltaYaw &&
            this.CameraDeltaPitch == pos.CameraDeltaPitch)
}
function _TEPosition_Copy(pos)
{
    this.X = pos.X;
    this.Y = pos.Y;
    this.Height = pos.Height;
    this.Yaw = pos.Yaw;
    this.Pitch = pos.Pitch;
    this.Roll = pos.Roll;
    this.CameraDeltaYaw = pos.CameraDeltaYaw;
    this.CameraDeltaPitch = pos.CameraDeltaPitch;
}
/********************************************************************************************/
//CoordinateSyetem
/********************************************************************************************/

function  CoordinateSyetem()
{
  this.Group="";// As String 'local copy
  this.System="";// As String 'local copy
  this.Datum="";// As String 'local copy
  this.Unit="";// As String 'local copy
  this.EPSG="";// As String 'local copy
}
/********************************************************************************************/
//Plane
/********************************************************************************************/

function Plane()
{

  var _this=this;

  this.ObjName        = "Plane";
  this.MyManager = null;// As TECollaboration.Manager
  this.Comm = null;// As SLCULib.Comunication
  this.te = null;// As TerraExplorer;// 'To draw the cursors in the OnFrame

  this.IPlane = null;//As IPlane3
  this.ICoordSys = null;//As ICoordSys;
  this.ITerrain = null;//As ITerrain3;

  this.TEPosition1 = null;// As TEPosition
  this.TEPosition2 = null;// As TEPosition

  this.LastMoveTimeStamp=0.0;// As Double Static

  this.LeaderName = "";
  this.SyncLocation = false;
  this.IamDaLeader = false;
  this.StaticFrameDelay = 20;
  this.DynamicFramesDelay = 0;
  this.StaticFramesCounter = 0;
  this.DynamicFramesCounter = 0;
  this.SendIntervalMiliSec = 1000;
  
  this.ClientCS = new CoordinateSyetem();
  this.MyContinuousMotion = new ContinuousMotion();


  //methods
  this.SetManager = _plane_SetManager;
  this.Execute = _plane_Execute;
  this.SetMeAsLeader = _plane_SetMeAsLeader;
  this.ClearLeader = _plane_ClearLeader;
  this.SetContinuousMotionGlobe = _plane_SetContinuousMotionGlobe;
  
  //fire events
  this.attachEvent=_plane_attachEvent;
  this.OnLeaderChangedEvent=null;
  this.fireOnLeaderChanged=_plane_fireOnLeaderChanged;

  //events of te - help
  this.te_OnFrame=_plane_te_OnFrame;
  this.OnFrame=function()        { _this.te_OnFrame();       }
  this.te_OnLoadFinished=_plane_te_OnLoadFinished;
  this.OnLoadFinished=function()        { _this.te_OnLoadFinished();       }
}


function _plane_attachEvent(name,func)
{
    //we support only with one site - change it to array
    if (name=="OnLeaderChanged")
      this.OnLeaderChangedEvent=func;
}

function _plane_fireOnLeaderChanged(leader)
{
    if (this.OnLeaderChangedEvent)
      this.OnLeaderChangedEvent(leader);
}




//'To fire this event, use RaiseEvent with the following syntax:
//'RaiseEvent OnMessage[(arg1, arg2, ... , argn)]

//VBVBVB
//Public Event OnMessage(LastMessage As String)



function _plane_SetManager(vData)
{
//''used when assigning an Object to the property, on the left side of a Set statement.
    this.MyManager = vData;
    this.Comm = this.MyManager.Comm;
    this.te = this.MyManager.TerraExplorer;
    this.IPlane = this.te.interface("IPlane3");
    this.ICoordSys = this.te.interface("ICoordSys");
    this.ITerrain = this.te.interface("ITerrain3");
    this.TEPosition1=new TEPosition();
    this.TEPosition2=new TEPosition();
    
    //events of te
    this.te.attachEvent("OnFrame",       this.OnFrame);
    this.te.attachEvent("OnLoadFinished",this.OnLoadFinished);
    

    this.SetContinuousMotionGlobe();
}



//Private Sub te_OnLoadFinished()
function _plane_te_OnLoadFinished()
{
    this.SetContinuousMotionGlobe();
}


//Private Sub SetContinuousMotionGlobe()
function _plane_SetContinuousMotionGlobe()
{
    //'MyContinuousMotion needs to know if the terrain is globe or not
    this.MyContinuousMotion.TerrainIsGlobe = (	this.ITerrain.GroupKey == "LAT-LONG" &&
                                                this.ITerrain.SystemKey == "LAT-LONG" && 
                                                this.ITerrain.DatumKey == "WGS84")
}


function _plane_SetMeAsLeader()
{
    this.IamDaLeader = true;
    this.LeaderName = this.Comm.Nick;
    this.fireOnLeaderChanged(this.Comm.Nick);
//    'MsgBox "LeaderName set as: " & LeaderName
//    'LeaderMessageFlag = True
    this.Comm.BroadcastData("<Plane><SetLeader>" + this.LeaderName + "<SetLeader><Plane>", 0);
}


function _plane_ClearLeader()
{
    this.IamDaLeader = false;
    this.LeaderName = "";
    this.fireOnLeaderChanged(this.LeaderName);
}

//Public Sub Execute(FromIP As String, FromNick As String, ByVal InputStr As String)
function _plane_Execute(FromIP, FromNick, InputStr)
{
    var st = StripTag(InputStr);
    var Command = st.Command;
    var InputStr = st.Message;

    
    if (Command == "")
    {
        //alert("2DO: Send Illegal message");
        return;
    }
    
    if (Command == "TrackOnOff")
    {
        if (InputStr == "On")
        {
             this.SyncLocation = true;
        }
        else
        {
            if (InputStr == "Off")
            {
                this.SyncLocation = false;
                return;
            }
        }
    }
    
    if (Command == "SetLeader")
    {
        //If ((Comm.IP = FromIP) and (Comm.Nick = FromNick)) Then Exit Sub
        if (InputStr == this.Comm.Nick) 
        {
            this.IamDaLeader = true;
            this.LeaderName = this.Comm.Nick;
            //alert("LeaderName set as: " + LeaderName);
            this.fireOnLeaderChanged(this.Comm.Nick);
        }
        else
        {
            this.IamDaLeader = false;
            this.LeaderName = InputStr;
            this.fireOnLeaderChanged(InputStr);
        }
    }
    
    if (Command == "SetPosition") 
    {
        if (this.te.FlyName == "NO_FLY") return;
        if (this.SyncLocation && !this.IamDaLeader)
        {
            var Chr1=String.fromCharCode(1);
            var sArray = InputStr.split(Chr1);
            this.MyContinuousMotion.StartFlow(parseFloat(sArray[0]), parseFloat(sArray[1]), parseFloat(sArray[2]), parseFloat(sArray[4]), parseFloat(sArray[3]), parseFloat(sArray[5]), parseFloat(sArray[7]), parseFloat(sArray[6]));
        }
    }
    
    if (Command == "WhoIsLeader")
    {
        if (this.IamDaLeader) 
        {
            this.Comm.SendData(FromIP, FromNick, "<Plane><SetLeader>" + this.Comm.Nick + "<SetLeader><Plane>", 0);
        }
    }
    
//'     If (StrComp(Command, "SetCommCS", vbTextCompare) = 0) Then
//'        'If ((Comm.IP = FromIP) And (Comm.Nick = FromNick)) Then Exit Sub
//'        If (Comm.Nick = FromNick) Then Exit Sub
//'                sArray = Split(InputStr, Chr(1))
//'                With ClientCS
//'                    .Group = sArray(0)
//'                    .System = sArray(1)
//'                    .Datum = sArray(2)
//'                    .Unit = sArray(3)
//'                    .EPSG = sArray(4)
//'
//'
//'                      IcoordSys.SetSourceCS .Group, .System, .Datum, .Unit, 0 '.EPSG
//'                End With
//'    End If
    
}


function _plane_te_OnFrame()
{
    if (!this.SyncLocation) return;
    if ( this.Comm.IP == "") return ;// If not connected
    if (this.IamDaLeader)
    {
        var LocationStr="";// As String
        IplaneGetPosition(this.IPlane);
        this.TEPosition1.X = VCP_X;
        this.TEPosition1.Y = VCP_Y;
        this.TEPosition1.Height = VCP_H;
        this.TEPosition1.Yaw = VCP_Yaw;
        this.TEPosition1.Pitch = VCP_Pitch;
        this.TEPosition1.Roll = VCP_Roll;
        this.TEPosition1.CameraDeltaYaw = VCP_C_Yaw;
        this.TEPosition1.CameraDeltaPitch = VCP_C_Pitch;
        if ((GetTickCount() - this.LastMoveTimeStamp) >= this.SendIntervalMiliSec)
        {
            this.LastMoveTimeStamp = GetTickCount();
//           If (TEPosition1.Equals(TEPosition2)) Then
//               StaticFramesCounter = StaticFramesCounter + 1
//               If (StaticFramesCounter < mvarStaticFrameDelay) Then
//                   Exit Sub
//               Else
//                   StaticFramesCounter = 0
//               End If
//           Else
//               DynamicFramesCounter = DynamicFramesCounter + 1
//               If (DynamicFramesCounter < mvarDynamicFramesDelay) Then
//                   Exit Sub
//               Else
//                   DynamicFramesCounter = 0
//               End If
//           End If
            var Chr1=String.fromCharCode(1);
            LocationStr = VCP_X + Chr1 + VCP_Y + Chr1 + VCP_H + Chr1 + VCP_Yaw + Chr1 + VCP_Pitch + Chr1 + VCP_Roll + Chr1 + VCP_C_Yaw + Chr1 + VCP_C_Pitch + Chr1;
            LocationStr = WrapTag(LocationStr, "SetPosition");
            LocationStr = WrapTag(LocationStr, "Plane");
            try
            {
                this.Comm.BroadcastData(LocationStr, 32768);
            }
            catch (e) {  }

        }
//'       TEPosition2.Copy(TEPosition1);
    }
    else
    {
        if (this.SyncLocation && !this.IamDaLeader) 
        {
                 if (this.MyContinuousMotion.pStartTime > 0 && this.MyContinuousMotion.pLength > 0)
                 {
                    this.MyContinuousMotion.CalculateFlow();
                  //  if (this.MyContinuousMotion.PositionChangedInLastCalcFlow)
                    {
                        //'Iplane.MovePosition cX, cY, cZ, cYAW, cPITCH, cROLL, cDeltaYAW, cDeltaPITCH
                        this.IPlane.MovePosition(this.MyContinuousMotion.cX, 
                                                this.MyContinuousMotion.cY, 
                                                this.MyContinuousMotion.cZ, 
                                                this.MyContinuousMotion.cYAW, 
                                                this.MyContinuousMotion.cPITCH, 
                                                this.MyContinuousMotion.cROLL, 
                                                this.MyContinuousMotion.cDeltaYAW, 
                                                this.MyContinuousMotion.cDeltaPITCH);
                    }
            }
        }
        //'With TEPosition
        //'MsgBox "OnFrame SyncLocation=TRUE, IamDaLeader=FALSE"
        //'MsgBox "x= " & CStr(.X)
        //'Iplane.SetPosition .X, .Y, .Height, .Yaw, .Pitch, .Roll, .CameraDeltaYaw, .CameraDeltaPitch
        //'End With
    }
}


/********************************************************************************************/
//Annotation
/********************************************************************************************/

function Annotation()
{

    var _this=this;

// Properties
    this.ObjName        = "Annotation";
    this.MyManager = null;// As TECollaboration.Manager
    this.Comm = null;// As SLCULib.Comunication
    this.te = null;// As TerraExplorer;// 'To draw the cursors in the OnFrame

    this.ICoordSys = null;//As ICoordSys;
    this.IObjectManager = null;//As IObjectManager2;
    this.IInformationTree=null;// As IInformationTree2
    this.GroupName = null;

// methods
    this.SetManager = _annotation_SetManager;
    this.Execute = _annotation_Execute;

    this.CreatePolyline = _annotation_CreatePolyline;
    this.CreateTextLabel = _annotation_CreateTextLabel;
    this.ShowHide = _annotation_ShowHide;
  
}

function _annotation_SetManager(vData)
{
    this.MyManager = vData;
    this.Comm = this.MyManager.Comm;
    this.te = this.MyManager.TerraExplorer;
    this.ICoordSys = this.te.interface("ICoordSys");
    this.IObjectManager = this.te.interface("IObjectManager2");
    this.IInformationTree = this.te.interface("IInformationTree2");
}

function _annotation_Execute(FromIP, FromNick, InputStr)
{
    if (SGWorld.Project.Name == "")
        return;
        
    var st = StripTag(InputStr);
    var Command = st.Command;
    var InputStr = st.Message;


    if (Comm.Nick == FromNick) return;

    if (Command == "")
         return;   //alert("2DO: Send Illegal message");

    if (Command == "DrawPolyline")
    {
        var NewPolyline ;
        var Chr1=String.fromCharCode(1);
        var sArray = InputStr.split(Chr1);
        NewPolyline = this.IObjectManager.CreatePolyline(0, sArray[1], 0, GetGroupID(this.GroupName, SGLang.i18n("Text85"), FromNick), sArray[2]);
        var i=0;
        for(i = 4 ; i <= (sArray[3])*3+1; i+=3)
        {
             NewPolyline.AddVertex (parseFloat(sArray[i]),parseFloat(sArray[i + 1]), parseFloat(sArray[i + 2]));
        }
        if (NewPolyline != null)
            NewPolyline.HeightStyle = sArray[0];
    }
    if (Command == "AddTextLabel")
    {
        var NewLabel ;
        var Chr1=String.fromCharCode(1);
        var sArray = InputStr.split(Chr1);
        NewLabel = this.IObjectManager.CreateLabel(parseFloat(sArray[0]), parseFloat(sArray[1]), parseFloat(sArray[2]), GetGroupID(this.GroupName, SGLang.i18n("Text86"), FromNick), sArray[3])
        NewLabel.Text = sArray[4];
        NewLabel.FgColor = parseInt(sArray[5]);
        NewLabel.BgColor = parseInt(sArray[6]);
        NewLabel.FontSize = parseInt(sArray[7]);
        NewLabel.ScaleFactor = parseFloat(sArray[8]);
        NewLabel.LineToGroundType = 1; // LINE_TYPE_TO_GROUND 
    }
    
    if (Command == "ShowHide") 
    {
        var Chr1=String.fromCharCode(1);
        var sArray = InputStr.split(Chr1);
        ItemID = IInformationTree.FindItem(sArray[0]);
        if (ItemID == 0) 
            return;
        var IsGroup = true;
        if (sArray[2] == "0")    // We need this code 'cause we aren't sure if the sender uses Javascript or VB6
            IsGroup = false;
        var IsShow = true;
        if (sArray[1] == "0")
            IsShow = false;
        
        if (IsGroup)
            IInformationTree.SetGroupVisibility (ItemID, IsShow);
        else
        {
            objTemp = IInformationTree.GetObject(ItemID);
            objTemp.Visible = IsShow;
        }
    }
}

function _annotation_CreatePolyline (IPolyline)
{
    var Chr1=String.fromCharCode(1);
    var i=0;
    Message = "";
    for(i = 0 ; i <= IPolyline.NumOfVertices - 1; i++)
    {
        IpolylineGetVertex(i,IPolyline);
        Message = Message + Chr1 + VRX_X + Chr1 + VRX_H + Chr1 + VRX_Y;
    }

// Height Style, Line color, NumofVertices, vertices ..
    Message = IPolyline.HeightStyle  + Chr1 +  IPolyline.FgColor + Chr1 + IPolyline.Description + Chr1 + IPolyline.NumOfVertices + Message;
    Message = WrapTag(Message, "DrawPolyline");
    Message = WrapTag(Message, "Annotation");
    
    this.Comm.BroadcastData(Message, 0);
}
function _annotation_CreateTextLabel (ITextLabel)
{
    Message = "";
    var Chr1=String.fromCharCode(1);
    IobjectGetPosition (ITextLabel);

    Message = OGP_X + Chr1 + OGP_Y + Chr1 + OGP_H + Chr1 + ITextLabel.Description;
    Message = Message + Chr1 + ITextLabel.Text  + Chr1 + ITextLabel.FgColor + Chr1 + ITextLabel.BgColor + Chr1 + ITextLabel.FontSize + Chr1 + ITextLabel.ScaleFactor;
    
    Message = WrapTag(Message, "AddTextLabel");
    Message = WrapTag(Message, "Annotation");

    this.Comm.BroadcastData(Message, 0);
}

function _annotation_ShowHide (ItemID, bVisible, IsGroup)
{
    var Chr1=String.fromCharCode(1);
    Message = "\\";
    ParentItem = IInformationTree.GetNextItem(ItemID, 15);
    while ( ParentItem != 0 )
    {
        Message = "\\" + IInformationTree.GetItemName(ParentItem) + Message;
        ParentItem = IInformationTree.GetNextItem(ParentItem, 15);
    }
    Message = Message + IInformationTree.GetItemName(ItemID);
    Message = Message + Chr1 +  1*bVisible + Chr1 +  1*IsGroup;
    
    Message = WrapTag(Message, "ShowHide");
    Message = WrapTag(Message, "Annotation");

    this.Comm.BroadcastData(Message, 0);
}

/********************************************************************************************/
//CHAT
/********************************************************************************************/
function Chat()
{

  var _this=this;

  this.ObjName        = "Chat";
  this.MyManager = null;// As TECollaboration.Manager
  this.Comm = null;// As SLCULib.Comunication
  this.te = null;// As TerraExplorer;// 'To draw the cursors in the OnFrame

  this.IContainer = null;// As IContainer



  this.MessageLog=new Array(10);//10) As String
  this.FirstLine = 0;// As Integer
  this.bAutoRefreshMessageBarChat = true;

  this.te_OnConnectionReady=chat_te_OnConnectionReady;
  this.OnConnectionReady=function() { _this.te_OnConnectionReady();}


  //methods
  this.SetManager = _chat_SetManager;
  this.RefreshMessageBarChatMessages = _chat_RefreshMessageBarChatMessages;
  this.SendMessageBox = _chat_SendMessageBox;
  this.SendTextMessage = _chat_SendTextMessage;
  this.Execute = _chat_Execute;
  
  this.attachEvent=_chat_attachEvent;
  this.OnMessageEvent=null;
  this.fireOnMessage=_chat_fireOnMessage;


}


function _chat_attachEvent(name,func)
{
    //we support only with one site - change it to array
    if (name=="OnMessage")
      this.OnMessageEvent=func;
}
function _chat_fireOnMessage(message)
{
    if (this.OnMessageEvent)
      this.OnMessageEvent(message);
}




//'To fire this event, use RaiseEvent with the following syntax:
//'RaiseEvent OnMessage[(arg1, arg2, ... , argn)]

//VBVBVB
//Public Event OnMessage(LastMessage As String)





function _chat_SetManager(vData)
{
//''used when assigning an Object to the property, on the left side of a Set statement.
    this.MyManager = vData;
    this.Comm = this.MyManager.Comm;
    this.te = this.MyManager.TerraExplorer;
    this.IContainer = this.te.interface("IContainer");
}



//Public Sub Execute(FromIP As String, FromNick As String, ByVal InputStr As String)
function _chat_Execute(FromIP, FromNick, InputStrIn)
{

    var Message = "";// As String

    var st = StripTag(InputStrIn);
    var Command = st.Command;
    var InputStr = st.Message;

    
    if (Command == "")
    {
        //'MsgBox "2DO: Send Illegal message"
        return;
    }
    
    if (Command == "Send")
    {
        //'If ((Comm.IP = FromIP) and (Comm.Nick = FromNick)) Then Exit Sub
        //'Message = FromNick & " (" & FromIP & "): " & InputStr 'Changed when asked to remove IP from message
        Message = FromNick + ": " + InputStr;
               
        this.FirstLine++;
        if (this.FirstLine > 10)  this.FirstLine = 0;
        
        this.MessageLog[this.FirstLine] = Message;
        
        //VBVBVB
        //RaiseEvent OnMessage(Message);
        this.fireOnMessage(Message);
        this.RefreshMessageBarChatMessages();
    }
    
    if (Command == "SendMessageBox")
    {
        if ((this.Comm.IP == FromIP) && (this.Comm.Nick == FromNick)) return;
        {
          alert(InputStr);//, vbOKOnly, "TE Collaboration");
        }
    }
}

//Public Sub SendMessageBox(MessageText As String)
function _chat_SendMessageBox(MessageText)
{
    var Message=MessageText;// As String
    Message = MessageText;
    Message = WrapTag(Message, "SendMessageBox");
    Message = WrapTag(Message, this.ObjName);

    this.Comm.BroadcastData(Message, 0);
}

//Public Sub SendMessageBox(MessageText As String)
function _chat_SendTextMessage(MessageText)
{

    var Message=MessageText;// As String
    Message = WrapTag(Message, "Send");
    Message = WrapTag(Message, this.ObjName);

    this.Comm.BroadcastData(Message, 0);
}

//Public Sub RefreshMessageBarChatMessages()
function _chat_RefreshMessageBarChatMessages()
{
    Message = "";
    var i=0;
    for(i = this.FirstLine;i>=0;i--)
    {
        Message += "\n" + this.MessageLog[i];
    }
    for(i = 10;i>=(this.FirstLine + 1);i--)
    {
        Message += "\n" + this.MessageLog[i];
    }
    if (this.bAutoRefreshMessageBarChat)
    {
        this.IContainer.SetMessageBarText(Message);
    }
}

function chat_te_OnConnectionReady()
{
    //'Clear message log eac time a new connection is created
    for(i = 0;i<10;i++)
    {
         this.MessageLog[i] = "";
    }
    
}
/********************************************************************************************/
//CursorInfo
/********************************************************************************************/


//Key As String, X As Double, Y As Double, Height As Double, Style As CursorStyle, Size As CursorSize, CalculatedSize As Double, Color As Long, TECursorObject1 As ITerraExplorerObject2, TECursorObject2 As ITerraExplorerObject2, Optional sKey As String
function CursorInfo(Key,X, Y, Height, Style, Size, CalculatedSize, Color , TECursorObject1 , TECursorObject2 )
{
  this.X=X;               // As Double 'local copy
  this.Y=Y;               // As Double 'local copy
  this.CalculatedSize=CalculatedSize;  // As Double 'local copy
  this.Color=Color;           // As Long 'local copy
  this.TECursorObject1=TECursorObject1;// As ITerraExplorerObject2 'local copy
  this.TECursorObject2=TECursorObject2;// As ITerraExplorerObject2 'local copy
  this.Style=Style;             // As Integer 'local copy
  this.Size=Size;              // As Integer 'local copy
  this.Height=Height;          // As Double 'local copy
  this.MarkedForDeletion=false;   // As Boolean 'local copy

  this.MyContinuousMotion = new ContinuousMotion();
  this.Key=Key;//"";// As String
  this.Free=_CursorInfo_Free;
}

//help function to overcome delay release ...
function _CursorInfo_Free()
{
	try
	{
		if (this.TECursorObject1)
		{
			this.TECursorObject1.visible=false;
			this.TECursorObject1=null;
		}
		if (this.TECursorObject2)
		{
			this.TECursorObject2.visible=false;
			this.TECursorObject2=null;
		}
	}
	catch(e)
	{
		// do nothing. Bug fix for #15668 
	}
}

/********************************************************************************************/
//Enums
/********************************************************************************************/


function ENUM_CursorStyle()
{
  this.ARROW_2D = 0;
  this.ARROW_3D = 1;
  this.CIRCLES  = 2;
} eCursorStyle = new ENUM_CursorStyle()

function ENUM_CursorSize()
{
  this.SMALL = 0;
  this.MEDIUM = 1;
  this.LARGE = 2;
} eCursorSize = new ENUM_CursorSize();


/********************************************************************************************/
//Virtual Cursor
/********************************************************************************************/

//Private Function CalculateCursorSize(MyCursorSize As CursorSize, CenterX As Double, CenterY As Double)
function _virtualCursor_CalculateCursorSize(MyCursorSize, CenterX, CenterY)
{
    //VBVBVB
    //Iplane.GetPosition P_X, P_Y, P_H, P_Yaw, P_Pitch, P_Roll, P_C_Yaw, P_C_Pitch
    IplaneGetPosition(this.Iplane);

    Distance =  this.IcoordSys.GetDistance(VCP_X, VCP_Y, CenterX, CenterY);
    Distance2 = Math.sqrt(Distance * Distance + VCP_H * VCP_H);

    if (MyCursorSize == eCursorSize.SMALL) 
        return Distance2 / 20.0;
    if (MyCursorSize == eCursorSize.MEDIUM)
        return Distance2 / 10.0;
    if (MyCursorSize == eCursorSize.LARGE) 
        return Distance2 / 5.0;
    return Distance2;
}



//Public Sub StartCursor(CursorStyle As CursorStyle, CursorSize As CursorSize, Color As Long, X As Double, Y As Double)
function _virtualCursor_StartCursor(CursorStyle, CursorSize, Color, X , Y)
{
  this.StartCursorEx(CursorStyle, CursorSize, Color, X, Y, 0);// '***Make sure adding 0 is OK
}

//Public Sub StartCursorEx(CursorStyle As CursorStyle, CursorSize As CursorSize, Color As Long, X As Double, Y As Double, Height As Double)
function _virtualCursor_StartCursorEx(CursorStyle, CursorSize, Color, X, Y, Height)
{
  var Message;// As String
  //'Cursor Style, Color
  var Chr1=String.fromCharCode(1);
  Message = CursorStyle + Chr1 + CursorSize + Chr1 + Color + Chr1 + X + Chr1 + Y + Chr1 + Height;
  Message = WrapTag(Message, "StartCursor");
  Message = WrapTag(Message, this.ObjName);

  this.Comm.BroadcastData(Message, 0)
  this.LastMoveTimeStamp = GetTickCount();// 'start cursor includes a location, so can reset the move cursor interval
}

//Public Sub MoveCursor(X As Double, Y As Double, CulculatedSize As Double)
function _virtualCursor_MoveCursor(X, Y, CulculatedSize)
{
  this.MoveCursorEx(X, Y, 0, CulculatedSize);
}

//Public Sub MoveCursorEx(X As Double, Y As Double, Height As Double, CulculatedSize As Double)
function _virtualCursor_MoveCursorEx(X, Y, Height, CulculatedSize)
{
    if ((GetTickCount() - this.LastMoveTimeStamp) >= this.SendIntervalMiliSec) 
    {
        this.LastMoveTimeStamp = GetTickCount();

        var Message;// As String
        var Chr1=String.fromCharCode(1);
        //'Cursor Style, Color
        Message = X + Chr1 + Y + Chr1 + Height + Chr1 + CulculatedSize;
        Message = WrapTag(Message, "MoveCursor");
        Message = WrapTag(Message, this.ObjName);
    
        this.Comm.BroadcastData (Message, 32768);// 'DT_STRING_TRY
    }
}

//Public Sub EndCursor()
function _virtualCursor_EndCursor()
{
  this.EndCursorEx(0, 0, 0, 0);
}

//function EndCursorEx(X As Double, Y As Double, Height As Double, CulculatedSize As Double)
function _virtualCursor_EndCursorEx(X, Y, Height, CulculatedSize)
{
  var  Message;// As String
  var Chr1=String.fromCharCode(1);
  //'Cursor Style, Color
  Message = X + Chr1 + Y + Chr1 + Height + Chr1 + CulculatedSize;
  Message = WrapTag(Message, "EndCursor");
  Message = WrapTag(Message, this.ObjName);

  this.Comm.BroadcastData(Message, 0);
}

function vc_te_OnLoadFinished()
{
     this.SetContinuousMotionGlobe();
}

function vc_te_OnFrame()
{
  var TempCursorInfo;// As CursorInfo
  try
  {
        var CurCursorInfo;
        for(CurCursorInfo in this.LiveCursors)
        {
            TempCursorInfo = this.LiveCursors[CurCursorInfo];
            //Debug.Print "Before: " & TempCursorInfo.MyContinuousMotion.cX & "  " & TempCursorInfo.MyContinuousMotion.cY
            TempCursorInfo.MyContinuousMotion.CalculateFlow();
            TempCursorInfo.X = TempCursorInfo.MyContinuousMotion.cX;
            TempCursorInfo.Y = TempCursorInfo.MyContinuousMotion.cY;
            TempCursorInfo.Height = TempCursorInfo.MyContinuousMotion.cZ;
            //Debug.Print "After: " & TempCursorInfo.MyContinuousMotion.cX & "  " & TempCursorInfo.MyContinuousMotion.cY & "  " & TempCursorInfo.MyContinuousMotion.cZ
    
            TempCursorInfo.CalculatedSize = this.CalculateCursorSize(TempCursorInfo.Size, TempCursorInfo.X, TempCursorInfo.Y);
            if (TempCursorInfo.Style == eCursorStyle.ARROW_2D || TempCursorInfo.Style == eCursorStyle.ARROW_3D)
            {
                

                this.TempTE2DArrow = TempCursorInfo.TECursorObject1;
                //with(this.TempTE2DArrow)
                //{
                    this.TempTE2DArrow.SetPosition(0, 0, TempCursorInfo.CalculatedSize / 20 + TempCursorInfo.Height, 0, 0, 0, 61);
                    if (TempCursorInfo.Style == eCursorStyle.ARROW_3D )
                    {
                        this.TempTE3DArrow = this.TempTE2DArrow;
                        this.TempTE3DArrow.Height = TempCursorInfo.CalculatedSize / 8;
                        //'Debug.Print TempTE3DArrow.Description
                    }
                    this.TempTE2DArrow.HeadX = TempCursorInfo.X;
                    this.TempTE2DArrow.HeadY = TempCursorInfo.Y;
                    var TailX = TempCursorInfo.X;
                    var TailY = TempCursorInfo.Y;
                    //VBVBVB
                    //Iplane.GetPosition P_X, P_Y, P_H, P_Yaw, P_Pitch, P_Roll, P_C_Yaw, P_C_Pitch
                    IplaneGetPosition(this.Iplane);

                    //VBVBVB
                    //this.IcoordSys.MoveCoordEx(TailX, TailY, 0, P_Yaw, 0, 0, -TempCursorInfo.CalculatedSize, 0, 0);
                    IcoordSysMoveCoordEx(this.IcoordSys,TailX, TailY, 0, VCP_Yaw, 0, 0, -TempCursorInfo.CalculatedSize, 0, 0);
                    TailX=CS_X;//this value return from IcoordSysMoveCoordEx
                    TailY=CS_Y;//this value return from IcoordSysMoveCoordEx
                    VCP_Yaw=CS_Yaw;



                    this.TempTE2DArrow.TailX = TailX;
                    this.TempTE2DArrow.TailY = TailY;
                //}
            }
            else
            {
                    if (TempCursorInfo.Style == eCursorStyle.CIRCLES) 
                    {
                        this.TempTECircle = TempCursorInfo.TECursorObject1;
                        this.TempTECircle.Radius = TempCursorInfo.CalculatedSize / 8;
                        this.TempTECircle.SetPosition(TempCursorInfo.X, TempCursorInfo.Y, TempCursorInfo.CalculatedSize / 20 + TempCursorInfo.Height, 0, 0, 0, 0)
                        //'***DOn't 4get
                        this.TempTECircle = TempCursorInfo.TECursorObject2;
                        this.TempTECircle.Radius = TempCursorInfo.CalculatedSize;
                        this.TempTECircle.SetPosition(TempCursorInfo.X, TempCursorInfo.Y, TempCursorInfo.CalculatedSize / 20 + TempCursorInfo.Height, 0, 0, 0, 0);
                        this.TempTECircle = null;
                    }
            }
            
            if (TempCursorInfo.MyContinuousMotion.ReachedEndPoint && TempCursorInfo.MarkedForDeletion)
            {
                //delay release of javascript
                this.LiveCursors[TempCursorInfo.Key].Free();
                this.LiveCursors[TempCursorInfo.Key] = null;
                delete (this.LiveCursors[TempCursorInfo.Key]);

                if (this.TempTE2DArrow) this.TempTE2DArrow = null;
                if (this.TempTE3DArrow) this.TempTE3DArrow = null;
                if (this.TempTECircle)  this.TempTECircle = null;
            }
        }

      TempCursorInfo = null;
      //'If Err.Description <> 0 Then Err.Clear
      return;
  }
  catch(e)
  {
//Err.Clear
//'MsgBox Err.Description & " " & Err.Source & " " & Err.LastDllError
//'This happens because of getting to onFrame when the object is not created yet or after it is deleted.
//'so I swallow the error
//'MsgBox Err.Source
//'While (Err.Number <> 0)
//'    Err.Clear
//'Wend
//'Err.Raise 333, "EylonError", "EylonError"
  }
}

///constractor////
function VirtualCursor()
{
//PRIVATE:
  //properties
  var _this=this;
  this.MyManager=null;// As TECollaboration.Manager
  this.Comm=null;// As SLCULib.Comunication
  this.te=null;// As TerraExplorer;// 'To draw the cursors in the OnFrame

  this.IObjectManager=null;// As IObjectManager3
  this.IRender=null;// As IRender4
  this.IcoordSys=null;// As ICoordSys2
  this.Iplane=null;// As IPlane3
  this.IInformationTree=null;// As IInformationTree2
  this.ITerrain=null;// As ITerrain3

  this.LiveCursors=new Array();// As New CursorInfoCollection
  //Set LiveCursors = New CursorInfoCollection ' = ***nothing ?!?!?
  this.TempCursorInfo1=null;// As CursorInfo
  this.TempCursorInfo2=null;// As CursorInfo
  this.TempTE2DArrow=null;// As ITerrainArrow2
  this.TempTE3DArrow=null;// As ITerrain3DArrow2
  this.TempTECircle=null;// As ITerrainRegularPolygon2

  this.StaticFramesCounter=0;
  this.StaticFramesDelay = 10;
  this.GroupName = null;

  this.sArray;
  //methods

  this.te_OnFrame=vc_te_OnFrame;
  this.OnFrame=function()        { _this.te_OnFrame();       }

  this.te_OnLoadFinished=vc_te_OnLoadFinished;
  this.OnLoadFinished=function() { _this.te_OnLoadFinished();}

  this.CalculateCursorSize=_virtualCursor_CalculateCursorSize;
  this.SetContinuousMotionGlobe=_virtualCursor_SetContinuousMotionGlobe;
  this.LastMoveTimeStamp=0;// As Double



//PUBLIC

//properties:
//local variable(s) to hold property value(s)
  this.SendIntervalMiliSec=500;// As Double 'local copy
  this.ObjName        ="VirtualCursor";
//methods
  this.SetManager     =_virtualCursor_SetManager;
  this.Execute        =_virtualCursor_Execute;
  this.StartCursor    =_virtualCursor_StartCursor;
  this.StartCursorEx  =_virtualCursor_StartCursorEx;
  this.MoveCursor     =_virtualCursor_MoveCursor;
  this.MoveCursorEx   =_virtualCursor_MoveCursorEx;
  this.EndCursor      =_virtualCursor_EndCursor;
  this.EndCursorEx    =_virtualCursor_EndCursorEx;
  

}



function _virtualCursor_SetManager(vData)
{
//''used when assigning an Object to the property, on the left side of a Set statement.
    this.MyManager = vData;
    this.Comm = this.MyManager.Comm;

    this.te = this.MyManager.TerraExplorer;

    this.IObjectManager = this.te.interface("IObjectManager3");
    this.IRender = this.te.interface("IRender4");
    this.IcoordSys = this.te.interface("IcoordSys2");
    this.Iplane = this.te.interface("IPlane3");
    this.IInformationTree = this.te.interface("IInformationTree2");
    this.ITerrain = this.te.interface("ITerrain3");

    this.te.attachEvent("OnLoadFinished",this.OnLoadFinished);
    this.te.attachEvent("OnFrame",       this.OnFrame);
}


function _virtualCursor_SetContinuousMotionGlobe()
{
    //MyContinuousMotion needs to know if the terrain is globe or not
    try
    {
        var CurCursorInfo;
        for(CurCursorInfo in this.LiveCursors)
        {
            var TempCursorInfo = this.LiveCursors[CurCursorInfo];
            TempCursorInfo.MyContinuousMotion.TerrainIsGlobe = (this.ITerrain.GroupKey == "LAT-LONG" && this.ITerrain.SystemKey == "LAT-LONG" && this.ITerrain.DatumKey == "WGS84");
        }
    }
    catch(e)
    {
    }
}

//Public Sub Execute(FromIP As String, FromNick As String, ByVal InputStr As String)
function _virtualCursor_Execute(FromIP, FromNick, InputStrIn)
{
    if (SGWorld.Project.Name == "")
        return;
    var st = StripTag(InputStrIn);
    var Command = st.Command;
    var InputStr = st.Message;
    
    if (Command == "")
    {
        //alert("2DO: Send Illegal message");
        return;
    }

    if (Command == "StartCursor")
    {
        //Debug.Print "StartCursor" & "FromIP: " & FromIP & "FromNick:" & FromNick
        //if ((Comm.IP == FromIP) && (Comm.Nick == FromNick)) return;
        if (Comm.Nick == FromNick) return;

        var NewCursor = null;// As CursorInfo
        var Chr1=String.fromCharCode(1);
        sArray = InputStr.split(Chr1);
        
        //'If already exist from previous time use it if not create new cursor
        /*
        var CurCursorInfo;// As CursorInfo
        var TempCursorInfo;
        for (CurCursorInfo in this.LiveCursors)
        {
            TempCursorInfo = this.LiveCursors[CurCursorInfo];
            if (TempCursorInfo.Key == (FromIP + FromNick))
            {
               NewCursor = TempCursorInfo;
               //NewCursor.TECursorObject1.Visible=false;
            }
        }
        TempCursorInfo = null;
        */
        NewCursor=this.LiveCursors[(FromIP + FromNick)];

        if (NewCursor == null)
        {
            var myCS = this.CalculateCursorSize(1*(sArray[1]), 0, 0);
            NewCursor = new CursorInfo((FromIP + FromNick), parseFloat(sArray[3]), parseFloat(sArray[4]), parseFloat(sArray[5]), 1*(sArray[0]), 1*(sArray[1]), myCS, 1*(sArray[2]), null, null, (FromIP + FromNick));
            this.LiveCursors[(FromIP + FromNick)] = NewCursor;
        }
        else
        {
            NewCursor.Free();
            NewCursor.MarkedForDeletion = false;
        }
        
        
        this.SetContinuousMotionGlobe();
        
        //with(NewCursor)
        //{
            //'Create the TE Cursor object
            switch  (NewCursor.Style)
            {
                case eCursorStyle.ARROW_2D:
                     NewCursor.TECursorObject1 = this.IObjectManager.CreateArrow(sArray[3], sArray[4], sArray[5], 0, 10, 4,NewCursor.Color, 2,NewCursor.Color, 0, GetGroupID(this.GroupName, SGLang.i18n("Text134"),FromNick), "Cursor")
                     this.TempTE2DArrow = NewCursor.TECursorObject1;
                     this.TempTE2DArrow.BgAlpha = 0.8;
                     this.TempTE2DArrow.KeepAliveOnRelease = 0;// 'When the object is removed from the collection it is deleted from TE
                     this.TempTE2DArrow = null;
                     break;
                case eCursorStyle.ARROW_3D:
                    NewCursor.TECursorObject1 = this.IObjectManager.Create3DArrow(parseFloat(sArray[3]), parseFloat(sArray[4]), parseFloat(sArray[5]), 0, 10, 1, NewCursor.CalculatedSize / 8, NewCursor.Color, 2, NewCursor.Color, 0, GetGroupID(this.GroupName, SGLang.i18n("Text134"), FromNick), SGLang.i18n("Text135"))
                     //'.TECursorObject.BgAlpha = 0.8
                     this.TempTE3DArrow = NewCursor.TECursorObject1;
                     this.TempTE3DArrow.BgAlpha = 0.8;
                     this.TempTE3DArrow.KeepAliveOnRelease = 0;// 'When the object is removed from the collection it is deleted from TE
                     this.TempTE3DArrow = null;
                     break;

                case eCursorStyle.CIRCLES:
                    NewCursor.TECursorObject1 = this.IObjectManager.CreateCircle(parseFloat(sArray[3]), parseFloat(sArray[4]), parseFloat(sArray[5]), NewCursor.CalculatedSize / 8, 30, NewCursor.Color, 2, NewCursor.Color, 0, GetGroupID(this.GroupName, SGLang.i18n("Text134"), FromNick), SGLang.i18n("Text136"))
                    NewCursor.TECursorObject2 = this.IObjectManager.CreateCircle(parseFloat(sArray[3]), parseFloat(sArray[4]), parseFloat(sArray[5]), NewCursor.CalculatedSize, 30, NewCursor.Color, 0, NewCursor.Color, 0, GetGroupID(this.GroupName, SGLang.i18n("Text134"), FromNick), SGLang.i18n("Text137"))
                     //'When the object is removed from the collection it is deleted from TE
                     this.TempTECircle = NewCursor.TECursorObject1;
                     this.TempTECircle.KeepAliveOnRelease = 0;
                     this.TempTECircle = NewCursor.TECursorObject2;
                     this.TempTECircle.KeepAliveOnRelease = 0;
                     this.TempTECircle = null;
                     break;
            }
            NewCursor.MyContinuousMotion.StartFlow(parseFloat(sArray[3]), parseFloat(sArray[4]), parseFloat(sArray[5]), 0, 0, 0, 0, 0);
        //}

    }

    var Chr1=String.fromCharCode(1);

    if (Command=="MoveCursor") 
    {
        //Debug.Print "MoveCursor" & "FromIP: " & FromIP & "FromNick: " & FromNick
        //if ((Comm.IP == FromIP) && (Comm.Nick == FromNick)) return;
        if (Comm.Nick == FromNick) return;

        sArray = InputStr.split(Chr1);
        this.TempCursorInfo1 = this.LiveCursors[(FromIP + FromNick)];
        //with(this.TempCursorInfo1)
        //{
            this.TempCursorInfo1.MyContinuousMotion.StartFlow(parseFloat(sArray[0]), parseFloat(sArray[1]), parseFloat(sArray[2]), 0, 0, 0, 0, 0);
            //'.CalculatedSize  = sArray(3)'Decided to ignore the size on the initiating
            //'machine and use calculated size resolved on the StartCursor and OnFrame calculate
        //}
        this.TempCursorInfo1 = null;
    }

    if (Command == "EndCursor")
    {
        //Debug.Print "EndCursor" & "FromIP: " & FromIP & "FromNick: " & FromNick
        //if ((Comm.IP == FromIP) && (Comm.Nick == FromNick)) return;
        if (Comm.Nick == FromNick) return;

        sArray = InputStr.split(Chr1);
        this.TempCursorInfo2 = this.LiveCursors[FromIP + FromNick];
        if (this.TempCursorInfo2 != undefined)
        {
        //with(this.TempCursorInfo2)
        //{
            this.TempCursorInfo2.MyContinuousMotion.StartFlow(parseFloat(sArray[0]), parseFloat(sArray[1]), parseFloat(sArray[2]), 0, 0, 0, 0, 0);
            this.TempCursorInfo2.MarkedForDeletion = true;
        //}
        }
        this.TempCursorInfo2 = null;
    }

}

/********************************************************************************************/
//SessionCreatorManager
/********************************************************************************************/

function SessionCreatorManager()
{

    var _this = this;

    this.ObjName = "SessionCreatorManager";
    this.MyManager = null; // As TECollaboration.Manager
    this.Comm = null; // As SLCULib.Comunication
    this.te = null; // As TerraExplorer;// 'To draw the cursors in the OnFrame

    this.CreatorName = "";
    this.IamDaCreator = false;

    //methods
    this.SetManager = _sessionCreatorManager_SetManager;
    this.Execute = _sessionCreatorManager_Execute;

}
function _sessionCreatorManager_SetManager(vData)
{
    //''used when assigning an Object to the property, on the left side of a Set statement.
    this.MyManager = vData;
    this.Comm = this.MyManager.Comm;
    this.te = this.MyManager.TerraExplorer;
}

function _sessionCreatorManager_Execute(FromIP, FromNick, InputStrIn)
{
    var st = StripTag(InputStrIn);
    var Command = st.Command;
    var InputStr = st.Message;
    if (Command == "WhoIsSessionCreator" && this.MyManager.IsManager)
    {
        this.Comm.SendData(FromIP, FromNick, "<SessionCreatorManager><SessionCreator>" + this.Comm.Nick + "<SessionCreator><SessionCreatorManager>", 0);
    }
    if (Command == "SessionCreator")
    {
        this.CreatorName = InputStr;
    }
}

/********************************************************************************************/
//SessionCreatorManager
/********************************************************************************************/

function ShareManager()
{
    var MyManager = null; // As TECollaboration.Manager
    var Comm = null; // As SLCULib.Comunication
    var _fileManagers =  [];
    var masterFlyReceived = true;
    var flyShareMethod = 0;

    var GetFileManager = function (path)
    {
        if (!_fileManagers[path])
        {
            _fileManagers[path] = $("<OBJECT classid='CLSID:A3EEA80F-5A77-402B-8A2E-D1D9A08A497C' style='display:none' />").appendTo($(document.body));
        }
        return _fileManagers[path][0];
    };

    var DestroyFileManager = function(path)
    {
        if (_fileManagers[path])
        {
            _fileManagers[path].remove();
            delete _fileManagers[path];
        }
    };

    var endsWith = function (str, suffix, ignoreCase)
    {
        if (ignoreCase)
        {
            str = str.toLowerCase();
            suffix = suffix.toLowerCase();
        }
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    return {
        ObjName: "ShareManager",

        _eventNames: ["ShareFlyReceived", "ShareRequest", "MasterFlyReceived", "MasterFlyReloaded"],
        //methods
        SetManager: function(vData)
        {
            MyManager = vData;
            Comm = MyManager.Comm;
        },

        Execute: function(fromIP, fromNick, inputMessage)
        {
            if (fromNick == Comm.Nick) // ignore shares from myself
                return;

            var st = StripTag(inputMessage);
            var command = st.Command;
            var message, fileManager;
            if (st.Message != "")
            {
                message = JSON.parse(st.Message);
                if (message.File)
                    fileManager = GetFileManager(message.File);
            }
            switch (command)
            {
                case "FileStart":
                    {
                        // r is added to filename, so that it will be easier to test this functionality on one computer
                        // this way send and receive file names are different and can coexist on same computer

                        // filename, mode:write, parent window:none
                        fileManager.Open(SGWorld.Application.DataPath + "\\r_" + message.File, 1, 0);
                        break;
                    }
                case "FilePart":
                    {
                        var binaryData = fileManager.FromBase64(message.Data);
                        fileManager.Write(binaryData);
                        break;
                    }
                case "FileEnd":
                    {
                        fileManager.Close();
                        DestroyFileManager(message.File);
                        if (message.IsMasterFly)
                        {
                            Events_FireEvent(this, "MasterFlyReceived", fromNick, SGWorld.Application.DataPath + "\\r_" + message.File);
                            masterFlyReceived = true;
                            if (!MyManager.IsManager)
                                Comm.BroadcastData("<ShareManager><ShareRequest><ShareRequest><ShareManager>", 0)
                        }
                        else
                        {
                            Events_FireEvent(this, "ShareFlyReceived", fromNick, SGWorld.Application.DataPath + "\\r_" + message.File);
                        }
                        break;
                    }
                case "ShareRequest":
                    {
                        Events_FireEvent(this, "ShareRequest", fromNick, fromIP);
                        break;
                    }
                case "MasterFlyUrl":
                    {
                        if (message.File)
                            Events_FireEvent(this, "MasterFlyReceived", fromNick, message.File);
                        masterFlyReceived = true;
                        if (!MyManager.IsManager)
                            Comm.BroadcastData("<ShareManager><ShareRequest><ShareRequest><ShareManager>", 0)

                        break;
                    }
                case "GetMasterFly":
                    {
                        if (!MyManager.IsManager) // only master handles this message
                            return;
                        var message = {};
                        if (flyShareMethod == 2) // send fly link
                        {
                            message.File = SGWorld.Project.Name;
                        }
                        if (flyShareMethod == 1 || flyShareMethod == 2) // do not send fly or send link
                        {
                            Comm.SendData(fromIP, fromNick, "<ShareManager><MasterFlyUrl>" + JSON.stringify(message) + "<MasterFlyUrl><ShareManager>", 0);
                        }
                        else // send fly link
                        {
                            if (endsWith(SGWorld.Project.Name, ".fly", true))
                            {
                                this.ShareFile(SGWorld.Project.Name, fromNick, fromIP, true);
                            }
                            else
                            {
                                Comm.SendData(fromIP, fromNick, "<ShareManager><MasterFlyUrl>" + JSON.stringify({ File: "" }) + "<MasterFlyUrl><ShareManager>", 0);
                                alert(SGLang.i18n("Text130"));
                            }

                        }
                        break;
                    }
                case "MasterFlyReloaded":
                    {
                        Events_FireEvent(this, "MasterFlyReloaded");
                        break;
                    }
            }
        },

        ShareFile: function(filename, toNick, toIp, isMasterFly)
        {
            var originalFileName = filename;
            if (!masterFlyReceived) // do not allow sharing until master fly is received
                return;
            var sendFunction = function(msg, type)
            {
                Comm.BroadcastData(msg, type);
            };
            if (toNick && toIp)
            {
                sendFunction = function(msg, type)
                {
                    Comm.SendData(toIp, toNick, msg, type);
                };
            }
            var fileManager = GetFileManager(filename);
            try
            {
                // filename, mode:read, parent window:none
                if (isMasterFly)
                {
                    fileManager.Open(filename, 0, 0);
                    filename = new Date().getTime() + ".fly";
                }
                else
                {
                    fileManager.Open(SGWorld.Application.DataPath + "\\" + filename, 0, 0);
                }
            }
            catch (e)
            {
                alert(SGLang.i18n("Text139", { path: filename, error: e.description }));
                DestroyFileManager(originalFileName);
                return;
            }
            var message = {
                File: filename,
                IsMasterFly: isMasterFly
            };
            sendFunction("<ShareManager><FileStart>" + JSON.stringify(message) + "<FileStart><ShareManager>", 0);
            var length = fileManager.GetLength();
            var data = {};
            data.more = true;
            data.data = {}
            do
            {
                // read in chunks of 40000 
                ReadDataFromSLFM(fileManager, 40000, data);
                //more = fileManager.Read(1024, null);
                message.Data = fileManager.ToBase64(data.data);
                sendFunction("<ShareManager><FilePart>" + JSON.stringify(message) + "<FilePart><ShareManager>", 0);
            }
            while (data.more);
            delete message.Data;
            sendFunction("<ShareManager><FileEnd>" + JSON.stringify(message) + "<FileEnd><ShareManager>", 0);
            DestroyFileManager(originalFileName);
        },
        AttachEvent: function(event, func, context)
        {
            Events_AttachEvent(this, event, func, context);
        },
        SetFlyShareMethod: function(pFlyShareMethod)
        {
            if (pFlyShareMethod == 0) // unknown, set by client that wants to join
            {
                Comm.BroadcastData("<ShareManager><GetMasterFly><GetMasterFly><ShareManager>", 0);
            }
            else
            {
                flyShareMethod = pFlyShareMethod;
                masterFlyReceived = true;
            }
        },
        Disable: function()
        {
            masterFlyReceived = false;
        }
    };
}

function Events_FireEvent(obj, event)
{
    Events_ValidateEvent(obj, event);

    if (obj._eventHandlers[event])
    {
        var args = Array.prototype.slice.call(arguments, 2);
        var handlerList = obj._eventHandlers[event]
        for (var i = 0; i < handlerList.length; i++)
        {
            var handler = obj._eventHandlers[event][i];
            handler.func.apply(handler.context, args);
        }
    }
}
function Events_ValidateEvent(obj, event)
{
    for (var i = 0; i < obj._eventNames.length; i++)
    {
        if (obj._eventNames[i] == event)
            return;
    }
    throw "Event " + event + " not defined";
}
function Events_AttachEvent(obj, event, func, context)
{
    Events_ValidateEvent(obj, event);
    if(!obj._eventHandlers)
        obj._eventHandlers = {};
    if(!obj._eventHandlers[event])
        obj._eventHandlers[event] = [];
    var handlerList = obj._eventHandlers[event];
    var handler = {
        func: func,
        context: context || window
    };
    handlerList.push(handler);
}
