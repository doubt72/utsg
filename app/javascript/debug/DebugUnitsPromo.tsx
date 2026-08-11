import React, { useEffect, useState } from "react";
import { getAPI } from "../utilities/network";
import CounterDisplay from "../components/game/CounterDisplay";
import Unit, { UnitData } from "../engine/Unit";
import Marker, { MarkerData } from "../engine/Marker";
import Feature, { FeatureData } from "../engine/Feature";


export default function DebugUnitsPromo() {
  const [units, setUnits] = useState<{ [index: string]: UnitData }>({})

  useEffect(() => {
    getAPI("/api/v1/scenarios/all_units", {
      ok: respons => respons.json().then(json => { setUnits(json) })
    })
  }, [])

  const keysTier: { [index: string]: boolean } = {
    ussr_militia_s: true,
    jap_snlf_s: true,
    usa_ranger_s: true,
    uk_sherman_firefly: true,
    ger_tiger_ii: true,
  }

  const keysPromo: { [index: string]: boolean } = {
    uk_sherman_firefly: true,
    usa_ranger_s: true,
    ger_8_8cm_flak_36: true,
    ger_stug_iii_f_g: true,
    ussr_t_34_85: true,
    ger_tiger_ii: true,
    usa_gmc_dukw: true,
    usa_m3_half_track: true,
  }

  const keysPromo2: { [index: string]: boolean } = {
    jap_snlf_s: true,
    usa_gmc_cckw: true,
    fra_brandt_m1935: true,
    fra_char_b1_bis: true,
    ger_panzerschreck: true,
    uk_churchill_crocodile: true,
    uk_matilda_ii: true,
  }

  const rowTop: { [index: string]: boolean } = {
    uk_sherman_firefly: true,
    usa_ranger_s: true,
    ger_8_8cm_flak_36: true,
    ger_stug_iii_f_g: true,
  }

  const rowTop2: { [index: string]: boolean } = {
    usa_gmc_cckw: true,
  }

  const rowBottom: { [index: string]: boolean } = {
    fra_brandt_m1935: true,
    ussr_t_34_85: true,
  }

  const rowBottom2: { [index: string]: boolean } = {
    fra_char_b1_bis: true,
  }

  const rowBottom3: { [index: string]: boolean } = {
    ger_tiger_ii: true,
    jap_snlf_s: true,
  }

  const keysPromoMaybe: { [index: string]: boolean } = {
    usa_m3_half_track: true,
    ussr_militia_s: true,
    uk_sherman_firefly: true,
    usa_ranger_s: true,
    ger_8_8cm_flak_36: true,
    ger_stug_iii_f_g: true,
    ussr_t_34_85: true,
    usa_gmc_cckw: true,
    uk_universal_carrier: true,
    uk_churchill_crocodile: true,
    usa_gmc_dukw: true,
    fra_brandt_m1935: true,
    fra_char_b1_bis: true,
    ger_panzerschreck: true,
    ussr_guards_smg_s: true,
    ussr_kv_1_m39: true,
    uk_gurkha_s: true,
    uk_matilda_ii: true,
    uk_piat: true,
    usa_jeep__50_mg: true,
    ger_panther_a_g: true,
    ger_pzkpfw_iv_h_j: true,
    ger_vw_kubelwagen: true,
    ger_tiger_ii: true,
    jap_snlf_s: true,
    jap_bicycle: true,
    fin_sissi_s: true,
  }

  const cells = (keys: { [index: string]: boolean }, pad: boolean) => {
    const cells: JSX.Element[] = []
    Object.keys(units).filter(u => !!keys[u]).map(
      (k, j) => cells.push(svgContainer(makeUnit(units[k]), j, pad))
    )
    return cells
  }

  const svgContainer = (unit: Unit | Marker | Feature | undefined, key: number, pad: boolean) => {
    if (!unit) { return <></> }
    const fullKey = `${unit.id}-${key}`
    return <div key={fullKey} style={{ padding: pad ? "8px" : "0px" }}>
        <CounterDisplay unit={unit} />
      </div>
  }

  const makeUnit = (data: UnitData | FeatureData | MarkerData): Unit | Marker | Feature | undefined => {
    if (data.ft) {
      return new Feature(data)
    } else if (data.mk) {
      return new Marker(data)
    } else {
      return new Unit(data)
    }
  }

  return (
    <div>
      <div className="p1em flex flex-wrap">
        {cells(keysTier, true)}
      </div>
      <div className="p1em flex flex-wrap">
        {cells(keysPromo, true)}
      </div>
      <div className="p1em flex flex-wrap">
        {cells(keysPromo2, true)}
      </div>
      <div className="p1em flex flex-wrap">
        {cells(rowTop, false)}
        {cells(rowTop2, false)}
      </div>
      <div className="p1em flex flex-wrap">
        {cells(rowBottom, false)}
        {cells(rowBottom2, false)}
        {cells(rowBottom3, false)}
      </div>
      <div className="p1em flex flex-wrap">
        {cells(keysPromoMaybe, false)}
      </div>
    </div>
  )
}
