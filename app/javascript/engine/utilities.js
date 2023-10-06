const alliedCodeToName = (code) => {
  const lookup = [
    { name: "Soviet", code: "ussr" },
    { name: "American", code: "usa" },
    { name: "British", code: "uk" },
    { name: "U.S. Marines", code: "usm" },
    { name: "Commonwealth", code: "com" },
    { name: "French", code: "fra" },
    { name: "Polish", code: "pol" },
    { name: "Greek", code: "gre" },
    { name: "Norwegian", code: "nor" },
    { name: "Chinese", code: "chi" },
    { name: "Philippine", code: "phi" },
    { name: "Dutch", code: "net" },
    { name: "Belgian", code: "bel" },
    { name: "Yugoslav", code: "yug" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

const axisCodeToName = (code) => {
  const lookup = [
    { name: "German", code: "ger" },
    { name: "Italian", code: "ita" },
    { name: "Japanese", code: "jap" },
    { name: "Finnish", code: "fin" },
    { name: "Romanian", code: "rom" },
    { name: "Bulgarian", code: "bul" },
    { name: "Hungarian", code: "hun" },
    { name: "Slovakian", code: "slo" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

export { alliedCodeToName, axisCodeToName }