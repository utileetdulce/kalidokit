import Vector from "../utils/vector";
import { clamp } from "../utils/helpers";
import { Results } from "../Types";

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
    const UpperLeg = {
        r: new Vector({
            x: Vector.getRelativeSphericalCoords(lm[11], lm[23], lm[25]).theta,
            y: 0,
            z: Vector.getRelativeSphericalCoords(lm[11], lm[23], lm[25]).phi,
        }),
        l: new Vector({
            x: Vector.getRelativeSphericalCoords(lm[12], lm[24], lm[26]).theta,
            y: 0,
            z: Vector.getRelativeSphericalCoords(lm[12], lm[24], lm[26]).phi,
        }),
    };

    // const LowerLeg = {
    //     r: new Vector({
    //         x: Vector.thetaPhiFrom3DCoords(lm[23], lm[25], lm[27]).theta,
    //         y: 0,
    //         z: Vector.thetaPhiFrom3DCoords(lm[23], lm[25], lm[27]).phi
    //     }),
    //     l: new Vector({
    //         x: Vector.thetaPhiFrom3DCoords(lm[24], lm[26], lm[28]).theta,
    //         y: 0,
    //         z: Vector.thetaPhiFrom3DCoords(lm[24], lm[26], lm[28]).phi
    //     })
    // };

    let LowerLeg = {
        r: Vector.findRotation(lm[25], lm[27]),
        l: Vector.findRotation(lm[26], lm[28]),
    };
    LowerLeg.r.x = Vector.angleBetween3DCoords(lm[23], lm[25], lm[27]);
    LowerLeg.r.y = 0; // Y Axis not correct
    LowerLeg.r.z = 0; // Z Axis not correct
    LowerLeg.l.x = Vector.angleBetween3DCoords(lm[24], lm[26], lm[28]);
    LowerLeg.l.y = 0; // Y Axis not correct
    LowerLeg.l.z = 0; // Z Axis not correct

    //Modify Rotations slightly for more natural movement
    let rightLegRig = rigLeg(UpperLeg.r, LowerLeg.r, "Right");
    let leftLegRig = rigLeg(UpperLeg.l, LowerLeg.l, "Left");

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
 * @param {String} side : "Left" or "Right"
 */
export const rigLeg = (UpperLeg: Vector, LowerLeg: Vector, side = "Right") => {
    let invert = side === "Right" ? 1 : -1;
    let rigedUpperLeg = new Vector({
        x: UpperLeg.x,
        y: 0,
        z: UpperLeg.z + invert * offsets.upperLeg.z,
    });
    let rigedLowerLeg = new Vector({
        x: -LowerLeg.x * Math.PI,
        y: 0,
        z: LowerLeg.z,
    });

    return {
        // do not use. leg values are inaccurate
        UpperLeg: rigedUpperLeg,
        LowerLeg: rigedLowerLeg,
    };
};
