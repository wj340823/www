var PointLayer;
var gPositionsArray = [];
var gVisibleArray = [];
var gPointsIndex = 0;
var gViewshedIndex = 0;
var gVisibilityDistance = 4000;

var bInEdit;
var bFirstTime;
var gStartDate;
var gEndDate;
var gForceOutOfRange;

var gPointsSelection = [];
var time;


//-----------

var seedLatitude = -99;
//-----------
// SelectViewshedObjects
function SelectViewshedObjects() {
    
    SGWorld.Window.ShowMessageBarText(SGLang.i18n("Text72"), 120000); 
    gForceOutOfRange = true;
    
    
    for (var i = 0; i < viewshedArray.length; i++) {
        var viewshedObj =  viewshedArray[i];
        var centerPoint = viewshedObj.Position.Copy();
        var verticesArray = [];

        if (viewshedObj.FieldOfViewX == 360) // Spherical
        {
            
            var sqrDist = viewshedObj.Distance * Math.sqrt(2) ;
            var Point1 = centerPoint.Move(sqrDist, 45, centerPoint.Pitch);
            var Point2 = centerPoint.Move(sqrDist, 135, centerPoint.Pitch);
            var Point3 = centerPoint.Move(sqrDist, 225, centerPoint.Pitch);
            var Point4 = centerPoint.Move(sqrDist, 315, centerPoint.Pitch);
            var verticesArray = [Point1.X, Point1.Y, 0, Point2.X, Point2.Y, 0, Point3.X, Point3.Y, 0, Point4.X, Point4.Y, 0];
        }
        else {
            var rightPoint = centerPoint.Move(viewshedObj.Distance / Math.cos(viewshedObj.FieldOfViewX * Math.PI / 360), centerPoint.Yaw - viewshedObj.FieldOfViewX / 2, centerPoint.Pitch);
            var leftPoint = centerPoint.Move(viewshedObj.Distance / Math.cos(viewshedObj.FieldOfViewX * Math.PI / 360), centerPoint.Yaw + viewshedObj.FieldOfViewX / 2, centerPoint.Pitch);
            var verticesArray = [centerPoint.X, centerPoint.Y, 0, rightPoint.X, rightPoint.Y, 0, leftPoint.X, leftPoint.Y, 0];
        }
        
        var tmpPolygon = SGWorld.Creator.CreatePolygonFromArray(verticesArray, 0, 0, 0, GroupID, "");

        if (seedLatitude == -99) {
            seedLatitude = verticesArray[1];
        }
        DrawOnPolygon(tmpPolygon.Geometry, 2, 2)
        SGWorld.ProjectTree.DeleteItem(tmpPolygon.ID);
    }
    globalCount = 0;
    seedLatitude = -99;

}

//-----------
// DrawOnPolygon
function DrawOnPolygon(polygonGeometry, type, altitudeType) {

    var envelope = polygonGeometry.Envelope; // Multi polygon evnelope (min/max)

    CreateTheObjects = true;
    var MinX = Math.min(envelope.Rings(0).Points(0).x, envelope.Rings(0).Points(2).x); //coordinateswise: he need to know which one is minimum/maximum
    var MaxX = Math.max(envelope.Rings(0).Points(0).x, envelope.Rings(0).Points(2).x);
    var MinY = Math.min(envelope.Rings(0).Points(0).y, envelope.Rings(0).Points(2).y);
    var MaxY = Math.max(envelope.Rings(0).Points(0).y, envelope.Rings(0).Points(2).y);
   
    var XDist = SGWorld.CoordServices.GetDistance(MinX, MinY, MaxX, MinY);
    var YDist = SGWorld.CoordServices.GetDistance(MinX, MinY, MinX, MaxY);

    var distanceVal = validateNumber($("#distance").attr("value")); 
        // Find the first point altitude
        var currCoord;
        switch (polygonGeometry.GeometryType) {
            case 3: // ipolygon
                currCoord = SGWorld.Creator.CreatePosition(MinX, MinY, polygonGeometry.Rings(0).Points.Item(0).Z, altitudeType, 0);
                break;
            case 6: // imultipolygon
                currCoord = SGWorld.Creator.CreatePosition(MinX, MinY, polygonGeometry.Item(0).Rings(0).Points.Item(0).Z, altitudeType, 0);
                break;
        }
       
        var currCoordAlt = currCoord.Altitude;
       
        while (currCoord.x < MaxX) {
            currCoord.y = MinY;
            while (currCoord.y < MaxY) {
                var pointGeometry = SGWorld.Creator.GeometryCreator.CreatePointGeometry([currCoord.x, currCoord.y, 0]);
                if (polygonGeometry.SpatialRelation.Intersects(pointGeometry)) {
                    var tmpCoord = currCoord.Copy(); // to avoid changes in the CurrCoord value in the DrawObject function 
                        
                        if (AddToPointsList(tmpCoord) == false)
                            return false;
                        
                  
                }       
                currCoord = currCoord.Move(distanceVal, 0, 0);
                currCoord.Altitude = currCoordAlt;               
            }
            currCoord = currCoord.Move(distanceVal, 90, 0);
            currCoord.Altitude = currCoordAlt;
        }
        return true;
        
}

