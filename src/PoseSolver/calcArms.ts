import Vector from "../utils/vector";
import Euler from "../utils/euler";
import { clamp } from "../utils/helpers";
import { Results, Side } from "../Types";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";

/**
 * Calculates arm rotation as euler angles
 * @param {Array} lm : array of 3D pose vectors from tfjs or mediapipe
 */
export const calcArms = (lm: Results) => {
    //Pure Rotation Calculations
    const rightUpperArmSphericalCoords = Vector.getRelativeSphericalCoords(lm[12], lm[11], lm[13], {
        x: "z",
        y: "x",
        z: "y",
    });
    const leftUpperArmSphericalCoords = Vector.getRelativeSphericalCoords(lm[11], lm[12], lm[14], {
        x: "z",
        y: "x",
        z: "y",
    });

    const rightLowerArmSphericalCoords = Vector.getRelativeSphericalCoords(lm[11], lm[13], lm[15], {
        x: "z",
        y: "x",
        z: "y",
    });
    const leftLowerArmSphericalCoords = Vector.getRelativeSphericalCoords(lm[12], lm[14], lm[16], {
        x: "z",
        y: "x",
        z: "y",
    });

    let Hand = {
        r: Vector.findRotation(new Vector(lm[15]), Vector.lerp(new Vector(lm[17]), new Vector(lm[19]), 0.5)),
        l: Vector.findRotation(new Vector(lm[16]), Vector.lerp(new Vector(lm[18]), new Vector(lm[20]), 0.5)),
    };

    const UpperArm = {
        r: new Vector({
            x: -rightLowerArmSphericalCoords.phi - 0.2,
            y: -rightUpperArmSphericalCoords.theta,
            z: -rightUpperArmSphericalCoords.phi,
        }),
        l: new Vector({
            x: -leftLowerArmSphericalCoords.phi - 0.2,
            y: -leftUpperArmSphericalCoords.theta,
            z: leftUpperArmSphericalCoords.phi,
        }),
    };

    const LowerArm = {
        r: new Vector({
            x: Hand.r.x, //0, // not relevant
            y: Vector.angleBetween3DCoords(lm[11], lm[13], lm[15]), //rightLowerArmSphericalCoords.theta,
            z: 0, //rightLowerArmSphericalCoords.phi,
        }),
        l: new Vector({
            x: -Hand.l.x, // not relevant
            y: -Vector.angleBetween3DCoords(lm[12], lm[14], lm[16]), //leftLowerArmSphericalCoords.phi,
            z: 0, //PI / 2.2 + leftLowerArmSphericalCoords.theta,
        }),
    };

    //Modify Rotations slightly for more natural movement
    let rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, RIGHT);
    let leftArmRig = rigArm(UpperArm.l, LowerArm.l, Hand.l, LEFT);

    return {
        //Scaled
        UpperArm: {
            r: rightArmRig.UpperArm,
            l: leftArmRig.UpperArm,
        },
        LowerArm: {
            r: rightArmRig.LowerArm,
            l: leftArmRig.LowerArm,
        },
        Hand: {
            r: rightArmRig.Hand,
            l: leftArmRig.Hand,
        },
        //Unscaled
        Unscaled: {
            UpperArm: UpperArm,
            LowerArm: LowerArm,
            Hand: Hand,
        },
    };
};

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} UpperArm : normalized rotation values
 * @param {Object} LowerArm : normalized rotation values
 * @param {Object} Hand : normalized rotation values
 * @param {Side} side : left or right
 */
export const rigArm = (UpperArm: Vector, LowerArm: Vector, Hand: Vector, side: Side = RIGHT) => {
    // Invert modifier based on left vs right side
    const invert = side === RIGHT ? 1 : -1;

    let rigedUpperArm = new Euler({
        x: UpperArm.x * PI,
        y: UpperArm.y * PI,
        z: UpperArm.z * PI,
        rotationOrder: "YZX",
    });

    let rigedLowerArm = new Euler({
        x: LowerArm.x * PI,
        y: LowerArm.y * PI,
        z: LowerArm.z * PI,
        rotationOrder: "YZX",
    });

    Hand.y = clamp(Hand.z * 2, -0.6, 0.6); //side to side
    Hand.z = Hand.z * -2.3 * invert; //up down

    return {
        //Returns Values in Radians for direct 3D usage
        UpperArm: rigedUpperArm,
        LowerArm: rigedLowerArm,
        Hand: Hand,
    };
};
