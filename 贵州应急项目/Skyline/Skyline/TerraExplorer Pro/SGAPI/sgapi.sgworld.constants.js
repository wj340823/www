// JScript File

//- Height Types -------------------------------------------------------
var sgHeightRelative            = 0;
var sgHeightOnTerrain           = 2
var sgHeightAbsolute            = 3;
//- Fly To Patterns ----------------------------------------------------
var sgPatternFlyto              = "FlyToLocation";
var sgPatternJump               = "JumpToLocation";
var sgPatternCircle             = "CircleGlobe";
var sgPatternOval               = "Oval";
var sgPatternLine               = "Line";
var sgPatternArc                = "Arc";
var sgPatternFlyThrough         = "FlyThrough"; // Unique to SGAPI (not implemented in TE). When more then one node is given, fly between the nodes.
//- Node Types ---------------------------------------------------------
var sgNodeTypeGroup             = 1000;
var sgNodeTypeLayer             = 1001;
var sgNodeTypePolyline          = 1;
var sgNodeTypePolygon           = 2;
var sgNodeTypeRectangle         = 3;
var sgNodeTypeRegularPolygon    = 4;
var sgNodeTypeCircle            = 5;
var sgNodeType3DPolygon         = 6;
var sgNodeTypeBuilding          = 7;
var sgNodeTypeBox               = 8;
var sgNodeTypePyramid           = 9;
var sgNodeTypeCylinder          = 10;
var sgNodeTypeCone              = 11;
var sgNodeTypeEllipse           = 12;
var sgNodeTypeArc               = 13;
var sgNodeTypeArrow             = 14;
var sgNodeType3DArrow           = 15;
var sgNodeTypeSphere            = 16;
var sgNodeTypeModel             = 17;
var sgNodeTypeLabel             = 18;
var sgNodeTypeLocation          = 19;
var sgNodeTypeHotlink           = 20;
var sgNodeTypeRoute             = 21;
var sgNodeTypeMessage           = 22;
var sgNodeTypeDynamic           = 23;
var sgNodeTypeImageLabel        = 24;
var sgNodeTypeThreatDome        = 25;
var sgNodeTypeImageryLayer      = 26;
var sgNodeTypeTerrainVideo      = 27;
var sgNodeTypePointCloud        = 28;
var sgNodeTypeElevationLayer    = 29;
var sgNodeTypeTerrainModifier   = 30;
var sgNodeTypeTerrainHole       = 31;
//- Action Codes -------------------------------------------------------
var sgActionCodeFlyto           = 0;
var sgActionCodeCirclePattern   = 1;
var sgActionCodeOvalPattern     = 2;
var sgActionCodeLinePattern     = 3;
var sgActionCodeArcPattern      = 4;
var sgActionCodeFollowBehind    = 5;
var sgActionCodeFollowAbove     = 6;
var sgActionCodeFollowBelow     = 7;
var sgActionCodeFollowRight     = 8;
var sgActionCodeFollowLeft      = 9;
var sgActionCodeFollowBehindAndAbove = 10;
var sgActionCodeFollowCockpit   = 11;
var sgActionCodeFollowFromGround= 12;
var sgActionCodeStop            = 13;
var sgActionCodeJump            = 14;
var sgActionCodeDelete          = 15;
var sgActionCodeEditFinished    = 16;
var sgActionCodeObjectAdded     = 17;
var sgActionCodePlay            = 18;
var sgActionCodeShow            = 19;
var sgActionCodeEditStarted     = 20;
var sgActionCodeSelChanged      = 21;
var sgActionCodeWaypointChanged = 22;
var sgActionCodeGroupAdded      = 23;
var sgActionCodeLayerAdded      = 24;
//----------------------------------------------------------------------
var _arrPatternToAC = new Array(); 
_arrPatternToAC[sgPatternFlyto]=sgActionCodeFlyto; 
_arrPatternToAC[sgPatternJump]=sgActionCodeJump; 
_arrPatternToAC[sgPatternCircle]=sgActionCodeCirclePattern; 
_arrPatternToAC[sgPatternOval]=sgActionCodeOvalPattern; 
_arrPatternToAC[sgPatternLine]=sgActionCodeLinePattern; 
_arrPatternToAC[sgPatternArc]=sgActionCodeArcPattern;
//----------------------------------------------------------------------
var sgLevelHouse                = 100.0;
var sgLevelStreet               = 1000.0;
var sgLevelCity                 = 8000.0;
var sgLevelState                = 800000.0;
var sgLevelCountry              = 4000000.0;
var sgLevelGlobe                = 15000000.0;
//----------------------------------------------------------------------
var sgPixelToWorldTypeTerrain   = 0;
var sgPixelToWorldTypeAll       = 1|2|4|8|16;
var sgPixelToWorldTypeSky       = 32;
//----------------------------------------------------------------------
var sgInputModeFreeFlight       = 0;
var sgInputModeComClient        = 1;
var sgInputModeControlledFlight = 2;
var sgInputModeEdit             = 3;
var sgInputModeMeasurament      = 4;
//----------------------------------------------------------------------
var sgArrowStyleLine            = 0;
var sgArrowStyleLineTail        = 1;
var sgArrowStyleWide            = 3;
var sgArrowStyleWideAngular     = 4;
//----------------------------------------------------------------------
var sgSphereStyleNormal         = 0;
var sgSphereStyleUpperHalf      = 1;
var sgSphereStyleUpperHalfWithBase = 2;
var sgSphereStyleLowerHalf      = 3;
var sgSphereStyleLowerHalfWithBase = 4;
//----------------------------------------------------------------------
var sgLabelLockModeDecal        = 0;
var sgLabelLockModeAxis         = 1;
var sgLabelLockModeAxisTextUp   = 2;
var sgLabelLockModeAxisAutoPitch= 3;
var sgLabelLockModeAxisAutoPitchTextUp = 4;
//----------------------------------------------------------------------
var sgMessageClientUpperLeft    = 0;
var sgMessageClientLowerLeft    = 1;
var sgMessageClientMain         = 2;
var sgMessageClientMessageBar   = 3;
var sgMessageClientFloatBrowser = 4;
var sgMessageClientPopup        = 5;
//----------------------------------------------------------------------
var sgMessageTypeText           = 0;
var sgMessageTypeURL            = 1;
var sgMessageTypeScript         = 3;
//----------------------------------------------------------------------
var sgMotionStyleGroundVehicle  = 0;
var sgMotionStyleAirplane       = 1;
var sgMotionStyleHelicopter     = 2;
var sgMotionStyleHovercraft     = 3;
//----------------------------------------------------------------------
var sgDynamicObjectTypeModel    = 0;
var sgDynamicObjectTypeText     = 1;
var sgDynamicObjectTypeImage    = 2;
var sgDynamicObjectTypeVirtual  = 3;
//----------------------------------------------------------------------
var sgControlNone               = 0;
var sgControlNavigation         = 1;
var sgControlCenterSign         = 2;
var sgControlText               = 4;
var sgControlDateTime           = 64;
//----------------------------------------------------------------------
var sgSortAlphabeticallyAZ      = 0;
var sgSortAlphabeticallyZA      = 1;
var sgSortByType                = 2;
var sgSortNone                  = 3;
//----------------------------------------------------------------------
var sgLabelLineNone             = 0;
var sgLabelLineToGround         = 1;
var sgLabelLineCustom           = 2;
//----------------------------------------------------------------------
// SG Colors
var sgAliceblue       = "#F0F8FF";    var sgAntiquewhite     = "#FAEBD7";    var sgAqua                 = "#00FFFF";    var sgAquamarine        = "#7FFFD4";
var sgAzure           = "#F0FFFF";    var sgBeige            = "#F5F5DC";    var sgBisque               = "#FFE4C4";    var sgBlack             = "#000000";
var sgBlanchedalmond  = "#FFEBCD";    var sgBlue             = "#0000FF";    var sgBlueviolet           = "#8A2BE2";    var sgBrown             = "#A52A2A";
var sgBurlywood       = "#DEB887";    var sgCadetblue        = "#5F9EA0";    var sgChartreuse           = "#7FFF00";    var sgChocolate         = "#D2691E";
var sgCoral           = "#FF7F50";    var sgCornflowerblue   = "#6495ED";    var sgCornsilk             = "#FFF8DC";    var sgCrimson           = "#DC143C";
var sgCyan            = "#00FFFF";    var sgDarkblue         = "#00008B";    var sgDarkcyan             = "#008B8B";    var sgDarkgoldenrod     = "#B8860B";
var sgDarkgray        = "#A9A9A9";    var sgDarkgreen        = "#006400";    var sgDarkkhaki            = "#BDB76B";    var sgDarkmagenta       = "#8B008B";
var sgDarkolivegreen  = "#556B2F";    var sgDarkorange       = "#FF8C00";    var sgDarkorchid           = "#9932CC";    var sgDarkred           = "#8B0000";
var sgDarksalmon      = "#E9967A";    var sgDarkseagreen     = "#8FBC8B";    var sgDarkslateblue        = "#483D8B";    var sgDarkslategray     = "#2F4F4F";
var sgDarkturquoise   = "#00CED1";    var sgDarkviolet       = "#9400D3";    var sgDeeppink             = "#FF1493";    var sgDeepskyblue       = "#00BFFF";
var sgDimgray         = "#696969";    var sgDodgerblue       = "#1E90FF";    var sgFirebrick            = "#B22222";    var sgFloralwhite       = "#FFFAF0";
var sgForestgreen     = "#228B22";    var sgFuchsia          = "#FF00FF";    var sgGainsboro            = "#DCDCDC";    var sgGhostwhite        = "#F8F8FF";
var sgGold            = "#FFD700";    var sgGoldenrod        = "#DAA520";    var sgGray                 = "#808080";    var sgGreen             = "#008000";
var sgGreenyellow     = "#ADFF2F";    var sgHoneydew         = "#F0FFF0";    var sgHotpink              = "#FF69B4";    var sgIndianred         = "#CD5C5C";
var sgIndigo          = "#4B0082";    var sgIvory            = "#FFFFF0";    var sgKhaki                = "#F0E68C";    var sgLavender          = "#E6E6FA";
var sgLavenderblush   = "#FFF0F5";    var sgLawngreen        = "#7CFC00";    var sgLemonchiffon         = "#FFFACD";    var sgLightblue         = "#ADD8E6";
var sgLightcoral      = "#F08080";    var sgLightcyan        = "#E0FFFF";    var sgLightgoldenrodyellow = "#FAFAD2";    var sgLightgreen        = "#90EE90";
var sgLightgrey       = "#D3D3D3";    var sgLightpink        = "#FFB6C1";    var sgLightsalmon          = "#FFA07A";    var sgLightseagreen     = "#20B2AA";
var sgLightskyblue    = "#87CEFA";    var sgLightslategray   = "#778899";    var sgLightsteelblue       = "#B0C4DE";    var sgLightyellow       = "#FFFFE0";
var sgLime            = "#00FF00";    var sgLimegreen        = "#32CD32";    var sgLinen                = "#FAF0E6";    var sgMagenta           = "#FF00FF";
var sgMaroon          = "#800000";    var sgMediumaquamarine = "#66CDAA";    var sgMediumblue           = "#0000CD";    var sgMediumorchid      = "#BA55D3";
var sgMediumpurple    = "#9370DB";    var sgMediumseagreen   = "#3CB371";    var sgMediumslateblue      = "#7B68EE";    var sgMediumspringgreen = "#00FA9A";
var sgMediumturquoise = "#48D1CC";    var sgMediumvioletred  = "#C71585";    var sgMidnightblue         = "#191970";    var sgMintcream         = "#F5FFFA";
var sgMistyrose       = "#FFE4E1";    var sgMoccasin         = "#FFE4B5";    var sgNavajowhite          = "#FFDEAD";    var sgNavy              = "#000080";
var sgOldlace         = "#FDF5E6";    var sgOlive            = "#808000";    var sgOlivedrab            = "#6B8E23";    var sgOrange            = "#FFA500";
var sgOrangered       = "#FF4500";    var sgOrchid           = "#DA70D6";    var sgPalegoldenrod        = "#EEE8AA";    var sgPalegreen         = "#98FB98";
var sgPaleturquoise   = "#AFEEEE";    var sgPalevioletred    = "#DB7093";    var sgPapayawhip           = "#FFEFD5";    var sgPeachpuff         = "#FFDAB9";
var sgPeru            = "#CD853F";    var sgPink             = "#FFC0CB";    var sgPlum                 = "#DDA0DD";    var sgPowderblue        = "#B0E0E6";
var sgPurple          = "#800080";    var sgRed              = "#FF0000";    var sgRosybrown            = "#BC8F8F";    var sgRoyalblue         = "#4169E1";
var sgSaddlebrown     = "#8B4513";    var sgSalmon           = "#FA8072";    var sgSandybrown           = "#F4A460";    var sgSeagreen          = "#2E8B57";
var sgSeashell        = "#FFF5EE";    var sgSienna           = "#A0522D";    var sgSilver               = "#C0C0C0";    var sgSkyblue           = "#87CEEB";
var sgSlateblue       = "#6A5ACD";    var sgSlategray        = "#708090";    var sgSnow                 = "#FFFAFA";    var sgSpringgreen       = "#00FF7F";
var sgSteelblue       = "#4682B4";    var sgTan              = "#D2B48C";    var sgTeal                 = "#008080";    var sgThistle           = "#D8BFD8";
var sgTomato          = "#FF6347";    var sgTurquoise        = "#40E0D0";    var sgViolet               = "#EE82EE";    var sgWheat             = "#F5DEB3";
var sgWhite           = "#FFFFFF";    var sgWhitesmoke       = "#F5F5F5";    var sgYellow               = "#FFFF00";    var sgYellowgreen       = "#9ACD32"; 
//----------------------------------------------------------------------
var sgOKOnly                    = 0;
var sgOKCancel                  = 1;
var sgAbortRetryIgnore          = 2;
var sgYesNoCancel               = 3;
var sgYesNo                     = 4;
var sgRetryCancel               = 5;

var sgCritical                  = 16;
var sgQuestion                  = 32;
var sgExclamation               = 48;
var sgInformation               = 64;
var sgDefaultButton1            = 0;
var sgDefaultButton2            = 256;
var sgDefaultButton3            = 512;
var sgDefaultButton4            = 768;
var sgApplicationModal          = 0;
var sgSystemModal               = 4096;

var sgOK                        = 1;
var sgCancel                    = 2;
var sgAbort                     = 3;
var sgRetry                     = 4;
var sgIgnore                    = 5;
var sgYes                       = 6;
var sgNo                        = 7;

//----------------------------------------------------------------------
var $createGroupRoot = "~SGTemp";
var $createGroupID   = -1;
var $groundHeightAccuracyConversion = 1;
var sgDefaultForegroundColor = 0x00FF00;    // sgLime
var sgDefaultBackgroundColor = 0x696969;    // sgDimgray

var sgDefaultLabelTextColor  = 0xFFFFFF;      // sgWhite
var sgDefaultLabelBackgroundColor = 0x808080; // sgGray

var SGERR_MULTIPLE_TABS = -2147220989;
var SGERR_NO_LICENSE = -2147220992;

function sgKMH(speedKMH) { return speedKMH*1000/3600; }