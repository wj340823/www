"use strict;"
//
//---- Global variables -----
//
var g_OperationParameters = null;
//
// * g_NumWaypoints is being used to count waypoints added
// in order to decide whether the user passed the predefined quota. 
//
var g_NumWaypoints = 0;
var g_KeepAskingIfTooManyPoints = true;
//
// * g_MinSlopeDiff is used to determine the minimum difference in grade
// that we'll use to remove extra waypoints
//
var g_MinSlopeDiff = 0.01;
//
// * g_MaxHeadingDiff is used to determine whether a pair of lines is turning
// ie: this is the threshold for a course change
//
var g_MaxHeadingDiff = 0.5;
//
//	* g_Flatten determines whether to implement wall top flattening routine
//
//
var g_Flatten = true;

//Enumeration-style globals
var OBJECTTYPE = {
	"MeshFence": 0,
	"Wall": 1,
	"WallWithFence": 2,
	"WireStrandFence": 3
};

var CREATEAS = {
	"Group": 0,
	"Layer_Entire": 1,
	"Layer_Streaming": 2
};

var FILLSTYLE = {
	"Color": 0,
	"Texture": 1
};

var POSTSTYLE = {
	"None": 0,
	"Circular": 1,
	"Square": 2
};

var TYPE_FENCE = OBJECTTYPE.MeshFence;
var TYPE_WALL = OBJECTTYPE.Wall;
var TYPE_WALLWITHFENCE = OBJECTTYPE.WallWithFence;

// note that "PostReference" is added dynamically because it's just getting reset every time the paramters object gets looped...
// probably it could be placed as a parameter in WorkingGroup more appropriately, but it's just not done that way for now

//Default Parameter Objects
var DEFAULT_FENCE_PARAMS =
{
    ObjectType: OBJECTTYPE.MeshFence,
	CreateAs: CREATEAS.Layer_Streaming,
	FillStyle: FILLSTYLE.Color,
	Color: "#808080",
	Opacity: 50,
	Texture: SGLang.i18n("Select_A_File"),
	Height: 2,
	Sampling: 5,
	SimplifyLine: false,
	PostStyle: POSTSTYLE.Circular,
	PostFillStyle: FILLSTYLE.Color,
	PostColor: "#808080",
	PostTexture: SGLang.i18n("Select_A_File"),
	PostSpacing: 5,
	PostExtension: 0.25,
	PostDiameter: 0.2,
	VisibilityDistance: 5000,
	MaxWaypoints: 2000
};
var DEFAULT_WALL_PARAMS = 
{
	ObjectType: OBJECTTYPE.Wall,
	CreateAs: CREATEAS.Layer_Streaming,
	FillStyle: FILLSTYLE.Color,
	Color: "#404040",
	Opacity: 100,
	Texture: SGLang.i18n("Select_A_File"),
	Width: 0.5,
	Height: 5,
	Sampling: 5,
	SimplifyLine: false,
	PostStyle: POSTSTYLE.None,
	PostFillStyle: FILLSTYLE.Color,
	PostColor: "#000000",
	PostTexture: SGLang.i18n("Select_A_File"),
	PostSpacing: 5,
	PostExtension: 0.25,
	PostDiameter: 0.25,
	VisibilityDistance: 5000,
	MaxWaypoints: 2000
};

var DEFAULT_WALLWITHFENCE_PARAMS =
{
	ObjectType: OBJECTTYPE.WallWithFence,
	CreateAs: CREATEAS.Layer_Streaming,
	WallParameters: {},
	FenceParameters: {}
};

$.extend(DEFAULT_WALLWITHFENCE_PARAMS.WallParameters, DEFAULT_WALL_PARAMS);
DEFAULT_WALLWITHFENCE_PARAMS.WallParameters.CreateAs = DEFAULT_WALLWITHFENCE_PARAMS.CreateAs;
$.extend(DEFAULT_WALLWITHFENCE_PARAMS.FenceParameters, DEFAULT_FENCE_PARAMS);
DEFAULT_WALLWITHFENCE_PARAMS.FenceParameters.CreateAs = DEFAULT_WALLWITHFENCE_PARAMS.CreateAs;
DEFAULT_WALLWITHFENCE_PARAMS.FenceParameters.Height = DEFAULT_WALLWITHFENCE_PARAMS.WallParameters.Height + 2;
DEFAULT_WALLWITHFENCE_PARAMS.FenceParameters.PostStyle = POSTSTYLE.Circular;

var DEFAULT_WIRESTRAND_PARAMS =
{
	ObjectType: OBJECTTYPE.WireStrandFence,
	CreateAs: CREATEAS.Layer_Streaming,
	NumberOfStrands: 3,
	FillStyle: FILLSTYLE.Color,
	Color: "#808080",
	Opacity: 100,
	Height: 3,
	Sampling: 5,
	SimplifyLine: false,
	PostStyle: POSTSTYLE.Circular,
	PostFillStyle: FILLSTYLE.Color,
	PostColor: "#808080",
	PostTexture: SGLang.i18n("Select_A_File"),
	PostSpacing: 5,
	PostExtension: 0,
	PostDiameter: 0.2,
	VisibilityDistance: 5000,
	MaxWaypoints: 2000
};

function ValidateParameters(params)
{
	if (params == null)
	{
		return false;
	}
    if (params.PostSpacing < params.Sampling) {
        alert(SGLang.i18n("ERROR_TEXT_SamplingFenceAndPosts"));
        return false;
    }
	//Object Type
	switch (params.ObjectType)
	{
		case OBJECTTYPE.MeshFence:
			return ValidateFenceParams(params);
		break;
		case OBJECTTYPE.Wall:
			return ValidateWallParams(params);
		break;
		case OBJECTTYPE.WallWithFence:
			return ValidateWallWithFenceParams(params);
		break;
		case OBJECTTYPE.WireStrandFence:
			return ValidateWireStrandFenceParams(params);
		break;
		default:
			return false;
	}
	
	return true;
}

function ValidateGeneralParams(params) {

    if (params.PostFillStyle == FILLSTYLE.Texture && (params.PostTexture == SGLang.i18n("Select_A_File") || params.PostTexture == "")) {
        alert(SGLang.i18n("ERROR_TEXT_NoPostTexture"));
        return false;
    }

	// check all common numerics here... isNaN and appropriate ranges
	if (isNaN(params.Opacity) ||  params.Opacity < 0 || params.Opacity > 100){
        alert(SGLang.i18n("ERROR_TEXT_OpacityValidation"));
        return false;		
	}
	
    if (isNaN(params.Sampling) ||  params.Sampling < 1){
        alert(SGLang.i18n("ERROR_TEXT_SamplingValidation"));
        return false;
    }

    if (isNaN(params.PostSpacing) || params.PostSpacing < 0) {
        alert(SGLang.i18n("ERROR_TEXT_PostSpacingValidation"));
        return false;
    }

	if (isNaN(params.PostExtension) || params.PostExtension < 0) {
        alert(SGLang.i18n("ERROR_TEXT_PostExtensionValidation"));
        return false;
    }
	
	if (isNaN(params.PostDiameter) || params.PostDiameter < 0) {
        alert(SGLang.i18n("ERROR_TEXT_PostDiameterValidation"));
        return false;
    }

    if (isNaN(params.VisibilityDistance) || params.VisibilityDistance < 1) {
        alert(SGLang.i18n("ERROR_TEXT_VisibilityDistanceValidation"));
        return false;
    }

    //
    // If you got here safe then return true
    //
    return true;
}

function ValidateFenceParams(params) {
    if (params.FillStyle == FILLSTYLE.Texture && params.Texture == SGLang.i18n("Select_A_File")) {
        alert(SGLang.i18n("ERROR_TEXT_NoTexture"));
        return false;
    }
	
    if (isNaN(params.Height) || params.Height < 0.5) {
        alert(SGLang.i18n("ERROR_TEXT_FenceHeightValidation"));
        return false;
    }

	if (!ValidateGeneralParams(params))
	{
		return false;
	}
	
	return true;
}

function ValidateWallParams(params) {
    if (params.FillStyle == FILLSTYLE.Texture && params.Texture == SGLang.i18n("Select_A_File")) {
        alert(SGLang.i18n("ERROR_TEXT_NoTexture"));
        return false;
    }

    if (isNaN(params.Width) || params.Width < 0.01) {
        alert(SGLang.i18n("ERROR_TEXT_WallWidthValidation"));
        return false;
    }
	
	if ( isNaN(params.Height) || params.Height < 0.5 ) {
		alert(SGLang.i18n("ERROR_TEXT_WallHeightValidation"));
		return false;
	}

	if (!ValidateGeneralParams(params))
	{
		return false;
	}
    //
    // If you got here safe then return true
    //
    return true;
}

function ValidateWallWithFenceParams(params) {
	if (ValidateWallParams(params.WallParameters) && ValidateFenceParams(params.FenceParameters))
	{
		return true;
	}
    return false;
}

function ValidateWireStrandFenceParams(params) {
    if (isNaN(params.NumberOfStrands) || params.NumberOfStrands < 0) {
        alert(SGLang.i18n("ERROR_TEXT_TooFewStrands"));
        return false;
    }
	
    if (isNaN(params.Height) || params.Height < 0.5) {
        alert(SGLang.i18n("ERROR_TEXT_WireStrandHeightValidation"));
        return false;
    }

	if (!ValidateGeneralParams(params))
	{
		return false;
	}

    //
    // If you got here safe then return true
    //
    return true;
}

