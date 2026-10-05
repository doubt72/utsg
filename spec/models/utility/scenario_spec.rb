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
      expect(Utility::Scenario.checksum("007")).to be == "1.2-30a90db49d47c6f2071415b0861c1fd0"
      expect(Utility::Scenario.checksum("008")).to be == "1.1-b41f149c7714757ccea0c6b986a61839"
      expect(Utility::Scenario.checksum("009")).to be == "1.0-e349a34f70ff4271c1f7d7333153c456"
      expect(Utility::Scenario.checksum("010")).to be == "1.0-0fe7333aa525850023f50c3458af0588"
      expect(Utility::Scenario.checksum("011")).to be == "1.4-6a9db8d7e939e91750cf8cb8bc479ba1"
      expect(Utility::Scenario.checksum("012")).to be == "0.4b-072cf04c99a14aa7bd5d911dd22cecf6"
      expect(Utility::Scenario.checksum("013")).to be == "0.2a-2a3875bd8d67e6f05e578aa50beaa94b"
      expect(Utility::Scenario.checksum("014")).to be == "0.2a-b638d9d2f489254e6b0016ca4cba00bb"
      expect(Utility::Scenario.checksum("015")).to be == "0.2a-fcd1f4ef3da5dec035c462787161e6de"
      expect(Utility::Scenario.checksum("016")).to be == "0.5p-4d257cd5476c01a1943bee669f2485ed"
      expect(Utility::Scenario.checksum("017")).to be == "0.1p-8ef30eb5fd5705cb27051d30ceca131c"
      expect(Utility::Scenario.checksum("018")).to be == "0.1p-44d5e58c77bdd8b0ff557f1d8da0e3fd"
      expect(Utility::Scenario.checksum("019")).to be == "0.1p-7eac12dab77dc60a532e05779a129d87"
      expect(Utility::Scenario.checksum("020")).to be == "0.1p-6c2a494d9ba064053290872e3bf5604d"
      expect(Utility::Scenario.checksum("021")).to be == "0.1p-4772a967d8024159fb439a3ad1731b26"
      expect(Utility::Scenario.checksum("022")).to be == "0.1p-c7dde68d33e0636c8650610f8e171bc8"
      expect(Utility::Scenario.checksum("023")).to be == "0.4p-4186f25aa5d8ae6ea17360d8fc970a2e"
      expect(Utility::Scenario.checksum("024")).to be == "0.1p-ab240259b337cb79ab9bcaf10763fbac"
      expect(Utility::Scenario.checksum("025")).to be == "0.1p-31aa24c85362d3cf0bd6d7453a9c8c2d"
      expect(Utility::Scenario.checksum("026")).to be == "1.0-283dc335ab3f258aabe2ff5f8368a03d"
      expect(Utility::Scenario.checksum("027")).to be == "0.1p-6bfb543eec719593d602d726113cc43d"
      expect(Utility::Scenario.checksum("028")).to be == "0.1p-b8b13756df20ab1d33e4634f79eed682"
      expect(Utility::Scenario.checksum("029")).to be == "0.1p-0ad67bc7ba3768af7fae3cdc69b90372"
      expect(Utility::Scenario.checksum("030")).to be == "0.1p-883319d51d97997a86d6200aaad65eb5"
      expect(Utility::Scenario.checksum("031")).to be == "0.1p-73761388b990945853f701e15efe443f"
      expect(Utility::Scenario.checksum("032")).to be == "0.1p-bb3d1b28abc511fa86fd397da8de8d3a"
      expect(Utility::Scenario.checksum("033")).to be == "0.1p-9913cf53f1c70cf3f349dc185a29488a"
      expect(Utility::Scenario.checksum("034")).to be == "0.1p-365a0855cec368d34c9475f5631de49c"
      expect(Utility::Scenario.checksum("035")).to be == "0.1p-1017747d5e61a0036a5e35b43ac925dc"
      expect(Utility::Scenario.checksum("036")).to be == "0.1p-1ae949168796a5f726d3faef8c116c58"
      expect(Utility::Scenario.checksum("037")).to be == "0.2b-b649dca6ff1fd3acd34126624214cc42"
      expect(Utility::Scenario.checksum("038")).to be == "0.1p-394d28ab9b64381988a430cea6211944"
      expect(Utility::Scenario.checksum("039")).to be == "0.1p-d58f26cf8076394e8b04cc69058d8ddb"
      expect(Utility::Scenario.checksum("040")).to be == "0.1p-fbd794ebb31d01d242fd1e938c6171d9"
      expect(Utility::Scenario.checksum("041")).to be == "0.1p-9854cb5754ff26472f1c2c61dd1da0c9"
      expect(Utility::Scenario.checksum("042")).to be == "0.1p-b3f09bb2101745c0117a9f3a6564faca"
      expect(Utility::Scenario.checksum("043")).to be == "0.1p-fcb80d74cfeaad9966473b804036a35f"
      expect(Utility::Scenario.checksum("044")).to be == "0.1p-a386747f517e6eb03cda9b26ed769911"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-1b1ce29864f60efccc2ae32e1a613d42"
      expect(Utility::Scenario.checksum("102")).to be == "1.0-0914d469887d7582e082cd84d5e0cd07"
      expect(Utility::Scenario.checksum("103")).to be == "1.2-97c54372a831ae957c96b7167ef5b3be"
      expect(Utility::Scenario.checksum("104")).to be == "1.0-f5238f37e0535f87c2299cafe31fc22e"
      expect(Utility::Scenario.checksum("105")).to be == "1.0-f2abcb67b433f09ddc9201c35c4aa90b"
      expect(Utility::Scenario.checksum("106")).to be == "1.1-5e84b0d190a59c056d076dbee0506bd3"
      expect(Utility::Scenario.checksum("107")).to be == "1.0-f706be086c498a42d58b5ed151c170fb"
      expect(Utility::Scenario.checksum("108")).to be == "0.3a-f87d7685bcaf32ee014549a6af6b0289"
      expect(Utility::Scenario.checksum("109")).to be == "0.3a-168af07dcee089ffe5d1959e14196335"
      expect(Utility::Scenario.checksum("110")).to be == "0.2a-92ba90fd5bba620026d081bfbefeb2e4"
      expect(Utility::Scenario.checksum("111")).to be == "0.1p-425270480e44c4582e56d289e5d0e2ca"
      expect(Utility::Scenario.checksum("112")).to be == "0.1p-bff7d28e721722746bcc1dfaad8346d1"
      expect(Utility::Scenario.checksum("113")).to be == "0.1p-253b516779119f105de2683e610e0bfc"
      expect(Utility::Scenario.checksum("114")).to be == "0.1p-7e04075baad5bb830f6d3b17c8b622b1"
      expect(Utility::Scenario.checksum("115")).to be == "0.1p-593a7a6a0bfd560ef44b0d66d1937109"
      expect(Utility::Scenario.checksum("116")).to be == "0.1p-25c2d9370b0e4eee0799e66c9223b4ed"
      expect(Utility::Scenario.checksum("117")).to be == "0.1p-596630f233a5e6a3202b073970e5ae42"
      expect(Utility::Scenario.checksum("118")).to be == "0.1p-e6433a15716be1a346aec7d8e27fad70"
      expect(Utility::Scenario.checksum("119")).to be == "0.1p-b736b8e04af6b71949550696b5dae161"
      expect(Utility::Scenario.checksum("120")).to be == "0.1p-5553ef278d9f6949d86c8f7a0f42bf38"
      expect(Utility::Scenario.checksum("121")).to be == "0.1p-e42ca4a7d161f3bd1cbded5a6d8cf878"
      expect(Utility::Scenario.checksum("122")).to be == "0.1p-52a286b932b167157526010f99ee970e"
      expect(Utility::Scenario.checksum("123")).to be == "0.1p-3f944eb04640b6aaab8a2713f4ee883c"
      expect(Utility::Scenario.checksum("124")).to be == "0.1p-eb142f032f35b0f766ab5d860051d32d"

      expect(Utility::Scenario.checksum("201")).to be == "1.1-ad1616bd08b6f67f90597dcc117c4a1e"
      expect(Utility::Scenario.checksum("202")).to be == "1.0-c23021496106a10b71100bded02eb026"
      expect(Utility::Scenario.checksum("203")).to be == "1.0-dfa1cf28dc5e7728caf769a3dba4ea7f"
      expect(Utility::Scenario.checksum("204")).to be == "0.6b-fa3120b0ad117e821e780c66ccf04003"
      expect(Utility::Scenario.checksum("205")).to be == "0.3a-6ae30c8d6205b5b9541b48fa9f0e66f7"
      expect(Utility::Scenario.checksum("206")).to be == "0.3a-3d43e9ad4fb93ab53b1c67a7224b9cb5"
      expect(Utility::Scenario.checksum("207")).to be == "0.1p-c1ccb4b7af1493ca0815a1af3cdc0ab1"
      expect(Utility::Scenario.checksum("208")).to be == "0.1p-4c97df4dcb3e9198d9db2a27d20a76dd"
      expect(Utility::Scenario.checksum("209")).to be == "0.1p-5e25f28fe9186c2f85b2d7fb5490748e"
      expect(Utility::Scenario.checksum("210")).to be == "0.1p-089c618bc778c61c786474c4702f32fd"
      expect(Utility::Scenario.checksum("211")).to be == "0.1p-247e01eb5469142d584ff7972265c8e4"
      expect(Utility::Scenario.checksum("212")).to be == "0.1p-bdbed8ae5763e4ab41ec04fbe5fddda8"
      expect(Utility::Scenario.checksum("213")).to be == "0.1p-95e379dcc3d8350a7a9278a39ef70114"
      expect(Utility::Scenario.checksum("214")).to be == "0.1p-6a6b485b6cee94f9059958a11e0e49f9"
      expect(Utility::Scenario.checksum("215")).to be == "0.1p-347469f92e58524399157a7742df830a"
      expect(Utility::Scenario.checksum("216")).to be == "0.1p-b570a52ff30697e3a425b0388ef876d0"

      expect(Utility::Scenario.checksum("301")).to be == "1.4-e03cbe285095c717488f1520cc569e69"
      expect(Utility::Scenario.checksum("302")).to be == "1.1-8c4f1a1da93dd6fdfb3805ca70cea709"
      expect(Utility::Scenario.checksum("303")).to be == "1.2-7a86244b1eaceb886fc31021b5b01364"
      expect(Utility::Scenario.checksum("304")).to be == "1.0-de7e962767d0e661ff66b57da4725fe7"
      expect(Utility::Scenario.checksum("305")).to be == "1.0-e62f61191dc1289a54f20054dc39bfa2"
      expect(Utility::Scenario.checksum("306")).to be == "1.0-8a5846db67320d154c308703f786e606"
      expect(Utility::Scenario.checksum("307")).to be == "1.0-02f9488d1fa6a6272f7725dd25b1b7ac"
      expect(Utility::Scenario.checksum("308")).to be == "1.4-87966dc8adf28db7046b4508b42b9550"
      expect(Utility::Scenario.checksum("309")).to be == "0.3b-345987e627a68b50bd8279e63b4e9bf9"
      expect(Utility::Scenario.checksum("310")).to be == "0.3a-122ff9e01e723a546f378e4c30fc14c2"
      expect(Utility::Scenario.checksum("311")).to be == "0.3a-8c27f8991bb703237f59a7fce12841cc"
      expect(Utility::Scenario.checksum("312")).to be == "0.3a-ed9adf1397ed6088eec15eca2f07e87f"
      expect(Utility::Scenario.checksum("313")).to be == "0.1p-d4e9e2f7554679e8eba94aa457e53238"
      expect(Utility::Scenario.checksum("314")).to be == "0.1p-809f34bb223a14eedf68ac83becc41b1"
      expect(Utility::Scenario.checksum("315")).to be == "1.0-90aa0daf81f0d17e19a723d49aa36f6c"
      expect(Utility::Scenario.checksum("316")).to be == "0.1p-ce3f93e852fdf189aba2501fa92f54cc"
      expect(Utility::Scenario.checksum("317")).to be == "0.1p-a41f777c2545d1047a8bdd4bc914662b"
      expect(Utility::Scenario.checksum("318")).to be == "0.1p-241ce4d642795a1229974992dfaf0132"
      expect(Utility::Scenario.checksum("319")).to be == "0.1p-3f89b9a3501473c05f247b14b5fe7971"
      expect(Utility::Scenario.checksum("320")).to be == "0.1p-07929e2f801a2ca0fc33f30076bba82a"
      expect(Utility::Scenario.checksum("321")).to be == "0.1p-ed9fc42103e95114898b784f5e581e35"
      expect(Utility::Scenario.checksum("322")).to be == "0.1p-22dfd10b9f59b2402358ba5a57348767"
      expect(Utility::Scenario.checksum("323")).to be == "0.1p-a3e73c49ff2ac0c431aff6b2ce1c32e6"
      expect(Utility::Scenario.checksum("324")).to be == "0.1p-6eafca984c1acfa7b1c4911eb08648e0"
      expect(Utility::Scenario.checksum("325")).to be == "0.1p-14ad1e9499b2ce5d0a0783a9f2b0058d"
      expect(Utility::Scenario.checksum("326")).to be == "0.1p-ae193d0d8519396832700b438d1dca39"
      expect(Utility::Scenario.checksum("327")).to be == "0.1p-06cf2354619aa6dd39903768da7e52ce"
      expect(Utility::Scenario.checksum("328")).to be == "0.1p-a223d25954c5d8c4dbf39abaced0f8b1"
      expect(Utility::Scenario.checksum("329")).to be == "0.1p-abca4c59f23b2e29e0c3b5a1fbfe0bf6"
      expect(Utility::Scenario.checksum("330")).to be == "0.1p-f2dd4eb50b733774a26b30e6dcb4b07f"

      expect(Utility::Scenario.checksum("401")).to be == "1.4-da83145a00119c080fe7702c18be58d9"
      expect(Utility::Scenario.checksum("402")).to be == "1.1-489aefc2132dd283d8ba5e9b101b4135"
      expect(Utility::Scenario.checksum("403")).to be == "1.0-aa92ddb4144f90b2abbf3aff663d9d55"
      expect(Utility::Scenario.checksum("404")).to be == "1.1-6be9f6c5fe9f30bbf6662c7c9e322d35"
      expect(Utility::Scenario.checksum("405")).to be == "1.0-a3dc6e39aa10adef70d136232e48bde2"
      expect(Utility::Scenario.checksum("406")).to be == "1.2-764b39b8260bd3b8d4b4ff21ef561eb8"
      expect(Utility::Scenario.checksum("407")).to be == "0.5b-2b40e4a107612297a72a19a909a356fe"
      expect(Utility::Scenario.checksum("408")).to be == "0.4a-39834fcc31566389353a40881314d508"
      expect(Utility::Scenario.checksum("409")).to be == "0.2a-97c4e475cce2735665314f342b2d628b"
      expect(Utility::Scenario.checksum("410")).to be == "0.2a-490799aa399c0cb27306d5c7b30afe8f"
      expect(Utility::Scenario.checksum("411")).to be == "0.3a-3745817729291aa49c79d597953acba0"
      expect(Utility::Scenario.checksum("412")).to be == "0.1p-43a579f5508aec47aeac40c500d2da44"
      expect(Utility::Scenario.checksum("413")).to be == "0.1p-960e0d06fedadac0b3899ea7ce599b8b"
      expect(Utility::Scenario.checksum("414")).to be == "0.1p-94490d71d85f2c84b8b78a75fe6d2c1b"
      expect(Utility::Scenario.checksum("415")).to be == "0.1p-1410abd30a48132a0204280daaffe1d3"
      expect(Utility::Scenario.checksum("416")).to be == "0.1p-6e66de27f801f1c60ce1a66914d3523c"
      expect(Utility::Scenario.checksum("417")).to be == "1.0-bbb0b14233d036a2fbccfc0b7a44930d"
      expect(Utility::Scenario.checksum("418")).to be == "0.1p-08edce28eca4f823ca39d7304d71b40d"
      expect(Utility::Scenario.checksum("419")).to be == "0.1p-660e588603488f8a61d781f795c10b5f"
      expect(Utility::Scenario.checksum("420")).to be == "0.1p-2d425362777fd88d3321026849ad758a"
      expect(Utility::Scenario.checksum("421")).to be == "0.1p-718bd17516b2ac82620734d0e8ad9462"
      expect(Utility::Scenario.checksum("422")).to be == "0.1p-909a49bfc21544a66e4ac493cea096a7"
      expect(Utility::Scenario.checksum("423")).to be == "0.1p-06a31bad9b6aedfd22b3d83db715e4cd"
      expect(Utility::Scenario.checksum("424")).to be == "0.1p-f62f7b9bacc66882e5f909d1ec34f0dd"
      expect(Utility::Scenario.checksum("425")).to be == "0.1p-a1c88c98c5ecea63be328af4c53af140"
      expect(Utility::Scenario.checksum("426")).to be == "0.1p-6937668b3bd1220253e15134fb154fd7"
      expect(Utility::Scenario.checksum("427")).to be == "0.1p-9769595f3cd34daa11e33a60770d446d"
      expect(Utility::Scenario.checksum("428")).to be == "0.1p-2c747b7865c478b6ceb0c6aad0dbd92f"

      expect(Utility::Scenario.checksum("501")).to be == "1.2-27ecf7b2dab18b930268c7c5c6869fa1"
      expect(Utility::Scenario.checksum("502")).to be == "1.0-51fe13e43ce4db52b043d40a42d2eef6"
      expect(Utility::Scenario.checksum("503")).to be == "1.2-8ca48680f1c7df6922e05c51b0bb4b8e"
      expect(Utility::Scenario.checksum("504")).to be == "1.0-a22b8e03dbe1d5b7f32cd9afcd9f5da1"
      expect(Utility::Scenario.checksum("505")).to be == "1.0-a3ea0b90fc068272a86498f8026621e5"
      expect(Utility::Scenario.checksum("506")).to be == "1.0-6b6108af6048282ff6a8ef4bb95a2823"
      expect(Utility::Scenario.checksum("507")).to be == "0.2a-a890e6b26006b3f7fe329d027d67b716"
      expect(Utility::Scenario.checksum("508")).to be == "1.1-f2cd36afc59e79bff31dc2e3ae1e7b73"
      expect(Utility::Scenario.checksum("509")).to be == "0.3a-05fae7cf9aa4e9601a083701dc131a9d"
      expect(Utility::Scenario.checksum("510")).to be == "1.2-e0399ab2badc899c3f12a17f675f2201"
      expect(Utility::Scenario.checksum("511")).to be == "0.2a-6da06bd1d161af85b3bf5d2d531035a6"
      expect(Utility::Scenario.checksum("512")).to be == "1.2-e8f90a9ec439d34cdd2f5b7d944cdf6c"
      expect(Utility::Scenario.checksum("513")).to be == "0.1p-b095f79b4a5cf3a92761b6650bbd2fd5"
      expect(Utility::Scenario.checksum("514")).to be == "0.1p-bf7a64b96dbd626420cb978cba151f9c"
      expect(Utility::Scenario.checksum("515")).to be == "0.1p-d2088e7740fff021c98f523edb0b0490"
      expect(Utility::Scenario.checksum("516")).to be == "0.1p-e25a46e31e6065e75573bb3bb1bb3f3e"
      expect(Utility::Scenario.checksum("517")).to be == "0.1p-ed636d65ea0473140409bb3fff105415"
      expect(Utility::Scenario.checksum("518")).to be == "0.1p-8d992f54595ea941c4c028a87dd2b675"
      expect(Utility::Scenario.checksum("519")).to be == "0.1p-9cf23dd94460989d6aa43f7a3d5aa831"
      expect(Utility::Scenario.checksum("520")).to be == "0.1p-9c9701d72c42589312bf06502ed12a83"
      expect(Utility::Scenario.checksum("521")).to be == "0.1p-e7b936cf4356b58e531a7598ebc6c075"
      expect(Utility::Scenario.checksum("522")).to be == "0.1p-dbb4c5413cff3a499745579dd925dcca"
      expect(Utility::Scenario.checksum("523")).to be == "0.1p-b6cffbeadc28cd39d2dc19469437a7f7"
      expect(Utility::Scenario.checksum("524")).to be == "0.1p-162e489e5bdd179f15c8449f1ade34fe"

      expect(Utility::Scenario.checksum("601")).to be == "1.2-ae6409b2023188831b01b7962a6aa8e3"
      expect(Utility::Scenario.checksum("602")).to be == "1.0-d2f0279769377fef100d5d85ad57af84"
      expect(Utility::Scenario.checksum("603")).to be == "1.3-ff5ab04e25bf9be7d39bf3483a93007a"
      expect(Utility::Scenario.checksum("604")).to be == "1.1-c82bec81e4294d766135622291330c80"
      expect(Utility::Scenario.checksum("605")).to be == "0.2a-6983e517b47a9faf935da96355b7124b"
      expect(Utility::Scenario.checksum("606")).to be == "0.2a-77f5b82ea942eac7b43966dc542046eb"
      expect(Utility::Scenario.checksum("607")).to be == "0.3a-96c3787ff4fdfc19b7263cbf06bdd9b3"
      expect(Utility::Scenario.checksum("608")).to be == "0.1p-4ed7691f3e205845c9331057962d9287"
      expect(Utility::Scenario.checksum("609")).to be == "0.1p-22cac5d8bc9cb04fe12047cebbf6df81"
      expect(Utility::Scenario.checksum("610")).to be == "0.1p-80eab425b13135415040f243ff2cc5cc"
      expect(Utility::Scenario.checksum("611")).to be == "0.1p-6ceb417ed6dea6dfec3eed57d3459e47"
      expect(Utility::Scenario.checksum("612")).to be == "0.1p-a27da3f8f84b9e8039ea8ed2f973bd69"
      expect(Utility::Scenario.checksum("613")).to be == "0.1p-aa4d8e092ee367a1010f30842b0ddd42"
      expect(Utility::Scenario.checksum("614")).to be == "0.1p-763100d2d59d2dc6470a978bdb283fc0"
      expect(Utility::Scenario.checksum("615")).to be == "0.1p-08904083a2711fa824f987888706222e"
      expect(Utility::Scenario.checksum("616")).to be == "0.1p-ad12d1e551868d9398c50c65f6076b0c"

      expect(Utility::Scenario.checksum("901")).to be == "0.1p-0e2e33b0a55493e1ec58bdce615d80d1"
      expect(Utility::Scenario.checksum("902")).to be == "0.1p-a3391cec7cd055a3f3771021fdffac94"
    end
  end
end
