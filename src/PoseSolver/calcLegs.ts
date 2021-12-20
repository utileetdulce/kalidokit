import Vector from "../utils/vector";
import { Results, Side } from "../Types";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";

export const offsets = {
    upperLeg: {
        z: 0.2,
    },
};

/**
 * Calculates leg rotation as euler angles
 * TODO: Make angles more accurate in all rotation axis
 * @param {Results} lm : array of 3D pose vectors from tfjs or mediapipe
 */
export const calcLegs = (lm: Results) => {
    const rightUpperLegSphericalCoords = Vector.getRelativeSphericalCoords(lm[11], lm[23], lm[25], { x: "y", y: "z", z: "x" });
    const leftUpperLegSphericalCoords = Vector.getRelativeSphericalCoords(lm[12], lm[24], lm[26], { x: "y", y: "z", z: "x" });
    const UpperLeg = {
        r: new Vector({
            x: rightUpperLegSphericalCoords.theta,
            y: 0,
            z: rightUpperLegSphericalCoords.phi,
        }),
        l: new Vector({
            x: leftUpperLegSphericalCoords.theta,
            y: 0,
            z: leftUpperLegSphericalCoords.phi,
        }),
    };

    const LowerLeg = {
        r: new Vector({
            x: -Vector.angleBetween3DCoords(lm[23], lm[25], lm[27]),
            y: 0,
            z: 0
        }),
        l: new Vector({
            x: -Vector.angleBetween3DCoords(lm[24], lm[26], lm[28]),
            y: 0, 
            z: 0
        })
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
    let rigedUpperLeg = new Vector({
        x: UpperLeg.x * PI,
        y: UpperLeg.y * PI,
        z: UpperLeg.z * PI + invert * offsets.upperLeg.z,
    });
    let rigedLowerLeg = new Vector({
        x: LowerLeg.x * PI,
        y: LowerLeg.y * PI,
        z: LowerLeg.z * PI
    });

    return {
        UpperLeg: rigedUpperLeg,
        LowerLeg: rigedLowerLeg,
    };
};