//////////////  Class ClassCreateLayerOrGroupInfo
//
// Constructor for Group or Layer creation helper class
// 
function ClassCreateLayerOrGroupInfo() {
    this.IsGroup = false;
    this.CreateItemCallback = null;
    this.FinalizationCallback = null;
    this.LayerOrGroupObject = null;
}
//
// Function pointers
//
ClassCreateLayerOrGroupInfo.prototype.Create = CreateALayerOrGroup;

function CreateALayerOrGroup() {
        switch (g_OperationParameters.CreateAs) {
            case CREATEAS.Group:
                var theCreatedObject = SGWorld.ProjectTree.CreateGroup(GetCreatedGroupName());
                this.IsGroup = true;
                this.CreateItemCallback = callbackAddItemToGroup;
                this.FinalizationCallback = null;
				this.LayerOrGroupObject = theCreatedObject;
                break;

            case CREATEAS.Layer_Entire:
            case CREATEAS.Layer_Streaming:
				var baseLayerName = GetCreatedLayerName();
				if (g_OperationParameters.ObjectType == OBJECTTYPE.WallWithFence)
				{
					//creating a wall-and-fence type object requires multiple feature layers; LayerOrGroupObject is an array, with
					//LayerOrGroupObject[0] being the wall and LayerOrGroupObject[1] being the fence
					this.LayerOrGroupObject = [];
					
					var wallLayer = CreateAShapeLayer(baseLayerName + " (Wall)", g_OperationParameters.CreateAs, TYPE_WALL);
					SetCommonPropertiesForACreatedLayer(wallLayer, g_OperationParameters.WallParameters);
					var fenceLayer = CreateAShapeLayer(baseLayerName + " (Fence)", g_OperationParameters.CreateAs, TYPE_FENCE);
					SetCommonPropertiesForACreatedLayer(fenceLayer, g_OperationParameters.FenceParameters);
					this.LayerOrGroupObject.push(wallLayer);
					this.LayerOrGroupObject.push(fenceLayer);
				}
				else
				{
					var theCreatedObject = CreateAShapeLayer(baseLayerName, g_OperationParameters.CreateAs, g_OperationParameters.ObjectType);
					SetCommonPropertiesForACreatedLayer(theCreatedObject, g_OperationParameters);
					this.LayerOrGroupObject = theCreatedObject;
				}
				this.IsGroup = false;
				this.CreateItemCallback = callbackAddItemToLayer;
				this.FinalizationCallback = callbackEndOfGraphForLayer;
                break;

            default:
                throw new Error(2000, "Unexpected layer or group option");
        }

        //this.LayerOrGroupObject = theCreatedObject;
}

////////////////////////////////  End of classes definition //////////////////////////////
//
//------------------------------
//  WorkOnSelectedItem
//
function WorkOnSelectedItem() {
    var node = SGWorld.ProjectTree.GetNextItem("", ItemCode.SELECTED);

    if (node == "") {
        alert(SGLang.i18n("ERROR_TEXT_NoItemSelected"));
        return;
    }
    else if (SGWorld.ProjectTree.IsLayer(node)) {
        var theLayer = SGWorld.ProjectTree.GetLayer(node);

        WorkOnALayerOfShapes(theLayer);
    }
    else if (SGWorld.ProjectTree.IsGroup(node)) {
        WorkOnAGroupOfItems(node);
    }
    else {
        alert(SGLang.i18n("ERROR_TEXT_SelectedNotAGroupOrLayer"));
        return;
    }
}
//
//
//
function WorkOnAPolygonOrPolyline(theShape, params) {
    g_KeepAskingIfTooManyPoints = true;
    var creatorHelper = new ClassCreateLayerOrGroupInfo();
    creatorHelper.Create();

	if (params.ObjectType == OBJECTTYPE.MeshFence ||
		params.ObjectType == OBJECTTYPE.Wall ||
		params.ObjectType == OBJECTTYPE.WireStrandFence)
	{
		params.PostReference = null;
		var createdGroupOrLayer = creatorHelper.LayerOrGroupObject;
		
		theCallback = creatorHelper.CreateItemCallback;
		thefinalizationCallback = creatorHelper.FinalizationCallback;

		WorkingGraph(theShape,
                params,
                createdGroupOrLayer,
                theCallback);
				
		if (thefinalizationCallback != null) {
			thefinalizationCallback(createdGroupOrLayer);
		}
	}
	if (params.ObjectType == OBJECTTYPE.WallWithFence)
	{		
		if (g_OperationParameters.CreateAs != CREATEAS.Group)
		{
			params.WallParameters.PostReference = null;
			params.FenceParameters.PostReference = null;
			theCallback = creatorHelper.CreateItemCallback;
			thefinalizationCallback = creatorHelper.FinalizationCallback;
			//TODO: Until TE API is fixed to allow creation of multiple feature groups
			//within a TE-created feature layer, creating a wall-and-fence type object
			//requires multiple feature layers
			var wallLayer = creatorHelper.LayerOrGroupObject[0];
			var fenceLayer = creatorHelper.LayerOrGroupObject[1];
			
			//once for wall
			WorkingGraph(theShape,
					params.WallParameters,
					wallLayer,
					theCallback);
					
			if (thefinalizationCallback != null) {
				thefinalizationCallback(wallLayer);
			}

			//once for fence
			WorkingGraph(theShape,
					params.FenceParameters,
					fenceLayer,
					theCallback);
					
			if (thefinalizationCallback != null) {
				thefinalizationCallback(fenceLayer);
			}
		}
		//else we're creating a group
		else
		{
			params.WallParameters.PostReference = null;
			params.FenceParameters.PostReference = null;
			var createdGroup = creatorHelper.LayerOrGroupObject;
			
			theCallback = creatorHelper.CreateItemCallback;
			thefinalizationCallback = creatorHelper.FinalizationCallback;

			//once for wall
			
			WorkingGraph(theShape,
					params.WallParameters,
					createdGroup,
					theCallback);

			//once for fence

			WorkingGraph(theShape,
					params.FenceParameters,
					createdGroup,
					theCallback);
					
			if (thefinalizationCallback != null) {
				thefinalizationCallback(createdGroup);
			}
		}
	}
}
//
//
//
function WorkOnAGroupOfItems(theGroupnode) {
	g_OperationParameters.PostReference = null;
    var createdGroupOrLayer = null;
    var theCallback = null;
    var thefinalizationCallback = null;
    var helperCreated = false;

    g_KeepAskingIfTooManyPoints = true;
    var creatorHelper = new ClassCreateLayerOrGroupInfo();
   
    //
    // Get the first child
    //
    var childID = SGWorld.ProjectTree.GetNextItem(theGroupnode, ItemCode.CHILD);
    while (childID != 0) {
        var theObject;
        var objectType; 
        var objectTypeValid;

        try {
            theObject = SGWorld.ProjectTree.GetObject(childID);
            objectType = theObject.ObjectType;
            objectTypeValid = true;
        }
        catch (err) {
            objectTypeValid = false;
        }

        if (objectTypeValid) {
            //If it is a layer set a layer callback
            //If it is a group set a group callback
            switch (objectType) { //1 = polyline, 2 = polygon
                case ObjectTypeCode.OT_POLYLINE:
                case ObjectTypeCode.OT_POLYGON:
                    if (!helperCreated) {
                        //
                        // Calling Create() sets all necessary parameters.
                        //
                        creatorHelper.Create();
                        //
                        // Get the operation parameters.
                        //
                        createdGroupOrLayer = creatorHelper.LayerOrGroupObject;
                        theCallback = creatorHelper.CreateItemCallback;
                        thefinalizationCallback = creatorHelper.FinalizationCallback;

                        helperCreated = true;
                    }
                    if (g_OperationParameters.ObjectType == TYPE_WALLWITHFENCE) {
                        var wallGroupOrLayer;
                        var fenceGroupOrLayer;
                        if (g_OperationParameters.CreateAs == CREATEAS.Group) {
                            //wall and fence can go in the same group
                            wallGroupOrLayer = creatorHelper.LayerOrGroupObject;
                            fenceGroupOrLayer = creatorHelper.LayerOrGroupObject;
                        }
                        else {
                            //wall and fence can't go in the same layer because
                            //of the issue with creating multiple feature groups
                            //in a TE-created feature layer
                            wallGroupOrLayer = creatorHelper.LayerOrGroupObject[0];
                            fenceGroupOrLayer = creatorHelper.LayerOrGroupObject[1];
                        }
                        var fenceHeight = parseFloat(g_OperationParameters.WallHeight) + parseFloat(g_OperationParameters.FenceHeight);
                        //call workinggraph twice, once for wall and once for fence

                        //wall
                        WorkingGraph(theObject,
						g_OperationParameters.WallParameters,
						wallGroupOrLayer,
						theCallback);

                        //fence
                        WorkingGraph(theObject,
						g_OperationParameters.FenceParameters,
						fenceGroupOrLayer,
						theCallback);

                        if (thefinalizationCallback != null) {
                            thefinalizationCallback(wallGroupOrLayer);
                            thefinalizationCallback(fenceGroupOrLayer);
                        }
                    }
                    else {
                        WorkingGraph(theObject,
						g_OperationParameters,
						creatorHelper.LayerOrGroupObject,
						theCallback);

                        if (thefinalizationCallback != null) {
                            thefinalizationCallback(createdGroupOrLayer);
                        }
                    }
                    break;
                default:
                    //
                    // Do nothing
                    //
            }
        }
        //
        // Get the next one in line...
        //
        childID = SGWorld.ProjectTree.GetNextItem(childID, ItemCode.NEXT);
    }
}

