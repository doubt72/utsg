# frozen_string_literal: true

module Utility
  class Scenario
    module Definitions
      AVAILABLE_ALLIED_FACTIONS = [
        # Current supported factions
        { name: "Soviet", code: "ussr", nations: ["ussr"] },
        { name: "Commonwealth", code: "uk", nations: %w[uk can aus nz ind sa] },
        { name: "American", code: "usa", nations: %w[usa bra] },
        { name: "French", code: "fra", nations: %w[fra frf] },
        { name: "Chinese", code: "chi", nations: %w[chi chb] },
        # { name: "United Nations", code: "un", nations: %w[un sk] },
        # ...Do we really need these? -- minors instead
        # { name: "Republican", code: "rsp", nations: ["rsp"] },
        # { name: "Indian (Dominion/Republic)", code: "doi", nations: ["doi"] },
        # { name: "Israeli", code: "isr", nations: ["isr"] },
        {
          name: "Minor Powers", code: "alm",
          nations: %w[pol gre nor bel dut yug eth bol cze],
        },
      ].freeze

      AVAILABLE_AXIS_FACTIONS = [
        # Currently supported factions
        { name: "German", code: "ger", nations: ["ger"] },
        { name: "Italian", code: "ita", nations: ["ita"] },
        { name: "Japanese", code: "jap", nations: ["jap"] },
        # ...Move this to minors? (anything > 5 scenarios = include here)
        { name: "Finnish", code: "fin", nations: ["fin"] },
        # { name: "Chinese", code: "chb", nations: ["chb2 chg"] },
        # { name: "Communist", code: "com", nations: %w[ussr chc nk vie] },
        # { name: "Nationalist", code: "nsp", nations: ["nsp"] },
        # ...Do we really need these? -- minors instead
        # { name: "Pakistani", code: "pak", nations: ["pak"] },
        # { name: "Arab League", code: "arl", nations: %w[syr jor egy] },
        {
          name: "Minor Powers", code: "axm",
          nations: %w[hun bul rom slv cro nsp par],
        },
      ].freeze
    end
  end
end
