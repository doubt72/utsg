import React, { useEffect, useState } from "react";
import Header from "./Header";
import ChatDisplay from "./ChatDisplay";
import { CreateGameButton, ScenariosButton } from "./utilities/buttons";
import GameList from "./GameList";
import { titleNameStyle } from "./Utilities";
import { useLocation, useNavigate } from "react-router-dom";
import Feature, { FeatureData } from "../engine/Feature";
import Marker, { MarkerData } from "../engine/Marker";
import Unit, { UnitData } from "../engine/Unit";
import { getAPI } from "../utilities/network";
import Counter from "../engine/Counter";
import MapCounter from "./game/map/MapCounter";

const sampleUnitData: { [index: string]: boolean } = {
  alm_zb_vz__30: true,
  alm_wz__35_at_rifle: true,
  alm_bofors_37mm_at: true,
  alm_lt_vz__38: true,
  alm_horse: true,
  axm_42m_toldi_iia: true,
  chi_type_triple_ten: true,
  chi_vickers_6_ton: true,
  chi_bofors_75mm: true,
  fin_sissi_s: true,
  fin_mc: true,
  fra_legionnaire_s: true,
  fra_brandt_m1935: true,
  fra_75mm_m1897: true,
  fra_char_b1_bis: true,
  ger_pionier_s: true,
  ger_volksgrenadier_s: true,
  ger_gebirgsjager_s: true,
  ger_mg_42: true,
  ger_8_8cm_flak_36: true,
  ger_stug_iii_f_g: true,
  ger_panzerschreck: true,
  ger_panther_d: true,
  ger_pzkpfw_iv_f2: true,
  ger_tiger_ii: true,
  ger_jagdtiger: true,
  ger_marder_iii: true,
  ger_sdkfz_221: true,
  ger_sdkfz_234_1: true,
  ger_sdkfz_251_1: true,
  ger_vw_kubelwagen: true,
  ita_bersaglieri_s: true,
  ita_bande_s: true,
  ita_m11_39: true,
  ita_l3_35: true,
  ita_autoblindo_41: true,
  jap_snlf_s: true,
  jap_crew_t: true,
  jap_type_89_gren_l: true,
  jap_type_95_ha_go: true,
  jap_bicycle: true,
  uk_gurkha_s: true,
  uk_airborne_s: true,
  uk_piat: true,
  uk_vickers_mg: true,
  uk_qf_6pdr_mk_iv: true,
  uk_matilda_ii: true,
  uk_sherman_firefly: true,
  uk_churchill_crocodile: true,
  uk_universal_carrier: true,
  uk_kangaroo: true,
  usa_ranger_s: true,
  usa_marine_rifle_s: true,
  usa_radio_155mm: true,
  usa_m4_sherman: true,
  usa_m3a1_stuart_ft: true,
  usa_m18_hellcat: true,
  usa_jeep__50_mg: true,
  usa_m3a1_half_track: true,
  usa_lvta_2: true,
  usa_gmc_cckw: true,
  usa_gmc_dukw: true,
  ussr_guards_smg_s: true,
  ussr_militia_s: true,
  ussr_tank_crew_t: true,
  ussr_kv_1_m39: true,
  ussr_t_34_85: true,
  ussr_is_2: true,
  ussr_su_76m: true,
  ussr_isu_122: true,
  vcf_renault_ft: true,
}

type CounterDisplay = {
  from: string,
  toward: string,
  opacity: number,
}