function WorkOnALayerOfShapes(theLayer) {
    var createdGroupOrLayer = null;
	var wallGroupOrLayer = null;
	var fenceGroupOrLayer = null;
    var theCallback = null;
    var thefinalizationCallback = null;

	g_OperationParameters.PostReference = null;

    g_KeepAskingIfTooManyPoints = true;
    var creatorHelper = new ClassCreateLayerOrGroupInfo();
    creatorHelper.Create();
    theCallback = creatorHelper.CreateItemCallback;
    thefinalizationCallback = creatorHelper.FinalizationCallback;
	
	if (g_OperationParameters.ObjectType == TYPE_WALLWITHFENCE)
	{
	    if (g_OperationParameters.CreateAs == CREATEAS.Group)
		{
			//wall and fence can go in the same group
			wallGroupOrLayer = creatorHelper.LayerOrGroupObject;
			fenceGroupOrLayer = creatorHelper.LayerOrGroupObject;
		}
		else
		{
			//wall and fence can't go in the same layer because
			//of the issue with creating multiple feature groups
			//in a TE-created feature layer
			wallGroupOrLayer = creatorHelper.LayerOrGroupObject[0];
			fenceGroupOrLayer = creatorHelper.LayerOrGroupObject[1];
		}
	}
	else
	{
		createdGroupOrLayer = creatorHelper.LayerOrGroupObject;
	}

    var featureGroupsCount = theLayer.FeatureGroups.Count;
    //
    // A layer might contain different feature groups
    //
    for (var i = 0; i < featureGroupsCount; i++) {
        var groupType = theLayer.FeatureGroups(i).GeometryType;
        if (groupType != SGGeometryTypeId.SG_LINESTRING && groupType != SGGeometryTypeId.SG_LINEARRING)
            continue;

        var theFeatureGroup = theLayer.FeatureGroups(i);
        for (j = 0; j < theFeatureGroup.Count; j++) {
            var currentShape = theFeatureGroup(j);

			if (g_OperationParameters.ObjectType == TYPE_WALLWITHFENCE)
			{
				var fenceHeight = parseFloat(g_OperationParameters.WallHeight) + parseFloat(g_OperationParameters.FenceHeight);
				//call workinggraph twice, once for wall and once for fence
				
				//wall
				var fill;
				switch(g_OperationParameters.WallFillStyle)
				{
					case FILLSTYLE.Color:
						fill = g_OperationParameters.WallColor;
					break;
					case FILLSTYLE.Texture:
					//texture will be default, since it's got to be one or the other
					default:
						fill = g_OperationParameters.WallTexture;
				}
				WorkingGraph(currentShape,
                g_OperationParameters,
                wallGroupOrLayer,
                theCallback);
					
				//fence
				switch(g_OperationParameters.FenceFillStyle)
				{
					case FILLSTYLE.Color:
						fill = g_OperationParameters.FenceColor;
					break;
					case FILLSTYLE.Texture:
					//texture will be default, since it's got to be one or the other
					default:
						fill = g_OperationParameters.FenceTexture;
				}
				WorkingGraph(currentShape,
					g_OperationParameters,
					fenceGroupOrLayer,
					theCallback);
                if (thefinalizationCallback != null) {
                    thefinalizationCallback(wallGroupOrLayer);
                    thefinalizationCallback(fenceGroupOrLayer);
                }
			}
			else
			{
				var fill;
				switch(g_OperationParameters.FillStyle)
				{
					case FILLSTYLE.Color:
						fill = g_OperationParameters.Color;
					break;
					case FILLSTYLE.Texture:
					//texture will be default, since it's got to be one or the other
					default:
						fill = g_OperationParameters.Texture;
				}
				WorkingGraph(currentShape,
					g_OperationParameters,
					createdGroupOrLayer,
					theCallback);
                if (thefinalizationCallback != null) {
                    thefinalizationCallback(createdGroupOrLayer);
                }
			}
        }
    }
}

function WorkOnClipboardItems() {

    var createdGroupOrLayer = null;
    var theCallback = null;
    var thefinalizationCallback = null;
    var helperCreated = false;
	
	g_OperationParameters.PostReference = null;
	
    g_KeepAskingIfTooManyPoints = true;
    var creatorHelper = new ClassCreateLayerOrGroupInfo();
    

    // loop over the clipboard
    for (var i = 0; i < SGWorld.Application.Clipboard.Count; i++) {

        var theObject;
        var objectType;
        var objectTypeValid;

        try {
            theObject = SGWorld.Application.Clipboard.Item(i);
            objectType = theObject.ObjectType;
            objectTypeValid = true;
        }
        catch (err) {
            objectTypeValid = false;
        }

        if (objectTypeValid) {
            //If it is a layer set a layer callback
            //If it is a group set a group callback
            switch (objectType) { //1 = polyline, 2 = polygon
                case ObjectTypeCode.OT_POLYLINE:
                case ObjectTypeCode.OT_POLYGON:
                    if (!helperCreated) {
                        //
                        // Calling Create() sets all necessary parameters.
                        //
                        creatorHelper.Create();
                        //
                        // Get the operation parameters.
                        //
                        createdGroupOrLayer = creatorHelper.LayerOrGroupObject;
                        theCallback = creatorHelper.CreateItemCallback;
                        thefinalizationCallback = creatorHelper.FinalizationCallback;

                        helperCreated = true;
                    }
                    if (g_OperationParameters.ObjectType == TYPE_WALLWITHFENCE) {
                        var wallGroupOrLayer;
                        var fenceGroupOrLayer;
                        if (g_OperationParameters.CreateAs == CREATEAS.Group) {
                            //wall and fence can go in the same group
                            wallGroupOrLayer = creatorHelper.LayerOrGroupObject;
                            fenceGroupOrLayer = creatorHelper.LayerOrGroupObject;
                        }
                        else {
                            //wall and fence can't go in the same layer because
                            //of the issue with creating multiple feature groups
                            //in a TE-created feature layer
                            wallGroupOrLayer = creatorHelper.LayerOrGroupObject[0];
                            fenceGroupOrLayer = creatorHelper.LayerOrGroupObject[1];
                        }
                        var fenceHeight = parseFloat(g_OperationParameters.WallHeight) + parseFloat(g_OperationParameters.FenceHeight);
                        //call workinggraph twice, once for wall and once for fence

                        //wall
                        WorkingGraph(theObject,
							g_OperationParameters.WallParameters,
							wallGroupOrLayer,
							theCallback);

                        //fence
                        WorkingGraph(theObject,
							g_OperationParameters.FenceParameters,
							fenceGroupOrLayer,
							theCallback);

                        if (thefinalizationCallback != null) {
                            thefinalizationCallback(wallGroupOrLayer);
                            thefinalizationCallback(fenceGroupOrLayer);
                        }
                    }
                    else {
                        WorkingGraph(theObject,
							g_OperationParameters,
							creatorHelper.LayerOrGroupObject,
							theCallback);
                        if (thefinalizationCallback != null) {
//                            thefinalizationCallback(createdGroupOrLayer);
                            thefinalizationCallback(creatorHelper.LayerOrGroupObject);
                        }
                    }
                    break;
                default:
                    //
                    // Do nothing
                    //
            }
        }
     }
}


function SetCommonPropertiesForACreatedLayer(theCreatedLayer, params) {
    var theFeaureGroup;
    if (params.ObjectType == OBJECTTYPE.MeshFence || params.ObjectType == OBJECTTYPE.WireStrandFence) {
        theFeaureGroup = theCreatedLayer.FeatureGroups.Polyline;
    }
    else if (params.ObjectType == OBJECTTYPE.Wall) {
        theFeaureGroup = theCreatedLayer.FeatureGroups.Polygon;
    }
	
	var textureScaleY = params.Height;
	//TODO: Until TE API is fixed to allow creation of multiple feature groups
	//within a TE-created feature layer, creating a wall-and-fence type object
	//requires multiple feature layers, so the fence and wall layers will each
	//call this separately (hence why only fence and wall types are handled here)

    theCreatedLayer.IgnoreZ = true;
    
    theFeaureGroup.SetProperty("Altitude", params.Height);
    theFeaureGroup.SetProperty("Max. Visibility Distance", params.VisibilityDistance);
    //theFeaureGroup.SetProperty("Altitude Method", AltitudeTypeCode.ATC_TERRAIN_RELATIVE);
    theFeaureGroup.SetProperty("Altitude Method", 1);
    theFeaureGroup.SetProperty("Line Opacity", 0);
	if (params.FillStyle == FILLSTYLE.Texture)
	{
		theFeaureGroup.SetProperty("Fill Opacity", 100);
		theFeaureGroup.SetProperty("Texture File", params.Texture);
		theFeaureGroup.SetProperty("Tiling Method", TilingMethodCode.TM_METERS_PER_TILE);
		theFeaureGroup.SetProperty("Scale X", 1.5);
		theFeaureGroup.SetProperty("Scale Y", textureScaleY);
	}
	else if (params.FillStyle == FILLSTYLE.Color)
	{
		var color = SGWorld.Creator.CreateColor(0,0,0,0);
		color.FromHTMLColor(params.Color);
		theFeaureGroup.SetProperty("Fill Opacity", params.Opacity);
		theFeaureGroup.SetProperty("Fill Color", color.ToBGRColor());
	}
    theFeaureGroup.SetProperty("Extend to Ground", true);
    theFeaureGroup.SetProperty("Ground Object", true); 
}
//
//
//
function GetCreatedGroupName(){
	var baseName;
	var i = 1;
	switch (g_OperationParameters.ObjectType) {
        case TYPE_WALL:
            baseName = "Wall Group";
            break;
        case TYPE_FENCE:
            baseName = "Mesh Fence Group";
            break;
		case TYPE_WALLWITHFENCE:
			baseName = "Wall And Fence Group";
			break;
		case OBJECTTYPE.WireStrandFence:
			baseName = "Wire Strand Fence Group";
			break;
        default:
            throw new Error(2000, "Unable to create a unique group name - base object type is unrecognized");
    }
	while (SGWorld.ProjectTree.FindItem(baseName + " " + i) != 0)
	{
		i++;
	}
    return baseName + " " + i;
}
//
//
//
function GetCreatedLayerName() {
	var baseName;
	var i = 1;
	switch (g_OperationParameters.ObjectType) {
		case TYPE_WALL:
			baseName = "Wall Layer";
			break;
		case TYPE_FENCE:
			baseName = "Mesh Fence Layer";
			break;
		case TYPE_WALLWITHFENCE:
			baseName = "Wall And Fence Layer";
			break;
		case OBJECTTYPE.WireStrandFence:
			baseName = "Wire Strand Fence Layer";
			break;
        default:
            throw new Error(2000, "Unable to create a unique group name - base object type is unrecognized");
    }
	if (g_OperationParameters.ObjectType != TYPE_WALLWITHFENCE)
	{
		while (SGWorld.ProjectTree.FindItem(baseName + " " + i) != 0)
		{
			i++;
		}
	}
	//TODO: Until TE API is fixed to allow creation of multiple feature groups
	//within a TE-created feature layer, creating a wall-and-fence type object
	//requires multiple feature layers; until then layers are appended with
	//" (Wall)" or " (Fence)" according to the layer they represent in the object
	else
	{
		while (SGWorld.ProjectTree.FindItem(baseName + " " + i + " (Wall)") != 0 ||
				SGWorld.ProjectTree.FindItem(baseName + " " + i + " (Fence)") != 0)
		{
			i++;
		}
	}
    return baseName + " " + i;
}
//
//
//
function callbackEndOfGraphForLayer(theContainer) {
/*alert("in callbackEndOfGraphForLayer" + '\n' +
		"layer name: " + theContainer.TreeItem.Name);*/
    theContainer.Save();
    theContainer.Refresh();
}

