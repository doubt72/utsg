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
      expect(scenarios.length).to be == 1
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
      expect(Utility::Scenario.checksum("001")).to be == "1.0-a5287d684749f588a1311b2f010063d1"
      expect(Utility::Scenario.checksum("002")).to be == "0.1p-9537dbcad109de34d0571b809cdc788a"
      expect(Utility::Scenario.checksum("003")).to be == "0.1p-b317de64247fd333bcafe4e26ecd4fae"
      expect(Utility::Scenario.checksum("004")).to be == "0.1p-aae1f3e72204f045041ef21c4169a632"
      expect(Utility::Scenario.checksum("005")).to be == "0.1p-e102dc09cfe51c96850352c6d1fad551"
      expect(Utility::Scenario.checksum("006")).to be == "0.1p-56105034bb4cc9e60a7ad727cd386f7e"
      expect(Utility::Scenario.checksum("007")).to be == "0.1p-3c12ab6be990d7e66f56fa304aca366d"
      expect(Utility::Scenario.checksum("008")).to be == "0.1p-7a1b7c29bf185b765561cf879f426ad6"
      expect(Utility::Scenario.checksum("009")).to be == "0.1p-10f2a889028400cd1e66644065086dcb"
      expect(Utility::Scenario.checksum("010")).to be == "0.1p-1b89298704ea97cd208eb38dd9f8661b"
      expect(Utility::Scenario.checksum("011")).to be == "0.1p-745dbb9be91ada86191924e0cc61686e"
      expect(Utility::Scenario.checksum("012")).to be == "0.1p-7340ec1018971e3279f4ca9ee972ab91"
      expect(Utility::Scenario.checksum("013")).to be == "0.1p-50cd2e6242e9172293b2522bb5ac6b63"
      expect(Utility::Scenario.checksum("014")).to be == "0.1p-2961ce28c99dcbd08daf6b485c242f33"
      expect(Utility::Scenario.checksum("015")).to be == "0.1p-5c6e7d65f2577e21e27598539a0627ee"
      expect(Utility::Scenario.checksum("016")).to be == "0.1p-d1347cfa2fe69569cb4a619d76505bc8"

      expect(Utility::Scenario.checksum("101")).to be == "0.1p-2d0419077f3607bf40e68e35dcd6bd25"
      expect(Utility::Scenario.checksum("102")).to be == "0.1p-63b69d24cebf05afb4aadf50f2a58b89"
      expect(Utility::Scenario.checksum("103")).to be == "0.1p-1a329194465b9c6f48cf9157925b6380"
      expect(Utility::Scenario.checksum("104")).to be == "0.1p-047485433b25493170b9b95ced194ebe"
      expect(Utility::Scenario.checksum("105")).to be == "0.1p-6f2e75a1e0df12aeae6c58f818445766"
      expect(Utility::Scenario.checksum("106")).to be == "0.1p-52b61e07a47386a0acc0d2346f4a3354"
      expect(Utility::Scenario.checksum("107")).to be == "0.1p-95a438def80f1eafca25b904aa2fcc99"
      expect(Utility::Scenario.checksum("108")).to be == "0.1p-2064e4aa90bf5bd996863b7380b1dcfa"
      expect(Utility::Scenario.checksum("109")).to be == "0.1p-d8f4010bd47854fb2646334cd42e7aa1"
      expect(Utility::Scenario.checksum("110")).to be == "0.1p-090aa069422223edc2f63f5c694d5547"

      expect(Utility::Scenario.checksum("201")).to be == "0.1p-809890de213e7d89fa347ae2485c9ea7"
      expect(Utility::Scenario.checksum("202")).to be == "0.1p-ba85ff9dd716e3a2a875c6bcd4fe56d9"
      expect(Utility::Scenario.checksum("203")).to be == "0.1p-4e46bcf26b9d0868e9e91d914313ada8"
      expect(Utility::Scenario.checksum("204")).to be == "0.1p-3aad02f9e07d2f2ecff8fbd02082379b"
      expect(Utility::Scenario.checksum("205")).to be == "0.1p-06806cc0d1afa56ed729cd2726697c6e"
      expect(Utility::Scenario.checksum("206")).to be == "0.1p-671c4888a3ffbe228bcfaf2376b99c78"

      expect(Utility::Scenario.checksum("301")).to be == "0.1p-d2faa7a16eebd5c9cd84e09898d6a0ca"
      expect(Utility::Scenario.checksum("302")).to be == "0.1p-fd5fd94e02317600f205f6e1c65022ae"
      expect(Utility::Scenario.checksum("303")).to be == "0.1p-3ac66ced82d7e0927a5c39d55dad0cc5"
      expect(Utility::Scenario.checksum("304")).to be == "0.1p-9158bd08a3946187ae696e6d4efe24fb"
      expect(Utility::Scenario.checksum("305")).to be == "0.1p-8bc0170ffb0a1c93d356f8fd2bb5aaab"
      expect(Utility::Scenario.checksum("306")).to be == "0.1p-d8a81155d0e092a9fa092733a03f5587"
      expect(Utility::Scenario.checksum("307")).to be == "0.1p-60264678db76fecc8fb8e2002aec19fe"
      expect(Utility::Scenario.checksum("308")).to be == "0.1p-7613c0a04f6434cf62837b00a244d0fc"
      expect(Utility::Scenario.checksum("309")).to be == "0.1p-864e1ce716056b2beb7f28eab79bf10b"
      expect(Utility::Scenario.checksum("310")).to be == "0.1p-5b9869fb1726f1d12c1a7fabd151e9c4"
      expect(Utility::Scenario.checksum("311")).to be == "0.1p-ed80d268a1f114b663f7d88f80ca89d3"
      expect(Utility::Scenario.checksum("312")).to be == "0.1p-82c07740307b9bdfa9a06272753f5ec0"

      expect(Utility::Scenario.checksum("401")).to be == "0.1p-7d6116b9bc33b236844d96b3b0eefba2"
      expect(Utility::Scenario.checksum("402")).to be == "0.1p-125ee4ab856a866c72daccc9c6433f45"
      expect(Utility::Scenario.checksum("403")).to be == "0.1p-8cb84ebbf68a34e2e1b7e48662caaad6"
      expect(Utility::Scenario.checksum("404")).to be == "0.1p-d3853239661371db58de942530d1c695"
      expect(Utility::Scenario.checksum("405")).to be == "0.1p-271604228501064a1048e2e37f918574"
      expect(Utility::Scenario.checksum("406")).to be == "0.1p-2b541629b538b0d10c2027abbe7c6f0c"
      expect(Utility::Scenario.checksum("407")).to be == "0.1p-c1627b4d49d0a017206ce105bbcc3390"
      expect(Utility::Scenario.checksum("408")).to be == "0.1p-64c690476d477259115d675f90feaa91"
      expect(Utility::Scenario.checksum("409")).to be == "0.1p-440d7043e922dca0960b31d7cab601e8"
      expect(Utility::Scenario.checksum("410")).to be == "0.1p-f1209142021dfffb7bed5ae94be07a7a"
      expect(Utility::Scenario.checksum("411")).to be == "0.1p-74c83b63a15969a1d7383cbfc08e0492"

      expect(Utility::Scenario.checksum("501")).to be == "0.1p-ee887ffe196a4cc69b3e53186649d0de"
      expect(Utility::Scenario.checksum("502")).to be == "0.1p-04569f08fd4602d1d05013912084b13f"
      expect(Utility::Scenario.checksum("503")).to be == "0.1p-367aaa61c70a9973b0f66fafde213a8c"
      expect(Utility::Scenario.checksum("504")).to be == "0.1p-fa8a1039207fea7146cf73086e1b9e4e"
      expect(Utility::Scenario.checksum("505")).to be == "0.1p-5a31179b98c379db75459ef2200bd8f3"
      expect(Utility::Scenario.checksum("506")).to be == "0.1p-d17c83d94f8d75085de1accfb3e4f4b3"
      expect(Utility::Scenario.checksum("507")).to be == "0.1p-202702cccf674e95efb07e927cad8690"
      expect(Utility::Scenario.checksum("508")).to be == "0.1p-f92ec6e2203b2d46e5d21d03556f44e5"
      expect(Utility::Scenario.checksum("509")).to be == "0.1p-22458d46bfdd18587e4ce19de130e562"
      expect(Utility::Scenario.checksum("510")).to be == "0.1p-342c8ec9ea23e043875a2c1569e2eaf7"
      expect(Utility::Scenario.checksum("511")).to be == "0.1p-31b155194d445c676208bd0c64cea4ed"
      expect(Utility::Scenario.checksum("512")).to be == "0.1p-d75d5ce1a554646146b284faae3984b4"

      expect(Utility::Scenario.checksum("601")).to be == "0.1p-f3fabc756b4f6d210950c235d2c0106a"
      expect(Utility::Scenario.checksum("602")).to be == "0.1p-2536a9cbf78aafb821ca63cddcb95402"
      expect(Utility::Scenario.checksum("603")).to be == "0.1p-9bf33657beb7b5a95617a813ab1ad975"
      expect(Utility::Scenario.checksum("604")).to be == "0.1p-6c9eaa5b2890dad29c3d7913db5225a3"
      expect(Utility::Scenario.checksum("605")).to be == "0.1p-8df4f5bf763157fe509ac7799e0b9fa3"
      expect(Utility::Scenario.checksum("606")).to be == "0.1p-57323f91e8900fc824805a1cde04d34d"
      expect(Utility::Scenario.checksum("607")).to be == "0.1p-fd638fd437361944e0eabe095abf9d2e"
    end
  end
end
