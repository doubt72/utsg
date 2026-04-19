## 0.59 Alpha

- Set default (back) to scenario number (for now)
- Bug fix: team ghosts
- Updated 001, 308
- Reset 001, 101

## 0.58 Alpha

- Add non-collapsed turn track for larger windows
- Update docs to match changes that happened a while ago.
- Bug fix: show close combat firepower if unit broken

## 0.57 Alpha

- More tweaks to critical hit
- Bug fix: "sd"

## 0.56 Alpha

- Add critical hit (only affects morale checks)
- Allow discarding unmanned or uncarried support weapons to be removed to get under stacking limit.
- Allow splitting squads during overstack reduction
- Only show firing hexes as targets in reaction fire
- Graphical and display tweaks
- Bug fix: reload forgets close combat roll result
- Bug fix: only first formatted substitution substituting
- Bug fix: show display error when trying to place encumbered SW on leader

## 0.55 Alpha

- Show message when selecting non-active player units
- Passing doesn't shift initiative if initiative on player's side
- Only reset to 16 instead of 14

## 0.54 Alpha

- Updated 007

## 0.53 Alpha

- Optimize map background

## 0.52 Alpha

- More shrinkage

## 0.51 Alpha

- Fancier map background
- Bug fix: rush should also roll back VPs

## 0.50 Alpha

- Layout tweaks
- Dropped radio cannot be operated by an opponent
- Bug fix: close combat not being set correctly in two-player games at the beginning of phase (left in a little bit of instrumentation in case not fixed)
- Bug fix: overstack should unselect all other units
- Bug fix: unmanned gun should not trigger possible reaction fire
- Updated 011

## 0.49 Alpha

- Layout size tweaks, add map background

## 0.48 Alpha

- Add Collapse of Inititiative Track

## 0.47 Alpha

- Minor layout fix
- Tweak counter tooltips to be above mouse to avoid issues
- Bug fix: winning player swapped in game over window
- Bug fix: leave game button shouldn't open new tab, should just go to main page (what was I thinking?)
- Bug fix: display bug on broken tie morale checks
- Updated 005

## 0.46 Alpha

- Make ranged combat a little less likely to hit
- Removed unnecessary admin game stats

## 0.45 Alpha

- Disabling accounts does the minimum (but silently)
- Bug fix: rectify type mismatch on game record (winner)

## 0.44 Alpha

- Admin stat pages / allow disabling accounts
- Bug fix: fire start state was clearing in_progress state/not gameState
- Bug fix: overselection of ghosted deploy
- Update 011, 510, 603

## 0.43 Alpha

- Fix scoring for minor nations
- Instrumenting national display (seems to only disappear on the remote server)
- Updated 308

## 0.42 Alpha

- Move logo out of Game Controls which are constantly change and sometimes disappears
- Bug fix: cache names for deploy action string value (undeployed teams may disappear)

## 0.41 Alpha

- Removed excessive updates and finally successfully(?) fixed performance
- Bug fix: dropped machine guns prevent overstack resolution
- Updated 007

## 0.40 Alpha

- More attempts at improving update performance
- Updated 301
- Downgraded 004, 302, 504 to alpha

## 0.39 Alpha

- Live updates of game lists on main page when games created/updated
- Slightly better error message when (not) multiselecting infantry weapons
- Some render optimizations
- Add button to return to main page after game over or not logged in
- Bug fix: don't allow undo of automatic reaction fire pass
- Bug fix: fixed bug with calculated average rating
- Bug fix: selecting deploy unit should unselect on map
- Updated 308

## 0.38 Alpha

- Added high contrast palette for colorblindness
- Added preferences, can now disable map animations and reset map display settings
- Lower animation refresh slightly (Safari in particular has trouble updating)
- Redo stacking warning during deploy to be more informative, include undo
- Bug fix: rally pass doesn't pass BOTH players
- Bug fix: don't allow spliting/joining of units in contact with the enemy
- Updated 501
- Updated 301 (and implemented special rout rule)

