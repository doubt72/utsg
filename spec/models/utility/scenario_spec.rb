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

      # If any of these change, scenario needs to be updated with a new version,
      # then update test with new version/checksum
      expect(Utility::Scenario.checksum("001")).to be == "1.2-8fd3bab2c4805d98ae8be01ad190a21c"
      expect(Utility::Scenario.checksum("002")).to be == "0.1p-e8e47527f0fc0607b29c89dbea69da8d"
      expect(Utility::Scenario.checksum("003")).to be == "0.1p-b6077b9ebb702777692a97a7a2ed224b"
      expect(Utility::Scenario.checksum("004")).to be == "0.1p-17509aa1925c4de3e2263cf2716a4282"
      expect(Utility::Scenario.checksum("005")).to be == "0.1p-2d8eb81baf219c0be97d32f5191ecca8"
      expect(Utility::Scenario.checksum("006")).to be == "0.1p-5e78a420cb0a61aaa15cb9b2a4b1ba74"
      expect(Utility::Scenario.checksum("007")).to be == "0.1p-e8fc9c215c0f9babe73ddebf73c7785b"
      expect(Utility::Scenario.checksum("008")).to be == "0.1p-68d0a92ca8a5463ebdae446fc2a75d47"
      expect(Utility::Scenario.checksum("009")).to be == "0.1p-64f0823b9cfd803503f0016c1a152c43"
      expect(Utility::Scenario.checksum("010")).to be == "0.1p-b8c542709062f3f003429f6f38aef514"
      expect(Utility::Scenario.checksum("011")).to be == "0.1p-188b99fe5b01413e7d7cbdec8fbd412d"
      expect(Utility::Scenario.checksum("012")).to be == "0.1p-f870316c265d5e551e1834fb653ef6b1"
      expect(Utility::Scenario.checksum("013")).to be == "0.1p-c05118ac359b2132e11a18111ded9c59"
      expect(Utility::Scenario.checksum("014")).to be == "0.1p-fc66428d211f431c1976eb3ba57e0444"
      expect(Utility::Scenario.checksum("015")).to be == "0.1p-b6b2a17b60317e4f7c0d15bc2590a2dc"
      expect(Utility::Scenario.checksum("016")).to be == "0.1p-d4bef1bd17f1a73afeedae0cb73bb853"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-05bc66e28a386553c3debcc18dada4f1"
      expect(Utility::Scenario.checksum("102")).to be == "0.1p-371c739f97867a2114cdf4551351ecb4"
      expect(Utility::Scenario.checksum("103")).to be == "0.1p-e702182f03d8028f15b32bf16150fc0a"
      expect(Utility::Scenario.checksum("104")).to be == "0.1p-5437a8225d3d5112af169a7a535fc53a"
      expect(Utility::Scenario.checksum("105")).to be == "0.1p-0b02bb8d370174098af8e69cdcfe348c"
      expect(Utility::Scenario.checksum("106")).to be == "0.1p-e1cd3d765c8e79f93635fd30f13d8d54"
      expect(Utility::Scenario.checksum("107")).to be == "0.1p-4c1338f69a8293f3bc419389af77e81c"
      expect(Utility::Scenario.checksum("108")).to be == "0.1p-d8a14c1a6364242fd5e63503aa89f6e4"
      expect(Utility::Scenario.checksum("109")).to be == "0.1p-a7f717df9c1e26242535756daa04be90"
      expect(Utility::Scenario.checksum("110")).to be == "0.1p-01a0d87e7d2b80f9633ad933aca316cb"

      expect(Utility::Scenario.checksum("201")).to be == "0.1p-1b22e32455c5e7c450ff22a6088d88f2"
      expect(Utility::Scenario.checksum("202")).to be == "0.1p-feab16ab2c5db0af76a14eeb7938d0fd"
      expect(Utility::Scenario.checksum("203")).to be == "0.1p-abc919cc85349fcc276059d935a144ca"
      expect(Utility::Scenario.checksum("204")).to be == "0.1p-49460073c2ae643ca16f52e1b3b0d78f"
      expect(Utility::Scenario.checksum("205")).to be == "0.1p-fd341bcd099f4fbf433c6d9ad583a34f"
      expect(Utility::Scenario.checksum("206")).to be == "0.1p-84e277d07c094ae1dbaf627a85b7b0fe"

      expect(Utility::Scenario.checksum("301")).to be == "1.1-0de79d912d491979ee71e6972aa43c2a"
      expect(Utility::Scenario.checksum("302")).to be == "0.1p-6407e7d02b047a0b501d10bf578cf8ea"
      expect(Utility::Scenario.checksum("303")).to be == "0.1p-84465c18d80c59f6a9fdf665ea234cb2"
      expect(Utility::Scenario.checksum("304")).to be == "0.1p-919b084d6f2b4bfeb898502c33d2d3ec"
      expect(Utility::Scenario.checksum("305")).to be == "0.1p-fcfc42861e65d8968864e9e6bd1583bf"
      expect(Utility::Scenario.checksum("306")).to be == "0.1p-99b99988454aacdc9ab23373266f11cd"
      expect(Utility::Scenario.checksum("307")).to be == "0.1p-fbd7bdd94d2526d60e839a065ead532c"
      expect(Utility::Scenario.checksum("308")).to be == "0.1p-091ffc51f7d02717404f520c480001dc"
      expect(Utility::Scenario.checksum("309")).to be == "0.1p-001dc59643c12c3a85ecfb298ea73584"
      expect(Utility::Scenario.checksum("310")).to be == "0.1p-e5ba10375b67d1adeaf39b0972c21015"
      expect(Utility::Scenario.checksum("311")).to be == "0.1p-785ad8a24fbde62d4779134dc6e260b8"
      expect(Utility::Scenario.checksum("312")).to be == "0.1p-5885a923fcd090a887d694aae9fcf878"

      expect(Utility::Scenario.checksum("401")).to be == "1.1-ee76040f43aef9f53fa38266d1304fb5"
      expect(Utility::Scenario.checksum("402")).to be == "0.1p-a6021551d395276ef4b6e2f7b0bf78a5"
      expect(Utility::Scenario.checksum("403")).to be == "0.1p-1ef571340d5c4e65ad3775664f945a93"
      expect(Utility::Scenario.checksum("404")).to be == "0.1p-898a0cf3cae1a3715b81decddddf67b1"
      expect(Utility::Scenario.checksum("405")).to be == "0.1p-e057500dac4ad8c65cce883795670e3e"
      expect(Utility::Scenario.checksum("406")).to be == "0.1p-4e8af6d6d0b25b8d8877aca515b03cc3"
      expect(Utility::Scenario.checksum("407")).to be == "0.1p-54c24652caa933eeb3608b9192d2bb11"
      expect(Utility::Scenario.checksum("408")).to be == "0.1p-8405c1fa39ef00fd0042e8eff3ff1001"
      expect(Utility::Scenario.checksum("409")).to be == "0.1p-ac4d1906ba3b6fa6451d37464f987dc8"
      expect(Utility::Scenario.checksum("410")).to be == "0.1p-7bf4e2b63563cc8902451d0cad461f6b"
      expect(Utility::Scenario.checksum("411")).to be == "0.1p-aae29a6db4ce6f51669b8bb3b212cc1e"

      expect(Utility::Scenario.checksum("501")).to be == "0.1p-e320266d3b3aa8dd0b5d1cb35ca3656a"
      expect(Utility::Scenario.checksum("502")).to be == "0.1p-13a17f97f00354ab99f72290931a4c95"
      expect(Utility::Scenario.checksum("503")).to be == "0.1p-7ffc93307f8851ff7c1f1ad3961ce9c2"
      expect(Utility::Scenario.checksum("504")).to be == "0.1p-6aed6d1347826e33ce73b79ea399dce9"
      expect(Utility::Scenario.checksum("505")).to be == "0.1p-ff712e35994da28ce5f2608ab23fba35"
      expect(Utility::Scenario.checksum("506")).to be == "0.1p-f0e4f4f20defce0eefffbbb262da14f7"
      expect(Utility::Scenario.checksum("507")).to be == "0.1p-30fd4818aff4b7faf1154601fb484e8f"
      expect(Utility::Scenario.checksum("508")).to be == "0.1p-9eccecbf35ebb912fa979ffaa80a7906"
      expect(Utility::Scenario.checksum("509")).to be == "0.1p-03bbc836e1f0d2b0d7d552bd4a7f9b24"
      expect(Utility::Scenario.checksum("510")).to be == "0.1p-928482b873567c0b625074629bf90c8f"
      expect(Utility::Scenario.checksum("511")).to be == "0.1p-c2cf7b2695171064e71cebe0ea277ee5"
      expect(Utility::Scenario.checksum("512")).to be == "0.1p-8296257558c4d108a9117b482ae1ea67"

      expect(Utility::Scenario.checksum("601")).to be == "0.1p-a464d78c621d5345955fa4156929b813"
      expect(Utility::Scenario.checksum("602")).to be == "0.1p-21249725504ba01d6999533c4c4a217f"
      expect(Utility::Scenario.checksum("603")).to be == "0.1p-197dcb86b214c075a0bc9ac5726837a4"
      expect(Utility::Scenario.checksum("604")).to be == "0.1p-4ae907a3e4602e3bfefd262bc4ac9e44"
      expect(Utility::Scenario.checksum("605")).to be == "0.1p-8f599a54f13446e809f15fd21016564c"
      expect(Utility::Scenario.checksum("606")).to be == "0.1p-6c7720255fe7e109499d4e47528299e6"
      expect(Utility::Scenario.checksum("607")).to be == "0.1p-6b4e4fce00dde06397fd5db97eb8971e"
    end
  end
end
