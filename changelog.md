# 0.105


- Updated 304

# 0.104

- Refactored immobilization
  - Immobilized vehicles now drop any units they are carrying (new rule)
- Bug fix/change: units should not be able to fire from vehicles (except radios)
- Bug fix: support weapons should not be able to be fired when in contact with opponent units
- Bug fix: don't allow multiselect for assault with unit with zero movement
- Bug fix: don't use red text for unarmored vehicles with jammed weapons
- Bug fix: artillery drift hitting friendly units should not toggle player for morale check rolls
- Updated 406

# 0.103

- Rearrange the ratings and balance to top of the scenario display
- Add victory point hexes to terrain help
- Updated 604

# 0.102

- Support for additional factions (interwar, cold war, hypothetical)
- Bug fix: MG should not hold VP when assault moving out
- Updated 203 to release

# 0.101

- Added mines with different FP
- Downgraded 305, 408, 502, 604 to alpha
- Updated 008, 104, 304, 406

# 0.100

- Bug fix: sniper check should check leader last in stack
- Bug fix: sniper check should not switch players on reaction fire
- Bug fix: reaction fire not consistently triggering sniper
- Bug fix: routs should use road cost when base terrain cost > 1
- Bug fix: fix crash on second tab open on same game (is this really a real issue?  Ehhh, well, I dunno, need to keep an eye on other things that can happen here too.)
- Updated 203

# 0.99

- Add new announcement/links to playthroughs
- Updated 102, moved to release

# 0.98

- Slightly cleaner notification tweak
- Bug fix: should say half range or less, not less than half range in help
- Bug fix: previous fix broke solo games, tweak fix
- Updated 102

# 0.97

- Some refactoring of scenario designer
- Bug fix: not exactly a bug, but streamline notifications and also switch skipping reaction fire when invalid to inactive player to avoid issues of stalling async games for no reason/giving turn notifications for no reason

# 0.96

- Changed rule so no entrenchment in mud (not just snow)
- Moved window to calculated location based on window height
- Switch name to game name on new game form
- Add pointer cursor to scenario selection row
- Major documentation updates/refactoring
- Bug fix: radios should not be able to be picked up by opponent
- Bug fix: fix rapid fire animations and action string
- Bug fix: incendiary infantry weapons should be eliminated when carrying eliminated

# 0.95

- Bug fix: fix shadows on reinforcement panel when map rotated
- Bug fix: switching reinforcement planel should reset position
- Bug fix: fix missing blocked LOS by edges for a few buildings types
- Updated 102
- Moved 006 to release

# 0.94

- Tweaked animation placement
- Bug fix: actually fix reinforcement panel opening in minimap
- Bug fix: don't flip VP control on rout if other units can hold it
- Bug fix: fix shift on hex overlay numbers/letters when map rotated
- Bug fix: fix cases where animations got hidden behind dice generation

# 0.93

- Change immobilized vehicle close combat firepower to 1 (and update docs)
- Various artifacts related to map rotation
  - Remember setting on reload
  - Clean up animation alignment
  - Update docs
  - Bug fix: move/rout track lines offset in wrong direction
  - Bug fix: direction arrow in counter badges
  - Bug fix: some shadows are wrong direction(s)
  - Bug fix: wrecks in direction of turret
  - Bug fix: rotate action buttons on move track and fix/refactor menu/tooltip placement/rotation
- Bug fix: prevent automatic opening reinforcement panel in minimap
- Bug fix: refactor/implement various special rules properly (never got around to most of them before)
- Bug fix: fix minor nation vehicle casualties/scoring
- Bug fix: should not be able to target wrecks
- Bug fix: catastrophic weapon repair check should only destroy weapon, not vehicle

# 0.92

- Allow ability to rotate the map (first pass)
- Open reinforcement panel when undoing deployment/selecting unit
- Update admin game listing page to have list of just two-player/finished games
- Updated 006 (fixed map)

# 0.91

- Reset counters/overlay to show counters and unit overlays when current user's turn
- Vehicles don't get free repairs with leader in hex, now count as single repair attempt
- Undeploy tweaks:
  - Don't select unit when undeploying
  - Add warning when undeploy will leave crewed/support weapon unassigned
  - Bug fix: selection of turreted units selected marker instead of unit during deploy phase
  - Bug fix: replace unit at same index instead of top of stack when undoing