function callbackAddItemToLayer(theContainer, linesGeometry, altitude) {
/*alert("in callbackAddItemToLayer" + '\n' +
		"layer name: " + theContainer.TreeItem.Name + '\n' +
		"altitude: " + altitude);*/
    var theStringObjectID;
    if (linesGeometry.GeometryType == SGGeometryTypeId.SG_LINESTRING || linesGeometry.GeometryType == SGGeometryTypeId.SG_MULTILINESTRING) {
        theStringObjectID = theContainer.FeatureGroups.Polyline.CreateFeature(linesGeometry);
    }
    else if (linesGeometry.GeometryType == SGGeometryTypeId.SG_POLYGON || linesGeometry.GeometryType == SGGeometryTypeId.SG_MULTIPOLYGON) {
        //
        // This occurs as a result of calling the buffer that creates a polygon
        //
        theStringObjectID = theContainer.FeatureGroups.Polygon.CreateFeature(linesGeometry);
    }
    else {
        throw new Error(2000, "Expecting a line or multiline or a polygon");
    }

    var theObject = SGWorld.Creator.GetObject(theStringObjectID);
    //SGWorld.Creator.DeleteObject(theStringObjectID);
    return theObject;
}
//
//
//
function callbackAddItemToGroup(theContainer, linesGeometry, altitude){
    
    //
    // Create a terrain object
    //
    var theReturnObject = null;
   
    if (linesGeometry.GeometryType == SGGeometryTypeId.SG_LINESTRING || linesGeometry.GeometryType == SGGeometryTypeId.SG_MULTILINESTRING) {
        var theNewTerrainPolyline = SGWorld.Creator.CreatePolyline(linesGeometry, 0xFFB3FF44, 
        AltitudeTypeCode.ATC_TERRAIN_RELATIVE,
        theContainer /* the group ID*/);
        theReturnObject = theNewTerrainPolyline
        theReturnObject.Position.Altitude = altitude;
        
        theReturnObject.Position.AltitudeType = 3;
        theReturnObject.Geometry.StartEdit();
        if (linesGeometry.GeometryType == SGGeometryTypeId.SG_LINESTRING) {
            for (var i = 0; i < theReturnObject.Geometry.NumPoints; i++) {
                wpi = SGWorld.Terrain.GetGroundHeightInfo(theReturnObject.Geometry.Points(i).X, theReturnObject.Geometry.Points(i).Y, 2, true);
                theReturnObject.Geometry.Points(i).Z = wpi.Position.Altitude + altitude;
            }
        }
        else{
            for (var i = 0; i < theReturnObject.Geometry.NumGeometries; i++) {
                for (var j = 0; j < theReturnObject.Geometry(i).NumPoints; j++) {
                    wpi = SGWorld.Terrain.GetGroundHeightInfo(theReturnObject.Geometry(i).Points(j).X, theReturnObject.Geometry(i).Points(j).Y, 2, true);
                    theReturnObject.Geometry(i).Points(j).Z = wpi.Position.Altitude + altitude;
                }
            }
        }

    theReturnObject.Geometry.EndEdit();
    }
  
    else if (linesGeometry.GeometryType == SGGeometryTypeId.SG_POLYGON || linesGeometry.GeometryType == SGGeometryTypeId.SG_MULTIPOLYGON) {
    
        //
        // This occurs as a result of calling the buffer that creates a polygon
        //
        var theNewTerrainPolygon = SGWorld.Creator.CreatePolygon(linesGeometry, 0xFFB3FF44, 0xFFB3FF44, 
            AltitudeTypeCode.ATC_TERRAIN_ABSOLUTE,
            theContainer /* the group ID*/);
        theReturnObject = theNewTerrainPolygon;
        
        theReturnObject.Position.AltitudeType = 3;
        theReturnObject.Geometry.StartEdit();
        for (var i = 0; i < theReturnObject.Geometry.NumPoints; i++) {
            wpi = SGWorld.Terrain.GetGroundHeightInfo(theReturnObject.Geometry.Points(i).X, theReturnObject.Geometry.Points(i).Y, 2, true);
            theReturnObject.Geometry.Points(i).Z = wpi.Position.Altitude + altitude;
        }
        theReturnObject.Geometry.EndEdit();
    }
    else {
        throw new Error(2000, "Expecting a line or multiline or a polygon");
    }
    //
    // Set common properties
    //
	if (g_OperationParameters.ObjectType != OBJECTTYPE.WallWithFence)
	{
		theReturnObject.Visibility.MaxVisibilityDistance = g_OperationParameters.VisibilityDistance;
	}
	else
	{
		theReturnObject.Visibility.MaxVisibilityDistance = g_OperationParameters.WallParameters.VisibilityDistance;
	}

    return theReturnObject;
}
//
//---------------------------
//
//
function VertexPointInfo() {
	this.Vertex = null;
	this.PointVertex = null;
	this.Heading1 = 0;
	this.Heading2 = 0;
	this.HeadingToVertex = 0;
	this.IsPointVertex = function(point) {
		if (this.Vertex != null) {
			var diff = this.Vertex.AimTo(point).Yaw - this.HeadingToVertex;
			//alert("headingToPoint = " + this.Vertex.AimTo(point).Yaw + "\r\nheadingToVertex = " + this.HeadingToVertex + "\r\ndiff = " + diff);
			if (diff > 359) {
				diff -= 360;
			}
			else if (diff < -359) {
				diff += 360;
			}
			return Math.abs(diff) < 0.05;
		}
		else return false;
	}
}
//
//---------------------------
//
//
function FindEndCap(points, endCap, radius) {
	var total = points.Count;
	//alert("total = " + total);
	for (var i = 0; i < total; i++) {
		var point = points(i);
		if (SGWorld.CoordServices.GetDistance(point.X, point.Y, endCap.X, endCap.Y) <= (radius + 0.1)) {
			//alert("endcap starts at " + i);
			return i;
		}
	}
}
//
//---------------------------
// WorkingGraph : The main working function that creates fences and walls.
//
function WorkingGraph(theShape, parameters, createdGroupOrLayer, callbackAddItemToGroupOrLayer) {
	//
    // Transform to Geos LineString or MultiLineString
    //
    
    var theLines = MakeLinesFromShape(theShape);
    //
    //  Insert the additional weigh points.
    //
    
    var newGeometry;
    //
    // If it passes the quota of weighppoints an exception is thrown.
    //
    try {

        /// 'if' is made to cover smaller fence sampling than posts sampling
        
        if (parameters.PostSpacing > parameters.Sampling && parameters.PostSpacing % parameters.Sampling != 0) { 

            newGeometry = CreateExtraPointsToGeosLineString(theLines, parameters.PostSpacing, parameters.Height, parameters.SimplifyLine);
            newGeometry = CreateExtraPointsToGeosLineString(newGeometry, parameters.Sampling, parameters.Height, parameters.SimplifyLine);
        }
        else newGeometry = CreateExtraPointsToGeosLineString(theLines, parameters.Sampling, parameters.Height, parameters.SimplifyLine);
        
            
		// RPK: this is where the logic has to be for simplifying... or in the function above but with conditionals... see if it can be put here
		// or right after the catch...
    }
    catch (e) {
		//TODO: remove the created group or layer
        return;
    }

    //
    // Create a terrain object from GEOS LineString.
    //
    if (parameters.ObjectType == OBJECTTYPE.Wall) {
        
        var bufferedShape = CreateABufferForTheShape(newGeometry, parameters.Width, parameters.Height)
        //
        // Delete the original shape??
        //
        newGeometry = bufferedShape;
    }
    //
    // Call the callback function, the callback is responsible to set
    // all common properties like altitude etc.
    //
    
	if (parameters.ObjectType != OBJECTTYPE.WireStrandFence) {
	    
	    var theNewShape = callbackAddItemToGroupOrLayer(createdGroupOrLayer, newGeometry, parameters.Height);
	    
	    createdGroupOrLayer.IgnoreZ = false;
	    if (theNewShape.ObjectType == 33) {
	        
	        switch (theNewShape.Geometry.GeometryType) {
	            case 1:
	                {
	                    theNewShape.Geometry.StartEdit();
	                    for (var i = 0; i < theNewShape.Geometry.NumPoints; i++) {

	                        wpi = SGWorld.Terrain.GetGroundHeightInfo(theNewShape.Geometry.Points(i).X, theNewShape.Geometry.Points(i).Y, 1, false);
	                        //if ($("#ddlObjectType").val() == "Option_WallWithFence" && theNewShape.Geometry.GeometryType != 6) theNewShape.Geometry.Points(i).Z = wpi.Position.Altitude + parameters.Height + parseFloat($("#txtWallHeight").val());
	                        if ($("#ddlObjectType").val() == "Option_WallWithFence" && theNewShape.Geometry.GeometryType != 6) theNewShape.Geometry.Points(i).Z = wpi.Position.Altitude + parameters.Height;
	                        else theNewShape.Geometry.Points(i).Z = wpi.Position.Altitude + parameters.Height;

	                    }
	                    theNewShape.Geometry = theNewShape.Geometry.EndEdit();
	                }
	                break;   

                case 5:
	                {
	                    
	                    theNewShape.Geometry.StartEdit();
	                    for (var j = 0; j < theNewShape.Geometry.NumGeometries; j++) {

	                        for (var i = 0; i < theNewShape.Geometry(j).NumPoints; i++) {

	                            wpi = SGWorld.Terrain.GetGroundHeightInfo(theNewShape.Geometry(j).Points(i).X, theNewShape.Geometry(j).Points(i).Y, 1, false);
	                            if ($("#ddlObjectType").val() == "Option_WallWithFence" && theNewShape.Geometry.GeometryType != 6) theNewShape.Geometry(j).Points(i).Z = wpi.Position.Altitude + parameters.Height + parseFloat($("#txtWallHeight").val());
	                            else theNewShape.Geometry(j).Points(i).Z = wpi.Position.Altitude + parameters.Height;
	                        }
	                    }
	                    theNewShape.Geometry = theNewShape.Geometry.EndEdit();
	                }
	                break;

	            case 6:
	                {
	                    theNewShape.Geometry.StartEdit();
	                    for (var j = 0; j < theNewShape.Geometry.NumGeometries; j++) {

	                        for (var i = 0; i < theNewShape.Geometry(j).ExteriorRing.NumPoints; i++) {

	                            wpi = SGWorld.Terrain.GetGroundHeightInfo(theNewShape.Geometry(j).ExteriorRing.Points(i).X, theNewShape.Geometry(j).ExteriorRing.Points(i).Y, 1, false);
	                            theNewShape.Geometry(j).ExteriorRing.Points(i).Z = wpi.Position.Altitude + parameters.Height
	                        }
	                    }
	                    theNewShape.Geometry = theNewShape.Geometry.EndEdit();
	                    
	                }
	                break;
	                
	        }

	    }
	    
       if (theNewShape.ObjectType != 33) theNewShape.Visibility.Show = false;  //made to hide fence shapefile in order to get the correct post altitude from GetGroundHeightInfo
       else createdGroupOrLayer.Visibility.Show = false;

		DoExtendToGround(theNewShape, parameters);
		
	}
	else
	{
		//WIRE STRAND FENCE
		var increments = parameters.Height / (parameters.NumberOfStrands + 1);
		if (parameters.CreateAs != CREATEAS.Group)//its a layer
		{
			if (!createdGroupOrLayer.DataSourceInfo.Attributes.IsAttributeExist("Altitude"))
				createdGroupOrLayer.DataSourceInfo.Attributes.CreateAttribute("Altitude",2,15,3); // 2=Double, 15=szChar,3=precision(num dec places)
			var color = SGWorld.Creator.CreateColor(0,0,0,255);
			color.FromHTMLColor(parameters.Color);
			createdGroupOrLayer.FeatureGroups.Polyline.SetProperty("Extend to Ground", false);
			createdGroupOrLayer.FeatureGroups.Polyline.SetProperty("Line Color", color);
			createdGroupOrLayer.FeatureGroups.Polyline.SetProperty("Altitude", "[Altitude]");
			createdGroupOrLayer.FeatureGroups.Polyline.SetProperty("Line Opacity", parameters.Opacity / 100);
			createdGroupOrLayer.IgnoreZ = false;
			createdGroupOrLayer.Visibility.Show = false; //made to hide fence shapefile in order to get the correct pole altitude from GetGroundHeightInfo
            
}

		for (var i=0; i<parameters.NumberOfStrands; i++) {
		   
			var strandHeight = parameters.Height - ((i + 1) * increments);
			var theNewShape = callbackAddItemToGroupOrLayer(createdGroupOrLayer, newGeometry, strandHeight);
			
			if (parameters.CreateAs == CREATEAS.Group)
			{
				theNewShape.LineStyle.Color.FromHTMLColor(parameters.Color);
				theNewShape.LineStyle.Color.SetAlpha(parameters.Opacity/100);
			}
			else 
			{
			    //it's a layer
			    theNewShape.FeatureAttributes(0).Value = strandHeight;
			    switch (theNewShape.Geometry.GeometryType) {
			        case 5:
			            {
			                theNewShape.Geometry.StartEdit();
			                for (var j = 0; j < theNewShape.Geometry.NumGeometries; j++) {
			                    for (var k = 0; k < theNewShape.Geometry(j).NumPoints; k++) {
			                        wpi = SGWorld.Terrain.GetGroundHeightInfo(theNewShape.Geometry(j).Points(k).X, theNewShape.Geometry(j).Points(k).Y, 1, false);
			                        theNewShape.Geometry(j).Points(k).Z = wpi.Position.Altitude + strandHeight;
			                    }
			                }
			                theNewShape.Geometry = theNewShape.Geometry.EndEdit();
			            }
			            break;
			        case 1:
			            {
			                theNewShape.Geometry.StartEdit();
			                for (var j = 0; j < theNewShape.Geometry.NumPoints; j++) {
			                    wpi = SGWorld.Terrain.GetGroundHeightInfo(theNewShape.Geometry.Points(j).X, theNewShape.Geometry.Points(j).Y, 1, false);
			                    theNewShape.Geometry.Points(j).Z = wpi.Position.Altitude + strandHeight;
			                }
			                theNewShape.Geometry = theNewShape.Geometry.EndEdit();
			            }
			            break;
			    }
			}
		}
	}
	
	/////////////////
	//Posts
/////////////////

	if (parameters.PostStyle != POSTSTYLE.None)
	{		
		//make a geometry for the fence posts
		newGeometry = CreateExtraPointsToGeosLineString(theLines, parameters.PostSpacing, 0);
		
		//TODO: fill color and texture for posts
		var lineColor = SGWorld.Creator.CreateColor(0,0,0,0);
		var fillColor = SGWorld.Creator.CreateColor(0,0,0,255);
		//Note that setting line color is hopefully a temporary solution to an issue
		//of the post objects ignoring 0 alpha for some reason and still getting set to 100%
		lineColor.FromHTMLColor(parameters.PostColor);
		fillColor.FromHTMLColor(parameters.PostColor);
		var countPoly = 1;
		if (newGeometry.GeometryType == SGGeometryTypeId.SG_MULTILINESTRING)
		{
			countPoly = newGeometry.Count;
			if (countPoly == 1)
				newGeometry = newGeometry(0);
		}
		if (parameters.CreateAs == CREATEAS.Group)
		{
			for (var counterPoly = 0; counterPoly < countPoly; counterPoly++)
			{
				var subGeometry = newGeometry;
				if (countPoly > 1)
				{
					subGeometry = newGeometry(counterPoly);
				}
				for (var i=0; i < subGeometry.Points.Count; i++) {
                    
				    var wpi = SGWorld.Terrain.GetGroundHeightInfo(subGeometry.Points(i).X, subGeometry.Points(i).Y, 2, true);
				    var pos = SGWorld.Creator.CreatePosition(subGeometry.Points.Item(i).X, subGeometry.Points.Item(i).Y, wpi.Position.Altitude, AltitudeTypeCode.ATC_TERRAIN_ABSOLUTE, 0, 0, 0, 0);  
					var groupId = createdGroupOrLayer;
					var description = "Post " + (i + 1);
					//create a post object
					var theShape;
					if (parameters.PostStyle == POSTSTYLE.Circular)
					{
					    theShape = SGWorld.Creator.CreateCylinder(pos, parameters.PostDiameter / 2, parameters.Height + parameters.PostExtension, lineColor, fillColor, -1/*number of segments*/, groupId, description);
					}
					else if (parameters.PostStyle == POSTSTYLE.Square)
					{
					    theShape = SGWorld.Creator.CreateBox(pos, parameters.PostDiameter, parameters.PostDiameter, parameters.Height + parameters.PostExtension, lineColor, fillColor, groupId, description);
					}

					if (parameters.PostStyle == FILLSTYLE.Texture) {
					    theShape.FillStyle.Color.SetAlpha(1.0);
					    theShape.LineStyle.Color.SetAlpha(0.0);
					    theShape.FillStyle.Texture.FileName = parameters.PostTexture;
					    theShape.FillStyle.Texture.TilingMethod = TilingMethodCode.TM_METERS_PER_TILE;
					    theShape.FillStyle.Texture.ScaleX = 1;
					    theShape.FillStyle.Texture.ScaleY = parameters.Height + parameters.PostExtension;
					}
	}
	//theNewShape.Visibility.Show = true;
			}
		}
		else if (parameters.CreateAs == CREATEAS.Layer_Entire || parameters.CreateAs == CREATEAS.Layer_Streaming) {
		
			var baseName = createdGroupOrLayer.TreeItem.Name;
			//create a new layer for the posts
			if (parameters.PostReference == null)
			{
				parameters.PostReference = CreateAShapeLayer(baseName + " Posts", parameters.CreateAs, "POSTS");
			}
			var layer = parameters.PostReference;
			switch (parameters.PostStyle)
			{
				case POSTSTYLE.Circular:
					layer.FeatureGroups.Point.DisplayAs = ObjectTypeCode.OT_CYLINDER;
					layer.FeatureGroups.Point.SetProperty("Radius X", parameters.PostDiameter/2);
				break;
				case POSTSTYLE.Square:
					layer.FeatureGroups.Point.DisplayAs = ObjectTypeCode.OT_BOX;
					layer.FeatureGroups.Point.SetProperty("Length", parameters.PostDiameter);
					layer.FeatureGroups.Point.SetProperty("Width", parameters.PostDiameter);
				break;
				default:
				//TODO: error
}

layer.FeatureGroups.Point.SetProperty("Height", parameters.Height + parameters.PostExtension);
if ($("#ddlObjectType").val() == "Option_WallWithFence" || theNewShape.Geometry.GeometryType != 6) layer.FeatureGroups.Point.SetProperty("Height", parseFloat($("#txtFenceHeight").val()) + parseFloat($("#txtFencePostExtension").val()));
            if (parameters.PostFillStyle == FILLSTYLE.Color)
			{
				layer.FeatureGroups.Point.SetProperty("Line Color", lineColor.ToBGRColor());
				layer.FeatureGroups.Point.SetProperty("Line Opacity", 0);
				layer.FeatureGroups.Point.SetProperty("Fill Color", fillColor.ToBGRColor());
				layer.FeatureGroups.Point.SetProperty("Fill Opacity", 100);
			}
			else
			{
			    layer.FeatureGroups.Point.SetProperty("Line Opacity", 0);
			    layer.FeatureGroups.Point.SetProperty("Fill Opacity", 100);
			    layer.FeatureGroups.Point.SetProperty("Texture File", parameters.PostTexture);
				layer.FeatureGroups.Point.SetProperty("Tiling Method", 1 /*TilingMethodCode.TM_METERS_PER_TILE*/);
				layer.FeatureGroups.Point.SetProperty("Scale Y", parameters.Height + parameters.PostExtension);
			}

            layer.FeatureGroups.SetProperty("Altitude Method", 1);
			//add points from the geometry as features
			for (var counterPoly = 0; counterPoly < countPoly; counterPoly++) {
			   
			    
			    var subGeometry = newGeometry;
			    
				if (countPoly > 1)
				{
					subGeometry = newGeometry(counterPoly);
	}
	
				for (var i=0; i < subGeometry.Points.Count; i++)
				{
				    theFeature = layer.FeatureGroups.Point.CreateFeature(subGeometry.Points.Item(i), "");
				    theFeature = SGWorld.ProjectTree.Getobject(theFeature);
				    wpi = SGWorld.Terrain.GetGroundHeightInfo(theFeature.Geometry.X, theFeature.Geometry.Y, 2, true);
				    theFeature.Geometry.Z = wpi.Position.Altitude;
				    
				}
        }
			callbackEndOfGraphForLayer(layer);
		}
}
if (theNewShape.ObjectType != 33) theNewShape.Visibility.Show = true; //Show layer after have been hidden in order to get the correct pole altitude from GetGroundHeightInfo
else createdGroupOrLayer.Visibility.Show = true;

}
//
//------------------------------------
// MaxAltitude: Returns the higher altitude when comparing two points with a relative altitude
//
function MaxAltitude(point1, point2, altitude) {
	// create positions relative to terrain
	var pos1 = SGWorld.Creator.CreatePosition(point1.X, point1.Y, altitude, 0);
	var pos2 = SGWorld.Creator.CreatePosition(point2.X, point2.Y, altitude, 0);
	// switch to absolute
	pos1 = pos1.ToAbsolute(0);
	pos2 = pos2.ToAbsolute(0);
	//alert("pos1.X = " + pos1.X + "\r\npos2.X = " + pos2.X + "\r\npos1.Y = " + pos1.Y + "\r\npos2.Y = " + pos2.Y + "\r\npos1.Alt = " + pos1.Altitude + "\r\npos2.Alt = " + pos2.Altitude);
	// compare heights and return higher altitude
	if (pos2.Altitude > pos1.Altitude) {
		return pos2.Altitude;
	}
	else {
		return pos1.Altitude;
	}
}
//
//------------------------------------
// HeadingChange: Returns true if the heading changes more than g_MaxHeadingDiff
// assumes points are IPoint, not IPosition
//
function HeadingChange(point1, point2, point3, returnValueInsteadOfBool) {
	// create new positions on terrain
	var pos1 = SGWorld.Creator.CreatePosition(point1.X, point1.Y);
	var pos2 = SGWorld.Creator.CreatePosition(point2.X, point2.Y);
	var pos3 = SGWorld.Creator.CreatePosition(point3.X, point3.Y);
	var heading1 = pos1.AimTo(pos2).Yaw;
	var heading2 = pos2.AimTo(pos3).Yaw;
	//alert("heading1 = " + heading1 + "\r\nheading2 = " + heading2);
	var diff = Math.abs(heading2 - heading1);
	if (diff > 180) {
		//alert("wrapping around");
		if (heading1 > heading2) {
			heading2 += 360;
		}
		else {
			heading1 += 360;
		}
		diff = Math.abs(heading2 - heading1);
	}
	//alert("diff = " + diff);
	if (returnValueInsteadOfBool != null && returnValueInsteadOfBool == true) {
		return heading2 - heading1;
	}
	else {
		return diff > g_MaxHeadingDiff;
	}
}
//
//------------------------------------
// IsParallel: calculates heading for pointA1-pointA2 and pointB1-pointB2
// returns true if they are within g_MaxHeadingDiff of each other
//
function IsParallel(pointA1, pointA2, pointB1, pointB2) {
	var posA1 = SGWorld.Creator.CreatePosition(pointA1.X, pointA1.Y);
	var posA2 = SGWorld.Creator.CreatePosition(pointA2.X, pointA2.Y);
	var posB1 = SGWorld.Creator.CreatePosition(pointB1.X, pointB1.Y);
	var posB2 = SGWorld.Creator.CreatePosition(pointB2.X, pointB2.Y);
	var headingA = posA1.AimTo(posA2).Yaw;
	var headingB = posB1.AimTo(posB2).Yaw;
	var diff = Math.abs(headingA - headingB);
	if (diff > 180) {
		if (headingA > headingB) {
			headingB += 360;
		}
		else {
			headingA += 360;
		}
		diff = Math.abs(headingA - headingB);
	}
	return diff < g_MaxHeadingDiff;
}
//
//------------------------------------
// CreateABufferForTheShape: Create a buffer for walls
//
function CreateABufferForTheShape(theGeometryToBuffer, desiredWallWidth, pointsAltitude)
{    
    //
    // Reflect the buffer size according to final requested wall width
    //
    var bufferSize = desiredWallWidth / 2.0;
    //
    // Create the buffer
    //
	//var theBufferShape = theGeometryToBuffer.SpatialOperator.buffer(bufferSize);

    // We do not want to create a buffer here using GEOS because of two reasons:
    //  1. The generated polygon is difficult to Ofer to apply textures to, and it creates visual bugs becasue of points ordering
    //  2. Later in code, this onterrain polygon is given altitude. But if the wall is defined on steep terrain, the top of wall becomes inclined which is not natural
    // To fix both those problems we do the following
    //  1. Split the line to segments by points.
    //  2. Convert each segment defined by 2 points to rectangle of 4 points with absolute heights.
	//  3. Connect each rectangle of wall with connector that hides the connections between rectangles
    
    var polygons = [];
    // geometry here can be either LineString or MultiLineString
	if(theGeometryToBuffer.GeometryType == SGGeometryTypeId.SG_LINESTRING)
	{
	    polygons = CreateABufferForSingleGeometry(theGeometryToBuffer, bufferSize, pointsAltitude);
	}
	else
	{
		for(var i=0;i<theGeometryToBuffer.Count;i++)
		{
		    polygons.push.apply(polygons, CreateABufferForSingleGeometry(theGeometryToBuffer(i), bufferSize, pointsAltitude));
		}
    }
	
	return SGWorld.Creator.GeometryCreator.CreateMultiPolygonGeometry(polygons);
}

