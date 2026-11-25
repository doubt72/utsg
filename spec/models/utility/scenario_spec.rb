# frozen_string_literal: true

require "rails_helper"

RSpec.describe Utility::Scenario do
  let(:scenario_name) { "xxx Spec Test xxx" }

  before :all do
    unless defined?(Scenarios::Scenario0TT)
      class Scenarios::Scenario0TT < Scenarios::Base # rubocop:disable Style/ClassAndModuleChildren
        ID = "0TT"
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
    expect(described_class.scenario_by_id("0TT")[:name]).to be == scenario_name
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
      expect(scenarios.length).to be == Scenarios.constants.length - 3
    end

    it "gets spec scenario when filtering by string" do
      scenarios = described_class.all_scenarios({ "string" => scenario_name, "status" => "p*" })
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "0TT"
    end

    it "gets correct scenarios with allies filter" do
      scenarios = described_class.all_scenarios({ "allies" => "usa", "status" => "p*" })
      scenarios.each do |s|
        expect(s[:allies].include?("usa") || s[:allies].include?("bra")).to be true
      end
      scenarios.select! { |s| s[:id] == "0TT" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "0TT"
    end

    it "gets correct scenarios with axis filter" do
      scenarios = described_class.all_scenarios({ "axis" => "ger", "status" => "p*" })
      scenarios.each do |s|
        expect(s[:axis].include?("ger")).to be true
      end
      scenarios.select! { |s| s[:id] == "0TT" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "0TT"
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

  context "complexity" do
    it "scenario 000" do
      scenario = Utility::Scenario.scenario_by_id("000")
      expect(Utility::Scenario.complexity(scenario)).to be_within(0.01).of(0.96)
    end

    it "scenario 911" do
      scenario = Utility::Scenario.scenario_by_id("911")
      expect(Utility::Scenario.complexity(scenario)).to be_within(0.01).of(9.56)
    end
  end

  context "checksum versioning" do
    it "has correct checksum/versions" do
      # This may seem tedious as hell, but this test will catch any changes to
      # scenarios that don't have the version changes they should.  Saved game
      # integrity depends on versions having correct scenario JSON blobs stared.

      # If this changes, make sure to add entry for version/checksum
      constants = Scenarios.constants.reject do |k|
        %i[Base Scenario999 Scenario0TT].include?(k)
      end
      expect(constants.length).to be == 249

      # If any of these change, scenario MUST to be updated with a new version,
      # then update test with new version/checksum
      expect(Utility::Scenario.checksum("000")).to be == "1.2-f67c2949633ebf8a434904627430f624"

      expect(Utility::Scenario.checksum("001")).to be == "1.5-5ba5fca5c66728fcac9297ced6f9bbdb"
      expect(Utility::Scenario.checksum("002")).to be == "1.4-2d08b2fc90d25e6ee7d8d7125d7e6b63"
      expect(Utility::Scenario.checksum("003")).to be == "1.2-c092683cf28fedbd892ee16164f2e095"
      expect(Utility::Scenario.checksum("004")).to be == "1.1-2567c8d53588dab1155a4a42e9b8db5f"
      expect(Utility::Scenario.checksum("005")).to be == "1.2-c60e1f7278ecff2cc513a738d7460025"
      expect(Utility::Scenario.checksum("006")).to be == "1.1-b75e106c182fef230473b544e6567727"
      expect(Utility::Scenario.checksum("007")).to be == "1.4-97446889811fd1dcea09757bed8b514d"
      expect(Utility::Scenario.checksum("008")).to be == "1.2-300920b610543e854f9bf99cf9534d30"
      expect(Utility::Scenario.checksum("009")).to be == "1.1-fb8eb26c53ca34a3b5b1a356696df750"
      expect(Utility::Scenario.checksum("010")).to be == "1.2-6c5ca278ddb5e2ee42f36b7605a24312"
      expect(Utility::Scenario.checksum("011")).to be == "1.6-908bf326faa03fe6bc26e3493a6c4d32"
      expect(Utility::Scenario.checksum("012")).to be == "1.1-5fbd73d8c194706bae0d0c1c06907331"
      expect(Utility::Scenario.checksum("013")).to be == "1.1-0e97843a51f2ac790bcebb50d49200d8"
      expect(Utility::Scenario.checksum("014")).to be == "0.3a-263ffe10fa0b8301a54bc4fb921406a8"
      expect(Utility::Scenario.checksum("015")).to be == "0.3a-5f1544400cb079a904335211de488b02"
      expect(Utility::Scenario.checksum("016")).to be == "0.6a-d2a42bf429485e72279cfca32cd2789e"
      expect(Utility::Scenario.checksum("017")).to be == "0.3a-041234c519e46297b678f4b2f793567c"
      expect(Utility::Scenario.checksum("018")).to be == "0.3a-e87dced065f6242a90bd0388bd66bfac"
      expect(Utility::Scenario.checksum("019")).to be == "0.2a-0e2a8370205c6352a0e73b531c896d17"
      expect(Utility::Scenario.checksum("020")).to be == "0.3a-5d1dda754cdd1668ab93f32a6d55d9c7"
      expect(Utility::Scenario.checksum("021")).to be == "0.2a-bc4fb6f31c4c130e1b28fbf1e822ff2a"
      expect(Utility::Scenario.checksum("022")).to be == "0.2a-59423cf025f93b729dae95619f46a08d"
      expect(Utility::Scenario.checksum("023")).to be == "0.6a-93c6d0798530b9e873fee13b96c5599c"
      expect(Utility::Scenario.checksum("024")).to be == "0.3a-7f5c656ea8953ea53bd0009a4bc7d675"
      expect(Utility::Scenario.checksum("025")).to be == "0.3a-feb980a5688aa451431698bb27e5e6ca"
      expect(Utility::Scenario.checksum("026")).to be == "1.1-d76dc12462114114febd4988d0e1ba51"
      expect(Utility::Scenario.checksum("027")).to be == "0.3a-686bf04fa8a59e8552e5deb814276be7"
      expect(Utility::Scenario.checksum("028")).to be == "0.3a-43caa2e6c03e73aa8984ad5b4023abcb"
      expect(Utility::Scenario.checksum("029")).to be == "0.3a-cd0ba66f5faec35c6e26672740067aa9"
      expect(Utility::Scenario.checksum("030")).to be == "0.2a-05ff44fd24d8b37d4d014618eba8ce27"
      expect(Utility::Scenario.checksum("031")).to be == "0.2a-9b5f5a03eefda4b5ca0b6214d383b538"
      expect(Utility::Scenario.checksum("032")).to be == "0.2a-f9380ff9571d54cd4fdd5cc1f5466dd6"
      expect(Utility::Scenario.checksum("033")).to be == "0.3a-01af2b1dc2398484ef30f80b02473793"
      expect(Utility::Scenario.checksum("034")).to be == "0.3a-ce2c6d997b6d2f3e1f200a1b5987dec3"
      expect(Utility::Scenario.checksum("035")).to be == "0.2a-4b8c4c644d4ad138fc12b0391a88ca6c"
      expect(Utility::Scenario.checksum("036")).to be == "0.3a-1e2a8a6348db86842b8e416950c23c41"
      expect(Utility::Scenario.checksum("037")).to be == "1.1-8f29e5ad911adc19372760b305709088"
      expect(Utility::Scenario.checksum("038")).to be == "0.3a-fdd2e7ab66cc70923c36bee64690dcfb"
      expect(Utility::Scenario.checksum("039")).to be == "0.2a-0380ea93520bc9e8aead8de1db0196f9"
      expect(Utility::Scenario.checksum("040")).to be == "0.2a-6c7b2df689fee708ed88abbb1626f08b"
      expect(Utility::Scenario.checksum("041")).to be == "0.2a-5910230f5dd4b396d878138592580560"
      expect(Utility::Scenario.checksum("042")).to be == "0.2a-5bb94ec28bc9c59c082e2d7f356c342e"
      expect(Utility::Scenario.checksum("043")).to be == "0.3a-e117118e92fac2822e5eee6507624d83"
      expect(Utility::Scenario.checksum("044")).to be == "0.2a-2a974b481e063d2eb7494de3081b82ca"

      expect(Utility::Scenario.checksum("101")).to be == "1.1-c92970d3a534c84ed3dcc696362bc0e7"
      expect(Utility::Scenario.checksum("102")).to be == "1.1-bc96a4f530a017fb4353c8c9907bd56c"
      expect(Utility::Scenario.checksum("103")).to be == "1.3-0502e350d23689b2366508ab19294298"
      expect(Utility::Scenario.checksum("104")).to be == "1.1-190ca64124622fe8acb0733b75b553f2"
      expect(Utility::Scenario.checksum("105")).to be == "1.1-800599398e6130f814980503de6733d3"
      expect(Utility::Scenario.checksum("106")).to be == "1.2-04b43c4486856e4f4e9a17325863def9"
      expect(Utility::Scenario.checksum("107")).to be == "1.1-49347b41debc9de0679aeb93838582c1"
      expect(Utility::Scenario.checksum("108")).to be == "0.4a-11fd084f5dd83a28657da4e10626494c"
      expect(Utility::Scenario.checksum("109")).to be == "0.4a-5d74b3a2272ca2297f8e7238d84d80b3"
      expect(Utility::Scenario.checksum("110")).to be == "0.4a-9fe558218994e822c59caed161f3bcb0"
      expect(Utility::Scenario.checksum("111")).to be == "0.3a-b82fba75862b5899c9694e7c72cda64c"
      expect(Utility::Scenario.checksum("112")).to be == "0.3a-dad3ac72f4b3eb68b66753e2553afd8e"
      expect(Utility::Scenario.checksum("113")).to be == "0.2a-debea64141782a514f0c463b4ab4ac19"
      expect(Utility::Scenario.checksum("114")).to be == "0.3a-c5c4e4a3ab8c4d4b701c4b5cdeaae533"
      expect(Utility::Scenario.checksum("115")).to be == "0.2a-91d078174e7b1660a5339a1987e65cb6"
      expect(Utility::Scenario.checksum("116")).to be == "0.2a-792cca74d144ce9152cc26612b956a5b"
      expect(Utility::Scenario.checksum("117")).to be == "0.2a-bc4d7c6e1373c18c98f662f160e38960"
      expect(Utility::Scenario.checksum("118")).to be == "0.2a-f7d632cd1d557cff8dfcc46231d08e16"
      expect(Utility::Scenario.checksum("119")).to be == "0.2a-4a79d132bb2a560c76231dc3ccbfe12a"
      expect(Utility::Scenario.checksum("120")).to be == "0.2a-bcbced4c06dd63c4307c4db0d17d6d76"
      expect(Utility::Scenario.checksum("121")).to be == "0.2a-309f6629bba3b56820c45f679e499c57"
      expect(Utility::Scenario.checksum("122")).to be == "0.3a-ce44b146bdab186baa7e62da48983424"
      expect(Utility::Scenario.checksum("123")).to be == "0.3a-60d8ea5902b8f12e888e100b3cc6d2ea"
      expect(Utility::Scenario.checksum("124")).to be == "0.2a-da89fa0778d5b60d296b6c2d568bdc92"

      expect(Utility::Scenario.checksum("201")).to be == "1.3-5b724d2fb1f0a04808437beba6513566"
      expect(Utility::Scenario.checksum("202")).to be == "1.2-ee7e3e3c606cf294750cacc8383d6eaf"
      expect(Utility::Scenario.checksum("203")).to be == "1.1-97b9ad3f4c5df78eeddafae4182a4acf"
      expect(Utility::Scenario.checksum("204")).to be == "1.1-876be60e41bd02664b31dbf5e65a4697"
      expect(Utility::Scenario.checksum("205")).to be == "0.4a-656e812aa5ca4f490ad1ddfa20d261e1"
      expect(Utility::Scenario.checksum("206")).to be == "0.4a-77ed1a0b2569cd8f4b38630cd0db40e9"
      expect(Utility::Scenario.checksum("207")).to be == "0.3a-b62d3534b9609dc9ad916ee1de0554da"
      expect(Utility::Scenario.checksum("208")).to be == "0.3a-850daa22f4ae8d753d8920e9575afdc4"
      expect(Utility::Scenario.checksum("209")).to be == "0.3a-a3bbd4cfb7fe1c35b78c4c3804a6f03f"
      expect(Utility::Scenario.checksum("210")).to be == "0.2a-5dc1904759ad6cad07158d11929bb12e"
      expect(Utility::Scenario.checksum("211")).to be == "0.3a-7d84461828b17caa6bed4fa971914577"
      expect(Utility::Scenario.checksum("212")).to be == "0.3a-3e6ba324bd356b810eecd7392d71e8d2"
      expect(Utility::Scenario.checksum("213")).to be == "0.2a-86c4ad765fa8ef0e601552a9574f430e"
      expect(Utility::Scenario.checksum("214")).to be == "0.2a-22dfcebaa196cfa7527cb34dc0c25fb4"
      expect(Utility::Scenario.checksum("215")).to be == "0.3a-22211731ab1012bda1f861bac2d733a2"
      expect(Utility::Scenario.checksum("216")).to be == "0.2a-38c561fb1f94cdb578aed25c9ff49fdf"

      expect(Utility::Scenario.checksum("301")).to be == "1.5-f3eb3b25ccdb1fb9f5fe1fd8c62c17b3"
      expect(Utility::Scenario.checksum("302")).to be == "1.3-ef0556a98bac4db8a1342f6afb90de07"
      expect(Utility::Scenario.checksum("303")).to be == "1.3-17796f8ddf08c8c886f431bfbd62ca2b"
      expect(Utility::Scenario.checksum("304")).to be == "1.1-ed20ee71087f75da3860d2ecfb259a69"
      expect(Utility::Scenario.checksum("305")).to be == "1.2-7675ee10319fddb757a5521a4d8c4c9b"
      expect(Utility::Scenario.checksum("306")).to be == "1.1-9ad09c6efb248f8094837c37cac874c9"
      expect(Utility::Scenario.checksum("307")).to be == "1.2-166294e7df605db9e2a4be8bbe44fbf2"
      expect(Utility::Scenario.checksum("308")).to be == "1.5-5db52e258837b9de88455bb134fd8be7"
      expect(Utility::Scenario.checksum("309")).to be == "0.4b-bf4ba7b1cd80af9bdefd2b38f23f8e1e"
      expect(Utility::Scenario.checksum("310")).to be == "0.4a-f5c6b17de82eb26df7b09a5ab69905b4"
      expect(Utility::Scenario.checksum("311")).to be == "0.5a-05478ecbc204914eac1d42d973ec3fb6"
      expect(Utility::Scenario.checksum("312")).to be == "0.4a-0354f82890d408aa754dd6f681c68f70"
      expect(Utility::Scenario.checksum("313")).to be == "0.3a-53d8328c0897ad7347769c2fa395cf33"
      expect(Utility::Scenario.checksum("314")).to be == "0.3a-b2b2ba973e732fb57bb8d18c04d743a2"
      expect(Utility::Scenario.checksum("315")).to be == "1.1-14f3c49e6e74743e744b359eecaddd27"
      expect(Utility::Scenario.checksum("316")).to be == "0.2a-e409c28e1ae28af1c1c2dc3f464a2382"
      expect(Utility::Scenario.checksum("317")).to be == "0.2a-b8f35751dd2bbcbdbdba2de0889504bf"
      expect(Utility::Scenario.checksum("318")).to be == "0.2a-814bffcab50cc4b95d1c7288141ed134"
      expect(Utility::Scenario.checksum("319")).to be == "0.2a-ba2c31fd9b9e31c4eec0ea5e5d180047"
      expect(Utility::Scenario.checksum("320")).to be == "0.2a-c7ae5cd21e5ffd22946f3c6918b323c3"
      expect(Utility::Scenario.checksum("321")).to be == "0.2a-6743151cea739e05c5de3a9cc339900e"
      expect(Utility::Scenario.checksum("322")).to be == "0.2a-436d728c11fe2983bb07d0cab76365d7"
      expect(Utility::Scenario.checksum("323")).to be == "0.2a-238af925451c5c289d7b82247974eb26"
      expect(Utility::Scenario.checksum("324")).to be == "0.2a-153329e3c7aa27f7f6e0e9619fd81e3f"
      expect(Utility::Scenario.checksum("325")).to be == "0.2a-f3a0870227c544f9bcdffa7a3b2acf22"
      expect(Utility::Scenario.checksum("326")).to be == "0.2a-e5b52b0605b378c98da0475dcc789db7"
      expect(Utility::Scenario.checksum("327")).to be == "0.2a-189ef4ec46ae6afba869cd6a467b4ad2"
      expect(Utility::Scenario.checksum("328")).to be == "0.2a-8edd04bc2735227205afeb9902006c11"
      expect(Utility::Scenario.checksum("329")).to be == "0.3a-af31a073c31cb2a235e2e861e1bc84d0"
      expect(Utility::Scenario.checksum("330")).to be == "0.2a-1027b9894883bbc703df8e260e8620b5"

      expect(Utility::Scenario.checksum("401")).to be == "1.5-b7fe4bb7b4bbf9986d78b50360b7a95b"
      expect(Utility::Scenario.checksum("402")).to be == "1.2-6923aa7fcdd7d31bf6f9f6aeafe40ddc"
      expect(Utility::Scenario.checksum("403")).to be == "1.1-acf55a632e2402d238218d9ff9a14c15"
      expect(Utility::Scenario.checksum("404")).to be == "1.2-ebdefe69cc9f9b59185f662be9314943"
      expect(Utility::Scenario.checksum("405")).to be == "1.1-48a08e2b3ef86fa1b2ed2bec1c73869f"
      expect(Utility::Scenario.checksum("406")).to be == "1.3-73e42860ab89e496f6d8b3419bc2b0bc"
      expect(Utility::Scenario.checksum("407")).to be == "1.1-1ede25a05e7ddd97ca01a695923a5c51"
      expect(Utility::Scenario.checksum("408")).to be == "0.4a-b875bcc1006dfc6f63a2b9758ffac8b7"
      expect(Utility::Scenario.checksum("409")).to be == "0.3a-6fa7571bc9b251f5eecd262ea2faf6d6"
      expect(Utility::Scenario.checksum("410")).to be == "0.3a-fadaacc6398576c63ad5c2c7c767f27c"
      expect(Utility::Scenario.checksum("411")).to be == "0.4a-7e1dd5a3a0e2df33fec56fe6bd3ff103"
      expect(Utility::Scenario.checksum("412")).to be == "0.3a-55db1b585ed85cabfecbf18f6a842120"
      expect(Utility::Scenario.checksum("413")).to be == "0.2a-05d4f15b10efb5bd432c12f1318fafa0"
      expect(Utility::Scenario.checksum("414")).to be == "0.2a-0a15b17f3e8bce20b86707b3a689a62b"
      expect(Utility::Scenario.checksum("415")).to be == "0.3a-4355b7dd07e0826b69f5446459747a49"
      expect(Utility::Scenario.checksum("416")).to be == "0.3a-2fd0a110e823c3e670be280c8d8bae63"
      expect(Utility::Scenario.checksum("417")).to be == "1.1-c0cfab8786e1f307094d2bff6cee23c5"
      expect(Utility::Scenario.checksum("418")).to be == "0.2a-e59a38036065feda4ce1d43bf4bab240"
      expect(Utility::Scenario.checksum("419")).to be == "0.3a-4522c9801dd4007def3b5a2df0656c2c"
      expect(Utility::Scenario.checksum("420")).to be == "1.2-cee8b52bbc66d92b5dc91e3723f2f1a9"
      expect(Utility::Scenario.checksum("421")).to be == "0.2a-b5a88dab62f43ab339088eab7b23e5e5"
      expect(Utility::Scenario.checksum("422")).to be == "0.3a-25651d9c948bbd0eda48ecf5df9b4aed"
      expect(Utility::Scenario.checksum("423")).to be == "0.2a-21e1123e75ca83cf2d28d714f72f940f"
      expect(Utility::Scenario.checksum("424")).to be == "0.2a-8a3103f5434b2b6cc91f74f655616932"
      expect(Utility::Scenario.checksum("425")).to be == "0.2a-ec991040a2acad4c7b9cb0bc2ac6b512"
      expect(Utility::Scenario.checksum("426")).to be == "0.2a-fb2b662f7af08bf9aa0f962ae809a8a0"
      expect(Utility::Scenario.checksum("427")).to be == "0.2a-470d7ff029d0315b21173efa42b2b0e9"
      expect(Utility::Scenario.checksum("428")).to be == "0.2a-88136280fe385cb3108ec7769b65544b"

      expect(Utility::Scenario.checksum("501")).to be == "1.3-a85ad17c3455d26dc860c3aec87fc4f4"
      expect(Utility::Scenario.checksum("502")).to be == "1.1-aaed530324fda5b78e7a3d23f7102e9e"
      expect(Utility::Scenario.checksum("503")).to be == "1.3-199f8204e1f622054ab7ff8e3d2d98b1"
      expect(Utility::Scenario.checksum("504")).to be == "1.2-a80320dc12230361743761ef6f31f8d8"
      expect(Utility::Scenario.checksum("505")).to be == "1.1-cb2c2a97dbd48bf7b22082362820e9d3"
      expect(Utility::Scenario.checksum("506")).to be == "1.2-5eabbb55e2ca2fbd0c029601a360fee3"
      expect(Utility::Scenario.checksum("507")).to be == "0.4b-239c26ccae4eef3e3fd17a075cb51816"
      expect(Utility::Scenario.checksum("508")).to be == "1.2-c71a108fb6e3b628b457dd69c02ca456"
      expect(Utility::Scenario.checksum("509")).to be == "0.4a-46e736534f4957819edbe700835cab26"
      expect(Utility::Scenario.checksum("510")).to be == "1.4-c6a378159568cc4f745716cc0667d23f"
      expect(Utility::Scenario.checksum("511")).to be == "0.3a-db843eb07857c7c5ebb5e1270828e566"
      expect(Utility::Scenario.checksum("512")).to be == "1.4-0d51f17b96fef7c1627e45d603e419e3"
      expect(Utility::Scenario.checksum("513")).to be == "0.2a-37c26d311487c0621f73dba79de4d19b"
      expect(Utility::Scenario.checksum("514")).to be == "0.3a-c6774befeb0b7f3e9d4a4b78a961cdf8"
      expect(Utility::Scenario.checksum("515")).to be == "0.2a-7eccd74280d1fe1bfad0992a69fdf9b7"
      expect(Utility::Scenario.checksum("516")).to be == "0.2a-5de3c46964b3e976f20510f4cae3e30b"
      expect(Utility::Scenario.checksum("517")).to be == "0.2a-9d2c986c5a83b1f0bc57f0f0d5becfbd"
      expect(Utility::Scenario.checksum("518")).to be == "0.2a-529e1b3459fdeb04aa43344ed6c3abd0"
      expect(Utility::Scenario.checksum("519")).to be == "0.2a-ca2c072275de53fe55f66ce8b6f42056"
      expect(Utility::Scenario.checksum("520")).to be == "0.2a-26f11084fc5254abcc32dcd6dc8b2a1d"
      expect(Utility::Scenario.checksum("521")).to be == "0.2a-d3db50e3a12e00490ad1fc31f7320184"
      expect(Utility::Scenario.checksum("522")).to be == "0.2a-01866fe45fdc223f2e69669b81c192af"
      expect(Utility::Scenario.checksum("523")).to be == "0.2a-c5db5bbbb3cc4f8b728771f622c9584d"
      expect(Utility::Scenario.checksum("524")).to be == "0.3a-0dbe98d56f132bfdfb1a6680caa471ab"

      expect(Utility::Scenario.checksum("601")).to be == "1.3-2bd3e19af34a23515d77d0637eb475ba"
      expect(Utility::Scenario.checksum("602")).to be == "1.2-130775c37de930c5756dd98daa8944ed"
      expect(Utility::Scenario.checksum("603")).to be == "1.5-6f21cc31b655cb1889ccfb78f0545537"
      expect(Utility::Scenario.checksum("604")).to be == "1.4-5f0511f8ced197e89ceecb7d820ee6fe"
      expect(Utility::Scenario.checksum("605")).to be == "0.3a-4b106b5d1fb316a01e28750dd42c13b4"
      expect(Utility::Scenario.checksum("606")).to be == "0.3a-eed78c7b0d3fbf9ea282cd8f2dbabb2d"
      expect(Utility::Scenario.checksum("607")).to be == "0.4a-ca26b065a6166af9da6573b92e61ec32"
      expect(Utility::Scenario.checksum("608")).to be == "0.3a-898d9a0e745a8a40b6a8688ed1d59130"
      expect(Utility::Scenario.checksum("609")).to be == "0.3a-1e4c7b4c4287f96253397a10b7e2146b"
      expect(Utility::Scenario.checksum("610")).to be == "0.3a-aafc19e352d1153f41000cf398f5bdef"
      expect(Utility::Scenario.checksum("611")).to be == "0.2a-68edc8f0c50420e1f2522ff8850b6cc1"
      expect(Utility::Scenario.checksum("612")).to be == "0.2a-6810f444a2fb638a971f71b0c9a64d66"
      expect(Utility::Scenario.checksum("613")).to be == "0.3a-6c7dec05ce777f12624b2da66c9d6d04"
      expect(Utility::Scenario.checksum("614")).to be == "0.3a-b91f1d875ec330d58b400dd992c6d7c3"
      expect(Utility::Scenario.checksum("615")).to be == "0.2a-80153b031d9242940e94819a34538373"
      expect(Utility::Scenario.checksum("616")).to be == "0.3a-69d66d38b2920847becfb2957c8868f0"

      expect(Utility::Scenario.checksum("701")).to be == "0.2a-69d357ce263c6852ecd596c040df818f"
      expect(Utility::Scenario.checksum("702")).to be == "0.2a-a64f919ad27563e8b0cc87be6747842a"
      expect(Utility::Scenario.checksum("703")).to be == "0.2a-b3fa712be0e055e3071a88be9e5c9316"
      expect(Utility::Scenario.checksum("704")).to be == "0.2a-c1a0a80497c09f615414311700a42700"
      expect(Utility::Scenario.checksum("705")).to be == "0.2a-11e429e070824e319110f4094db3c358"
      expect(Utility::Scenario.checksum("706")).to be == "0.2a-96f42e8145f96df6b33721d82c8814c3"
      expect(Utility::Scenario.checksum("707")).to be == "0.2a-df4caeb486e41b7049b5cd56cd264cc8"
      expect(Utility::Scenario.checksum("708")).to be == "0.2a-7ecad6cf9cf46c550a02ec64a755266e"
      expect(Utility::Scenario.checksum("709")).to be == "0.2a-4fcf51d94b9e0c9b1f8a06fd0e795dc0"
      expect(Utility::Scenario.checksum("710")).to be == "0.2a-ed875a1ae1a0e6b4311a843c7d26e0b9"
      expect(Utility::Scenario.checksum("711")).to be == "0.2a-19770a02b68dd5d7598d05bd01760819"
      expect(Utility::Scenario.checksum("712")).to be == "0.2a-1ef5b87ffa5abbc9f68628a64dd295ee"
      expect(Utility::Scenario.checksum("713")).to be == "0.2a-8cf4263000e59d9f6e51500727fcfbc5"
      expect(Utility::Scenario.checksum("714")).to be == "0.2a-b5e6afc06819d4ff398a0a26fa9611f1"
      expect(Utility::Scenario.checksum("715")).to be == "0.2a-ed7d48459e75c7ae76710ec41c148c46"
      expect(Utility::Scenario.checksum("716")).to be == "0.2a-4f3164326bc7df5a95bf628a7a801063"
      expect(Utility::Scenario.checksum("717")).to be == "0.2a-d014e57b3c7cd495ef6e9a953d442309"
      expect(Utility::Scenario.checksum("718")).to be == "0.2a-94a51ef52b60abffcc7af44312445b20"
      expect(Utility::Scenario.checksum("719")).to be == "0.2a-c659a90625f1c10cd1731104d83275ba"
      expect(Utility::Scenario.checksum("720")).to be == "0.2a-c66158e96ebe17fc889c2e0711a6440c"
      expect(Utility::Scenario.checksum("721")).to be == "0.2a-a31b963c4574e5728849ba70c212ae76"
      expect(Utility::Scenario.checksum("722")).to be == "0.2a-23601125e0424f8a2c9b15e8211c9c67"
      expect(Utility::Scenario.checksum("723")).to be == "0.2a-7ea79d9df751b0698515b4898b47ba09"
      expect(Utility::Scenario.checksum("724")).to be == "0.2a-77b2c61c1b9f001fad77a66647734d18"

      expect(Utility::Scenario.checksum("801")).to be == "0.2a-be667c3f543645e3debdb6256f957d35"
      expect(Utility::Scenario.checksum("802")).to be == "0.2a-fab60dcf702c0963b85301145a93aeef"
      expect(Utility::Scenario.checksum("803")).to be == "0.2a-c858a46ae8012e386fc6cbe90d9052a2"
      expect(Utility::Scenario.checksum("804")).to be == "0.2a-b6124d7d94207a31f652818c61735ab0"
      expect(Utility::Scenario.checksum("805")).to be == "0.2a-4aa13408045e6ed998c1ee0aef76a4dd"
      expect(Utility::Scenario.checksum("806")).to be == "0.2a-a165600029b33ee6fa2686ff96b9c0af"
      expect(Utility::Scenario.checksum("807")).to be == "0.2a-a609240620c4f29fa6a78db17177ca39"
      expect(Utility::Scenario.checksum("808")).to be == "0.2a-500ccb3d59ef0d3e1640bfaa5880e4c2"
      expect(Utility::Scenario.checksum("809")).to be == "0.2a-b332d6e5feff21d6a801f201b3a21cd6"
      expect(Utility::Scenario.checksum("810")).to be == "0.2a-fe50a22f7f8b33474cade2cae9d37b43"
      expect(Utility::Scenario.checksum("811")).to be == "0.2a-ac3234872cc9e7b452bacea7cc5b1eea"
      expect(Utility::Scenario.checksum("812")).to be == "0.2a-8afa75a2e5dbedef8d258a4269c69ea5"
      expect(Utility::Scenario.checksum("813")).to be == "0.2a-919802af73630a1b56691b7ba4bd3bca"
      expect(Utility::Scenario.checksum("814")).to be == "0.2a-36f8eafe881eab902485626ea8ead188"
      expect(Utility::Scenario.checksum("815")).to be == "0.2a-db43112654663eb1b238e0bd3fbe1734"
      expect(Utility::Scenario.checksum("816")).to be == "0.2a-30f49e82fe5850ede1495a9cda69dba2"
      expect(Utility::Scenario.checksum("817")).to be == "0.2a-3c2cc031d0536b0ac22c3a9bdfc3d3b4"
      expect(Utility::Scenario.checksum("818")).to be == "0.2a-322fcb04239afb5ed86b51a4ddefa561"
      expect(Utility::Scenario.checksum("819")).to be == "0.2a-5ff046bc7c5bb81616a9594525a016f8"
      expect(Utility::Scenario.checksum("820")).to be == "0.2a-ef1970f1efacdb0fce0bbee3103a157d"
      expect(Utility::Scenario.checksum("821")).to be == "0.2a-3440afca01d78e2e9fce6a8a545329c2"
      expect(Utility::Scenario.checksum("822")).to be == "0.2a-4a90aefb8c20d2c457b05ed382252db9"
      expect(Utility::Scenario.checksum("823")).to be == "0.2a-e8862a84413e33183b480b75cfc19613"
      expect(Utility::Scenario.checksum("824")).to be == "0.2a-de595b4d5e10166226ed4f559a42c46d"
      expect(Utility::Scenario.checksum("825")).to be == "0.2a-04ac00fb33a4a12aa391ef703fb9f64b"
      expect(Utility::Scenario.checksum("826")).to be == "0.2a-21dce01330b93f0e5d5c9a11043aee57"
      expect(Utility::Scenario.checksum("827")).to be == "0.2a-a317b4bb092d7e1b9c13e7534f158080"

      expect(Utility::Scenario.checksum("901")).to be == "0.2a-e127da9c8c887f16e8ae717b2219a9df"
      expect(Utility::Scenario.checksum("902")).to be == "0.2a-925c6874c4bdd0fea51481dc865816f2"
      expect(Utility::Scenario.checksum("903")).to be == "0.2a-042b71d6ec81f8948b54c5c00f648d5d"
      expect(Utility::Scenario.checksum("904")).to be == "0.2a-22aa146b6b448b5dbe854c5775e2f6e9"
      expect(Utility::Scenario.checksum("905")).to be == "0.2a-febac17010cf10b7b608210cc39387a9"
      expect(Utility::Scenario.checksum("906")).to be == "0.2a-fbc3c86a716a71f5615cddbc09c54a77"
      expect(Utility::Scenario.checksum("907")).to be == "0.2a-9209f81faa2fbf6b83080fcc12234bd7"
      expect(Utility::Scenario.checksum("908")).to be == "0.2a-43fb9b992fedce6a6ba7a5b2610783bd"
      expect(Utility::Scenario.checksum("909")).to be == "0.2a-1725651c646aa6db9c32c9ffdfdb7031"
      expect(Utility::Scenario.checksum("910")).to be == "0.2a-86ddb80752b056fb0a8904adbb6596c9"
      expect(Utility::Scenario.checksum("911")).to be == "0.2a-e65be814cc435112d46c35d64cb498bc"
      expect(Utility::Scenario.checksum("912")).to be == "0.2a-ee93163fc63cccc9b989402a6c5a0eca"
      expect(Utility::Scenario.checksum("913")).to be == "0.2a-9b621502347afaf7a1c73cf0c99a0813"
      expect(Utility::Scenario.checksum("914")).to be == "0.2a-7ca6a62c624c907eadf1b087bd9fcd47"
      expect(Utility::Scenario.checksum("915")).to be == "0.2a-56d2ff3fe0846cba0b9112b811a0853d"
    end
  end
end
