xof 0302txt 0064
//
// DirectX file: Z:\Models\elect.x
//
// Converted by the PolyTrans geometry converter from Okino Computer Graphics, Inc.
// Date/time of export: 07/20/1998 13:22:17
//
// Bounding box of geometry = (-40.1519,0,-4.97705) to (39.7513,211.084,4.61957).


template Header {
 <3D82AB43-62DA-11cf-AB39-0020AF71E433>
 WORD major;
 WORD minor;
 DWORD flags;
}

template Vector {
 <3D82AB5E-62DA-11cf-AB39-0020AF71E433>
 FLOAT x;
 FLOAT y;
 FLOAT z;
}

template Coords2d {
 <F6F23F44-7686-11cf-8F52-0040333594A3>
 FLOAT u;
 FLOAT v;
}

template Matrix4x4 {
 <F6F23F45-7686-11cf-8F52-0040333594A3>
 array FLOAT matrix[16];
}

template ColorRGBA {
 <35FF44E0-6C7C-11cf-8F52-0040333594A3>
 FLOAT red;
 FLOAT green;
 FLOAT blue;
 FLOAT alpha;
}

template ColorRGB {
 <D3E16E81-7835-11cf-8F52-0040333594A3>
 FLOAT red;
 FLOAT green;
 FLOAT blue;
}

template IndexedColor {
 <1630B820-7842-11cf-8F52-0040333594A3>
 DWORD index;
 ColorRGBA indexColor;
}

template Boolean {
 <4885AE61-78E8-11cf-8F52-0040333594A3>
 WORD truefalse;
}

template Boolean2d {
 <4885AE63-78E8-11cf-8F52-0040333594A3>
 Boolean u;
 Boolean v;
}

template MaterialWrap {
 <4885AE60-78E8-11cf-8F52-0040333594A3>
 Boolean u;
 Boolean v;
}

template TextureFilename {
 <A42790E1-7810-11cf-8F52-0040333594A3>
 STRING filename;
}

template Material {
 <3D82AB4D-62DA-11cf-AB39-0020AF71E433>
 ColorRGBA faceColor;
 FLOAT power;
 ColorRGB specularColor;
 ColorRGB emissiveColor;
 [...]
}

template MeshFace {
 <3D82AB5F-62DA-11cf-AB39-0020AF71E433>
 DWORD nFaceVertexIndices;
 array DWORD faceVertexIndices[nFaceVertexIndices];
}

template MeshFaceWraps {
 <4885AE62-78E8-11cf-8F52-0040333594A3>
 DWORD nFaceWrapValues;
 Boolean2d faceWrapValues;
}

template MeshTextureCoords {
 <F6F23F40-7686-11cf-8F52-0040333594A3>
 DWORD nTextureCoords;
 array Coords2d textureCoords[nTextureCoords];
}

template MeshMaterialList {
 <F6F23F42-7686-11cf-8F52-0040333594A3>
 DWORD nMaterials;
 DWORD nFaceIndexes;
 array DWORD faceIndexes[nFaceIndexes];
 [Material]
}

template MeshNormals {
 <F6F23F43-7686-11cf-8F52-0040333594A3>
 DWORD nNormals;
 array Vector normals[nNormals];
 DWORD nFaceNormals;
 array MeshFace faceNormals[nFaceNormals];
}

template MeshVertexColors {
 <1630B821-7842-11cf-8F52-0040333594A3>
 DWORD nVertexColors;
 array IndexedColor vertexColors[nVertexColors];
}

template Mesh {
 <3D82AB44-62DA-11cf-AB39-0020AF71E433>
 DWORD nVertices;
 array Vector vertices[nVertices];
 DWORD nFaces;
 array MeshFace faces[nFaces];
 [...]
}

template FrameTransformMatrix {
 <F6F23F41-7686-11cf-8F52-0040333594A3>
 Matrix4x4 frameMatrix;
}

template Frame {
 <3D82AB46-62DA-11cf-AB39-0020AF71E433>
 [...]
}

Header {
	1; // Major version
	0; // Minor version
	1; // Flags
}

Material xof_default_2 {
	0.400000;0.400000;0.400000;1.000000;;
	32;
	0.700000;0.700000;0.700000;;
	0.000000;0.000000;0.000000;;
}

