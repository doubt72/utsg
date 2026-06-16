import React from "react";

export const smokeTable = (
  <table>
    <tbody>
      <tr>
        <th>roll</th>
        <th>result</th>
      </tr>
      <tr>
        <td>
          <strong>1-5</strong>
        </td>
        <td>smoke hindrance 2</td>
      </tr>
      <tr>
        <td>
          <strong>6-8</strong>
        </td>
        <td>smoke hindrance 3</td>
      </tr>
      <tr>
        <td className="pr05em">
          <strong>9-10</strong>
        </td>
        <td>smoke hindrance 4</td>
      </tr>
    </tbody>
  </table>
)

export default function FireSmokeSection() {

  return (
    <div>
      <p>
        If a targeted fire weapon can fire smoke (indicated by a dot over the firepower), they may
        choose to do so instead of firing on an enemy unit. Instead of choosing an enemy unit as a
        target, choose a hex (occupied or not) and the target roll proceeds normally. On success,
        roll d10 to determine how heavy the resulting smoke is, and a smoke marker is placed in the
        hex:
      </p>
      { smokeTable }
      <p>
        Offboard artillery firing smoke works the same way, except on a miss, smoke is placed in the
        drift hex.
      </p>
    </div>
  );
}
