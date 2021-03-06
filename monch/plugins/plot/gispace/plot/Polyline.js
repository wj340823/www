import BaseMixin from "./BaseMixin";
import PlotTypes from "../PlotTypes";

import LineString from "ol/geom/LineString";

export default class Polyline extends BaseMixin(LineString) {

    constructor(points = []) {
        super(points);
        this.type = PlotTypes.POLYLINE;
        this.setPoints(points);
    }

    generate() {
        let count = this.getPointCount();
        if(count < 2) {
            return;
        }
        this.setCoordinates(this.points);
    }
}