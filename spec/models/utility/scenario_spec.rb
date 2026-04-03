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
      expect(Utility::Scenario.checksum("001")).to be == "1.3-8c385f004378fbf1e5f8ad3172af0688"
      expect(Utility::Scenario.checksum("002")).to be == "1.1-21d464534362e38d295afce9d543b06b"
      expect(Utility::Scenario.checksum("003")).to be == "1.1-9c1eca31eb41b9793811b4d5fadb6660"
      expect(Utility::Scenario.checksum("004")).to be == "0.3b-b438e85ded172454f2d34cd5c8029edd"
      expect(Utility::Scenario.checksum("005")).to be == "1.0-7e266aa6c2c9b7bb29bc194bc81b4f9f"
      expect(Utility::Scenario.checksum("006")).to be == "0.2a-561ac7ede57ff85fabf0d90dbe842bba"
      expect(Utility::Scenario.checksum("007")).to be == "1.0-07dafbd72a52e5246de0bbae34b362bc"
      expect(Utility::Scenario.checksum("008")).to be == "0.3b-a11be1b2a278efd85bb5a13a825cf143"
      expect(Utility::Scenario.checksum("009")).to be == "0.2a-f65a176402936bf1973e5c81db28114e"
      expect(Utility::Scenario.checksum("010")).to be == "0.2a-7159d1042fd36d8aa324aac06ac4d525"
      expect(Utility::Scenario.checksum("011")).to be == "1.1-6e9d465424c5ece93773cddfe304fc86"
      expect(Utility::Scenario.checksum("012")).to be == "0.2a-987f9f4e6d6b67cc9d383e20af05d17c"
      expect(Utility::Scenario.checksum("013")).to be == "0.2a-d35e80567e96975cf0024b632fb29e63"
      expect(Utility::Scenario.checksum("014")).to be == "0.2a-f76b9453af5e11e6f752a8b49f3964a5"
      expect(Utility::Scenario.checksum("015")).to be == "0.2a-785f8ccda04069c6737697c91353f86b"
      expect(Utility::Scenario.checksum("016")).to be == "0.2a-9adfefed6e53a2375ea907cafd4c51f8"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-05bc66e28a386553c3debcc18dada4f1"
      expect(Utility::Scenario.checksum("102")).to be == "0.3b-9ee7dbc58e022f40fe75eb9ddd8ce8b8"
      expect(Utility::Scenario.checksum("103")).to be == "0.2a-2b7937d1024f65e9718fbd2a8176e1ad"
      expect(Utility::Scenario.checksum("104")).to be == "0.2a-7d64b87764f9c2688676b367fad00a85"
      expect(Utility::Scenario.checksum("105")).to be == "0.2a-5e8bf8bcd276c7ba494aab26a66fd69f"
      expect(Utility::Scenario.checksum("106")).to be == "0.2a-dfb17b64a76ddafe29b02bb9f1ed3c51"
      expect(Utility::Scenario.checksum("107")).to be == "0.2a-5db5894a82b58021503e24b047bc7e6b"
      expect(Utility::Scenario.checksum("108")).to be == "0.2a-e7a572953273de1e54dcd8bcfb2542e0"
      expect(Utility::Scenario.checksum("109")).to be == "0.2a-e3d0738a2e5ea71cab5cfaec7bfbf3cd"
      expect(Utility::Scenario.checksum("110")).to be == "0.2a-dfbb0db2edf3fdc74173abb290318273"

      expect(Utility::Scenario.checksum("201")).to be == "0.2a-760401d8032e160173ae2526a26a2bd6"
      expect(Utility::Scenario.checksum("202")).to be == "0.2a-d3153c139180a23a1223f924ad798b15"
      expect(Utility::Scenario.checksum("203")).to be == "0.2a-51e27885b20898b880f4167c27c8231e"
      expect(Utility::Scenario.checksum("204")).to be == "0.2a-2f8b48d69fde705790ed4a963277e7b7"
      expect(Utility::Scenario.checksum("205")).to be == "0.2a-353a0c191d679aa1462d14f211050af8"
      expect(Utility::Scenario.checksum("206")).to be == "0.2a-c2b59dbacc8274c28dc9c1ce20f1765b"

      expect(Utility::Scenario.checksum("301")).to be == "1.1-0de79d912d491979ee71e6972aa43c2a"
      expect(Utility::Scenario.checksum("302")).to be == "0.3b-2d95f07e62df9fccbf2c18a9e1866bd8"
      expect(Utility::Scenario.checksum("303")).to be == "1.1-bb3686cd9d68f0436bb1693171136118"
      expect(Utility::Scenario.checksum("304")).to be == "0.2a-01150230ac74495e71481b08ad06aaed"
      expect(Utility::Scenario.checksum("305")).to be == "0.3b-c1540473852229ae12427063fa1d5a3d"
      expect(Utility::Scenario.checksum("306")).to be == "0.2a-82afcbc3935be0b2bd69ba130844bf14"
      expect(Utility::Scenario.checksum("307")).to be == "0.2a-5515fc3fae396b41fde48ac0d255d065"
      expect(Utility::Scenario.checksum("308")).to be == "1.0-ae30d32be2b23ed2c9e1b499df0fdb46"
      expect(Utility::Scenario.checksum("309")).to be == "0.2a-bae4e84921d161093e7dd32c12e18c5c"
      expect(Utility::Scenario.checksum("310")).to be == "0.2a-3a402dcfab175f5d364bcfbbdc7f65b5"
      expect(Utility::Scenario.checksum("311")).to be == "0.2a-fe6c44eb3a8f2561f8fff615b52af1f2"
      expect(Utility::Scenario.checksum("312")).to be == "0.2a-98ac5e75b7c8b2662358c8cfdc5f16d6"

      expect(Utility::Scenario.checksum("401")).to be == "1.1-ee76040f43aef9f53fa38266d1304fb5"
      expect(Utility::Scenario.checksum("402")).to be == "0.2a-4887f04567ec96d8e6fa5344588057d9"
      expect(Utility::Scenario.checksum("403")).to be == "0.2a-be4c30510af423facd978ba005b60c1e"
      expect(Utility::Scenario.checksum("404")).to be == "0.2a-a6fb873e99658f638f4ce65f2a1f9adb"
      expect(Utility::Scenario.checksum("405")).to be == "0.2a-1dd70e3b042b6ca51b3b314ad3b051d0"
      expect(Utility::Scenario.checksum("406")).to be == "0.3b-3201060f413e4e1398ffd3855458243e"
      expect(Utility::Scenario.checksum("407")).to be == "0.2a-2c6e640c4b6809536232674c9c2d5354"
      expect(Utility::Scenario.checksum("408")).to be == "0.3b-07d7116f48146e60514b49c8d2ac621d"
      expect(Utility::Scenario.checksum("409")).to be == "0.2a-3062692945a66271bc6ca3171b6ac686"
      expect(Utility::Scenario.checksum("410")).to be == "0.2a-0539d28805db31755a314bd7bddd775f"
      expect(Utility::Scenario.checksum("411")).to be == "0.3a-79b965746ebe139fbf8152916688c469"

      expect(Utility::Scenario.checksum("501")).to be == "1.1-39f3a9fbe77621f1fe9d73ebedaa492d"
      expect(Utility::Scenario.checksum("502")).to be == "0.2b-6ec1dd755fcdd0d1bf7248ab4c044432"
      expect(Utility::Scenario.checksum("503")).to be == "1.0-ba6d5250acf261cef27e09375049c2ef"
      expect(Utility::Scenario.checksum("504")).to be == "0.3b-5a281f03e141a2aa5e22322675e11cf5"
      expect(Utility::Scenario.checksum("505")).to be == "0.2a-3752cda652808e1a12735d8ea2d37d22"
      expect(Utility::Scenario.checksum("506")).to be == "0.2a-faf291c77f437045bb16c432e8dae45f"
      expect(Utility::Scenario.checksum("507")).to be == "0.2a-a2709eb23f362b2a9e828579b7dfe2a0"
      expect(Utility::Scenario.checksum("508")).to be == "1.0-8efb52eeb7a18719d01f59e7a5ab044d"
      expect(Utility::Scenario.checksum("509")).to be == "0.3b-864da9ce72ee642948ab9f67c124e2bc"
      expect(Utility::Scenario.checksum("510")).to be == "1.0-b6267d5138a59e8fec7a15f50ae9c134"
      expect(Utility::Scenario.checksum("511")).to be == "0.2a-58096cd8258feca4807b01bf979d6d28"
      expect(Utility::Scenario.checksum("512")).to be == "0.2a-881e25dd6e7e28729f52bd4438da1173"

      expect(Utility::Scenario.checksum("601")).to be == "1.0-4a1f2a774edc3a227d9740743b382f93"
      expect(Utility::Scenario.checksum("602")).to be == "0.2a-b9ea96806eb7cdd206ce3fd2c0e7aa7f"
      expect(Utility::Scenario.checksum("603")).to be == "1.0-fe2ef9db15341587943b046bbfb41fd6"
      expect(Utility::Scenario.checksum("604")).to be == "0.3b-5d65729ae707089334fe21e7446cd509"
      expect(Utility::Scenario.checksum("605")).to be == "0.2a-f453099b01f19278f7811dcbee18e92c"
      expect(Utility::Scenario.checksum("606")).to be == "0.2a-5f4bb5b2305670834a80ad328e5a8ccb"
      expect(Utility::Scenario.checksum("607")).to be == "0.2a-467c2ff3710f7dd84975e83902dccba4"
    end
  end
end
