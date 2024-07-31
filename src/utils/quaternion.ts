import { degToRad } from "./util"
import { Vec3 } from "./v3"
import { Vec4 } from "./v4"

export function degToQuaternion(angles: Vec3): Vec4 {
    // Abbreviations for the various angular functions
    const roll = degToRad(angles[0])
    const pitch = degToRad(angles[1])
    const yaw = degToRad(angles[2])

    const cr = Math.cos(roll * 0.5);
    const sr = Math.sin(roll * 0.5);
    const cp = Math.cos(pitch * 0.5);
    const sp = Math.sin(pitch * 0.5);
    const cy = Math.cos(yaw * 0.5);
    const sy = Math.sin(yaw * 0.5);

    return [
    sr * cp * cy - cr * sp * sy,
    cr * sp * cy + sr * cp * sy,
    cr * cp * sy - sr * sp * cy,
    cr * cp * cy + sr * sp * sy,
    ]
}