## 0.37 alpha

- Refactoring deploy data structure
- Improve undo flow for deployments and add ability to "undeploy" units
- Add ability to split/rejoin squads (deleted teams from available units/scenarios, now split only)
- Removed all unit lookups in action string values (because unit can change type/IDs can disappear, this will also help bug fixes not degrade older games action displays or possibly break them outright)
- Deleted all games (and scenario versions): existing games no longer compatible with deploys/action changes
- Deleted games now redirect to main page
- Bug fix: undo not properly setting last action index

## 0.36 alpha

- Changed my mind about routed units capturing VPs (now flip on successful rally)
- Only anti-armor capable units show reaction fire for tanks
- Bug fix: fix display problem with undoing moves
- Bug fix: prevent selection of units in reinforcement panel if not deploying
- Bug fix: fix skipping deployment for initiative player in turns after the first
- Bug fix: rapid fire units attacks on armored units should be forbidden
- Bug fix: ghosts not showing up for morale checks on reaction fire after rush
- Bug fix: prevent rout all showing on minor nations when nothing to rout (and other nation/playerNation mismatches)

## 0.35 alpha

- Completely refactor action animations
- Let player undo passing reaction fire
- Disable LOS overlay/terrain buttons/overlays/tooltips when state overlays on
- Deployment panel only shows the clicky-clicky if it's a deployment phase
- Bug fix: issue targeting open hexes with artillery
- Bug fix: roll back VP/loading/dropping for shorted moves (uh, let's not speak of smoke)
- Bug fix: fire help adding up cover from all firing units but should use minimum cover
- Bug fix: rout should be able to switch VPs by routing into/through them
- Bug fix: gun needs to not be fired to be shown as available for reaction fire
- Bug fix: allow smoke click on path
- Bug fix: disallow radios from laying smoke
- Bug fix: get rid of badges on casualties

## 0.34 alpha

- Bug fix: fix rout/rout check loop issue

## 0.33 alpha

- Bug fix: fix getting stuck on fire displacement
- Updated 003

## 0.32 alpha

- Monospace fonts for numbers (and hex Coordinates) in action display

## 0.31 alpha

- Slowed down animations a bit
- Improve drift display
- Slightly refactored map display to deal with taller maps more elegantly
- Tweaked main page/about to add announcement
- Bug fix: can't fire at units inside vehicles, only vehicles
- Bug fix: rally selection fix (probably)
- Bug fix: fix problems with weilding enemy infantry weapons
- Bug fix: fix VP not switching after hex vacated due to rout
- Bug fix: fix loadable counters not being in active layer on move
- Bug fix: weapon broken animation should be in location of broken weapon
- Updated 011

## 0.30 alpha

- Bug fix: several weirdnesses from support weapons lying around
- Bug fix: ...finally fix deploy being skipped?
- Addtional minor display tweaks

## 0.29 alpha

- Force reload of game page if loaded version of app is out of date
- Bug fix: can't select close combat in two-player games (combat list doesn't get initiated)
- Bug fix: rally unexpectedly skipped
- Bug fix: rout check description text error

## 0.28 alpha

- Completely refactor action display formatting
- Completely refactor action/phase to much cleaner flow (major changes to close combat, overstacking check in particular)
- Delete all games; new action flow is no longer compatible

## 0.27 alpha

- Fix map display issue on previews

## 0.26 alpha

