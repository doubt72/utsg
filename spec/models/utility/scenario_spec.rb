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
      expect(constants.length).to be == 74

      # If any of these change, scenario MUST to be updated with a new version,
      # then update test with new version/checksum
      expect(Utility::Scenario.checksum("001")).to be == "1.3-6daf6f847aa2f2d8c528682b0bd21e02"
      expect(Utility::Scenario.checksum("002")).to be == "1.1-ee61a14b7681312b3885d3b9b30774a5"
      expect(Utility::Scenario.checksum("003")).to be == "1.1-4c1f0c20a1557999c22666d130578194"
      expect(Utility::Scenario.checksum("004")).to be == "0.3a-ece623c625ee6734bbdc07084e60c713"
      expect(Utility::Scenario.checksum("005")).to be == "1.0-f6c9bc76f73d0ad8a94a6275d686c43d"
      expect(Utility::Scenario.checksum("006")).to be == "0.2a-0b1cf45581086b7cf94062bd73142561"
      expect(Utility::Scenario.checksum("007")).to be == "1.1-c8d2b0662f896fdd6f1fe53ae1c05108"
      expect(Utility::Scenario.checksum("008")).to be == "0.3b-bcb9778d12402fa4830b8bbaa569fe22"
      expect(Utility::Scenario.checksum("009")).to be == "0.2a-c6368d71e854ffb330fdcdd9d0e3c8f9"
      expect(Utility::Scenario.checksum("010")).to be == "0.2a-68c746a8a1350ae5cf7787c6ac1ede45"
      expect(Utility::Scenario.checksum("011")).to be == "1.2-5718c8c2ecfc6a6f43d9e9374c046d57"
      expect(Utility::Scenario.checksum("012")).to be == "0.2a-0f8f2749b793fd53a42e7ba1a57c94ee"
      expect(Utility::Scenario.checksum("013")).to be == "0.2a-0db484758e449db1364e6d44fd19bc42"
      expect(Utility::Scenario.checksum("014")).to be == "0.2a-70351d35b59585e3107f6342e939fa18"
      expect(Utility::Scenario.checksum("015")).to be == "0.2a-685e3885842ccb9558f99a890645201a"
      expect(Utility::Scenario.checksum("016")).to be == "0.2a-da1e06ecea45390f3aa00534966c8f20"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-05bc66e28a386553c3debcc18dada4f1"
      expect(Utility::Scenario.checksum("102")).to be == "0.3b-ceec503b98c267610ef22efae03e89e2"
      expect(Utility::Scenario.checksum("103")).to be == "0.2a-7f54081cedef80615eb5848ae050468d"
      expect(Utility::Scenario.checksum("104")).to be == "0.2a-0cdbe420b1248695a0c86db317bf95ee"
      expect(Utility::Scenario.checksum("105")).to be == "0.2a-64b91c9c6b28fc4d9c126d9248fd353c"
      expect(Utility::Scenario.checksum("106")).to be == "0.2a-2ab5dc32ae1f544346f4f83d950a7a62"
      expect(Utility::Scenario.checksum("107")).to be == "0.2a-cd84afe91578b07c0fdfea1719894d2f"
      expect(Utility::Scenario.checksum("108")).to be == "0.2a-f7f799c007b0d7ccb712f6af81b3b875"
      expect(Utility::Scenario.checksum("109")).to be == "0.2a-9fa546c9f1d949da5641fa7bc038e6fe"
      expect(Utility::Scenario.checksum("110")).to be == "0.2a-92ba90fd5bba620026d081bfbefeb2e4"

      expect(Utility::Scenario.checksum("201")).to be == "0.2a-0893e44eafc0b9f7d88402d89780d03c"
      expect(Utility::Scenario.checksum("202")).to be == "0.2a-849c54997df2e5b5d9e88a0870de3346"
      expect(Utility::Scenario.checksum("203")).to be == "0.2a-c2abf3311b9587133384935071ef0286"
      expect(Utility::Scenario.checksum("204")).to be == "0.2a-8a2148777e20b4880d50389136c05aef"
      expect(Utility::Scenario.checksum("205")).to be == "0.2a-12c9645e5bf62f05dfd805677c9e9d59"
      expect(Utility::Scenario.checksum("206")).to be == "0.2a-d9b6201068ef5157f6df278896792290"

      expect(Utility::Scenario.checksum("301")).to be == "1.3-83836d8ddfaadd59dac96aec2b132095"
      expect(Utility::Scenario.checksum("302")).to be == "0.3a-f3ff3c3aaba5f8a85fa4348f453c4a73"
      expect(Utility::Scenario.checksum("303")).to be == "1.1-2666b6ed5f2a6252b63295c70b159aff"
      expect(Utility::Scenario.checksum("304")).to be == "0.2a-499e69bdac92a5f6f3af3f509a2fcb40"
      expect(Utility::Scenario.checksum("305")).to be == "0.3b-751ba3df6c724ff7656e89de36962693"
      expect(Utility::Scenario.checksum("306")).to be == "0.2a-147cf450c03caf5d7eb2eff454abc8be"
      expect(Utility::Scenario.checksum("307")).to be == "0.2a-e4d9d0c2ba7536df5a571be346e7d5ff"
      expect(Utility::Scenario.checksum("308")).to be == "1.2-db9d9fed5c72112e7bc2e723f3a7b116"
      expect(Utility::Scenario.checksum("309")).to be == "0.2a-a025c970fb5f10ec0889e186e2b6d2d9"
      expect(Utility::Scenario.checksum("310")).to be == "0.2a-6e70130747d54b4ae57e9bb317b5f4f1"
      expect(Utility::Scenario.checksum("311")).to be == "0.2a-199b16d24bbc721a19316ce4675d0c11"
      expect(Utility::Scenario.checksum("312")).to be == "0.2a-408179f019b90ad96eace5299b2c5d69"

      expect(Utility::Scenario.checksum("401")).to be == "1.1-fba74e04bbc8b2dca63496988f949ed6"
      expect(Utility::Scenario.checksum("402")).to be == "0.2a-59df766a20d60e2d4f1d7c38e94c555b"
      expect(Utility::Scenario.checksum("403")).to be == "0.2a-ed22a0bb144066e94d4aa4aa44bded9b"
      expect(Utility::Scenario.checksum("404")).to be == "0.2a-8bf20a855d265a1565e50808ce8be1ba"
      expect(Utility::Scenario.checksum("405")).to be == "0.2a-5d7007fde1dc2956a0efae8e71e7ed72"
      expect(Utility::Scenario.checksum("406")).to be == "0.3b-f0b6d82d5e8ed3384549f379b12a5501"
      expect(Utility::Scenario.checksum("407")).to be == "0.2a-07a6e572da08d23fa58937a10346a5cf"
      expect(Utility::Scenario.checksum("408")).to be == "0.3b-c70348097c8fce2cf8382a051ffcc0f6"
      expect(Utility::Scenario.checksum("409")).to be == "0.2a-1b15c8c9f787b9fb6cb6375d386b98b9"
      expect(Utility::Scenario.checksum("410")).to be == "0.2a-1e7caadeed69d1093759f1b8c5765047"
      expect(Utility::Scenario.checksum("411")).to be == "0.3a-01ea88c1e7c20eea2cc483aa533d74d3"

      expect(Utility::Scenario.checksum("501")).to be == "1.2-afc698d4c82e0219f8ae1299a284d21d"
      expect(Utility::Scenario.checksum("502")).to be == "0.2b-80a1a6e1c11c35651814d93d272517d0"
      expect(Utility::Scenario.checksum("503")).to be == "1.0-fbaa7f4dd68c34a5dacf053e09bfb734"
      expect(Utility::Scenario.checksum("504")).to be == "0.3a-b9bddd6e3bd877963df54cba3644141b"
      expect(Utility::Scenario.checksum("505")).to be == "0.2a-59d983089b326c72b39963ff72b074f4"
      expect(Utility::Scenario.checksum("506")).to be == "0.2a-5fbb0af2333d410bb423289a317a0a36"
      expect(Utility::Scenario.checksum("507")).to be == "0.2a-34b8f0bb53ac6f33d03fc3520989958b"
      expect(Utility::Scenario.checksum("508")).to be == "1.0-43a7308b83272b50d2f917b7d855f21f"
      expect(Utility::Scenario.checksum("509")).to be == "0.3b-ec3393a6f91eedc9764a31b4e1f46537"
      expect(Utility::Scenario.checksum("510")).to be == "1.1-c498a7943f0d23cb39fb8a02f60fc959"
      expect(Utility::Scenario.checksum("511")).to be == "0.2a-61113087195941ce4500f9880dd2df0f"
      expect(Utility::Scenario.checksum("512")).to be == "0.2a-9fff6782e75d65b6d2aaab9376a3bc86"

      expect(Utility::Scenario.checksum("601")).to be == "1.0-62c14b3adea2a5a71d70ab929a827afa"
      expect(Utility::Scenario.checksum("602")).to be == "0.2a-5794b16e30d19385de4e75b5ce31a3e0"
      expect(Utility::Scenario.checksum("603")).to be == "1.1-2d3a65662256c218899f165b480a4d4d"
      expect(Utility::Scenario.checksum("604")).to be == "0.3b-294bbd992fd224ab7ae0b59df453250d"
      expect(Utility::Scenario.checksum("605")).to be == "0.2a-3c145088425f4d24c3795e669e8c36af"
      expect(Utility::Scenario.checksum("606")).to be == "0.2a-f781df1b20d8578375d8d141672e06ae"
      expect(Utility::Scenario.checksum("607")).to be == "0.2a-a9de334d7452547632eceb9c5e4e421d"
    end
  end
end
