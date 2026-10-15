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

  context "checksum versioning" do
    it "has correct checksum/versions" do
      # This may seem tedious as hell, but this test will catch any changes to
      # scenarios that don't have the version changes they should.  Saved game
      # integrity depends on versions having correct scenario JSON blobs stared.

      # If this changes, make sure to add entry for version/checksum
      constants = Scenarios.constants.reject do |k|
        %i[Base Scenario999 Scenario0TT].include?(k)
      end
      expect(constants.length).to be == 185

      # If any of these change, scenario MUST to be updated with a new version,
      # then update test with new version/checksum
      expect(Utility::Scenario.checksum("000")).to be == "1.1-81e2c0758eea49450a2e5f2282ccd055"

      expect(Utility::Scenario.checksum("001")).to be == "1.4-8b883d6539a220c220367f1fab184ac8"
      expect(Utility::Scenario.checksum("002")).to be == "1.3-9d7864ce8a04683afd9b2b6750858853"
      expect(Utility::Scenario.checksum("003")).to be == "1.1-57c5f72d5146de752b4bfd0bb297c466"
      expect(Utility::Scenario.checksum("004")).to be == "1.0-ab678abe63c79c71108f0995fd43486b"
      expect(Utility::Scenario.checksum("005")).to be == "1.1-c137c38f86228fe1b082b4f22e109d92"
      expect(Utility::Scenario.checksum("006")).to be == "1.0-0cba3dd36cbfaa21e92c3e583fe8037d"
      expect(Utility::Scenario.checksum("007")).to be == "1.3-d4cd0c95918a3cf92bdca1b2a4ff2194"
      expect(Utility::Scenario.checksum("008")).to be == "1.1-b41f149c7714757ccea0c6b986a61839"
      expect(Utility::Scenario.checksum("009")).to be == "1.0-e349a34f70ff4271c1f7d7333153c456"
      expect(Utility::Scenario.checksum("010")).to be == "1.1-6ac70dbd123eec7e01f373f2d29253ce"
      expect(Utility::Scenario.checksum("011")).to be == "1.5-f7be5469e5ba6faaf25daae998418722"
      expect(Utility::Scenario.checksum("012")).to be == "1.0-8858580948314cf14039ee176f8c15a4"
      expect(Utility::Scenario.checksum("013")).to be == "0.4b-d7ddf8d2251ad7cc148cc7a0c1ffc40f"
      expect(Utility::Scenario.checksum("014")).to be == "0.3a-a97550452486bf5599b1efd0347b3c55"
      expect(Utility::Scenario.checksum("015")).to be == "0.3a-653a663dd116a03f22bdcfce46749d5d"
      expect(Utility::Scenario.checksum("016")).to be == "0.6a-d7c12d3f20052ac74fff14a2a75be846"
      expect(Utility::Scenario.checksum("017")).to be == "0.3a-ccaaed1ef7cd4968c70b4049bb0e6055"
      expect(Utility::Scenario.checksum("018")).to be == "0.3a-02163e8bfa031c33fb57d6378278dbf1"
      expect(Utility::Scenario.checksum("019")).to be == "0.2a-23e10080777d60844cc9106d0c41258d"
      expect(Utility::Scenario.checksum("020")).to be == "0.3a-6d2de1b8e0e62fecc5914a0ecda9fc75"
      expect(Utility::Scenario.checksum("021")).to be == "0.2a-46f8dc2c034c7a6b853a84a98a06d977"
      expect(Utility::Scenario.checksum("022")).to be == "0.2a-428e9d5c1773e9c6666c1b608eccaaa6"
      expect(Utility::Scenario.checksum("023")).to be == "0.6a-e6f95d38cd1364a5979b410b866335cf"
      expect(Utility::Scenario.checksum("024")).to be == "0.3a-404979834e00869ca6342931c99f9dcc"
      expect(Utility::Scenario.checksum("025")).to be == "0.3a-225bb6a805b6ee49ef828927a48438d7"
      expect(Utility::Scenario.checksum("026")).to be == "1.0-283dc335ab3f258aabe2ff5f8368a03d"
      expect(Utility::Scenario.checksum("027")).to be == "0.3a-81970eb8390bf7f2d8005f72eb93692a"
      expect(Utility::Scenario.checksum("028")).to be == "0.3a-02ab5abc32a5a554b357b10fa619c954"
      expect(Utility::Scenario.checksum("029")).to be == "0.3a-98343640e96ee3cc1042c0d7aab251fa"
      expect(Utility::Scenario.checksum("030")).to be == "0.2a-8ded0de698b8f2c81cd1e2d07a67630e"
      expect(Utility::Scenario.checksum("031")).to be == "0.2a-c71e871c10adc7c02239107b2f926409"
      expect(Utility::Scenario.checksum("032")).to be == "0.2a-d324d62cd225a6ba5c05d683e167951e"
      expect(Utility::Scenario.checksum("033")).to be == "0.3a-38c842a571bf32a767f53bd652c09bf2"
      expect(Utility::Scenario.checksum("034")).to be == "0.3a-2f7612de147d2b505cc9048066762403"
      expect(Utility::Scenario.checksum("035")).to be == "0.2a-94b9cd0aa7179ef4976fed08fb8a398b"
      expect(Utility::Scenario.checksum("036")).to be == "0.3a-1ef95d3a2d0c5eab2bbb3fb831cb483d"
      expect(Utility::Scenario.checksum("037")).to be == "1.0-d6364fcc190a2ac7d4f6de2524e9263d"
      expect(Utility::Scenario.checksum("038")).to be == "0.3a-b39bf7ea4fb6c65d61bf722e9d498e33"
      expect(Utility::Scenario.checksum("039")).to be == "0.2a-6683f7727c0238eb883579ff64d5e6b7"
      expect(Utility::Scenario.checksum("040")).to be == "0.2a-8aa0df45e9c1ca5e8cce57f212357e64"
      expect(Utility::Scenario.checksum("041")).to be == "0.2a-6e599b5a08376f2e643aee7d6716cc3e"
      expect(Utility::Scenario.checksum("042")).to be == "0.2a-6a87e33b22c64efc748830e8fd0809f6"
      expect(Utility::Scenario.checksum("043")).to be == "0.3a-622d344e9031928070b087147c3fefcd"
      expect(Utility::Scenario.checksum("044")).to be == "0.2a-d612f25485ffb5c6b9d5662125776393"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-1b1ce29864f60efccc2ae32e1a613d42"
      expect(Utility::Scenario.checksum("102")).to be == "1.0-0914d469887d7582e082cd84d5e0cd07"
      expect(Utility::Scenario.checksum("103")).to be == "1.2-97c54372a831ae957c96b7167ef5b3be"
      expect(Utility::Scenario.checksum("104")).to be == "1.0-f5238f37e0535f87c2299cafe31fc22e"
      expect(Utility::Scenario.checksum("105")).to be == "1.0-f2abcb67b433f09ddc9201c35c4aa90b"
      expect(Utility::Scenario.checksum("106")).to be == "1.1-5e84b0d190a59c056d076dbee0506bd3"
      expect(Utility::Scenario.checksum("107")).to be == "1.0-f706be086c498a42d58b5ed151c170fb"
      expect(Utility::Scenario.checksum("108")).to be == "0.4a-ff0d52b8c3c197e5e74cd710dd7d9f8f"
      expect(Utility::Scenario.checksum("109")).to be == "0.4a-f4832e675dd623a68cb9740888d06f16"
      expect(Utility::Scenario.checksum("110")).to be == "0.4a-bb01d87be86cb6226e8d80dee940e3b0"
      expect(Utility::Scenario.checksum("111")).to be == "0.3a-d57fb1390be25af030c41b0c75260a55"
      expect(Utility::Scenario.checksum("112")).to be == "0.3a-85e3bd58035efafa42814e49076966f3"
      expect(Utility::Scenario.checksum("113")).to be == "0.2a-cb3d63791329094d290231d080e997ca"
      expect(Utility::Scenario.checksum("114")).to be == "0.3a-4bba2fa99d433ba95458898ae187f11e"
      expect(Utility::Scenario.checksum("115")).to be == "0.2a-e0f37ec6329b8134508ad207b1ca13c3"
      expect(Utility::Scenario.checksum("116")).to be == "0.2a-792cca74d144ce9152cc26612b956a5b"
      expect(Utility::Scenario.checksum("117")).to be == "0.2a-2ad97e958078517afc4c252e28005301"
      expect(Utility::Scenario.checksum("118")).to be == "0.2a-32fa6ce25de410cc2667200fce5cc15b"
      expect(Utility::Scenario.checksum("119")).to be == "0.2a-bc63c090f66dac14137cf28b47691134"
      expect(Utility::Scenario.checksum("120")).to be == "0.2a-ebc131eee1625e343afbefce5f353321"
      expect(Utility::Scenario.checksum("121")).to be == "0.2a-4f150c54c77d83d0e3f9d7224e4fe616"
      expect(Utility::Scenario.checksum("122")).to be == "0.3a-383698c7584abfc761ab1eea6c9ece2f"
      expect(Utility::Scenario.checksum("123")).to be == "0.3a-e5066c03fdbebd8e589a4c7a5fab76ad"
      expect(Utility::Scenario.checksum("124")).to be == "0.2a-17771fb6c77c57b5c24aef922ffcd8ff"

      expect(Utility::Scenario.checksum("201")).to be == "1.1-ad1616bd08b6f67f90597dcc117c4a1e"
      expect(Utility::Scenario.checksum("202")).to be == "1.0-c23021496106a10b71100bded02eb026"
      expect(Utility::Scenario.checksum("203")).to be == "1.0-dfa1cf28dc5e7728caf769a3dba4ea7f"
      expect(Utility::Scenario.checksum("204")).to be == "1.0-65b0f425e5bdecb601d74c401dbe6d87"
      expect(Utility::Scenario.checksum("205")).to be == "0.4a-f8e8312a84cc4396ee82a34a8346badb"
      expect(Utility::Scenario.checksum("206")).to be == "0.4a-73eecfaa0553dbbb951ad2ce958c9825"
      expect(Utility::Scenario.checksum("207")).to be == "0.3a-274d9c8b4e6a233e663c24436df3fd17"
      expect(Utility::Scenario.checksum("208")).to be == "0.3a-75338465e3c6ca13368918ca3881b0f0"
      expect(Utility::Scenario.checksum("209")).to be == "0.3a-c1ad986670cf877639a5745b435aef79"
      expect(Utility::Scenario.checksum("210")).to be == "0.2a-9e8c1faebdec48802ac46216f420c8f8"
      expect(Utility::Scenario.checksum("211")).to be == "0.3a-2ac26ab40627711373fe65131320f54d"
      expect(Utility::Scenario.checksum("212")).to be == "0.3a-4316afb8ef998dc229c0ede9ee51ef0f"
      expect(Utility::Scenario.checksum("213")).to be == "0.2a-ba616dcd6bd3a88defc762e8af8cafd7"
      expect(Utility::Scenario.checksum("214")).to be == "0.2a-2a988d9ab555df74f62a6240d924e85d"
      expect(Utility::Scenario.checksum("215")).to be == "0.3a-e7fac85b1e71ad65f2ab618e46de310c"
      expect(Utility::Scenario.checksum("216")).to be == "0.2a-642cb3936fffc28a2855e7c9af1b6c5f"

      expect(Utility::Scenario.checksum("301")).to be == "1.4-e03cbe285095c717488f1520cc569e69"
      expect(Utility::Scenario.checksum("302")).to be == "1.2-0749b2d34d6ffc613f78bde1e36e29e7"
      expect(Utility::Scenario.checksum("303")).to be == "1.2-7a86244b1eaceb886fc31021b5b01364"
      expect(Utility::Scenario.checksum("304")).to be == "1.0-de7e962767d0e661ff66b57da4725fe7"
      expect(Utility::Scenario.checksum("305")).to be == "1.0-e62f61191dc1289a54f20054dc39bfa2"
      expect(Utility::Scenario.checksum("306")).to be == "1.0-8a5846db67320d154c308703f786e606"
      expect(Utility::Scenario.checksum("307")).to be == "1.1-4bfa5133d6dd3c36fdcb89a9092804d6"
      expect(Utility::Scenario.checksum("308")).to be == "1.4-87966dc8adf28db7046b4508b42b9550"
      expect(Utility::Scenario.checksum("309")).to be == "0.4b-a7303457be9d255060b6e0ae6616c1e6"
      expect(Utility::Scenario.checksum("310")).to be == "0.4a-3353232f32a5bc87be951de5a46a8bdb"
      expect(Utility::Scenario.checksum("311")).to be == "0.5a-4bdf65381a2039dd063b4bf1a61c8495"
      expect(Utility::Scenario.checksum("312")).to be == "0.4a-8590fa0f7ba326ce184dd43b34a151b0"
      expect(Utility::Scenario.checksum("313")).to be == "0.3a-ed08e005d9c222ccccccf2b6a30e524c"
      expect(Utility::Scenario.checksum("314")).to be == "0.3a-18017b3de8348624df3fb37154c0b1cd"
      expect(Utility::Scenario.checksum("315")).to be == "1.0-90aa0daf81f0d17e19a723d49aa36f6c"
      expect(Utility::Scenario.checksum("316")).to be == "0.2a-5bff19271938b5ee718be551be5f9e39"
      expect(Utility::Scenario.checksum("317")).to be == "0.2a-bd7c9f1ce4d1b557e43c68fa968f2922"
      expect(Utility::Scenario.checksum("318")).to be == "0.2a-a4fe9c1b69425e54a900dc2dc39653d8"
      expect(Utility::Scenario.checksum("319")).to be == "0.2a-268e9b5fbd5c66a8a4570f3fa5b1ef10"
      expect(Utility::Scenario.checksum("320")).to be == "0.2a-52252d7acdf11171cadebb00d3fc1211"
      expect(Utility::Scenario.checksum("321")).to be == "0.2a-acbc3159a04f2e1a70fbf2e44b2750d3"
      expect(Utility::Scenario.checksum("322")).to be == "0.2a-547685426c34f50e55a830937dc418b9"
      expect(Utility::Scenario.checksum("323")).to be == "0.2a-714766bf8f1a7647a4391986f53e20e3"
      expect(Utility::Scenario.checksum("324")).to be == "0.2a-8a62e2b4e90dafa5ec027b2052186c10"
      expect(Utility::Scenario.checksum("325")).to be == "0.2a-9444b080d51d55a28a3cfc37ebd16879"
      expect(Utility::Scenario.checksum("326")).to be == "0.2a-a781e4ebe0de91eaf77605b080105f08"
      expect(Utility::Scenario.checksum("327")).to be == "0.2a-eb0ea11ddfd2dd964abeed2382a8b8e6"
      expect(Utility::Scenario.checksum("328")).to be == "0.2a-3235906873d6d80a88f9ee70c20212cd"
      expect(Utility::Scenario.checksum("329")).to be == "0.3a-4f2a5d1fb529b1a6526b2b4d9cc489b4"
      expect(Utility::Scenario.checksum("330")).to be == "0.2a-e65eef34f387bdbbaa20cceef1604075"

      expect(Utility::Scenario.checksum("401")).to be == "1.4-da83145a00119c080fe7702c18be58d9"
      expect(Utility::Scenario.checksum("402")).to be == "1.1-489aefc2132dd283d8ba5e9b101b4135"
      expect(Utility::Scenario.checksum("403")).to be == "1.0-aa92ddb4144f90b2abbf3aff663d9d55"
      expect(Utility::Scenario.checksum("404")).to be == "1.1-6be9f6c5fe9f30bbf6662c7c9e322d35"
      expect(Utility::Scenario.checksum("405")).to be == "1.0-a3dc6e39aa10adef70d136232e48bde2"
      expect(Utility::Scenario.checksum("406")).to be == "1.2-764b39b8260bd3b8d4b4ff21ef561eb8"
      expect(Utility::Scenario.checksum("407")).to be == "1.0-4811725839a681bca9f0c3f698a5d039"
      expect(Utility::Scenario.checksum("408")).to be == "0.4a-39834fcc31566389353a40881314d508"
      expect(Utility::Scenario.checksum("409")).to be == "0.3a-1f6c5bbdd210f4616a3ad26b93346b63"
      expect(Utility::Scenario.checksum("410")).to be == "0.3a-fadaacc6398576c63ad5c2c7c767f27c"
      expect(Utility::Scenario.checksum("411")).to be == "0.4a-7e1dd5a3a0e2df33fec56fe6bd3ff103"
      expect(Utility::Scenario.checksum("412")).to be == "0.3a-55db1b585ed85cabfecbf18f6a842120"
      expect(Utility::Scenario.checksum("413")).to be == "0.2a-b9dd96c3eb1c933c91e06e6bf127f301"
      expect(Utility::Scenario.checksum("414")).to be == "0.2a-91d77d0d298a7534c313507a2d56b12a"
      expect(Utility::Scenario.checksum("415")).to be == "0.3a-446af9fc39557cf0081042a1dd904879"
      expect(Utility::Scenario.checksum("416")).to be == "0.3a-a101ab879d0e86518e89fa5a89fcd0ea"
      expect(Utility::Scenario.checksum("417")).to be == "1.0-bbb0b14233d036a2fbccfc0b7a44930d"
      expect(Utility::Scenario.checksum("418")).to be == "0.2a-325389f10e4adc8e5a35386d9fcca6bc"
      expect(Utility::Scenario.checksum("419")).to be == "0.3a-807576bcb67680a3f537c16323d1a085"
      expect(Utility::Scenario.checksum("420")).to be == "1.1-d8dea8c2a4638982ab40af4f369edbc5"
      expect(Utility::Scenario.checksum("421")).to be == "0.2a-b5a88dab62f43ab339088eab7b23e5e5"
      expect(Utility::Scenario.checksum("422")).to be == "0.3a-c8e7e2378ccd36e46a9c59188f12464d"
      expect(Utility::Scenario.checksum("423")).to be == "0.2a-deb874ffa237e9d21bfaa8b75defedd1"
      expect(Utility::Scenario.checksum("424")).to be == "0.2a-13e719179de07ace7a7665cc8d4d5448"
      expect(Utility::Scenario.checksum("425")).to be == "0.2a-411c05db335421597741deb4e8279a66"
      expect(Utility::Scenario.checksum("426")).to be == "0.2a-34750385dc5b60ef2b86146e147f3b46"
      expect(Utility::Scenario.checksum("427")).to be == "0.2a-73bf2016fa8d9064ea9507927d8951fa"
      expect(Utility::Scenario.checksum("428")).to be == "0.2a-6a9661bee2bfeb019f7eb4c72fb7d5da"

      expect(Utility::Scenario.checksum("501")).to be == "1.2-27ecf7b2dab18b930268c7c5c6869fa1"
      expect(Utility::Scenario.checksum("502")).to be == "1.0-51fe13e43ce4db52b043d40a42d2eef6"
      expect(Utility::Scenario.checksum("503")).to be == "1.2-8ca48680f1c7df6922e05c51b0bb4b8e"
      expect(Utility::Scenario.checksum("504")).to be == "1.0-a22b8e03dbe1d5b7f32cd9afcd9f5da1"
      expect(Utility::Scenario.checksum("505")).to be == "1.0-a3ea0b90fc068272a86498f8026621e5"
      expect(Utility::Scenario.checksum("506")).to be == "1.0-6b6108af6048282ff6a8ef4bb95a2823"
      expect(Utility::Scenario.checksum("507")).to be == "0.4b-5703205d08fa06d80bc27c79085214f5"
      expect(Utility::Scenario.checksum("508")).to be == "1.1-f2cd36afc59e79bff31dc2e3ae1e7b73"
      expect(Utility::Scenario.checksum("509")).to be == "0.4a-af9afc4b48325b1669ca48b2e1f9201d"
      expect(Utility::Scenario.checksum("510")).to be == "1.2-e0399ab2badc899c3f12a17f675f2201"
      expect(Utility::Scenario.checksum("511")).to be == "0.3a-dd329160bfcb60770c4c7aab962f2102"
      expect(Utility::Scenario.checksum("512")).to be == "1.2-e8f90a9ec439d34cdd2f5b7d944cdf6c"
      expect(Utility::Scenario.checksum("513")).to be == "0.2a-8f56465b1aa4517dd066bf6b3e9fb045"
      expect(Utility::Scenario.checksum("514")).to be == "0.3a-8532c3095229f34f3757be9077ff5138"
      expect(Utility::Scenario.checksum("515")).to be == "0.2a-48a7d331d11f99ec7335cdd34016286c"
      expect(Utility::Scenario.checksum("516")).to be == "0.2a-1297c6b5570b4799006cca8b27909706"
      expect(Utility::Scenario.checksum("517")).to be == "0.2a-e83e0f7aca869187e7b1ca4d92132e49"
      expect(Utility::Scenario.checksum("518")).to be == "0.2a-e942045089d5bb5b404d22090959b793"
      expect(Utility::Scenario.checksum("519")).to be == "0.2a-ed44090a30372358a75551439fe6f1bb"
      expect(Utility::Scenario.checksum("520")).to be == "0.2a-8c8d08873cb3747a00e226e3f9071efb"
      expect(Utility::Scenario.checksum("521")).to be == "0.2a-b6600a67dc34e72df38593658b8618fd"
      expect(Utility::Scenario.checksum("522")).to be == "0.2a-95a1fd27caf77047cc6bf80d7740dd8a"
      expect(Utility::Scenario.checksum("523")).to be == "0.2a-50171defe583925630d1368527cfcc8c"
      expect(Utility::Scenario.checksum("524")).to be == "0.3a-2161382bfc57935cfcdf8ceb09b3694c"

      expect(Utility::Scenario.checksum("601")).to be == "1.2-ae6409b2023188831b01b7962a6aa8e3"
      expect(Utility::Scenario.checksum("602")).to be == "1.1-64c59d98c2bbe5cae7298a4ca2308d00"
      expect(Utility::Scenario.checksum("603")).to be == "1.4-13e1498a16e6598fa35158704a81550d"
      expect(Utility::Scenario.checksum("604")).to be == "1.2-6dcdae130f2a4b16872161d4d7341e6e"
      expect(Utility::Scenario.checksum("605")).to be == "0.3a-a7ee5a14889488e18e75777aacc283f4"
      expect(Utility::Scenario.checksum("606")).to be == "0.3a-442dad53c01bc764a2287a4a9a811608"
      expect(Utility::Scenario.checksum("607")).to be == "0.4a-fdd603ef2b64384390430b135106ab30"
      expect(Utility::Scenario.checksum("608")).to be == "0.3a-308c190c77bc2c2d126b0eb3f24967bd"
      expect(Utility::Scenario.checksum("609")).to be == "0.3a-1e4c7b4c4287f96253397a10b7e2146b"
      expect(Utility::Scenario.checksum("610")).to be == "0.3a-a03acb58aec11785b3ddb19069e72edc"
      expect(Utility::Scenario.checksum("611")).to be == "0.2a-68edc8f0c50420e1f2522ff8850b6cc1"
      expect(Utility::Scenario.checksum("612")).to be == "0.2a-bf4174d782512131d66201d3f5edeadb"
      expect(Utility::Scenario.checksum("613")).to be == "0.3a-6c7dec05ce777f12624b2da66c9d6d04"
      expect(Utility::Scenario.checksum("614")).to be == "0.3a-b91f1d875ec330d58b400dd992c6d7c3"
      expect(Utility::Scenario.checksum("615")).to be == "0.2a-7d7b61a939dc0c9b57fa97c76e3dcd65"
      expect(Utility::Scenario.checksum("616")).to be == "0.3a-8c6c0efa5f3f229e570345fbdcac67f1"

      expect(Utility::Scenario.checksum("901")).to be == "0.1p-0e2e33b0a55493e1ec58bdce615d80d1"
      expect(Utility::Scenario.checksum("902")).to be == "0.1p-a3391cec7cd055a3f3771021fdffac94"
    end
  end
end
