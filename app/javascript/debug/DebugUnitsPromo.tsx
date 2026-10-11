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

    wire: true,
    at_mines10: true,
    tanktrap: true,
    sniper5: true,
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
        {cells({ usa_ranger_s: true }, false)}
        {cells({ ger_stug_iii_f_g: true }, false)}
        {cells({ fra_brandt_m1935: true }, false)}
        {/* {cells({ usa_m3_half_track: true }, false)} */}
        {cells({ jap_snlf_s: true }, false)}
        {cells({ ger_8_8cm_flak_36: true }, false)}
        {cells({ uk_sherman_firefly: true }, false)}
        {/* {cells({ ussr_t_34_85: true }, false)} */}
        {/* {cells({ ger_tiger_ii: true }, false)} */}
        {/* {cells({ usa_gmc_dukw: true }, false)} */}
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