Material material_2 {
	0.513726;0.513726;0.513726;1.000000;;
	6;
	0.020000;0.020000;0.020000;;
	0.000000;0.000000;0.000000;;
}
Mesh single_mesh_object {
	24;		// 24 vertices
	-40.151890;172.499634;3.755551;,
	-40.151890;177.335007;0.963847;,
	-40.151890;177.335007;-4.619562;,
	-40.151890;182.170380;3.755552;,
	-40.151890;198.580536;3.755549;,
	-40.151890;203.415909;0.963845;,
	-40.151890;203.415909;-4.619563;,
	-40.151890;208.251282;3.755550;,
	-3.559116;0.000000;4.977050;,
	-3.559116;211.084335;4.977050;,
	-3.559115;0.000000;-4.013195;,
	-3.559115;211.084335;-4.013195;,
	-0.963856;0.000000;0.481928;,
	-0.963856;211.084335;0.481928;,
	4.226665;0.000000;0.481928;,
	4.226665;211.084335;0.481928;,
	39.751316;172.499634;3.755548;,
	39.751316;177.335007;0.963844;,
	39.751316;177.335007;-4.619564;,
	39.751316;182.170380;3.755549;,
	39.751320;198.580536;3.755547;,
	39.751320;203.415909;0.963844;,
	39.751320;203.415909;-4.619565;,
	39.751320;208.251282;3.755548;;

	36;		// 36 faces
	3;12,8,14;,
	3;12,10,8;,
	3;12,14,10;,
	3;14,9,15;,
	3;14,8,9;,
	3;8,11,9;,
	3;8,10,11;,
	3;10,15,11;,
	3;10,14,15;,
	3;13,15,9;,
	3;13,9,11;,
	3;13,11,15;,
	3;17,19,18;,
	3;17,16,19;,
	3;17,18,16;,
	3;18,3,2;,
	3;18,19,3;,
	3;19,0,3;,
	3;19,16,0;,
	3;16,2,0;,
	3;16,18,2;,
	3;1,2,3;,
	3;1,3,0;,
	3;1,0,2;,
	3;21,23,22;,
	3;21,20,23;,
	3;21,22,20;,
	3;22,7,6;,
	3;22,23,7;,
	3;23,4,7;,
	3;23,20,4;,
	3;20,6,4;,
	3;20,22,6;,
	3;5,6,7;,
	3;5,7,4;,
	3;5,4,6;;

	MeshMaterialList {
		1;1;0;;
		{material_2}
	}

	MeshNormals {
		20; // 20 normals
		1.000000;0.000000;-0.000000;,
		0.866025;0.000000;-0.500000;,
		0.866025;0.000000;0.500000;,
		0.000000;-0.500000;0.866025;,
		0.000000;-1.000000;-0.000000;,
		0.000000;0.500000;0.866025;,
		0.000000;0.000000;-1.000000;,
		0.000000;-1.000000;-0.000000;,
		0.000000;0.500000;0.866025;,
		0.000000;1.000000;0.000000;,
		0.000000;-1.000000;0.000000;,
		-0.000000;-0.500000;-0.866025;,
		-0.000000;1.000000;-0.000000;,
		-0.000000;-0.500000;-0.866025;,
		-0.000000;1.000000;-0.000000;,
		-0.000000;0.500000;-0.866025;,
		-0.000000;0.000000;1.000000;,
		-0.866025;0.000000;-0.500000;,
		-0.866025;0.000000;0.500000;,
		-1.000000;-0.000000;0.000000;;

		36;		// 36 faces
		3;9,9,9;,
		3;9,9,9;,
		3;9,9,9;,
		3;17,6,18;,
		3;17,1,6;,
		3;1,2,6;,
		3;1,16,2;,
		3;16,18,2;,
		3;16,17,18;,
		3;10,10,10;,
		3;10,10,10;,
		3;10,10,10;,
		3;19,19,19;,
		3;19,19,19;,
		3;19,19,19;,
		3;3,7,5;,
		3;3,13,7;,
		3;13,15,7;,
		3;13,12,15;,
		3;12,5,15;,
		3;12,3,5;,
		3;0,0,0;,
		3;0,0,0;,
		3;0,0,0;,
		3;19,19,19;,
		3;19,19,19;,
		3;19,19,19;,
		3;3,4,8;,
		3;3,11,4;,
		3;11,15,4;,
		3;11,14,15;,
		3;14,8,15;,
		3;14,3,8;,
		3;0,0,0;,
		3;0,0,0;,
		3;0,0,0;;
	}  // End of Normals
} // End of Mesh