export default function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [units, setUnits] = useState<{ [index: string]: UnitData | FeatureData | MarkerData }>({})
  const [counters, setCounters] = useState<CounterDisplay[]>([])
  const [counterDisplay, setCounterDisplay] = useState<JSX.Element | undefined>()
  const [update, setUpdate] = useState<number>(0)

  const counterCount = 6

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: response => response.json().then(json => {
        setUnits(json)
        setCounters([
          {from: "wire", toward: "usa_ranger_s", opacity: 1},
          {from: "wire", toward: "ger_stug_iii_f_g", opacity: 1},
          {from: "wire", toward: "uk_sherman_firefly", opacity: 1},
          {from: "wire", toward: "jap_snlf_s", opacity: 1},
          {from: "wire", toward: "ussr_t_34_85", opacity: 1},
          {from: "wire", toward: "ger_tiger_ii", opacity: 1},
        ])
      })
    })
  }, [])

  useEffect(() => {
    history.pushState(null, "", location.pathname)
    const handlePopState = () => { history.pushState(null, "", location.pathname) }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [navigate, location])

  useEffect(() => {
    if (localStorage.getItem("validationNeeded")) {
      navigate("/verify_account", { replace: true });
    }
  }, []);

  const newGameButton = (
    <div className="main-page-start-game">
      <span className="red font11em">&gt; &gt; &gt; &gt; &gt;</span> <CreateGameButton />
    </div>
  );

  const seeScenariosButton = (
    <div className="main-page-start-game">
      <span className="red font11em">&gt; &gt; &gt; &gt; &gt;</span> <ScenariosButton />
    </div>
  );

  const loggedIn = !!localStorage.getItem("username")

  const makeUnit = (data: UnitData | FeatureData | MarkerData): Unit | Marker | Feature | undefined => {
    if (!data) { return }
    if (data.ft) {
      return new Feature(data)
    } else if (data.mk) {
      return new Marker(data)
    } else {
      return new Unit(data)
    }
  }

  const svgContainer = (
    unit: Unit | Marker | Feature | undefined, unit2: Unit | Marker | Feature | undefined,
    key: string, fade: number
  ) => {
    if (!unit || !unit2) { return <></> }
    const fullKey = `${unit.id}-${key}`
    return  <div key={fullKey} style={{padding: "0.1rem"}} >
              <svg height="84" width="84" viewBox="0 0 84 84">
                <g opacity={1 - fade}>
                  <MapCounter counter={new Counter(undefined, unit)} ovCallback={() => {}} />
                </g>
                <g opacity={fade}>
                  <MapCounter counter={new Counter(undefined, unit2)} ovCallback={() => {}} />
                </g>
              </svg>
           </div>
  }

  const nextStep = (index: number) => {
    setCounters(s => {
      const o = s[index].opacity
      if (o >= 1) {
        while (index === index) {
          const next = Math.floor(Math.random() * counterCount)
          if (next === index) { continue}
          let done = false
          let key = ""
          while (!done) {
            const keys = Object.keys(sampleUnitData)
            key = keys[Math.floor(Math.random() * keys.length)]
            if (Math.random() * 10 < 1) {
              const all = Object.keys(units)
              key = all[Math.floor(Math.random() * all.length)]
            }
            done = true
            // Skip the following countries until we add scenarios
            const exclNations = [
              "rsp", "nsp", "eth", "chb", "chg", "chc", "bol", "par", "un", "sk", "doi", "pak",
              "vie", "isr", "egy", "jor", "syr", "com", "arl"
            ]
            for (const d of s) {
              if (d.from === key || d.toward === key) { done = false }
              // Add more equivalents as necessary
              if (units[key].mk) {
                const data = units[key] as MarkerData
                if (exclNations.includes(data.v as string)) { done = false }
                if (exclNations.includes(data.v2 as string)) { done = false }
                if (exclNations.includes(data.nation as string)) { done = false }
                if (data.type === (units[d.toward] as MarkerData).type) { done = false }
              }
              if (!units[key].mk && !units[key].ft) {
                const data = units[key] as UnitData
                const data2 = units[d.toward] as UnitData
                const c1 = data.c === "vcf" ? "fra" : data.c
                const c2 = data2.c === "vcf" ? "fra" : data2.c
                if (c1 === c2) { done = false }
                if (exclNations.includes(data.c)) { done = false }
                if (data.d) { done = false }
              }
              if (units[key].ft !== undefined && units[d.toward].ft !== undefined) { done = false }
            }
          }
          setTimeout(() => nextStep(next), 4000)
          return [ ...s.slice(0, next), { from: s[next].toward, toward: key, opacity: 0}, ...s.slice(next + 1) ]
        }
      }
      setTimeout(() => nextStep(index), 25)
      return [ ...s.slice(0, index), { ...s[index], opacity: o + 0.1 }, ...s.slice(index + 1) ]
    })
    setUpdate(s => s+1)
  }

  useEffect(() => {
    if (Object.keys(units).length < 1) { return }
    nextStep(Math.floor(Math.random() * counterCount))
  }, [units])

  useEffect(() => {
    setCounterDisplay(
      <div className="mr1em flex nowrap">
        { counters.map((c, i) => {
          return svgContainer(makeUnit(units[c.from]), makeUnit(units[c.toward]), `${i}-1`, c.opacity)
        }) }
      </div>
    )
  }, [units, update])

  return (
    <div className="main-page home-page">
      <Header />
        <div className="main-page-welcome">
          { counterDisplay }
          <div className="flex-fill"></div>
          <div>
            <p>
              Welcome to the <strong>{titleNameStyle}</strong> server!  The server is currently
              in beta as I continue to shake things down, work out the bugs, and test the scenarios.  See
              the <a className="regular" href="/about">about</a> page for more information
              about the server, the code of conduct, or to report bugs.
            </p>
            <p>
              Best with Chromium-based browsers; it should work with any modern browser, but
              rendering performance can vary significantly.
            </p>
          </div>
        </div>
        <div className="flex ml05em mr05em mb1em">
          <div className={`main-page-chat-section${loggedIn ? "" : " main-page-chat-section-logged-out"}`}>
            <ChatDisplay gameId={0} showInput={loggedIn} desyncCallback={() => {}} />
          </div>
          <div>
            <div className="main-page-announcements">
              <p>
                <strong>Latest announcement</strong>: <a className="regular" href="/about/a20261002">
                  A Belated Update
                </a>
              </p>
              <p>
                View a video <a className="regular" href="https://youtu.be/0wJj1YgMCVc">tutorial</a>,{" "}
                <a className="regular" href="https://youtu.be/iJUNHKPXRaw">video</a>{" "}
                <a className="regular" href="https://youtu.be/KuXc-RpKwNk">playthroughs</a> of the game, or{" "}
                check out the <a className="regular" href="/help">documentation</a>.
              </p>
              <p>
                Join us on <a className="regular" href="https://discord.gg/URDcFwNGA7">Discord</a>.
              </p>
              {/* <p>
                Support the work (and/or my mild coffee addiction)
                on <a className="regular" href="https://www.patreon.com/cw/u43420358">Patreon</a> or
                on <a className="regular" href="https://ko-fi.com/doub72">Ko-fi</a> or
                maybe just <a className="regular" href="https://buymeacoffee.com/doubt72">Buy Me a Coffee</a>.
              </p> */}
              { loggedIn ?
                <p>
                  Create new game below to start.
                </p> :
                <p>
                  Sign up (or sign in) above to start.
                </p> }
            </div>
            {loggedIn ? newGameButton : seeScenariosButton}
          </div>
        </div>
      <GameList />
    </div>
  );
}
