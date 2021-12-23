const cloneDeep = require("lodash.clonedeep")
import { calcLegs } from "../src/PoseSolver/calcLegs"
import poseWorldLandmarks from "./poseWorlLandmarks"
import { Results } from "../src/Types"
import { offsets } from "../src/PoseSolver/calcLegs"

let worldLandmarks: Results
const PI = Math.PI

describe("should resolve the correct upper leg rotation for", () => {
    beforeEach(() => {
        worldLandmarks = cloneDeep(poseWorldLandmarks)
      })

    test("upper left leg, 90 degree forward, up", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
          
        expect(round(result.UpperLeg.l.x)).toBe(round(PI / 2))
        expect(round(result.Unscaled.UpperLeg.l.x)).toBe(0.5)
        
        expect(round(result.UpperLeg.l.z)).toBe(round((0 - offsets.upperLeg.z)))
        expect(round(result.Unscaled.UpperLeg.l.z)).toBe(0)
    })

    test("upper left leg, straight down", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0.4, z: 0 }

        const result = calcLegs(worldLandmarks)
          
        expect(round(result.UpperLeg.l.x)).toBe(round(-0))
        expect(round(result.Unscaled.UpperLeg.l.z)).toBe(0)

        expect(round(result.UpperLeg.l.z)).toBe(round((0 - offsets.upperLeg.z)))
        expect(round(result.Unscaled.UpperLeg.l.x)).toBe(-0)
    })

    test("upper left leg, 90 degree forward, up, 45 degree left", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: -0.4, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
          
        expect(round(result.UpperLeg.l.x)).toBe(round(PI / 2))
        expect(round(result.Unscaled.UpperLeg.l.x)).toBe(0.5)

        expect(round(result.UpperLeg.l.z)).toBe(round((-PI / 4 - offsets.upperLeg.z)))
        expect(round(result.Unscaled.UpperLeg.l.z)).toBe(-0.25)
    })

    test("upper right leg, 90 degree forward, up", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
  
        expect(round(result.UpperLeg.r.x)).toBe(round(PI / 2))        
        expect(round(result.Unscaled.UpperLeg.r.x)).toBe(0.5)

        expect(round(result.UpperLeg.r.z)).toBe(round(0 + offsets.upperLeg.z))
        expect(round(result.Unscaled.UpperLeg.r.z)).toBe(0)
    })

    test("upper right leg, straight down", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0.4, z: 0 }

        const result = calcLegs(worldLandmarks)
          
        expect(round(result.UpperLeg.r.x)).toBe(round(-0))
        expect(round(result.Unscaled.UpperLeg.r.z)).toBe(0)

        expect(round(result.UpperLeg.r.z)).toBe(round((0 + offsets.upperLeg.z)))
        expect(round(result.Unscaled.UpperLeg.r.x)).toBe(-0)
    })

    test("upper right leg, 90 degree forward, up, 45 degree left", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0.4, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
          
        expect(round(result.UpperLeg.r.x)).toBe(round(PI / 2))
        expect(round(result.Unscaled.UpperLeg.r.x)).toBe(0.5)

        expect(round(result.UpperLeg.r.z)).toBe(round((PI / 4 + offsets.upperLeg.z)))
        expect(round(result.Unscaled.UpperLeg.r.z)).toBe(0.25)
    })
})

describe("should resolve the correct lower leg rotation for", () => {
    beforeEach(() => {
        worldLandmarks = cloneDeep(poseWorldLandmarks)
      })

    test("lower left leg, 90 degree", () => {
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[28] = { x: 0, y: 0.4, z: -0.4 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.l.x).toBe(-PI / 2)
        expect(result.Unscaled.LowerLeg.l.x).toBe(-0.5)
    })

    test("lower left leg, 45 degree", () => {
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[28] = { x: 0, y: 0.4, z: -0.8 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.l.x).toBe(-PI / 4)
        expect(result.Unscaled.LowerLeg.l.x).toBe(-0.25)
    })

    test("lower right leg, 90 degree", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[27] = { x: 0, y: 0.4, z: -0.4 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.r.x).toBe(-PI / 2)
        expect(result.Unscaled.LowerLeg.r.x).toBe(-0.5)
    })

    test("lower right leg, 45 degree", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[27] = { x: 0, y: 0.4, z: -0.8 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.r.x).toBe(-PI / 4)
        expect(result.Unscaled.LowerLeg.r.x).toBe(-0.25)
    })
})

function round(value: number, decimals: number = 3){
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
}