- Disallow rapid reaction fire
- Put in some general console instrumenting to proactively help identify if I come across any weird states
- Bug fix: refactor some of the state creation (...Why wasn't this a bug before?)
- Bug fix: fix getting stuck on variable weather check
- Bug fix: a bunch of things involving interacting with dropped opponent weapons (this needs to be heavily tested before Pegasus Bridge)

## 0.25 alpha

- Fire for effect/vs hit
- Bug fix: non-move moves (e.g., load only) trigger reaction fire
- Bug fix: fix fire leadership range open hexes/active counters
- Bug fix: don't allow selection of units that can't reaction fire during reaction
- Bug fix: don't display pin for already broken units on morale checks
- Bug fix: fix fire displacement (rare event, not relevant to many scenarios, now testing)
- Updated 002

## 0.24 alpha

- Allow right click actions on move track
- Bug fix: accidentally supressed animations for opposing player in non-hotseat games
- Bug fix: removed double-hit anim
- Bug fix: smoke check action animation

## 0.23 alpha

- Allow right click to select actions
- Allow rollback of last part of move/refactor move action
- Add help overlay for enemy broken units for rout all
- Hiding counters doesn't cancel action (and also hides "action" counter overlay)
- Display/interface tweaks
- Limit username characters (dunno why I never did this before, what was I thinking)

## 0.22 alpha

- Added animated map notifications
- Removed map scroll (never terribly useful, actively annoying on very small screens)
- Bug fix: fix display of feature and marker counters in doc counter section
- Bug fix: fix reaction fire skip on undo
- Bug fix: broken units, etc., should not be multi-selectable
- Bug fix: Fix fire track on reaction fire, plus tweaks
- Updated 411 - better name

## 0.21 alpha

- End game after overstack phase on last turn
- Add pointer cursor to game listing, add extra "button" (though clicking anywhere works)
- Make join button orange (and added a flash)
- Add tweaks to reinforcement panels
- Show reaction fire stacks
- Show fire track
- Fixed a bunch of doc typos
- Bug fix: Disallow fire for units in contact

## 0.20 alpha

- Reaction fire gets bonus to hit
- Completely revamp close combat to make it more...  Dynamic
- Broken infantry units have half firepower (for CC only)
- Stop game on desync (websocket disconnection) with window with reload button

## 0.19 alpha

- Refactor status changes (and fix pinned broken units)
- Wrecked units also show up in casualties
- Fix carried infantry weapons not being dropped when unit eliminated
- Sniper no longer opens unit panel (was opening at the wrong time, but no help relevant and can affect multiple hexes so just skip)
- Skip reaction fire for more units that can't react (units that don't have facing or manning guns)
- Remove smoke as option on reaction fire
- Minor doc and help fixes
- Secondary sorting on ID after size when viewing scenarios for new game
- A few unit name changes, add extra smaller name shrink for a couple particularly long names

## 0.18 alpha

- Updated 008, 302, 305, 406, 408, 502, 504, 604 to beta
- Updated the rest of the scenarios to alpha

## 0.17 alpha

- Stop polling for user rating on scenarios when logged out/don't display
- No links to user profiles when logged out
- Clear session data more cleanly on logout
- Fix issue with prematurely loading units on deploy
- Updated 004, 102 to beta
- Prematurely update 011, 510, 603 to ready

## 0.16 alpha

- Main page tweaks
- Prematurely update 007 to ready
- Prematurely update 508 to ready
- Updated 509 to beta

## 0.15 alpha

- Fire check after morale and sniper checks
- Fix facing on reaction fire against moves and on shorted immobilization
- Improve reporting on armor facing fire attacks
- Various documentation fixes
- Tweak drift roll table
- Prematurely update 003 to ready
- Prematurely update 005 to ready
- Prematurely update 308 to ready

## 0.14 alpha

- Allow logged out users to see scenarios
- Prematurely update 002 to ready
- Prematurely update 303 to ready
- Prematurely update 503 to ready

## 0.13 alpha

- Split dev and admin, update profile page, allow admins to create devs
- Prematurely turn on patreon links and the like

## 0.12 alpha

- Add email notifications for signup codes/lost passwords
- Tweaks to email implementation/feedback page/signup flow

## 0.11 alpha

- Add email support/feedback page for testing

## 0.10 alpha

Arbitrary starting server version.