function CreateABufferForSingleGeometry(theGeometryToBuffer, bufferSize, pointsAltitude)
{
    // so first, get the list of points from theGeometryToBuffer to array in format [x,y,z,x,y,z....]
    var points = GetPointsArray(theGeometryToBuffer);

    // convert each point zValue to absolute height
    for (var i = 0; i < points.length; i += 3)
    {
        var heightInfo = SGWorld.Terrain.GetGroundHeightInfo(points[i], points[i + 1], AccuracyLevel.ACCURACY_BEST_FROM_MPT);
        heightInfo.Position.ChangeAltitudeType(AltitudeTypeCode.ATC_TERRAIN_ABSOLUTE);
        points[i + 2] = heightInfo.Position.Altitude + pointsAltitude;
    }
    // create array of wall polygons based on points array
    return CreateBufferedPolygonsArray(points, bufferSize);
}

function GetPointsArray(lineString)
{
	return new VBArray(lineString.Points.ToArray()).toArray();
}

function IPositionFromArray(arr, i)
{
	return SGWorld.Creator.CreatePosition(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2], AltitudeTypeCode.ATC_TERRAIN_ABSOLUTE)
}

function CreateBufferedPolygonsArray(points, bufferSize)
{
    var prevLinearRingPoints, prevPos;
	var numberOfSegments = points.length / 3 - 1;
	var bufferedPolygons = []; 	
    for (var i = 0; i < numberOfSegments; i++)
    {
        var pos1 = IPositionFromArray(points, i);
		var pos2 = IPositionFromArray(points, i + 1);
		// lets build a wall segment (rectangle buffered by bufferSize around a line defined by pos1 and pos2) from point i to point i+1
		var linearRingPoints = CreateBufferedRectangle(pos1,pos2,bufferSize);
		// if there is prev linear ring, create a connector to it
		if(prevLinearRingPoints)
		{
			var dx1 = prevPos.X - pos1.X;
			var dy1 = prevPos.Y - pos1.Y;
			var dx2 = pos2.X - pos1.X;
			var dy2 = pos2.Y - pos1.Y;
			var len1 = Math.sqrt(dx1 * dx1 + dy1*dy1);
			var len2 = Math.sqrt(dx2 * dx2 + dy2*dy2);
			var dot = (dx1 * dx2 + dy1 * dy2) / (len1 * len2);
			// add connector only if the angle between two segments is big enough
			if(Math.abs(dot) < 0.999)
			{
				var linearRing1 = SGWorld.Creator.GeometryCreator.CreateLinearRingGeometry([prevLinearRingPoints[2],linearRingPoints[0],prevLinearRingPoints[1], linearRingPoints[3], prevLinearRingPoints[2]]);
				bufferedPolygons.push(SGWorld.Creator.GeometryCreator.CreatePolygonGeometry(linearRing1));
			}
		}
		// add linearRing to our multiPolygon
		var linearRing = SGWorld.Creator.GeometryCreator.CreateLinearRingGeometry(linearRingPoints);
		bufferedPolygons.push(SGWorld.Creator.GeometryCreator.CreatePolygonGeometry(linearRing));
		prevLinearRingPoints = linearRingPoints;
		prevPos = pos1;
	}
	//if last and first points of the array are the same and there are more then 2 segments - it means this is closed polygon and we need to close the wall with connector
	if (numberOfSegments > 2 && points[0] == points[points.length - 3] && points[1] == points[points.length - 2] && points[2] == points[points.length - 1])
	{
		var rect1 = CreateBufferedRectangle(IPositionFromArray(points, numberOfSegments - 1), IPositionFromArray(points, numberOfSegments), bufferSize);		
		var rect2 = CreateBufferedRectangle(IPositionFromArray(points, 0), IPositionFromArray(points, 1), bufferSize);		
		var linearRing1 = SGWorld.Creator.GeometryCreator.CreateLinearRingGeometry([rect1[2],rect2[0],rect1[1], rect2[3], rect1[2]]);
		bufferedPolygons.push(SGWorld.Creator.GeometryCreator.CreatePolygonGeometry(linearRing1));
    }
    return bufferedPolygons;
}

