const alliedCodeToName = (code) => {
  const lookup = [
    { name: "Soviet", code: "ussr" },
    { name: "American", code: "usa" },
    { name: "British", code: "uk" },
    { name: "French", code: "fra" },
    { name: "Allied", code: "alm" },
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
    { name: "Axis", code: "axm" },
  ]

  for (const rec of lookup) {
    if (rec.code === code) {
      return rec.name
    }
  }

  return "Unknown"
}

const getFormattedDate = (date) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"    
  ]
  
  return `${months[date.getMonth() - 1]} ${date.getDate()}, ${date.getFullYear()}`
}

export { alliedCodeToName, axisCodeToName, getFormattedDate }