- Bug fix: stack size broken by hull markers
- Bug fix: should not be able to combine fire with unmanned operated units
- Bug fix: prevent assault moves into blazes
- Bug fix: fixes to updates on fire displacement (wasn't allowing displace to complete)
- Bug fix: fix premature skip to next phase when fire spread finished but displacement still needed

# 0.90

- Show faction name instead of axis or allies
- Updated 301

# 0.89

- Contol key closes overlay
- Change tired movement to half rounded down instead of -2
- Don't apply leader movement bonus if unit starts at 0

# 0.88

- Move turn notifications to back end where it always should have been

# 0.87

- Dissipate changed to disperse in one place
- Change message when needing to choose which unit is picking up another unit
- Slightly slow down error messages/tweak display
- Remove some instrumentation that isn't needed anymore
- Bug fix: turn notification not always firing; code simplified and fixed
- Bug fix: fix premature end selection when firing tired unit and machine gun
- Updated 308

# 0.86

- Reverse order of routing in rout-all in case of rally
- Bug fix: minor nation split team doesn't properly duplicate player nation
- Bug fix: gun turn not turning
- Updated 503

# 0.85

- Tweak deploy actions
- Add some credits

# 0.84

- Add ability to cancel/delete games before they start
- Changed mind on ability to pick up weapons when rushing -- it's no longer forbidden
- Refactor rout all to implement new rules
- Bug fix: opponent units should not get leader bonus during morale checks in shared hex
- Bug fix: undeploy button not displaying after all units deployed
- Updated 601, 602

# 0.83

- Updated 401

# 0.82

- Updated tutorial link

# 0.81 Beta

- Added tutorial link
- Toned down artillery drift slightly
- Bug fix: one last subtle bug with drift logic for off-board artillery, added additional test coverage; previous bugs were display-only but game-breaking
- Updated 401

# 0.80 Beta

- Bug fix: more changes for off-board artillery

# 0.79 Beta

- Bug fix: handle display of drift off-board in second location

# 0.78 Beta

- Dynamically resize interface components when selecting interface scale buttons
- Bug fix: unselect units when closing reinforcement panel (only affected auto-open, the most important case)
- Bug fix: handle display of drift off-board

# 0.77 Beta

- Exclude other player's solo games from the main page display

# 0.76 Beta

- Tweaks to copy
- Some game cleanup of old scenarios
- Updated 601

# 0.75 Beta

- More work on scenario designer
- Add ability to suppress help overlays
- Bug fix: no notification on finished games (but only notifying because old game was broken, technically)

## 0.74 Beta

- More work on scenario designer
- Updated 510

## 0.73 Beta

- Added scenario design page (which is still empty, though)
- More ostentatious scroll buttons
- Minor display tweaks/typo fixes
- Added tooltip with special rules
- Bug fix: don't show cancel on forced routs
- Bug fix: fix loss selections not being cleared
- Bug fix: a bit of cleanup on rally/repair (disallow unmanned weapon repair)

## 0.72 Beta

- Bug fix: another close combat issue

## 0.71 Beta

- Server tweaks
- Added a discord, this commit is also testing the webhook
- Bug fix: minor display issue with header collapse button when layout collapsed

## 0.70 Beta

- Bug fix: fix hanging tooltip when reconfiguring layout
- Bug fix: move paths sometimes not getting updated after opponent moves
- Bug fix: undoing move should reset sniper check
- Bug fix: only show resign if game in progress
- Updated 002

## 0.69 Beta

- Bug fix: fix for previous CC fix

## 0.68 Beta

- Leader can hold but not capture VPs
- Bug fix: CC with no casualties not being properly detected as complete

## 0.67 Beta

- Beta release / update announcements
- Bug fix: css class was incorrect for vertical controls during turn alert
- Bug fix: split/join shouldn't count for route enemy check...
- Bug fix: ...or double-pass main phase end check
- Updated 002
- Upgraded 006, 203 to beta
- Downgraded 406, 509 to alpha

## 0.66 Alpha

- Add turns to deployment phase notifications
- Bug fix: should not be able to pick up weapon when out of movement
- Bug fix: don't clear deployment done state when closing reinforcement panel (causes first "deploy finished" click to do nothing)

## 0.65 Alpha

- Major changes to game UI: allow moving control bar to left, allow hiding header
- Bug fix: splitting last squad in deploy should clear deploy state

## 0.64 Alpha

- Bug fix: got stuck in deploy (needed to be more careful with state setting)
- Bug fix: repair counter button not working (typo)

## 0.63 Alpha

- Add deployment confirmation
- Regularize/add symbols for action buttons on counters/map
- Delete (some more) games, clean up scenarios

## 0.62 Alpha

- Finish email notifications / allow notification toggle
- Allow undeploy of deployed features
- Bug fix: pinned parents of operated vehicles should not trigger reaction fire
- Delete (some) games, clean up scenarios
- Updated 603

## 0.61 Alpha

- Major selection refactor to improve performance, make UX changes cleaner
- Add ability to start/complete/cancel/etc for fire/move/assault/rout/etc from counter overlay
- Add ability to finish/cancel for move/assault/displace from map
- Added sound/visual bell when switching to current player
- Improve dragging of reinforcement panel
- Add LOS hexes for reaction fire but red
- Mines and wire show all movement, not cost
- Only active player should be able to resign
- Bug fix: help no longer causes counter overlay to close with accidental mouseovers on slower displays
- Bug fix: prevent clicking on move track if moving to current or illegal hex
- Bug fix: operated movement should not be affected by tired status

## 0.60 Alpha

- Add "still" notification animations for safari
- Sort wrecks to bottom of stack
- Additional/better instrumentation to close combat checks to help debug future close combat issues
- Bug fix: another issue with close combat not setting correctly in multiplayer games under certain conditions
- Bug fix: unexpected confusion when unit can pick up more than one unit
- Bug fix: undeploy right click menu
- Bug fix: fix default sort
- Bug fix: wrecks should not trigger reaction fire
- Bug fix: wrecks should not trigger close combat
- Bug fix: firing not respecting armor arcs since ghost changes
- Updated 503

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
