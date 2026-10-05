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
          nations: %w[pol gre nor bel dut yug eth bol cze fin], # includes fin
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
          nations: %w[hun bul rom slv cro nsp par vcf], # includes vcf
        },
      ].freeze

      def code_to_search(code) # rubocop:disable Metrics/MethodLength
        {
          "ussr" => "Soviet Union",
          "usa" => "American",
          "bra" => "Brazilian",
          "uk" => "British",
          "can" => "Canadian",
          "aus" => "Australian",
          "nz" => "New Zealand",
          "ind" => "Indian",
          "sa" => "South African",
          "fra" => "French",
          "frf" => "Free French",
          "chi" => "Chinese",
          "pol" => "Polish",
          "gre" => "Greek",
          "nor" => "Norwegian",
          "bel" => "Belgian",
          "dut" => "Dutch",
          "yug" => "Yugoslavian",
          "fin" => "Finnish",

          "rsp" => "Republican Spain",
          "eth" => "Ethiopian",
          "bol" => "Bolivian",
          "chb" => "Beiyang Chinese",

          "un" => "United Nations",
          "sk" => "South Korean",
          "doi" => "Indian",
          "isr" => "Israeli",

          "cze" => "Czeckoslovakian",

          "ger" => "German",
          "ita" => "Italian",
          "jap" => "Japanese",
          "hun" => "Hungarian",
          "bul" => "Bulgarian",
          "rom" => "Romanian",
          "slv" => "Slovakian",
          "cro" => "Croatian",
          "vcf" => "Vichy French",

          "nsp" => "Nationalist Spain",
          "chc" => "Communist Chinese",
          "par" => "Paraguayan",
          "chg" => "Beiyang Chinese",

          "nk" => "North Korean",
          "vie" => "Viet Minh;Vietminh;Vietnamese",
          "pak" => "Pakistani",
          "syr" => "Syrian",
          "jor" => "TransJordanian",
          "egy" => "Egyptian",
        }[code] || ""
      end
    end
  end
end
