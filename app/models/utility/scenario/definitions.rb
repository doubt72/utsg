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
        { name: "Chinese", code: "chi", nations: ["chi"] },
        { name: "Minor Powers", code: "alm", nations: %w[pol gre nor bel dut yug] },
      ].freeze

      AVAILABLE_AXIS_FACTIONS = [
        # Currently supported factions
        { name: "German", code: "ger", nations: ["ger"] },
        { name: "Italian", code: "ita", nations: ["ita"] },
        { name: "Japanese", code: "jap", nations: ["jap"] },
        { name: "Finnish", code: "fin", nations: ["fin"] },
        { name: "Minor Powers", code: "axm", nations: %w[pol gre nor bel dut yug] },
      ].freeze
    end
  end
end