function AlignLatLong(TerrainX, TerrainZ, distanceVal) {
    var metersRatio2 = 40000000 / 360;
    var BlockWidthY = distanceVal / metersRatio2;
    var BlockWidthX = distanceVal / (metersRatio2 * Math.cos(seedLatitude * Math.PI / 180));

    var MPTLeft = - 180.0;
    var MPTTop = -90.0;

    var xfactor = (TerrainX - MPTLeft) / BlockWidthX ;
    xfactor = Math.floor(xfactor);
    var BlockX = MPTLeft + (xfactor * BlockWidthX );

    var yfactor = (TerrainZ - MPTTop) / BlockWidthY;
    yfactor = Math.ceil(yfactor);
    var BlockZ = MPTTop + (yfactor * BlockWidthY);

    TerrainX = BlockX + BlockWidthX / 2.0;
    TerrainZ = BlockZ - BlockWidthY / 2.0;

    return [TerrainX, TerrainZ];
}

//------------
//  AddToPointsList
function AddToPointsList(position) {

    var distanceVal = validateNumber($("#distance").attr("value")); 
    // Alight point to grid and check if exists
    if (SGWorld.Terrain.CoordinateSystem.IsPlanar()) {

        position.X = parseInt(position.X);
        position.X = position.X - position.X % distanceVal;
        position.Y = parseInt(position.Y);
        position.Y = position.Y - position.Y % distanceVal;
    }
    else {
        var resultXY = AlignLatLong(position.X, position.Y, distanceVal);
        position.X = resultXY[0];
        position.Y = resultXY[1];
    }

    if (gPointsSelection.indexOf("" + position.X + position.Y) != -1) {//check if exist
        return;
    }

    var minAltitude = validateNumber($("#minAltitude").val());
    var maxAltitude = validateNumber($("#maxAltitude").val());
    var distanceVal = validateNumber($("#distance").attr("value"));

    gPointsSelection[gPointsSelection.length] = "" + position.X + position.Y;  
    

    var AltitudeMode = 0;  

    var withBuildings = (AltitudeMode == 0)?true : false;

    position.AltitudeType = 3;
    groundAltitude = SGWorld.Terrain.GetGroundHeightInfo(position.X, position.Y, 0, withBuildings).Position.Altitude;  // including buildings

    for (var currAltitude = minAltitude; currAltitude <= maxAltitude; currAltitude += distanceVal) {
        position.Altitude = groundAltitude + currAltitude;
        AddPoint(position);
       
    }

    if (withBuildings) {           // if the altitude difference between the point neighbor points exceed a threshold build a wall
        var posNew;
        var neighborAltitude;
        var altitudeDiff = -1;
        var found = false;
        for (var yaw = 270; yaw >= 0; yaw -= 90) {
            posNew = position.Copy();
            posNew = posNew.Move(distanceVal, yaw, 0);
            neighborAltitude = SGWorld.Terrain.GetGroundHeightInfo(posNew.X, posNew.Y, 0, true).Position.Altitude;  // including buildings
            altitudeDiff = Math.max(altitudeDiff, neighborAltitude - groundAltitude);
        }

        if (altitudeDiff > distanceVal * 2)
            for (var currAltitude = minAltitude + distanceVal; currAltitude <= maxAltitude + altitudeDiff; currAltitude += distanceVal) {
                position.Altitude = groundAltitude + currAltitude;
                AddPoint(position);
               
            }
    }
}

//-------------
// AddPoint
function AddPoint(pos) {
    
    var position1 = pos.ToAbsolute(0);
    gPositionsArray[gPointsIndex] = position1;
    gVisibleArray[gPointsIndex] = -1;

    gPointsIndex += 1;
   
}
//------------
//  AnalyzePoints




function AnalyzePoints() {
    var PointVisible = 0;
    var foundPointInRange = false;
    var viewshedID ;
    var totalPoints = gPointsIndex;
    var CreateTheObjects = true;

    
    if (!CreateTheObjects)
        return false;
    
    SGWorld.Window.ShowMessageBarText(SGLang.i18n("Text65"), 120000);

    try {
        SGWorld.Window.SetInputMode(1, "", false); // to avoid movement during analysis. we had to add a single frame to avoid accumulation of memory consumtions in some of the machines, hence one could move terrain during analysis.
        var viewshedID = viewshedArray[globalCount].ID;

        SGWorld.Analysis.StartViewshedVisibilityQuery(viewshedID, $("#QualityVal").attr("value"));

            for (var i = 0; i < gPointsIndex; i++) {
                try {
                    PointVisible = AnalyzePoint(gPositionsArray[i]); // Returns 1 for visible , 0 for unvisible and -1 if not in range
                    if (PointVisible > -1) // not out of range
                    {
                        gVisibleArray[i] = Math.max(gVisibleArray[i] , 0);
                        gVisibleArray[i] += PointVisible;
                   }
                }
                catch (err) {
                    
                    SGLang.i18n("Text50"); }
            }
            
            // Release viewshed buffer
            SGWorld.Analysis.EndVisibilityQuery();
            globalCount++;
            gViewshedIndex++;
  
    }
    catch (err) {
        
            alert ( SGLang.i18n("Text50"));
            return false;
    }
    return true;
}


