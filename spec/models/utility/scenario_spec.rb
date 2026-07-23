# frozen_string_literal: true

require "rails_helper"

RSpec.describe Utility::Scenario do
  let(:scenario_name) { "xxx Spec Test xxx" }

  before :all do
    unless defined?(Scenarios::Scenario000)
      class Scenarios::Scenario000 < Scenarios::Base # rubocop:disable Style/ClassAndModuleChildren
        ID = "000"
        NAME = "xxx Spec Test xxx"
        ALLIES = %w[uk usa].freeze
        AXIS = %w[ger ita].freeze
        DATE = [1941, 6, 15].freeze
        LAYOUT = [15, 23, "x"].freeze
        ALLIED_UNITS = {}.freeze
        AXIS_UNITS = {}.freeze
        STATUS = "p"

        class << self
          def generate
            {}
          end
        end
      end
    end
  end

  it "gets correct scenario from get_scenario" do
    expect(described_class.scenario_by_id("000")[:name]).to be == scenario_name
  end

  describe "all_scenarios" do
    it "gets all scenarios with no filters" do
      scenarios = described_class.all_scenarios({ "status" => "*" })

      length = described_class.all_scenarios({ "status" => "p*" }).filter do |s|
        s[:status] != "p"
      end.length

      expect(scenarios.length).to be == length
    end

    it "gets all scenarios with no filters (admin view)" do
      scenarios = described_class.all_scenarios({ "status" => "p*" })
      expect(scenarios.length).to be == Scenarios.constants.length - 2
    end

    it "gets spec scenario when filtering by string" do
      scenarios = described_class.all_scenarios({ "string" => scenario_name, "status" => "p*" })
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "000"
    end

    it "gets correct scenarios with allies filter" do
      scenarios = described_class.all_scenarios({ "allies" => "usa", "status" => "p*" })
      scenarios.each do |s|
        expect(s[:allies].include?("usa") || s[:allies].include?("bra")).to be true
      end
      scenarios.select! { |s| s[:id] == "000" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "000"
    end

    it "gets correct scenarios with axis filter" do
      scenarios = described_class.all_scenarios({ "axis" => "ger", "status" => "p*" })
      scenarios.each do |s|
        expect(s[:axis].include?("ger")).to be true
      end
      scenarios.select! { |s| s[:id] == "000" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "000"
    end
  end

  context "validate all records" do
    it "there are no duplicate IDs" do
      scenarios = described_class.all_scenarios({ "status" => "p*" })
      all_ids = scenarios.map { |s| s[:id] }

      expect(all_ids.length).to be == all_ids.sort.uniq.length
    end

    described_class.all_scenarios({ "status" => "p*" }).each do |scenario|
      describe "scenario #{scenario[:id]}" do
        it "has valid attributes" do
          expect(scenario[:id]).not_to be_empty
          expect(scenario[:name]).not_to be_empty
          expect(scenario[:string]).to be_nil
        end

        it "has valid allied forces" do
          expect(scenario[:allies].length).to be > 0
          scenario[:allies].each do |force|
            allies = described_class::Definitions::AVAILABLE_ALLIED_FACTIONS.map do |f|
              f[:nations]
            end.flatten
            expect(allies.include?(force)).to be true
          end
        end

        it "has valid axis forces" do
          expect(scenario[:axis].length).to be > 0
          scenario[:axis].each do |force|
            axis = described_class::Definitions::AVAILABLE_AXIS_FACTIONS.map do |f|
              f[:nations]
            end.flatten
            expect(axis.include?(force)).to be true
          end
        end

        it "has valid units" do
          current_scenario = described_class.scenario_by_id(scenario[:id])

          metadata = current_scenario[:metadata]
          expect(metadata[:allied_units].length).to be > 0
          metadata[:allied_units].each_value do |turn|
            expect(turn[:list]&.is_a?(Array)).to be true
            turn[:list].each do |unit|
              expect(unit).not_to have_key :not_found
            end
          end

          expect(metadata[:axis_units].length).to be > 0
          metadata[:axis_units].each_value do |turn|
            expect(turn[:list]&.is_a?(Array)).to be true
            turn[:list].each do |unit|
              expect(unit).not_to have_key :not_found
            end
          end
        end

        it "has metadata" do
          scenario = described_class.scenario_by_id(scenario[:id])
          expect(scenario).not_to be_nil
          expect(scenario[:metadata]).not_to be_nil

          metadata = scenario[:metadata]
          expect(metadata[:turns]).not_to be_nil
          expect(metadata[:first_deploy]).not_to be_nil
          expect(metadata[:first_action]).not_to be_nil
          expect(metadata[:description]).not_to be_nil
          expect(metadata[:map_data]).not_to be_nil
          expect(metadata[:allied_units]).not_to be_nil
          expect(metadata[:axis_units]).not_to be_nil
        end
      end
    end
  end

  context "stats" do
    it "handles no games" do
      expect(Utility::Scenario.stats("001")).to be == { one: 1, two: 1 }
    end

    it "handles games but no winners" do
      create(:game, scenario: "001")

      expect(Utility::Scenario.stats("001")).to be == { one: 1, two: 1 }
    end

    it "handles games" do
      game1 = create(:game, scenario: "001", player_two: create(:user))
      game1.winner = game1.player_one
      game1.save!

      game2 = create(:game, scenario: "001", player_two: create(:user))
      game2.winner = game2.player_two
      game2.save!

      expect(Utility::Scenario.stats("001")).to be == { one: 2, two: 2 }
    end
  end

  context "checksum versioning" do
    it "has correct checksum/versions" do
      # This may seem tedious as hell, but this test will catch any changes to
      # scenarios that don't have the version changes they should.  Saved game
      # integrity depends on versions having correct scenario JSON blobs stared.

      # If this changes, make sure to add entry for version/checksum
      constants = Scenarios.constants.reject do |k|
        %i[Base Scenario999 Scenario000].include?(k)
      end
      expect(constants.length).to be == 82

      # If any of these change, scenario MUST to be updated with a new version,
      # then update test with new version/checksum
      expect(Utility::Scenario.checksum("001")).to be == "1.4-790911864eba699a6a294c3b8ee4b22a"
      expect(Utility::Scenario.checksum("002")).to be == "1.3-fbc99e933e44aa5983dcb24599f80ccb"
      expect(Utility::Scenario.checksum("003")).to be == "1.1-6e4944cc13c728c57ce952eebef0bc31"
      expect(Utility::Scenario.checksum("004")).to be == "0.3a-ece623c625ee6734bbdc07084e60c713"
      expect(Utility::Scenario.checksum("005")).to be == "1.1-4f6cf129720d7b24416c7e9fb82620fa"
      expect(Utility::Scenario.checksum("006")).to be == "1.0-5e27b48072c945b754f928f93a1aa475"
      expect(Utility::Scenario.checksum("007")).to be == "1.2-6270c49dd5261cb0c8e549e7919583a6"
      expect(Utility::Scenario.checksum("008")).to be == "1.0-06013c00043147c1c94ecd8cfc2f8717"
      expect(Utility::Scenario.checksum("009")).to be == "0.2a-c6368d71e854ffb330fdcdd9d0e3c8f9"
      expect(Utility::Scenario.checksum("010")).to be == "0.2a-68c746a8a1350ae5cf7787c6ac1ede45"
      expect(Utility::Scenario.checksum("011")).to be == "1.3-ff7c48eece312350f864c54b76f6f748"
      expect(Utility::Scenario.checksum("012")).to be == "0.2a-a72ae41a60ada2f6320dac8993ce741a"
      expect(Utility::Scenario.checksum("013")).to be == "0.2a-0db484758e449db1364e6d44fd19bc42"
      expect(Utility::Scenario.checksum("014")).to be == "0.2a-3421a297cbd2eaabe9f0a1dbc705685d"
      expect(Utility::Scenario.checksum("015")).to be == "0.2a-f5368eade5fadca0220d344d2e25a336"
      expect(Utility::Scenario.checksum("016")).to be == "0.2a-a04acd0c46df1e396c7d0e7eb7c55540"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-05bc66e28a386553c3debcc18dada4f1"
      expect(Utility::Scenario.checksum("102")).to be == "1.0-00ff27c7b93b97053578e8b7963026a5"
      expect(Utility::Scenario.checksum("103")).to be == "0.2a-9ed7d39e44363afd9ff00fdedf6d6476"
      expect(Utility::Scenario.checksum("104")).to be == "0.2a-e23dc0c0039c7f51d281e2c1f2bb3268"
      expect(Utility::Scenario.checksum("105")).to be == "0.2a-9fedd58044a4a7dc97769de621524b47"
      expect(Utility::Scenario.checksum("106")).to be == "1.0-505c657a6911817f490323772110c1f9"
      expect(Utility::Scenario.checksum("107")).to be == "0.2a-cf0848927824082675d3d96668451a96"
      expect(Utility::Scenario.checksum("108")).to be == "0.2a-f7f799c007b0d7ccb712f6af81b3b875"
      expect(Utility::Scenario.checksum("109")).to be == "0.2a-c47935e2c21b7f3487be7314779fc0a5"
      expect(Utility::Scenario.checksum("110")).to be == "0.2a-92ba90fd5bba620026d081bfbefeb2e4"
      expect(Utility::Scenario.checksum("111")).to be == "0.1p-93265109118cf8f5a6a49e55cc658d34"
      expect(Utility::Scenario.checksum("112")).to be == "0.1p-e6f6373723ae221fa786b49b6e8c198b"

      expect(Utility::Scenario.checksum("201")).to be == "1.0-d285c94c697dc2d2b999a5d4a0c003be"
      expect(Utility::Scenario.checksum("202")).to be == "0.2a-ca2b4b52bf776193e2c740d288970510"
      expect(Utility::Scenario.checksum("203")).to be == "1.0-dfa1cf28dc5e7728caf769a3dba4ea7f"
      expect(Utility::Scenario.checksum("204")).to be == "0.2a-1918458c161066b368c5680cd92a7290"
      expect(Utility::Scenario.checksum("205")).to be == "0.2a-12c9645e5bf62f05dfd805677c9e9d59"
      expect(Utility::Scenario.checksum("206")).to be == "0.2a-d9b6201068ef5157f6df278896792290"
      expect(Utility::Scenario.checksum("207")).to be == "0.1p-09df0572413c1a97feeafa6c48ba55be"
      expect(Utility::Scenario.checksum("208")).to be == "0.1p-71e6c762bd54dfde62aeb63567ec8dc8"
      expect(Utility::Scenario.checksum("209")).to be == "0.1p-f46ee28926d915f9034dbdd42310e19f"
      expect(Utility::Scenario.checksum("210")).to be == "0.1p-4fb1ab99ae4bdc54d510544bcaad9b73"

      expect(Utility::Scenario.checksum("301")).to be == "1.4-f7676cfd8065e278e5db862886d59841"
      expect(Utility::Scenario.checksum("302")).to be == "0.3a-f3ff3c3aaba5f8a85fa4348f453c4a73"
      expect(Utility::Scenario.checksum("303")).to be == "1.1-2666b6ed5f2a6252b63295c70b159aff"
      expect(Utility::Scenario.checksum("304")).to be == "0.4b-e2a752c89f64a0ac53e4aabb9cfc2e5f"
      expect(Utility::Scenario.checksum("305")).to be == "0.3a-84ada99c4f2287939fc376ca4c312f9c"
      expect(Utility::Scenario.checksum("306")).to be == "0.2a-147cf450c03caf5d7eb2eff454abc8be"
      expect(Utility::Scenario.checksum("307")).to be == "0.2a-b75d6479a6f6a9f40bcf78645275009d"
      expect(Utility::Scenario.checksum("308")).to be == "1.4-87966dc8adf28db7046b4508b42b9550"
      expect(Utility::Scenario.checksum("309")).to be == "0.2a-d4a88cdb2f08faec22bd0d656ddd37aa"
      expect(Utility::Scenario.checksum("310")).to be == "0.2a-ec9c8cced006ce66288500ea6427e552"
      expect(Utility::Scenario.checksum("311")).to be == "0.2a-199b16d24bbc721a19316ce4675d0c11"
      expect(Utility::Scenario.checksum("312")).to be == "0.2a-eff5f7ab46fc57dc21d9e8ad7c94bff7"

      expect(Utility::Scenario.checksum("401")).to be == "1.3-f89a306a63d33187fe3251d2ae64252d"
      expect(Utility::Scenario.checksum("402")).to be == "0.2a-59df766a20d60e2d4f1d7c38e94c555b"
      expect(Utility::Scenario.checksum("403")).to be == "0.2a-402dfcbc605c2f36374f0df4fbefdfca"
      expect(Utility::Scenario.checksum("404")).to be == "0.2a-8bf20a855d265a1565e50808ce8be1ba"
      expect(Utility::Scenario.checksum("405")).to be == "0.2a-5d7007fde1dc2956a0efae8e71e7ed72"
      expect(Utility::Scenario.checksum("406")).to be == "0.5b-0b0d2d0011a4513bd7650e73f22cea87"
      expect(Utility::Scenario.checksum("407")).to be == "0.2a-07a6e572da08d23fa58937a10346a5cf"
      expect(Utility::Scenario.checksum("408")).to be == "0.3a-ab3da773c85881069be7edd84c2629c4"
      expect(Utility::Scenario.checksum("409")).to be == "0.2a-1e075adbb131f90dba6289567ee95afb"
      expect(Utility::Scenario.checksum("410")).to be == "0.2a-490799aa399c0cb27306d5c7b30afe8f"
      expect(Utility::Scenario.checksum("411")).to be == "0.3a-8dbe09afc72215058917570bb3b3dcbb"
      expect(Utility::Scenario.checksum("412")).to be == "0.1p-e9e8cfe5e61a87e9c59248d84b4933ad"

      expect(Utility::Scenario.checksum("501")).to be == "1.2-afc698d4c82e0219f8ae1299a284d21d"
      expect(Utility::Scenario.checksum("502")).to be == "0.2a-d634471fd9838af30f9532e120188565"
      expect(Utility::Scenario.checksum("503")).to be == "1.2-120434b82fa631a0493654b09d6d0fe4"
      expect(Utility::Scenario.checksum("504")).to be == "0.3a-5e33f4552f963e41001fcbf027bf8be6"
      expect(Utility::Scenario.checksum("505")).to be == "0.2a-59d983089b326c72b39963ff72b074f4"
      expect(Utility::Scenario.checksum("506")).to be == "0.2a-5fbb0af2333d410bb423289a317a0a36"
      expect(Utility::Scenario.checksum("507")).to be == "0.2a-d1109e27ef3f7c9a1a98937660f1ee69"
      expect(Utility::Scenario.checksum("508")).to be == "1.0-43a7308b83272b50d2f917b7d855f21f"
      expect(Utility::Scenario.checksum("509")).to be == "0.3a-00ec80a77a79acc9bef44dc8dcb304f8"
      expect(Utility::Scenario.checksum("510")).to be == "1.2-2af005c07784a1526835891219769bc0"
      expect(Utility::Scenario.checksum("511")).to be == "0.2a-6da06bd1d161af85b3bf5d2d531035a6"
      expect(Utility::Scenario.checksum("512")).to be == "1.0-524ae16a4b57218e2c6151151badf0de"

      expect(Utility::Scenario.checksum("601")).to be == "1.2-b3cb8e42f52aac8108bcf7f548c12130"
      expect(Utility::Scenario.checksum("602")).to be == "0.2a-5794b16e30d19385de4e75b5ce31a3e0"
      expect(Utility::Scenario.checksum("603")).to be == "1.3-184b435e7200f65f45c8f8e1abe68bb8"
      expect(Utility::Scenario.checksum("604")).to be == "0.6b-fd07280ba0da36f18d3f636408bf406f"
      expect(Utility::Scenario.checksum("605")).to be == "0.2a-3c145088425f4d24c3795e669e8c36af"
      expect(Utility::Scenario.checksum("606")).to be == "0.2a-5c655f06624a3af3b35bc5e671446f0a"
      expect(Utility::Scenario.checksum("607")).to be == "0.2a-e0cef79c48daa71a7e568bb1be796e3b"
      expect(Utility::Scenario.checksum("608")).to be == "0.1p-9cd8f97225a2a1abc7b95c7a1c00ecce"
    end
  end
end