function CreateBufferedRectangle(pos1, pos2, bufferSize)
{
	var start = pos1.AimTo(pos2);
	var end = pos2.AimTo(pos1);
	var startLeft = start.Copy();
	SGWorld.CoordServices.MoveCoordEx(startLeft, 0, bufferSize, 0);
	var startRight = start.Copy();
	SGWorld.CoordServices.MoveCoordEx(startRight, 0, -bufferSize, 0);

	var endLeft = end.Copy();
	SGWorld.CoordServices.MoveCoordEx(endLeft, 0, -bufferSize, 0);
	var endRight = end.Copy();
	SGWorld.CoordServices.MoveCoordEx(endRight, 0, bufferSize, 0);	
	return [startRight,endRight,endLeft, startLeft, startRight];
}

//
//------------------------------------
// DoExtendToGround: Do the actual streching and tiling to create the fence or the wall.
//
function DoExtendToGround(theShape, parameters) {
    //
    // If the shape is from a layer then it is an OT_FEATURE and not a terrain polygon
    // or a terrain polyline.
    //
    var shapeIsInGroupAndNotInLayer = null;
    var scaleX = 1.5;
    var scaleY = parameters.Height;

    if (ObjectTypeCode.OT_FEATURE == theShape.ObjectType) {
        shapeIsInGroupAndNotInLayer = false;
    } else {
        shapeIsInGroupAndNotInLayer = true;
    }

    if (shapeIsInGroupAndNotInLayer) {
		theShape.LineStyle.Color.SetAlpha(0);
		if (parameters.FillStyle == FILLSTYLE.Color)
		{
			theShape.FillStyle.Texture.FileName = "";
			theShape.FillStyle.Color.FromHTMLColor(parameters.Color);
			theShape.FillStyle.Color.SetAlpha(parameters.Opacity/100);
		}
		else
		{
			theShape.FillStyle.Color.FromHTMLColor("000000");
			theShape.FillStyle.Color.SetAlpha(1.0);
			theShape.FillStyle.Texture.FileName = parameters.Texture;
			theShape.FillStyle.Texture.TilingMethod = TilingMethodCode.TM_METERS_PER_TILE;
			theShape.FillStyle.Texture.ScaleX = scaleX;
			theShape.FillStyle.Texture.ScaleY = scaleY;
		}

		theShape.Terrain.GroundObject = false;
        theShape.ExtendToGround = true;
    }
    //
    // If the shape is in a layer then all the above steps have been handled during layer creation.
    //
}
//
//
//
function MakeLinesFromShape(theShape) {
    //
    // The shape at this point is actually an OT_FEATURE if it comes from a layer and not from a group (33)
    // Don't mix between the geometry type and the object type
    //
    switch (theShape.Geometry.GeometryType) {
        case SGGeometryTypeId.SG_POLYGON:
        case SGGeometryTypeId.SG_MULTIPOLYGON:
            return MakeMultilineStringFromTerrainPolygon(theShape);

        case SGGeometryTypeId.SG_LINESTRING:
        case SGGeometryTypeId.SG_MULTILINESTRING:
            return MakeMultilineStringFromTerrainPolyline(theShape);
            //
            //
            //
        default:
            throw new Error(2000, "Unexpected shape type");
    }

}