//------------
//  DrawPoints
function DrawPoints() {

    SGWorld.DetachEvent("OnFrame", DeleteIfDone);
    
    for (var i = 0; i < gPointsIndex; i++) {
        DrawObject(gPositionsArray[i], i);
    
    }
    return true;
}

//---------
// DrawObject
function DrawObject(position, index) {
    var node;
    var TEObj;
    var ObjType = "ImageLabel";    
    var distance = validateNumber($("#distance").attr("value"));   
    
    var size = distance / 100;
    
    var noiseVal = 0;
    var createAs = "LayerStreaming";
    var colorScheme = 0;
    
    var PointVisible;

    SGWorld.Window.ShowMessageBarText(SGLang.i18n("Text74") + " " + index, 120000);

    var VisibleValue = gVisibleArray[index];
    var VisibleRatio = (gVisibleArray[index] / gViewshedIndex) * 100;

    if (VisibleValue < 0 )  // point outside the Viewshed range
       return true;
    VisibleValue = Math.max(VisibleValue, 0);
    var IconColor = 0; // red + green * 256 + blue * 65536;
    if (VisibleRatio < 1)
        IconColor = 255 + 0 * 256 + 0 * 65536; // red
    else
        IconColor = 0 + 255 * 256 + 0 * 65536; // green
    if (PointLayer == null) 
    {
        CreateGroupOrLayer();

        // style the feature group
        if (featureLayerStyles[ObjType] != null) 
        {
            var result = featureLayerStyles[ObjType](size, abspath() + "/img/point.gif", "[IconColor]");
            if (result === false)
                return false;
        }
    }

    PointLayer.FeatureGroups.Point.CreateFeature([position.X, position.Y, position.Altitude], gViewshedIndex + ";" + VisibleValue + ";" + IconColor);

    return true;

}
//----------
//    CreateGroupOrLayer
function CreateGroupOrLayer() {
    var distance = validateNumber($("#distance").attr("value"));
    if (PointLayer == null) {
            var postfix = new Date().getTime();
            PointLayer = SGWorld.Creator.CreateNewFeatureLayer(SGLang.i18n("Text77"), LayerGeometryType.LGT_POINT, "FileName=ViewshedQuery" + postfix + ".shp;TEPlugName=OGR;", GroupID);
            PointLayer.Streaming = true;
            PointLayer.BlockWidth = distance*60;
            PointLayer.Refresh();
           
            PointLayer.DataSourceInfo.Attributes.CreateAttribute(SGLang.i18n("Text66"), 1, 20, 0);
            PointLayer.DataSourceInfo.Attributes.CreateAttribute(SGLang.i18n("Text67"), 1, 20, 0);
            PointLayer.DataSourceInfo.Attributes.CreateAttribute(SGLang.i18n("Text68"), 1, 20, 0);
            PointLayer.DataSourceInfo.Attributes.ImportAll = true;
            PointLayer.Visibility.MaxVisibilityDistance = gVisibilityDistance;
            // style the feature group
            PointLayer.FeatureGroups.Point.DisplayAs = ObjectTypeCode.OT_LABEL;

        }  
 
}
var featureLayerStyles = {

    "ImageLabel": function (size, param, param2) {
        PointLayer.FeatureGroups.Point.DisplayAs = ObjectTypeCode.OT_IMAGE_LABEL;
        PointLayer.FeatureGroups.Point.SetProperty("Image file", param)
        PointLayer.FeatureGroups.Point.SetProperty("Image Color", param2)
        PointLayer.FeatureGroups.Point.SetProperty("Scale", size);
        PointLayer.FeatureGroups.Point.SetProperty("Altitude Method", 1);
        PointLayer.FeatureGroups.Point.SetProperty("Limit growth", true);
        //PointLayer.FeatureGroups.Point.SetProperty("Tool Tip", SGLang.i18n("Text67") + ": [" + SGLang.i18n("Text67") + "]");
    }
   
}

//----
// AnalyzePoint
function AnalyzePoint(position) {

    var a = SGWorld.Analysis.QueryPointVisibility(position);
    if (a > -1) 
    return a;
      
}




