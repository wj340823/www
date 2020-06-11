

Dim VCP_X
Dim VCP_Y
Dim VCP_H
Dim VCP_Yaw
Dim VCP_Pitch
Dim VCP_Roll
Dim VCP_C_Yaw
Dim VCP_C_Pitch

Sub IplaneGetPosition(lIPlane)
  lIPlane.GetPosition VCP_X, VCP_Y, VCP_H, VCP_Yaw, VCP_Pitch, VCP_Roll, VCP_C_Yaw, VCP_C_Pitch
End Sub


Dim CS_X 
Dim CS_Y 
Dim CS_Elevation
Dim CS_Yaw
Sub IcoordSysMoveCoordEx(lICoordSys,X, Y, Elevation, Yaw, Pitch, Roll, moveForward, moveRight, moveUp)
  CS_X=X
  CS_Y=Y
  CS_Elevation=Elevation
  CS_Yaw=Yaw
  lICoordSys.MoveCoordEx CS_X, CS_Y, CS_Elevation, CS_Yaw, Pitch, Roll, moveForward, moveRight, moveUp
End Sub


Dim VRX_X
Dim VRX_Y
Dim VRX_H
Sub IpolylineGetVertex(i,Polyline)
  Polyline.GetVertex i, VRX_X, VRX_H, VRX_Y
End Sub


Dim OGP_X
Dim OGP_Y
Dim OGP_H
Dim OGP_Yaw
Dim OGP_Pitch
Dim OGP_Roll
Sub IobjectGetPosition(Obj)
    Obj.GetPosition OGP_X, OGP_Y, OGP_H, OGP_Yaw, OGP_Pitch, OGP_Roll
End Sub


function ReadDataFromSLFM(slfm,size,data)
    Dim binaryData
    data.more = slfm.Read(size,binaryData)
    data.data = binaryData
    ReadDataFromSLFM = data
end function