function MakeMultilineStringFromTerrainPolyline(theTerrainPolyline) {
    if (theTerrainPolyline.Geometry.GeometryType == SGGeometryTypeId.SG_LINESTRING || theTerrainPolyline.Geometry.GeometryType == SGGeometryTypeId.SG_MULTILINESTRING) {
        //LineString || //MultiLineString

        return theTerrainPolyline.Geometry.Clone();
    }
    else {
        throw new Error(2000, "Expecting a line or multiline");
    }
}


//
// From terrain polygon (regular or multi) to a Geos MultilineString
//
function MakeMultilineStringFromTerrainPolygon(theTerrainPolygon) {
    var theMultiLineString = null;

    switch (theTerrainPolygon.Geometry.GeometryType) {
        case SGGeometryTypeId.SG_POLYGON:
			//alert("MakeMultilineStringFromTerrainPolygon working on polygon");
            theMultiLineString = MakeMultilineStringFromIPolygon_WorkerFunc(theTerrainPolygon.Geometry, null);
            break;

        case SGGeometryTypeId.SG_MULTIPOLYGON:
			//alert("MakeMultilineStringFromTerrainPolygon working on multipolygon");
            for (var i = 0; i < theTerrainPolygon.Geometry.Count; i++) {
                //
                // At first time it will pass null, afterwards it will pass the expected
                // existing object.
                //
                theMultiLineString = MakeMultilineStringFromIPolygon_WorkerFunc(theTerrainPolygon.Geometry(i), theMultiLineString);
            }
            break;

        default:
            throw new Error(2000, "Unexpected shape type");
    }


    return theMultiLineString;

}

