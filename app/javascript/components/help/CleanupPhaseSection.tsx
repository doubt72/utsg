import React from "react";

export default function CleanupPhaseSection() {
  return (
    <div>
      <p>
        Several things happen during the prep phase, the first is close combat resolution, then
        several turn-end housekeeping tasks.
      </p>
      <ol>
        <li>
          <strong>Close Combat</strong>: resolve all close combats, initiative player chooses order
        </li>
        <li>
          <strong>Housekeeping</strong>:
            <ol>
              <li><strong>Check Stacking</strong>: remove overstacked units</li>
              <li><strong>Unit Status/Initiative Check</strong>: update status markers</li>
              <li><strong>Smoke Check</strong>: check smoke dispersion</li>
              <li><strong>Fire Check</strong>: check if fire spreads or is extinguished</li>
              <li><strong>Weather</strong>: check variable weather</li>
            </ol>
        </li>
      </ol>
    </div>
  );
}
