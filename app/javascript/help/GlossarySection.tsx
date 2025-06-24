import React from "react";

type GlossaryData = { name: string; desc: string };

const terms: GlossaryData[] = [
  { name: "Soft", desc: "soft units are unarmored, and hence gets no armor protection." },
  {
    name: "Armored",
    desc: "units (vehicles) with armor, and hence gets armor protection.  Armored units are not necessarily fully armored, some attacks may bypass armor protection (for instance, if the unit lacks top or rear armor).",
  },
  {
    name: "Fully Armored",
    desc: "units with armor on all sides (including top), and gets armor protection from all attacks.",
  },
  {
    name: "Infantry Weapons",
    desc: "weapons larger than small arms operated by infantry such as machine guns, mortars, small anti-tank weapons, or radios.  A separate category from crewed weapons such as guns or larger mortars which need to be manhandled or towed.",
  },
  {
    name: "Crewed Weapons",
    desc: "units such as guns or mortars which require a crew to operate.  Does not include (all) infantry weapons (such as lighter mortars or machine guns), refers to larger weapons that require manhandling or towing to be moved.",
  },
  {
    name: "Close Combat",
    desc: "close quarters combat between units occupying the same hex.",
  },
  {
    name: "Initiative",
    desc: "the ability to take an action; all actions cost a certain amount of initiative that moves the initiative marker along the initiative track, affecting the chance of the currently active player to retain initiative",
  },
  {
    name: "Action",
    desc: "something the player can order a unit or a collection of units to do, such as moving, firing, routing, etc.",
  },
  {
    name: "Hindrance",
    desc: "an inherent value of terrain or features that degrade the view of one hex from another hex, degrading the chance of making hits when firing.",
  },
  {
    name: "Line of Sight (LOS)",
    desc: "the ability for units to see other units, and hence whether or not they can perform the fire action.  Unlike many other hex-and-counter games, line of sight is blocked by the entire hex if the terrain type or a feature blocks LOS, not just the subset of the hex containing the blocking obstacle.",
  },
  {
    name: "Cover",
    desc: "a value that is either inherent to terrain or a benefit of a defensive feature that can protect infantry units from fire.",
  },
  {
    name: "Counter",
    desc: "a (virtual) cardboard sqare that represents a unit, marker, or feature.",
  },
  {
    name: "Unit",
    desc: "a counter that represents an infantry squad or team, vehicle, or weapon of some sort that can be ordered to do various actions depending on the type.",
  },
  {
    name: "Marker",
    desc: "a counter that represents some sort of unit or game status.  Unit status may be shown as a badge depending on user preferences.",
  },
  {
    name: "Feature",
    desc: "a counter that represents some sort of obstacle or defensive feature that isn't part of the map itself.  Features also may not be ordered, although they may be placed or removed under certain circumstances.",
  },
  {
    name: "Rout",
    desc: "an action that forces a broken infantry unit to retreat.",
  },
  {
    name: "Rally",
    desc: "an attempt to un-break a broken infantry unit.",
  },
  {
    name: "Break/Broken",
    desc: "an infantry unit that's taken fire may break, in which case the counter is flipped to the other side, and the unit may be routed but may not perform any actions.",
  },
  {
    name: "Leadership",
    desc: "a value that leaders have that is added to certain actions when combined with other units in the same hex, and also is the range for combining units in certain actions.",
  },
  {
    name: "Handling",
    desc: "a bonus that gun crews have to targeting with crewed weapons, excepting certain weapons like mortars.",
  },
  {
    name: "Morale",
    desc: "a value that infantry units have, or their resistance to being broken.",
  },
  {
    name: "Armor",
    desc: "the amount of resistance that armored units have against attacks.",
  },
  {
    name: "Facing",
    desc: "if a unit can be meaningfully rotated (i.e., vehicles or guns), the direction that a unit is facing is indicated by which direction the top of the counter is pointing.  If the unit has an independently rotating armored turret, a hull counter is used to indicate vehicle facing, and the counter itself is used to indicate turret facing.  When a vehicle has armor, which armor value is used depends on which direction the attack originates from relative to the unit's facing",
  },
  {
    name: "Firepower",
    desc: "the chance that hits from the unit will have an effect on targeted units.",
  },
  {
    name: "Activated",
    desc: "the state of a unit that has performed an action; in some cases additional actions may still be performed.",
  },
  {
    name: "Exhausted",
    desc: "the state of a unit that has performed either more than one action or a particularly taxing action, and cannot perform any additional actions.",
  },
  {
    name: "Tired",
    desc: "the state of a unit that was exhausted in a previous turn and has various penalties to actions in the current turn.",
  },
  {
    name: "Pinned",
    desc: "a unit that has taken fire and has been forced to take cover but not broken.",
  },
  {
    name: "Immobilized",
    desc: "a vehicle that can no longer move.",
  },
  {
    name: "Jammed",
    desc: "a weapon that has malfunctioned but has not been destroyed and may possibly be repaired.  Armored vehicle turrets may also jam, in which case they are unable to turn.",
  },
  {
    name: "Range",
    desc: "the maximum number of hexes that a target must be within for a weapon to have any effect when firing.",
  },
  {
    name: "Movement",
    desc: "the number of points that a unit may spend to move, the cost of which depends on the movement costs of terrain and features.",
  },
  {
    name: "Targeted",
    desc: "any weapon that requires a targeting roll to make a hit, and can only affect one target (that must be chosen before firing) in a hex at a time.",
  },
  {
    name: "Area Fire",
    desc: "fire from mortars and offboard artillery that may affect all units in a hex, and will ignore armor if an armored unit is not fully armored.",
  },
  {
    name: "Offboard Artillery",
    desc: "fire that requires a targeting roll and may drift into nearby hexes if it misses.",
  },
  {
    name: "Rapid Fire",
    desc: "weapons such as machine guns that may target multiple adjacent hexes in a single fire action.",
  },
  {
    name: "Field Gun",
    desc: "a low-velocity gun that depends on high explosives for its damage effects.",
  },
  {
    name: "Victory Points",
    desc: "whoever has the most victory points at the end of a scenario wins; points may be awarded from occupying victory points or from eliminating enemy units.",
  },
  {
    name: "Opportunity Fire",
    desc: "when a unit fires or moves, the opposing player may fire on that unit whether or not they currently have the initiative.",
  },
];

const sortedTerms = (): GlossaryData[] => {
  return terms.sort((a, b) => {
    if (a.name === b.name) {
      return 0;
    }
    return a.name > b.name ? 1 : -1;
  });
};

export default function GlossarySection() {
  return (
    <div>
      <h1>Glossary</h1>
      {sortedTerms().map((t, i) => (
        <p key={i}>
          <strong>{t.name}</strong>: {t.desc}
        </p>
      ))}
    </div>
  );
}
