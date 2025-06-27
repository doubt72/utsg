import React from "react";

export default function MainPhaseSection() {
  return (
    <div>
      <h1>Main Phase</h1>
      <p>
        During the main phase of each turn, the player with initiative can take various actions with
        their units (see the list below). Each action moves the marker on the initiative track, and
        after every action the acting player must make an initiative check, and if it fails, the
        initiative passes to the other player who may make their own actions in turn. Otherwise, the
        player can continue to order their units until no other orders are possible (or they
        otherwise choose to pass). Once both players pass back-to-back, the turn is over.
      </p>
      <p>
        If there is a sniper in play (i.e., the opposing player has a sniper), sniper checks are
        made immediately after actions before the initiative check.
      </p>
      <p>These are all of the actions that can be performed by the player with initiative:</p>
      <ol>
        <li>
          <strong>Pass</strong> (-1): a player may choose (or be forced to choose if no other
          options are available) to pass and take no action. Initiative is passed to the other
          player. Two passes in a row (one by each player) ends the Main Phase.
        </li>
        <li>
          <strong>Fire</strong> (2): a ranged attack from one or more of a player&apos;s units on
          one or more enemy units.
        </li>
        <li>
          <strong>Intensive Fire</strong> (2): a unit may (sometimes) take another fire action even
          if they already have taken an action.
        </li>
        <li>
          <strong>Move</strong> (2): a normal move of one or more units moving from one hex to
          another.
        </li>
        <li>
          <strong>Rush</strong> (2): a unit may (sometimes) take another limited move action even if
          they have already taken an action.
        </li>
        <li>
          <strong>Assault Move</strong> (3): a special kind of move of a single hex that may move
          units into an enemy hex and does not give an opponent the chance to take opportunity fire.
        </li>
        <li>
          <strong>Rout</strong> (1): a retreat move by one of a player&apos;s broken units. May be
          used to get a unit out of danger.
        </li>
        <li>
          <strong>Rout Enemy</strong> (3): an attempt to force all of an enemy player&apos;s broken
          units to retreat. Units can only be (successfully) routed once per turn.
        </li>
        <li>
          <strong>Opportunity Fire</strong> (2): the opposing player may choose to take a firing (or
          intensive firing action) in response to any enemy action except routing or assault moves.
          There is no opportunity fire if the acting player fails their initiative check, in that
          case the player may make a normal firing action instead.
        </li>
      </ol>
    </div>
  );
}
