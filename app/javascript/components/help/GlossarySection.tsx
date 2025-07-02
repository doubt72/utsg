import React from "react";

type GlossaryData = { name: string; desc: JSX.Element };

const terms: GlossaryData[] = [
  {
    name: "Elevation",
    desc: (
      <>
        the height of terrain; affects movement, <strong>firing</strong>, and{" "}
        <strong>line-of-sight</strong>.
      </>
    ),
  },
  {
    name: "Soft",
    desc: (
      <>
        unarmored <strong>units</strong> and so get no <strong>armor</strong>{" "}
        protection.
      </>
    ),
  },
  {
    name: "Armored",
    desc: (
      <>
        <strong>units</strong> (vehicles) with <strong>armor</strong>, and have
        protection against attacks. Armored units are not necessarily{" "}
        <strong>fully armored</strong>, some attacks may bypass armor protection
        (for instance, if the unit lacks top or rear armor).
      </>
    ),
  },
  {
    name: "Fully Armored",
    desc: (
      <>
        <strong>units</strong> with <strong>armor</strong> on all sides
        (including top), and gets armor protection from all attacks.
      </>
    ),
  },
  {
    name: "Infantry Weapons",
    desc: (
      <>
        weapons larger than small arms operated by <strong>infantry</strong>{" "}
        such as machine guns, mortars, small anti-tank weapons, or radios. A
        separate category from <strong>crewed weapons</strong> such as guns or
        larger mortars which need to be manhandled or towed.
      </>
    ),
  },
  {
    name: "Infantry",
    desc: (
      <>
        <strong>soft</strong> foot <strong>units</strong> including squads,
        teams, and leaders.
      </>
    ),
  },
  {
    name: "Crewed Weapons",
    desc: (
      <>
        <strong>units</strong> such as guns or mortars which require a crew to
        operate. Does not include (all) <strong>infantry weapons</strong> (such
        as lighter mortars or machine guns), refers to larger weapons that
        require manhandling or towing to be moved.
      </>
    ),
  },
  {
    name: "Close Combat",
    desc: (
      <>
        close quarters combat between <strong>units</strong> occupying the same
        hex.
      </>
    ),
  },
  {
    name: "Initiative",
    desc: (
      <>
        both the ability to take an <strong>action</strong> and the balance on
        the initiative track; all actions cost a certain amount of initiative
        that moves the initiative marker along the initiative track, affecting
        the chance of the currently active player to retain initiative
      </>
    ),
  },
  {
    name: "Action",
    desc: (
      <>
        something the player can order a <strong>unit</strong> or a collection
        of units to do, such as moving, <strong>firing</strong>,{" "}
        <strong>routing</strong>, etc.
      </>
    ),
  },
  {
    name: "Encumbrance",
    desc: (
      <>
        the &quot;<strong>movement</strong>&quot; value of <strong>infantry weapons</strong>,
        indicated by red negative number or a black &quot;-&quot; indicating no encumbrance.  Any
        <strong>infantry</strong> unit carrying the weapon has their movement reduced by the value.
      </>
    ),
  },
  {
    name: "Hindrance",
    desc: (
      <>
        an inherent value of terrain or <strong>features</strong> that degrade
        the view of one hex from another hex, degrading the chance of making
        hits when <strong>firing</strong>.
      </>
    ),
  },
  {
    name: "Line of Sight (LOS)",
    desc: (
      <>
        the ability for <strong>units</strong> to see other units, and hence
        whether or not they can perform the <strong>fire</strong> action. Unlike
        many other hex-and-counter games, line-of-sight is blocked by the entire
        hex if the terrain type or a feature blocks LOS, not just the subset of
        the hex containing the blocking obstacle.
      </>
    ),
  },
  {
    name: "Cover",
    desc: (
      <>
        a value that is either inherent to terrain or a benefit of a defensive{" "}
        <strong>feature</strong> that can protect <strong>infantry</strong>{" "}
        <strong>units</strong> from <strong>fire</strong>.
      </>
    ),
  },
  {
    name: "Counter",
    desc: (
      <>
        a (virtual) cardboard sqare that represents a <strong>unit</strong>,{" "}
        <strong>marker</strong>, or <strong>feature</strong>.
      </>
    ),
  },
  {
    name: "Unit",
    desc: (
      <>
        a <strong>counter</strong> that represents an <strong>infantry</strong>{" "}
        squad or team, vehicle, or weapon of some sort that can be ordered to do
        various actions depending on the type.
      </>
    ),
  },
  {
    name: "Marker",
    desc: (
      <>
        a <strong>counter</strong> that represents some sort of{" "}
        <strong>unit</strong> or game status. Unit status may be shown as a
        badge depending on user preferences.
      </>
    ),
  },
  {
    name: "Feature",
    desc: (
      <>
        a <strong>counter</strong> that represents some sort of obstacle or
        defensive feature that isn&apos;t part of the map itself. Features also
        may not be ordered, although they may be placed or removed under certain
        circumstances.
      </>
    ),
  },
  {
    name: "Rout",
    desc: (
      <>
        an action that forces a <strong>broken</strong>{" "}
        <strong>infantry</strong> <strong>unit</strong> to retreat.
      </>
    ),
  },
  {
    name: "Rally",
    desc: (
      <>
        an attempt to un-break a <strong>broken</strong>{" "}
        <strong>infantry</strong> <strong>unit</strong>.
      </>
    ),
  },
  {
    name: "Break/Broken",
    desc: (
      <>
        an <strong>infantry</strong> <strong>unit</strong> that has taken{" "}
        <strong>fire</strong> may break, in which case the counter is flipped to
        the other side, and the unit may be <strong>routed</strong> but may not
        perform any other <strong>actions</strong>.
      </>
    ),
  },
  {
    name: "Leadership",
    desc: (
      <>
        a value that leaders have that is added to certain actions when combined
        with other <strong>units</strong> in the same hex, and also is the range
        for combining units in certain
        <strong>actions</strong>.
      </>
    ),
  },
  {
    name: "Handling",
    desc: (
      <>
        a bonus that gun crews have to targeting with{" "}
        <strong>crewed weapons</strong>, but excepting certain weapons like
        mortars.
      </>
    ),
  },
  {
    name: "Morale",
    desc: (
      <>
        a value that <strong>infantry</strong> <strong>units</strong> have, or
        their resistance to being <strong>broken</strong>.
      </>
    ),
  },
  {
    name: "Armor",
    desc: (
      <>
        the amount of resistance that <strong>armored</strong>{" "}
        <strong>units</strong> have against attacks.
      </>
    ),
  },
  {
    name: "Facing",
    desc: (
      <>
        if a <strong>unit</strong> can be rotated (i.e., vehicles or guns), the
        direction that a unit is facing is indicated by which direction the top
        of the counter is pointing. If the unit has an independently rotating
        armored turret, a hull counter is used to indicate vehicle facing, and
        the counter itself is used to indicate turret facing. When a vehicle has{" "}
        <strong>armor</strong>, which armor value is used depends on which
        direction the attack originates from relative to the unit&apos;s facing
      </>
    ),
  },
  {
    name: "Firepower",
    desc: (
      <>
        the chance that hits from the <strong>unit</strong> will have an effect
        on targeted units.
      </>
    ),
  },
  {
    name: "Activated",
    desc: (
      <>
        the state of a <strong>unit</strong> that has performed an{" "}
        <strong>action</strong>; in some cases additional actions may still be
        performed.
      </>
    ),
  },
  {
    name: "Exhausted",
    desc: (
      <>
        the state of a <strong>unit</strong> that has performed either more than
        one <strong>action</strong> or a particularly taxing action, and cannot
        perform any additional actions.
      </>
    ),
  },
  {
    name: "Tired",
    desc: (
      <>
        the state of a <strong>unit</strong> that was exhausted in a previous
        turn and has various penalties to <strong>actions</strong> in the
        current turn.
      </>
    ),
  },
  {
    name: "Pinned",
    desc: (
      <>
        a <strong>unit</strong> that has taken <strong>fire</strong> and has
        been forced to take cover but not
        <strong>broken</strong>.
      </>
    ),
  },
  {
    name: "Immobilized",
    desc: <>a vehicle that can no longer move.</>,
  },
  {
    name: "Jammed",
    desc: (
      <>
        a weapon that has malfunctioned but has not been destroyed and may
        possibly be repaired. If an <strong>infantry weapon</strong> or{" "}
        <strong>crewed weapon</strong>, flip the counter to the jammed side. If
        a vehicle, use a weapon jammed marker. <strong>Armored</strong> vehicle
        turrets may also jam, in which case they will be unable to turn.
      </>
    ),
  },
  {
    name: "Range",
    desc: (
      <>
        the maximum number of hexes that a target must be within for a weapon to
        have any effect when <strong>firing</strong>.
      </>
    ),
  },
  {
    name: "Movement",
    desc: (
      <>
        the number of points that a <strong>unit</strong> may spend to move, the
        cost of which depends on the movement costs of terrain and{" "}
        <strong>features</strong>.
      </>
    ),
  },
  {
    name: "Targeted",
    desc: (
      <>
        any weapon that requires a targeting roll to make a hit, and can only
        affect one target (that must be chosen before <strong>firing</strong>)
        in a hex at a time.
      </>
    ),
  },
  {
    name: "Area Fire",
    desc: (
      <>
        <strong>fire</strong> from mortars and offboard artillery that may
        affect all <strong>units</strong> in a hex, and will ignore{" "}
        <strong>armor</strong> if an armored unit is not{" "}
        <strong>fully armored</strong>.
      </>
    ),
  },
  {
    name: "Offboard Artillery",
    desc: (
      <>
        <strong>fire</strong> that requires a <strong>targeting</strong> roll
        and may drift into nearby hexes if it misses.
      </>
    ),
  },
  {
    name: "Rapid Fire",
    desc: (
      <>
        weapons such as machine guns that may target multiple adjacent hexes in
        a single <strong>fire</strong>
        action.
      </>
    ),
  },
  {
    name: "Field Gun",
    desc: (
      <>
        a low-velocity gun that depends on high explosives for its damage
        effects.
      </>
    ),
  },
  {
    name: "Victory Points",
    desc: (
      <>
        whoever has the most victory points at the end of a scenario wins;
        points may be awarded from occupying victory points or from eliminating
        enemy <strong>units</strong>.
      </>
    ),
  },
  {
    name: "Fire",
    desc: (
      <>
        a ranged attack by a <strong>unit</strong> on target(s) in another hex.
      </>
    ),
  },
  {
    name: "Opportunity Fire",
    desc: (
      <>
        when a unit fires or moves, the opposing player may{" "}
        <strong>fire</strong> on that <strong>unit</strong> whether or not they
        currently have the initiative.
      </>
    ),
  },
  {
    name: "Stacking Limit",
    desc: (
      <>
        the total size of <strong>units</strong> in a hex cannot exceed the
        stacking limit. Can be temporarily exceeded when engaging in{" "}
        <strong>close combat</strong> — limit applies only to each player&apos;s
        units, not the combined total, and players can overstack before combat,
        but each side&apos;s units must be reduced to the stacking limit after
        combat.
      </>
    ),
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
      <p>
        Herein is found a list of terms used by the game, along with brief
        explanations of each:
      </p>
      {sortedTerms().map((t, i) => (
        <p key={i}>
          <strong className="glossary-term">{t.name}</strong>: {t.desc}
        </p>
      ))}
    </div>
  );
}