function MakeMultilineStringFromIPolygon_WorkerFunc(theIPolygon, existingMultilineString) {
	//alert("theIPolygon.Rings.Count = " + theIPolygon.Rings.Count);
    var lineStringArray = new Array();
    for (var ringIndex = 0; ringIndex < theIPolygon.Rings.Count; ringIndex++) {
        //
        // Loop for each ring
        //
        var verticesIndex = 0;
		var verticesArray = new Array();
		var currentRing = theIPolygon.Rings(ringIndex);
		//alert("currentRing.Points.Count = " + currentRing.Points.Count);
        for (var pointsIndex = 0; pointsIndex < currentRing.Points.Count; pointsIndex++) {
            //
            // Loop for each point in the ring
            //
            verticesArray[verticesIndex++] = currentRing.Points(pointsIndex).X;
            verticesArray[verticesIndex++] = currentRing.Points(pointsIndex).Y;
            verticesArray[verticesIndex++] = currentRing.Points(pointsIndex).Z;
        }
        //
        // We should add the first polygon point as the last point of the polyline
        //
        verticesArray[verticesIndex++] = currentRing.Points(0).X;
        verticesArray[verticesIndex++] = currentRing.Points(0).Y;
        verticesArray[verticesIndex++] = currentRing.Points(0).Z;
        //
        // Now we are ready to create a LineString geometry.
        //
        lineStringArray[ringIndex] = SGWorld.Creator.GeometryCreator.CreateLineStringGeometry(verticesArray);
    }

    if (existingMultilineString == null) {
        var theMultiLineString = SGWorld.Creator.GeometryCreator.CreateMultiLineStringGeometry(lineStringArray);
        return theMultiLineString;
    }
    else {
        //
        // We already have an existing object
        // Just add all the lineString that we have to that object.
        existingMultilineString.StartEdit();
        for (var i = 0; i < lineStringArray.length; i++) {
            existingMultilineString.AddGeometry(lineStringArray[i]);
        }
        var newGeometry = existingMultilineString.EndEdit();

        return newGeometry;
    }
}
//
// 
//
function CreateExtraPointsToGeosLineString(theLineString, spacingSizeMeters, pointsAltitude, simplifyLine) {
    var geoType = theLineString.GeometryType;
    var newGeometry;
    var bPassedAllowedWaypoints;

    g_NumWaypoints = 0;

    if (geoType == SGGeometryTypeId.SG_LINESTRING) {
        //
        // LineString
        //
        theLineString.StartEdit();
        //
        //
        //
        bPassedAllowedWaypoints = CreateExtraPointsToLineString_WorkerFunc(theLineString, spacingSizeMeters, pointsAltitude, simplifyLine);
        //
        //
        //
        newGeometry = theLineString.EndEdit();
    }
    else if (geoType == SGGeometryTypeId.SG_MULTILINESTRING) {
        //
        // MultiLineString
        //
        theLineString.StartEdit();
        //
        //
        //
        for (var i = 0; i < theLineString.Count; i++) {
            bPassedAllowedWaypoints = CreateExtraPointsToLineString_WorkerFunc(theLineString(i), spacingSizeMeters, pointsAltitude, simplifyLine);
        }
        //
        //
        //
        newGeometry = theLineString.EndEdit();
    }
    else {
        throw new Error(2000, "Unexpected type");
    }

    if (bPassedAllowedWaypoints) {
        throw new Error(2001, "Too many waypoints");
    }
    return newGeometry;
}
//
// Expecting an ILineString interface.
//
function CreateExtraPointsToLineString_WorkerFunc(theLineString, spacing, pointsAltitude, simplifyLine) {
    var geoType = theLineString.GeometryType;
    var numLinePoints = theLineString.Points.Count;
	var prevSlope = undefined;
    //
    // Create positions from first point and the last point
    //
    var workIndex = 0;
    var totalDistanceAddedSoFar = 0;
    var j = 0;
    for (var i = 0; i < numLinePoints - 1; i++) {
        var pointStart = theLineString.Points(workIndex);
		pointStart.Z = pointsAltitude;
        var pointEnd = theLineString.Points(workIndex + 1);
		pointEnd.Z = pointsAltitude;
        var positionStart = SGWorld.Creator.CreatePosition(pointStart.X, pointStart.Y, pointsAltitude, AltitudeTypeCode.ATC_TERRAIN_RELATIVE);
        var positionEnd = SGWorld.Creator.CreatePosition(pointEnd.X, pointEnd.Y, pointsAltitude, AltitudeTypeCode.ATC_TERRAIN_RELATIVE);
		
        var dist = SGWorld.CoordServices.GetDistance3D(positionStart, positionEnd);

        totalDistanceAddedSoFar = 0.0;
        j = 0;
        //
        // Stop the loop before we pass the second point.
        // We insert points between 2 adjacent points.
        //
		var pos1 = positionStart;
		var pos2 = null;
		var pos3 = null;

		var a1,a2;
		
		var fullCount = 0;
		// doAddPoint is used insanely.  I apologize.
		var doAddPoint = true;
        while (totalDistanceAddedSoFar + spacing < dist) {
            var newPosition = positionStart.MoveToward(positionEnd, spacing * (fullCount + 1));
//			newPosition = newPosition.ToAbsolute(0 /*ACCURACY_NORMAL*/);
			var checkSlope = false;
			if (simplifyLine) {
				if (!pos2) {
					doAddPoint = false;
					pos2 = newPosition;
				}
				else {
					if (pos3) {
						if (doAddPoint)
						{
							pos1 = pos2;
						}
						doAddPoint = true;
						pos2 = pos3;
					}
					pos3 = newPosition;
					checkSlope = true;
				}
			}
			
			if (checkSlope && simplifyLine && doAddPoint) {
				pos1 = pos1;
				pos2 = pos2;
				pos3 = pos3;
				var npos1 = pos1.ToAbsolute(0);
				var npos2 = pos2.ToAbsolute(0);
				var npos3 = pos3.ToAbsolute(0);
				//alert("Interrogate pos1: "+ pos1.X + " " + pos1.Y + " " + pos1.Altitude);
				//alert("Interrogate pos2: "+ pos2.X + " " + pos2.Y + " " + pos2.Altitude);
				//alert("Interrogate pos3: "+ pos3.X + " " + pos3.Y + " " + pos3.Altitude);
				var slopeTo1 = (npos2.Altitude - npos1.Altitude) / SGWorld.CoordServices.GetDistance(npos1.X, npos1.Y, npos2.X, npos2.Y);
				var slopeTo3 = (npos3.Altitude - npos2.Altitude) / SGWorld.CoordServices.GetDistance(npos2.X, npos2.Y, npos3.X, npos3.Y);
				var diff = slopeTo1 - slopeTo3;
				//alert("diff = " + diff);
				if (Math.abs(diff) < g_MinSlopeDiff) {
					//alert("removing point " + (workIndex + j) + "\r\nslope1 = " + slopeTo1 + "\r\nslope3 = " + slopeTo3);
					doAddPoint = false;
				}	
			}
			
			if (doAddPoint) {
				var addPoint;
				if (simplifyLine) {
					addPoint = pos2; //.ToRelative(0);
				}
				else {
					addPoint = newPosition; //.ToRelative(0);
				}
				theLineString.Points.InsertPoint(workIndex + j, addPoint.X, addPoint.Y, pointsAltitude); //, addPoint.Altitude);//pointsAltitude);
				//alert(addPoint.Altitude + " " + pointsAltitude);
				j++;
			}
            if (g_KeepAskingIfTooManyPoints) {
				if (doAddPoint)
					g_NumWaypoints++;
                if (g_NumWaypoints > g_OperationParameters.MaxWaypoints) {
                    //
                    // return true means that we have passed the quota
                    //
                    var doContinueWithNoAsking = confirm(SGLang.i18n("ERROR_TEXT_WaypointsPassedQuota"));
                    if (doContinueWithNoAsking) {
                        g_KeepAskingIfTooManyPoints = false;
                    }
                    else {
                        return true;    
                    }
                }
            }
			fullCount++;
            totalDistanceAddedSoFar += spacing;
        }
		if (pos2 && pos3 && simplifyLine) {
			pos1 = pos2;
			pos2 = pos3;
			var pos3 = positionEnd; // already absolute

			var npos1 = pos1.ToAbsolute(0);
			var npos2 = pos2.ToAbsolute(0);
			var npos3 = pos3.ToAbsolute(0);

			var slopeTo1 = (npos2.Altitude - npos1.Altitude) / SGWorld.CoordServices.GetDistance(npos1.X, npos1.Y, npos2.X, npos2.Y);
			var slopeTo3 = (npos3.Altitude - npos2.Altitude) / SGWorld.CoordServices.GetDistance(npos2.X, npos2.Y, npos3.X, npos3.Y);
			var diff = slopeTo1 - slopeTo3;
			//alert("diff = " + diff);
			if (Math.abs(diff) < g_MinSlopeDiff) {
				//alert("removing point " + (workIndex + j) + "\r\nslope1 = " + slopeTo1 + "\r\nslope3 = " + slopeTo3);
			}
			else {
				theLineString.Points.InsertPoint(workIndex + j, pos2.X, pos2.Y, pointsAltitude); //pos2.Altitude);//pointsAltitude);
				//alert(pos2.Altitude + " " + pointsAltitude);
				j++;
			}
		}
		//alert(theLineString.Points.Count);
        workIndex += j + 1;
    }
	
    //
    // return false means that we have passed the quota
    //
    return false;
}
//
//
//
function CreateAShapeLayer(layerName, streamingType, objType) {
    //
    // If it is a fence we should create a polyline layer
    // If it is a wall we should create a polygon layer since the result of buffer is a polygon.
    //
    var layerType;
    if (objType == TYPE_FENCE || objType == OBJECTTYPE.WireStrandFence) {
        layerType = LayerGeometryType.LGT_POLYLINE;
    }
     else if (objType == TYPE_WALL) {
        layerType = LayerGeometryType.LGT_POLYGON;
    }
	else if (objType == "POSTS")
	{
		layerType = LayerGeometryType.LGT_POINT;
	}
	else {
        throw new Error(2000, "Can't create a shape layer for this object type");
    }
	
	var filename = SanitizeLayerName(layerName);
	var postfix = new Date().getTime();

	//FileName= was previously set to a static string and was messing up the fence and wall layer... using objType for now as a distinguishing feature
    var newLayer = SGWorld.Creator.CreateNewFeatureLayer(layerName, layerType, "TEPlugName=OGR;FileName=" + filename + postfix + ".shp");
    newLayer.Streaming = streamingType == "LayerStreaming";
    newLayer.Load();
    
    return newLayer;
}

function SanitizeLayerName(layerName)
{
	var sanitizedName = layerName;
	//replace spaces, dashes (-), parentheses, and dots (.) with underscore (_)
	sanitizedName = sanitizedName.replace(/[\s\-\.]/g, "_");
	//eliminate other special characters
	sanitizedName = sanitizedName.replace(/[^0-9A-Za-z_]/g, "");
	
	//alert("sanitized" + '\n' + layerName + '\n' + "to" + '\n' + sanitizedName);
	
	return sanitizedName;
}
