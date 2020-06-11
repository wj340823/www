' VBScript File

dim tmpArr
sub vbInitTempArr(size)
    if size = 0 then ReDim tmpArr(0) : exit sub
    ReDim tmpArr(size-1)    
end sub
sub vbInsertDoubleToTempArray(index, val)
    tmpArr(index) = CDbl(val)
end sub
function vbGetTempArr()
    if UBound(tmpArr) = 0 then vbGetTempArr = 0 : exit function
    vbGetTempArr = tmpArr
end function

function vbTEColor2HTMLColor(r,g,b)
    blue = CStr(Hex(b))
    if len(blue) = 1 then blue = "0"+blue
    green = CStr(Hex(g))
    if len(green) = 1 then green = "0"+green
    red = CStr(Hex(r))
    if len(red) = 1 then red = "0"+red

    vbTEColor2HTMLColor="#"+red+green+blue
end function

function vbGetTEVersion()
    dim teMajor,teMinor,teBuild
    SGAPI.SGWorld.teCore.ITerraExplorer.GetTEVersion teMajor,teMinor,teBuild    
    vbGetTEVersion = teMajor & "." & teMinor & "." & teBuild
end function

sub vbPlaneGetPosition(pos)
    dim x,y,height,yaw,pitch,roll,cameraYaw,cameraPitch,flags
    
    flags = 4096
    if pos.heightType = sgHeightAbsolute then flags = 8192
    
    SGAPI.SGWorld.teCore.IPlane.GetPositionEx x,y,height,yaw,pitch,roll,cameraYaw,cameraPitch,flags
    
    pos.x = x
    pos.y = y
    pos.height = height
    pos.yaw = yaw + cameraYaw
    pos.pitch = pitch + cameraPitch
end sub

function vbSetParent(itemID, parent)
    if SGAPI.SGWorld.bV510orGreater then SGAPI.SGWorld.teCore.ITerraExplorer.SetParam 610, &HFFFF0002    'Make sure that the SetParentEx will add the item at the end of the child nodes 
    SGAPI.SGWorld.teCore.IInformationTree.SetParentEx itemID, parent
    vbSetParent = itemID    
end function

sub vbGetRenderRect(rect)
    dim screenX, screenY, width, height
	SGAPI.SGWorld.teCore.IRender.GetRenderRect screenX, screenY, width, height
	rect.left   = screenX
	rect.top    = screenY
	rect.width  = width
	rect.height = height
end sub

sub vbGetGroupLocation(itemID, pos)
    dim x,y,height,distance,yaw,pitch,flags
    
    SGAPI.SGWorld.teCore.IInformationTree.GetGroupLocation itemID, x,y,height,distance,yaw,pitch,flags
    
    pos.x = x
    pos.y = y
    pos.height = height
    pos.yaw = yaw
    pos.pitch = pitch
    pos.distance = distance
    
    if flags And 8192 then
        pos.heightType = sgHeightAbsolute
    else
        pos.heightType = sgHeightRelative
    end if
end sub

sub vbObjectGetPosition(obj, pos)
    dim x,y,height,yaw,pitch,roll,flags        
    flags = 4096
    if pos.heightType = sgHeightAbsolute then flags = 8192    
    obj.GetPositionEx x,y,height,yaw,pitch,roll,flags        
    pos.x = x
    pos.y = y
    pos.height = height
    pos.yaw = yaw
    pos.pitch = pitch
    pos.roll = roll    
end sub

function vbScreenToWorld(x,y,objType, coord3D)
    vbScreenToWorld = ""
    dim worldX,worldY,worldHeight,objID    
    SGAPI.SGWorld.teCore.IRender.ScreenToWorld x, y, objType, worldX, worldHeight, worldY, objID    
    coord3D.x = worldX
    coord3D.y = worldY
    coord3D.height = worldHeight
    coord3D.heightType = sgHeightAbsolute
    if objType = sgPixelToWorldTypeSky then vbScreenToWorld = "sky" : exit function
    if objID <> "" then vbScreenToWorld = objID
end function

function vbWorldToScreen(WorldX, WorldY, WorldHeight, coord2D)
    dim screenX, screenY, inScreen, bPointInfronOfCamera
    bPointInfronOfCamera = SGAPI.SGWorld.teCore.IRender.WorldToScreen(WorldX, WorldHeight, WorldY, screenX, screenY, 1, inScreen)
    if bPointInfronOfCamera = 0 then vbWorldToScreen = 0 : exit function     
    coord2D.x = screenX
    coord2D.y = screenY    
    if inScreen = 0 then vbWorldToScreen = 0 : exit function        
    vbWorldToScreen = 1
end function

function vbGetMouseInfo(coord2D)
    dim flags, screenX, screenY
    SGAPI.SGWorld.teCore.IRender.GetMouseInfo flags, screenX, screenY
    coord2D.x = screenX
    coord2D.y = screenY
    vbGetMouseInfo = flags
end function

function vbMoveCoordEx(coord, distance, yaw, pitch)
    dim x,y,height,oldHeightType    
    oldHeightType = coord.heightType
    coord.changeHeightType sgHeightAbsolute
    x = coord.x
    y = coord.y
    height = coord.height
    SGAPI.SGWorld.teCore.ICoordSys.MoveCoordEx x,y,height,yaw, pitch, 0, distance, 0,0
    coord.x = x
    coord.y = y
    coord.height = height
    coord.changeHeightType oldHeightType
    vbMoveCoordEx = yaw
end function

sub vbGetAimingAnglesEx(x1,y1,h1, x2,y2,h2, flags, outAngles)
    dim yaw, pitch
    SGAPI.SGWorld.teCore.ICoordSys.GetAimingAnglesEx x1,y1,h1, x2,y2,h2, yaw,pitch, flags
    outAngles.yaw = yaw
    outAngles.pitch = pitch
end sub

function vbConvertArray(JSArry)
    Dim myVBArray, temp
    temp = JSArry.join(", ")
    myVBArray = Split(temp, ", ")    
    vbConvertArray = myVBArray
end function
    
function vbCreatePolyline(lineColor, HeightStyle, GroupID, Description)
    set vbCreatePolyline = SGAPI.SGWorld.teCore.IObjectManager.CreatePolyline(vbGetTempArr(), lineColor, HeightStyle, GroupID, Description)
end function

function vbCreatePolygon(lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description)
    set vbCreatePolygon = SGAPI.SGWorld.teCore.IObjectManager.Create2DPolygon(vbGetTempArr(), lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description)
end function

function vbCreate3DPolygon(objectHeight, lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description)
    set vbCreate3DPolygon = SGAPI.SGWorld.teCore.IObjectManager.Create3DPolygon(vbGetTempArr(), objectHeight, lineColor, fillOpacity, fillColor, HeightStyle, GroupID, Description)
end function

function vbCreateBuilding(roofHeight, buildingStyle, HeightStyle, GroupID, Description)
    set vbCreateBuilding = SGAPI.SGWorld.teCore.IObjectManager.CreateBuilding(vbGetTempArr(), roofHeight, buildingStyle, HeightStyle, GroupID, Description)
end function

function vbMsgBox(prompt, buttons, title)
    vbMsgBox = MsgBox(prompt, buttons, title)
end function
