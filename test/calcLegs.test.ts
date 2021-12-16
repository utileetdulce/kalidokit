const cloneDeep = require("lodash.clonedeep")
import {calcLegs} from "../src/PoseSolver/calcLegs"
import poseLandmarks from "./poseLandmarks"
import poseWorldLandmarks from "./poseWorlLandmarks"
import {Results} from "../src/Types"

let worldLandmarks:Results

describe("lower leg", () => {
    beforeEach(() => {
        worldLandmarks = cloneDeep(poseWorldLandmarks)
      })

    test("should resolve the correct rotation for the lower left leg", () => {
        worldLandmarks[12] = {x:0, y: 0, z: 0}
        worldLandmarks[24] = {x:0, y: 0.4, z: 0}
        worldLandmarks[26] = {x:0, y: 0.4, z: 0.4}

        const result = calcLegs(worldLandmarks)
  
        expect(result.UpperLeg.l.z).toBe(Math.PI / 2)
        expect(result.Unscaled.UpperLeg.l.z).toBe(0.5)
    })


    

})

