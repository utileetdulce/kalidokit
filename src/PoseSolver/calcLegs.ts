import Vector from "../utils/vector";
import Euler from "../utils/euler";
import { Results, Side } from "../Types";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";

export const offsets = {
    upperLeg: {
        z: 0.1,
    },
};

/**
 * Calculates leg rotation angles
 * @param {Results} lm : array of 3D pose vectors from tfjs or mediapipe
 */
export const calcLegs = (lm: Results) => {
    const rightUpperLegSphericalCoords = Vector.getSphericalCoords(lm[23], lm[25], { x: "y", y: "z", z: "x" });
    const leftUpperLegSphericalCoords = Vector.getSphericalCoords(lm[24], lm[26], { x: "y", y: "z", z: "x" });
    const hipRotation = Vector.findRotation(lm[23], lm[24]);

    const UpperLeg = {
        r: new Vector({
            x: rightUpperLegSphericalCoords.theta,
            y: 0, // not relevant
            z: rightUpperLegSphericalCoords.phi - hipRotation.z,
        }),
        l: new Vector({
            x: leftUpperLegSphericalCoords.theta,
            y: 0, // not relevant
            z: leftUpperLegSphericalCoords.phi - hipRotation.z,
        }),
    };

    const LowerLeg = {
        r: new Vector({
            x: -Vector.angleBetween3DCoords(lm[23], lm[25], lm[27]),
            y: 0, // not relevant
            z: 0, // not relevant
        }),
        l: new Vector({
            x: -Vector.angleBetween3DCoords(lm[24], lm[26], lm[28]),
            y: 0, // not relevant
            z: 0, // not relevant
        }),
    };

    //Modify Rotations slightly for more natural movement
    let rightLegRig = rigLeg(UpperLeg.r, LowerLeg.r, RIGHT);
    let leftLegRig = rigLeg(UpperLeg.l, LowerLeg.l, LEFT);

    return {
        //Scaled
        UpperLeg: {
            r: rightLegRig.UpperLeg,
            l: leftLegRig.UpperLeg,
        },
        LowerLeg: {
            r: rightLegRig.LowerLeg,
            l: leftLegRig.LowerLeg,
        },
        //Unscaled
        Unscaled: {
            UpperLeg,
            LowerLeg,
        },
    };
};

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} UpperLeg : normalized rotation values
 * @param {Object} LowerLeg : normalized rotation values
 * @param {Side} side : left or right
 */
export const rigLeg = (UpperLeg: Vector, LowerLeg: Vector, side: Side = RIGHT) => {
    let invert = side === RIGHT ? 1 : -1;
    let rigedUpperLeg = new Euler({
        x: UpperLeg.x * PI,
        y: UpperLeg.y * PI,
        z: UpperLeg.z * PI + invert * offsets.upperLeg.z,
    });
    let rigedLowerLeg = new Euler({
        x: LowerLeg.x * PI,
        y: 0, // not relevant
        z: 0, // not relevant
    });

    return {
        UpperLeg: rigedUpperLeg,
        LowerLeg: rigedLowerLeg,
    };
};
