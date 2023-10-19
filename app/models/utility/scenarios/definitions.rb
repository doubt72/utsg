# frozen_string_literal: true

module Utility
  module Scenarios
    module Definitions
      AVAILABLE_ALLIED_FACTIONS = [
        # Current supported factions
        { name: "American", code: "usa" },
        { name: "British", code: "uk" },
        { name: "Soviet", code: "ussr" },

        # Likely future factions
        # { name: "French", code: "fra" },
        # { name: "Chinese", code: "chi" },

        # Possible future factions
        # { name: "Polish", code: "pol" },
        # { name: "Greek", code: "gre" },
        # { name: "Norwegian", code: "nor" },
        # { name: "Philippine", code: "phi" },
        # { name: "Dutch", code: "net" },
        # { name: "Belgian", code: "bel" },
        # { name: "Yugoslav", code: "yug" },
      ].freeze

      AVAILABLE_AXIS_FACTIONS = [
        # Currently supported factions
        { name: "German", code: "ger" },
        { name: "Italian", code: "ita" },
        { name: "Japanese", code: "jap" },

        # Likely future factions

        # Possible future factions
        # { name: "Finnish", code: "fin" },
        # { name: "Romanian", code: "rom" },
        # { name: "Bulgarian", code: "bul" },
        # { name: "Hungarian", code: "hun" },
        # { name: "Slovakian", code: "slo" },
      ].freeze
    end
  end
end
