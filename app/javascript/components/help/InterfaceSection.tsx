import React, { useEffect, useState } from "react";
import { roundedRectangle } from "../../utilities/graphics";
import { redNumber } from "./helpData";
import {
  ArrowsAngleContract,
  ArrowsAngleExpand,
  Circle,
  CircleFill,
  DashCircle,
  EyeFill,
  GeoAlt,
  GeoAltFill,
  Hexagon,
  HexagonFill,
  Phone,
  PlusCircle,
  Square,
  SquareFill,
  Stack,
} from "react-bootstrap-icons";

export default function InterfaceSection() {
  const [gameInterface, setGameInterface] = useState<JSX.Element | undefined>();
  const [showNumbers, setShowNumbers] = useState(true);
  const [innerWidth, setInnerWidth] = useState(700);

  const handleResize = () => {
    let windowWidth = window.innerWidth;
    if (windowWidth > 1380) {
      windowWidth = 1380;
    }
    if (windowWidth < 1180) {
      windowWidth = 1180;
    }
    const otherWidth = document.getElementById("index-for-size")?.offsetWidth;
    setInnerWidth(windowWidth - (otherWidth ? otherWidth : 0) - 64);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // A hack to deal with the layout sizes changing after load; resize will
    // settle after loading images, but the time that takes will vary depending
    // on how slow the network is, shouldn't be anywhere approaching the slowest
    // time here (should typically be under 100ms), but no re-renders will occur
    // after it settles regardless.
    const backoff = [10, 20, 30, 50, 75, 100, 125, 150, 175, 200, 500, 1000, 2000];
    backoff.forEach((d) => setTimeout(handleResize, d));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const width = 3028;
    const height = 2584;
    const shrink = (innerWidth - 1) / width;
    const buttonSelect = showNumbers ? "counter-help-button-selected" : "";
    const coords: { x: number; y: number }[] = [
      { x: 160, y: 100 },
      { x: 800, y: 50 },
      { x: 2870, y: 100 },
      { x: 250, y: 200 },
      { x: 1700, y: 200 },
      { x: 2400, y: 590 },
      { x: 160, y: 620 },
      { x: 180, y: 750 },
      { x: 1070, y: 702 },
      { x: 800, y: 780 },
      { x: 1000, y: 780 },
      { x: 1470, y: 780 },
      { x: 2650, y: 780 },
      { x: 2650, y: 1220 },
      { x: 2650, y: 1330 },
      { x: 550, y: 1580 },
    ];
    setGameInterface(
      <div style={{ float: "right" }}>
        <svg
          width={width * shrink}
          height={height * shrink}
          viewBox={`0 0 ${width * shrink} ${height * shrink}`}
        >
          <defs>
            <pattern
              id="screenshot"
              patternUnits="userSpaceOnUse"
              width={width * shrink}
              height={height * shrink}
            >
              <image
                href="/assets/screenshot3.png"
                x="0"
                y="0"
                width={width * shrink}
                height={height * shrink}
              />
            </pattern>
          </defs>
          <path
            d={roundedRectangle(0, 0, width * shrink, height * shrink, 8)}
            style={{ fill: "url(#screenshot)" }}
          />
          {showNumbers
            ? coords.map((c, i) => (
                <g key={i}>
                  <circle
                    cx={c.x * shrink}
                    cy={c.y * shrink}
                    r={12}
                    style={{ fill: "#E00", stroke: "white", strokeWidth: 2 }}
                  />
                  <text
                    x={c.x * shrink}
                    y={c.y * shrink + 6}
                    textAnchor="middle"
                    fontSize={16}
                    style={{ fill: "white" }}
                  >
                    {i + 1}
                  </text>
                </g>
              ))
            : ""}
        </svg>
        <div className="flex mb05em">
          <div className="flex-fill p05em align-end">toggle illustration:</div>
          <div
            className={`custom-button normal-button terrain-help-button ${buttonSelect}`}
            onClick={() => setShowNumbers((s) => !s)}
          >
            <span>labels</span>
          </div>
        </div>
      </div>
    );
  }, [showNumbers, innerWidth]);

  return (
    <div>
      <p>This is the main interface of the game, showing a scenario in progress:</p>
      {gameInterface}
      <p>
        {redNumber(1)}
        <strong>Collapse button</strong>: can be used to collapse the move and chat displays to make
        more room for the map. Will be replaced by an expand button once the display is collapsed.
      </p>
      <p>
        {redNumber(2)}
        <strong>Title bar</strong>: shows the current scenario, current turn, and game name (to the
        far right).
      </p>
      <p>
        {redNumber(3)}
        <strong>Header Collapse Button</strong>: can be used to hide the page header to make more
        room for the map.  Will be replaced by an expand button once the header is hidden.
      </p>
      <p>
        {redNumber(4)}
        <strong>Action display</strong>: shows all of the game actions up to this point, as well as roll
        results for various required checks.
      </p>
      <p>
        {redNumber(5)}
        <strong>Chat display</strong>: players can send messages via this display. Messages can only
        be sent by the players in the game, but any logged-in user can see the messages. Every game
        has its own chat, and the main chat on the front page of the site is also distinct from all
        of the game chats.
      </p>
      <p>
        {redNumber(6)}
        <strong>Control bar</strong>: this shows all of game actions currently available to the
        player. The game will only present options that are currently possible. There is always a
        help button here that will go to a relevant section of the documentation. Note that many but
        not all actions may be undone; in general, if any dice rolls are involved, there is no
        undoing. Also, actions can usually be cancelled until finished, any dice rolls involved will be deferred
        until the action is &quot;committed.&quot;  This also indicates (with a national icon
        on the far left) which player you&apos;re playing (or currently playing in a hotseat
        game).
      </p>
      <p>
        {redNumber(7)}
        <strong>Control bar position toggle</strong>: can be used to toggle the control bar between
        horizontal and vertical orientations (to give the map more horizonal or vertical space).
        Horizontal orientations are recommended until a user has experience with the controls; the
        controls are harder to navigate when collapesed to icon-only with only tooltips as a guide.
      </p>
      <p>
        {redNumber(8)}
        <strong>Map overview</strong>: a mini-map, showing the entire map of the current scenario,
        and which part of the map is visible. The main map can be navigated by clicking or dragging here to move
        the map display to other parts of the map if the entire map is not visible at once.
      </p>
      <p>
        {redNumber(9)}
        <strong>Map controls</strong>: these buttons control how the map is displayed or what is
        displayed on the map.  These buttons may be collapsed to icon only on smaller displays.
      </p>
      <p>
        Map zoom is controled with these buttons (if the map is at full or
        minimum size, those buttons are ghosted):
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button button-left">
          <DashCircle />
        </div>
        <div className="custom-button normal-button button-middle">
          <Circle />
        </div>
        <div className="custom-button normal-button button-right">
          <PlusCircle />
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        The size of the interface is controlled with these buttons, which switch between a large
        interfact suitable for large displays, a smaller interface suitable for smaller displays or
        to make room for larger maps, and an even smaller interface suitable for mobile devices such
        as tablets (the game is not meant for phones, and essentially unusable on anything smaller
        than a tablet):
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button button-left custom-button-select">
          <ArrowsAngleExpand />
        </div>
        <div className="custom-button normal-button button-middle">
          <ArrowsAngleContract />
        </div>
        <div className="custom-button normal-button button-right">
          <Phone />
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>The following button is used for toggling the display of coordinates in hexes:</p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <GeoAltFill /> <span>coords</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <GeoAlt /> <span>coords</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        The following button is used for toggling between showing status as a badge on the unit or
        as separate markers (like would be seen on an actual tabletop):
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <CircleFill /> <span>status</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <Stack /> <span>status</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        The following button is used for toggling between showing counter overlays on mouseover
        (allowing units to be selected) or showing line-of-sight for the counters being moused over:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <Stack /> <span>overlay</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <EyeFill /> <span>overlay</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        The following button is used for toggling between showing or hiding counters on the map:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <SquareFill /> <span>counters</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <Square /> <span>counters</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        The following button is used for toggling between showing a terrain info tooltip or not:
      </p>
      <div className="flex mb1em">
        <div className="ml1em"></div>
        <div className="custom-button normal-button">
          <HexagonFill /> <span>terrain</span>
        </div>
        <div className="mt05em">/</div>
        <div className="custom-button normal-button">
          <Hexagon /> <span>terrain</span>
        </div>
        <div className="flex-fill"></div>
      </div>
      <p>
        {redNumber(10)}
        <strong>Unit displays</strong>: these can be clicked on to show any units that can be
        deployed (either initially or as reinforcements) or casualties. If units are available for
        deployment, the player nation or faction icon will be highlighted, and units can be
        selected.  The unit display panels can be dragged if they are blocking an area of interest
        on the map.
      </p>
      <p>
        {redNumber(11)}
        <strong>Sniper</strong>: if one or both sides have snipers in the game, they are displayed
        here. Sniper rolls may affect infantry units after they take certain actions.
      </p>
      <p>
        {redNumber(12)}
        <strong>Turn track</strong>: shows the current turn. When the last turn is over, the
        scenario ends.  The turn track may be compressed to fit the display, but the last turn is always shown
        so it&apos;s always possible to see how many turns are left.
      </p>
      <p>
        {redNumber(13)}
        <strong>Weather display</strong>: shows the current weather conditions, and if there&apos;s a
        chance of precipitation, etc.
      </p>
      <p>
        {redNumber(14)}
        <strong>Score display</strong>: shows the current score (i.e., who would win if the game
        ended at that moment). Also shows which directions the two players are advancing, or more
        importantly, the directions that units must move when routing (i.e., the opposite direction
        from the arrows).
      </p>
      <p>
        {redNumber(15)}
        <strong>Initiative track</strong>: shows the player who currently has initiative (i.e.,
        which side the marker is displaying), and the roll required for the initiative player would
        need to roll after an action if when the marker moves to the opponent&apos;s side of the
        track. Game actions taken by the players move the marker along the track.  The currently
        active player (not always the same as initiative player, e.g., when the opposing player
        needs to make checks after the inititive player takes an action, etc.) is indicated by
        black arrows above and below the national icon of the current player.  This display may
        be compressed to fit the display.
      </p>
      <p>
        {redNumber(16)}
        <strong>Main map</strong>: the actual scenario map, along with counters showing features and
        player units.  If the terrain button is activated, mousing over the map will show terrain,
        if the LOS overlay is selected, mousing over units will show their line-of-sight, otherwise,
        unless in the middle of certain actions, mousing over units will expand the stacks where units
        can be examined or selected (if legal, e.g., if it&apos;s your turn to activate units) by clicking
        on them. The map can be dragged if not all of it is currently visible on the display.
      </p>
    </div>
  );
}
