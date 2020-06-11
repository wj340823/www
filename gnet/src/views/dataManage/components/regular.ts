import http from "axios";
const SINGLE_REGULAR = [
    {
        label: "互相重叠",
        value: 1
    },
    {
        label: "自重叠",
        value: 2
    },
    {
        label: "(线)自相交",
        value: 3
    },
    {
        label: "(线)伪节点",
        value: 4
    },
    {
        label: "(线)悬挂线",
        value: 5
    },
    {
        label: "(面)闭合",
        value: 6
    }
];
const REGULARS = [
    {
        label: "(点-面)点必须在多边形边界上",
        value: 1
    },
    {
        label: "(点-线)点要素必须位于线要素的端点上",
        value: 2
    },
    {
        label: "(点-线)点要素必须在线要素之上",
        value: 3
    },
    {
        label: "(点-面)点要素必须在多边形要素内",
        value: 4
    },
    {
        label: "(线-线)重叠",
        value: 5
    },
    {
        label: "(面-面)相互覆盖",
        value: 6
    },
    {
        label: "(面-面)单覆盖",
        value: 7
    },
    {
        label: "(线-面)边界重叠",
        value: 8
    }
];
const FILETYPE = [
    {
        label: "shapefile",
        value: "shapefile"
    },
    {
        label: "geojson",
        value: "geojson"
    },
    {
        label: "esrijson",
        value: "esrijson"
    },
    {
        label: "mif",
        value: "mif"
    }
];
const getAllCategory = async () => {
    let list;
    list = await http.get("/gnet/data/category").then(res => res.data.data);
    return list;
};
const getAllGroup = async () => {
  let list;
  list = await http.get("/gnet/data/group").then(res => res.data.data);
  return list;
};
export { SINGLE_REGULAR, REGULARS, FILETYPE, getAllCategory,getAllGroup };
