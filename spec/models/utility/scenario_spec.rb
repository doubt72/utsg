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
      expect(constants.length).to be == 225

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
      expect(Utility::Scenario.checksum("016")).to be == "0.6a-dbfb72766ff9b40cf8281a6f54971db9"
      expect(Utility::Scenario.checksum("017")).to be == "0.3a-041234c519e46297b678f4b2f793567c"
      expect(Utility::Scenario.checksum("018")).to be == "0.3a-e87dced065f6242a90bd0388bd66bfac"
      expect(Utility::Scenario.checksum("019")).to be == "0.2a-0e2a8370205c6352a0e73b531c896d17"
      expect(Utility::Scenario.checksum("020")).to be == "0.3a-5d1dda754cdd1668ab93f32a6d55d9c7"
      expect(Utility::Scenario.checksum("021")).to be == "0.2a-bc4fb6f31c4c130e1b28fbf1e822ff2a"
      expect(Utility::Scenario.checksum("022")).to be == "0.2a-59423cf025f93b729dae95619f46a08d"
      expect(Utility::Scenario.checksum("023")).to be == "0.6a-93c6d0798530b9e873fee13b96c5599c"
      expect(Utility::Scenario.checksum("024")).to be == "0.3a-e179f00e548c7d4a11e77d877c369152"
      expect(Utility::Scenario.checksum("025")).to be == "0.3a-feb980a5688aa451431698bb27e5e6ca"
      expect(Utility::Scenario.checksum("026")).to be == "1.1-d76dc12462114114febd4988d0e1ba51"
      expect(Utility::Scenario.checksum("027")).to be == "0.3a-686bf04fa8a59e8552e5deb814276be7"
      expect(Utility::Scenario.checksum("028")).to be == "0.3a-a49d0447381ebf7b979c83e1a0b74e9a"
      expect(Utility::Scenario.checksum("029")).to be == "0.3a-cd0ba66f5faec35c6e26672740067aa9"
      expect(Utility::Scenario.checksum("030")).to be == "0.2a-05ff44fd24d8b37d4d014618eba8ce27"
      expect(Utility::Scenario.checksum("031")).to be == "0.2a-d66e4f04f5c4a008c6287ec2c2eb791c"
      expect(Utility::Scenario.checksum("032")).to be == "0.2a-f9380ff9571d54cd4fdd5cc1f5466dd6"
      expect(Utility::Scenario.checksum("033")).to be == "0.3a-01af2b1dc2398484ef30f80b02473793"
      expect(Utility::Scenario.checksum("034")).to be == "0.3a-ce2c6d997b6d2f3e1f200a1b5987dec3"
      expect(Utility::Scenario.checksum("035")).to be == "0.2a-2d4cb1a691cd563eb0548219755c5a48"
      expect(Utility::Scenario.checksum("036")).to be == "0.3a-9b46786d3230dae7c4aab81ac0b51cdf"
      expect(Utility::Scenario.checksum("037")).to be == "1.1-8f29e5ad911adc19372760b305709088"
      expect(Utility::Scenario.checksum("038")).to be == "0.3a-fdd2e7ab66cc70923c36bee64690dcfb"
      expect(Utility::Scenario.checksum("039")).to be == "0.2a-a9c02dd3bf059236a27682558986958f"
      expect(Utility::Scenario.checksum("040")).to be == "0.2a-82f447da6599ed6235973f9e8717027b"
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
      expect(Utility::Scenario.checksum("112")).to be == "0.3a-26319464ef909be81752b6e961c0faef"
      expect(Utility::Scenario.checksum("113")).to be == "0.2a-debea64141782a514f0c463b4ab4ac19"
      expect(Utility::Scenario.checksum("114")).to be == "0.3a-c5c4e4a3ab8c4d4b701c4b5cdeaae533"
      expect(Utility::Scenario.checksum("115")).to be == "0.2a-ef8b8e7beae65d5409565e0e2f973d4a"
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
      expect(Utility::Scenario.checksum("211")).to be == "0.3a-f76b06c90864582036a54783ed46e5a9"
      expect(Utility::Scenario.checksum("212")).to be == "0.3a-3e6ba324bd356b810eecd7392d71e8d2"
      expect(Utility::Scenario.checksum("213")).to be == "0.2a-86c4ad765fa8ef0e601552a9574f430e"
      expect(Utility::Scenario.checksum("214")).to be == "0.2a-96a8ae059b33820fc25f07df6436a6f7"
      expect(Utility::Scenario.checksum("215")).to be == "0.3a-22211731ab1012bda1f861bac2d733a2"
      expect(Utility::Scenario.checksum("216")).to be == "0.2a-f263853aa7521f8d7dffcd3e08a986ff"

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
      expect(Utility::Scenario.checksum("313")).to be == "0.3a-d67cdd6bc97df159af06b513a5320b8e"
      expect(Utility::Scenario.checksum("314")).to be == "0.3a-691cb46b31b2308bec712437dd4ee164"
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
      expect(Utility::Scenario.checksum("329")).to be == "0.3a-03700217ca1aff70743ffafc957a9693"
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
      expect(Utility::Scenario.checksum("411")).to be == "0.4a-8726c88fbcc929d8517f5bd57a8f8a05"
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
      expect(Utility::Scenario.checksum("424")).to be == "0.2a-f7691c373443392e20011bbc74010ca6"
      expect(Utility::Scenario.checksum("425")).to be == "0.2a-ec991040a2acad4c7b9cb0bc2ac6b512"
      expect(Utility::Scenario.checksum("426")).to be == "0.2a-c1933a5fc81ad4c4a055c8667fb90f4c"
      expect(Utility::Scenario.checksum("427")).to be == "0.2a-470d7ff029d0315b21173efa42b2b0e9"
      expect(Utility::Scenario.checksum("428")).to be == "0.2a-07c5ecc45618bf0db558064293dd699c"

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
      expect(Utility::Scenario.checksum("514")).to be == "0.3a-c5f22357ddfe59b56ec4507b72cc07d0"
      expect(Utility::Scenario.checksum("515")).to be == "0.2a-3708e1ec421fd44ce3bc3e6eb7172950"
      expect(Utility::Scenario.checksum("516")).to be == "0.2a-335952b87b231df806f1ca5f5ef3458f"
      expect(Utility::Scenario.checksum("517")).to be == "0.2a-1b27dba22dec2e3beba571675fd6ca07"
      expect(Utility::Scenario.checksum("518")).to be == "0.2a-45e1cd52c735c46f3a90494e38e61d70"
      expect(Utility::Scenario.checksum("519")).to be == "0.2a-1c2331b6dd152e9b938881d7cf3cdcb9"
      expect(Utility::Scenario.checksum("520")).to be == "0.2a-37987119feb816c2e99502c6d2665219"
      expect(Utility::Scenario.checksum("521")).to be == "0.2a-65fd5fa571d3cca0ecd6a37a5fe0e549"
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
      expect(Utility::Scenario.checksum("615")).to be == "0.2a-0be3e7645bf51e90b6399cfdcb9a348e"
      expect(Utility::Scenario.checksum("616")).to be == "0.3a-8c6c0efa5f3f229e570345fbdcac67f1"

      expect(Utility::Scenario.checksum("801")).to be == "0.1p-48097e24ec33bf556b99644299a04c96"
      expect(Utility::Scenario.checksum("802")).to be == "0.1p-4a4770ccb498516945cc17d5e3e15b59"
      expect(Utility::Scenario.checksum("803")).to be == "0.1p-9b7f6eb9be0ae4daa4c198105cbc207d"
      expect(Utility::Scenario.checksum("804")).to be == "0.1p-ff2f5829ee3a0910d82699e35d82451e"
      expect(Utility::Scenario.checksum("805")).to be == "0.1p-b5fd7dfb5238c38ac08baa24efa1539a"
      expect(Utility::Scenario.checksum("806")).to be == "0.1p-d0bc30b17556e310d30337e215c1454e"
      expect(Utility::Scenario.checksum("807")).to be == "0.1p-8685a8347cb9a19980f8e362d0d8cfd5"
      expect(Utility::Scenario.checksum("808")).to be == "0.1p-5f6338d9e7086e05119cd9d8add22507"
      expect(Utility::Scenario.checksum("809")).to be == "0.1p-ccd1000490e66cf555576433030b7a59"
      expect(Utility::Scenario.checksum("810")).to be == "0.1p-d9c0701bdab4d277b5de194aad8657d7"
      expect(Utility::Scenario.checksum("811")).to be == "0.1p-e8f9b3266b42b256f4405ccb4328ca27"
      expect(Utility::Scenario.checksum("812")).to be == "0.1p-9127d2dcb0c31830e14ee5d667a57d43"
      expect(Utility::Scenario.checksum("813")).to be == "0.1p-3526a5efb5595998e65f703d70ef74a9"
      expect(Utility::Scenario.checksum("814")).to be == "0.1p-247e01282fded3731b27fa63b3660f3c"
      expect(Utility::Scenario.checksum("815")).to be == "0.1p-847fe7dc856937008620df102d8670be"
      expect(Utility::Scenario.checksum("816")).to be == "0.1p-199db0cdde88313b41abf265bd2a1503"
      expect(Utility::Scenario.checksum("817")).to be == "0.1p-c3cf90c7e820151dcbcfc7b858251e21"
      expect(Utility::Scenario.checksum("818")).to be == "0.1p-f77518e289e0eb684964ed3cdc4a1dbb"
      expect(Utility::Scenario.checksum("819")).to be == "0.1p-1dbfc7e9ba6b74eb3c7af581119e6bf5"
      expect(Utility::Scenario.checksum("820")).to be == "0.1p-2754e20dbb5525c779ab015462a1728c"
      expect(Utility::Scenario.checksum("821")).to be == "0.1p-0e9b44d851faecb9b47a9d9bf93f0cb8"
      expect(Utility::Scenario.checksum("822")).to be == "0.1p-c4b65e6036cee056728baf44aa7cfd3c"
      expect(Utility::Scenario.checksum("823")).to be == "0.1p-d386f8f0a6eba4b8b8d93b5165f5b6c1"
      expect(Utility::Scenario.checksum("824")).to be == "0.1p-91d74329f5594d38760aa88f1b0cb064"
      expect(Utility::Scenario.checksum("825")).to be == "0.1p-817f7c91c0780cefa97fcaf01ec13d88"
      expect(Utility::Scenario.checksum("826")).to be == "0.1p-9747f59206f41d8ef87d7ea76912d6bf"
      expect(Utility::Scenario.checksum("827")).to be == "0.1p-009b9eb5308d9c6e4f9fd183fcc016de"

      expect(Utility::Scenario.checksum("901")).to be == "0.1p-9e74c29b604f3932b5c20f6d9aadab6e"
      expect(Utility::Scenario.checksum("902")).to be == "0.1p-3ed6e07c002a01bbea3b7817c30e5fa3"
      expect(Utility::Scenario.checksum("903")).to be == "0.1p-ff9a4e53ea42a22996166378f05e7e65"
      expect(Utility::Scenario.checksum("904")).to be == "0.1p-819c8005aeb04a60658bc5d078fa42fe"
      expect(Utility::Scenario.checksum("905")).to be == "0.1p-2653c0cdc640379fab42a34bd1b9bf91"
      expect(Utility::Scenario.checksum("906")).to be == "0.1p-692cd3775baffc6b12ef90779e1258a2"
      expect(Utility::Scenario.checksum("907")).to be == "0.1p-50df1dd3dd1adeb18035ad99dff53363"
      expect(Utility::Scenario.checksum("908")).to be == "0.1p-f3c356a0623d5129786fddc7a442772f"
      expect(Utility::Scenario.checksum("909")).to be == "0.1p-9705367e861ce57e142f260b67305818"
      expect(Utility::Scenario.checksum("910")).to be == "0.1p-1f72b507e5aef5dfeaa7f174f98e7a5d"
      expect(Utility::Scenario.checksum("911")).to be == "0.1p-cd0d00478699772797fa49e86e586b15"
      expect(Utility::Scenario.checksum("912")).to be == "0.1p-47f26c52284282d35e79abdb4402b95b"
      expect(Utility::Scenario.checksum("913")).to be == "0.1p-f9ac01a198100e6f4c62ff119b34a854"
      expect(Utility::Scenario.checksum("914")).to be == "0.1p-8eaa1143e0c74c745d688f7752990bab"
      expect(Utility::Scenario.checksum("915")).to be == "0.1p-4edaa36d1bc2691f19b45b93202aefd1"
    end
  end
end
