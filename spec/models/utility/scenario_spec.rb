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
      expect(constants.length).to be == 110

      # If any of these change, scenario MUST to be updated with a new version,
      # then update test with new version/checksum
      expect(Utility::Scenario.checksum("000")).to be == "1.1-81e2c0758eea49450a2e5f2282ccd055"

      expect(Utility::Scenario.checksum("001")).to be == "1.4-8b883d6539a220c220367f1fab184ac8"
      expect(Utility::Scenario.checksum("002")).to be == "1.3-9d7864ce8a04683afd9b2b6750858853"
      expect(Utility::Scenario.checksum("003")).to be == "1.1-57c5f72d5146de752b4bfd0bb297c466"
      expect(Utility::Scenario.checksum("004")).to be == "1.0-06a411d1f62b601a6433220fa3006f45"
      expect(Utility::Scenario.checksum("005")).to be == "1.1-c137c38f86228fe1b082b4f22e109d92"
      expect(Utility::Scenario.checksum("006")).to be == "1.0-84dbf41efd9bc68c7fda5d61eeeaa4aa"
      expect(Utility::Scenario.checksum("007")).to be == "1.2-40e5eff43c09c40e5d790d763a34ea3b"
      expect(Utility::Scenario.checksum("008")).to be == "1.1-dd3499cb6e4b25b3e43e8b168743c0ea"
      expect(Utility::Scenario.checksum("009")).to be == "0.2a-e98dbcdcb08990c5775f185223ad3705"
      expect(Utility::Scenario.checksum("010")).to be == "0.2a-79d11f2b2e5a02e1c26294153bb35caf"
      expect(Utility::Scenario.checksum("011")).to be == "1.4-6a9db8d7e939e91750cf8cb8bc479ba1"
      expect(Utility::Scenario.checksum("012")).to be == "0.2a-8decc3e0d1a7fdee7f9ba8bcbd519390"
      expect(Utility::Scenario.checksum("013")).to be == "0.2a-2a3875bd8d67e6f05e578aa50beaa94b"
      expect(Utility::Scenario.checksum("014")).to be == "0.2a-dcdb0ea00dd45ddd2959f9deb0b3f317"
      expect(Utility::Scenario.checksum("015")).to be == "0.2a-fcd1f4ef3da5dec035c462787161e6de"
      expect(Utility::Scenario.checksum("016")).to be == "0.5p-4d257cd5476c01a1943bee669f2485ed"
      expect(Utility::Scenario.checksum("017")).to be == "0.1p-8ef30eb5fd5705cb27051d30ceca131c"
      expect(Utility::Scenario.checksum("018")).to be == "0.1p-44d5e58c77bdd8b0ff557f1d8da0e3fd"
      expect(Utility::Scenario.checksum("019")).to be == "0.1p-7eac12dab77dc60a532e05779a129d87"
      expect(Utility::Scenario.checksum("020")).to be == "0.1p-6c2a494d9ba064053290872e3bf5604d"

      expect(Utility::Scenario.checksum("022")).to be == "0.1p-c7dde68d33e0636c8650610f8e171bc8"
      expect(Utility::Scenario.checksum("023")).to be == "0.4p-4186f25aa5d8ae6ea17360d8fc970a2e"

      expect(Utility::Scenario.checksum("026")).to be == "0.1a-718bfbfc15238631f5e0fe51f5e94e27"

      expect(Utility::Scenario.checksum("030")).to be == "0.1p-883319d51d97997a86d6200aaad65eb5"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-1b1ce29864f60efccc2ae32e1a613d42"
      expect(Utility::Scenario.checksum("102")).to be == "1.0-fa4245898aed293bc1440cd9bfc5b997"
      expect(Utility::Scenario.checksum("103")).to be == "1.2-0335a3d41329c2899291e6659fda0543"
      expect(Utility::Scenario.checksum("104")).to be == "1.0-ae240025973b17e44540938d881d3452"
      expect(Utility::Scenario.checksum("105")).to be == "0.4a-8f59a52897beadd979b3f8037e4fe76f"
      expect(Utility::Scenario.checksum("106")).to be == "1.0-505c657a6911817f490323772110c1f9"
      expect(Utility::Scenario.checksum("107")).to be == "0.2a-cf0848927824082675d3d96668451a96"
      expect(Utility::Scenario.checksum("108")).to be == "0.3a-f87d7685bcaf32ee014549a6af6b0289"
      expect(Utility::Scenario.checksum("109")).to be == "0.3a-168af07dcee089ffe5d1959e14196335"
      expect(Utility::Scenario.checksum("110")).to be == "0.2a-92ba90fd5bba620026d081bfbefeb2e4"
      expect(Utility::Scenario.checksum("111")).to be == "0.1p-425270480e44c4582e56d289e5d0e2ca"
      expect(Utility::Scenario.checksum("112")).to be == "0.1p-bff7d28e721722746bcc1dfaad8346d1"
      expect(Utility::Scenario.checksum("113")).to be == "0.1p-253b516779119f105de2683e610e0bfc"
      expect(Utility::Scenario.checksum("114")).to be == "0.1p-7e04075baad5bb830f6d3b17c8b622b1"

      expect(Utility::Scenario.checksum("201")).to be == "1.1-ad1616bd08b6f67f90597dcc117c4a1e"
      expect(Utility::Scenario.checksum("202")).to be == "0.4b-1fb830b388087214e36082d585a1c866"
      expect(Utility::Scenario.checksum("203")).to be == "1.0-dfa1cf28dc5e7728caf769a3dba4ea7f"
      expect(Utility::Scenario.checksum("204")).to be == "0.3a-0c6fd85463da2743574c30374c209d78"
      expect(Utility::Scenario.checksum("205")).to be == "0.3a-6ae30c8d6205b5b9541b48fa9f0e66f7"
      expect(Utility::Scenario.checksum("206")).to be == "0.3a-3d43e9ad4fb93ab53b1c67a7224b9cb5"
      expect(Utility::Scenario.checksum("207")).to be == "0.1p-c1ccb4b7af1493ca0815a1af3cdc0ab1"
      expect(Utility::Scenario.checksum("208")).to be == "0.1p-4c97df4dcb3e9198d9db2a27d20a76dd"
      expect(Utility::Scenario.checksum("209")).to be == "0.1p-5e25f28fe9186c2f85b2d7fb5490748e"
      expect(Utility::Scenario.checksum("210")).to be == "0.1p-2f15b7da7ce12b28741a1093f6688d97"

      expect(Utility::Scenario.checksum("301")).to be == "1.4-9ff0ddcaa49996b9fc8816db5c0083d2"
      expect(Utility::Scenario.checksum("302")).to be == "1.1-a17588f5e69db4e8044ad600e64d128c"
      expect(Utility::Scenario.checksum("303")).to be == "1.2-f014b9861a7f2568635a44ea8c1269e6"
      expect(Utility::Scenario.checksum("304")).to be == "1.0-49537261abe56c2ac4663796a9084453"
      expect(Utility::Scenario.checksum("305")).to be == "0.6b-3272056284787b51b6dbcd26f3627a29"
      expect(Utility::Scenario.checksum("306")).to be == "0.3a-653642dfc570dfe237c3bb046e447057"
      expect(Utility::Scenario.checksum("307")).to be == "0.3a-7f9716f3cd8354b0c10ecfa06bf49785"
      expect(Utility::Scenario.checksum("308")).to be == "1.4-87966dc8adf28db7046b4508b42b9550"
      expect(Utility::Scenario.checksum("309")).to be == "0.3a-da6cae120fa9be1e92e6f7d2649c1472"
      expect(Utility::Scenario.checksum("310")).to be == "0.3a-9864ebf625130e9c2824635862cc1903"
      expect(Utility::Scenario.checksum("311")).to be == "0.3a-8c27f8991bb703237f59a7fce12841cc"
      expect(Utility::Scenario.checksum("312")).to be == "0.3a-ed9adf1397ed6088eec15eca2f07e87f"
      expect(Utility::Scenario.checksum("313")).to be == "0.1p-d4e9e2f7554679e8eba94aa457e53238"
      expect(Utility::Scenario.checksum("314")).to be == "0.1p-809f34bb223a14eedf68ac83becc41b1"
      expect(Utility::Scenario.checksum("315")).to be == "0.1p-eb8e7f4180f3675409efe82ce670f1db"

      expect(Utility::Scenario.checksum("401")).to be == "1.4-ebfa848c514cd84c0591d20d78830bc4"
      expect(Utility::Scenario.checksum("402")).to be == "1.1-489aefc2132dd283d8ba5e9b101b4135"
      expect(Utility::Scenario.checksum("403")).to be == "1.0-00d2bf9267cbf807a32784eace78b482"
      expect(Utility::Scenario.checksum("404")).to be == "1.1-6be9f6c5fe9f30bbf6662c7c9e322d35"
      expect(Utility::Scenario.checksum("405")).to be == "0.2a-5d7007fde1dc2956a0efae8e71e7ed72"
      expect(Utility::Scenario.checksum("406")).to be == "1.2-059252aba200b0588ce63d061a12d7ea"
      expect(Utility::Scenario.checksum("407")).to be == "0.3a-d8d4ac4090b870dc43de8969ffa41f2e"
      expect(Utility::Scenario.checksum("408")).to be == "0.4a-66f5a55a0724f3f1983edd591ac8b075"
      expect(Utility::Scenario.checksum("409")).to be == "0.2a-1e075adbb131f90dba6289567ee95afb"
      expect(Utility::Scenario.checksum("410")).to be == "0.2a-490799aa399c0cb27306d5c7b30afe8f"
      expect(Utility::Scenario.checksum("411")).to be == "0.3a-8dbe09afc72215058917570bb3b3dcbb"
      expect(Utility::Scenario.checksum("412")).to be == "0.1p-43a579f5508aec47aeac40c500d2da44"
      expect(Utility::Scenario.checksum("413")).to be == "0.1p-8a1384813602a42e8c78f6a950fb78ff"
      expect(Utility::Scenario.checksum("414")).to be == "0.1p-94490d71d85f2c84b8b78a75fe6d2c1b"
      expect(Utility::Scenario.checksum("415")).to be == "0.1p-1410abd30a48132a0204280daaffe1d3"
      expect(Utility::Scenario.checksum("416")).to be == "0.1p-610b9f6cad45015f9d86ccb9f33411f8"

      expect(Utility::Scenario.checksum("501")).to be == "1.2-27ecf7b2dab18b930268c7c5c6869fa1"
      expect(Utility::Scenario.checksum("502")).to be == "1.0-372417a03273e90c3a94e2558b8a5cc9"
      expect(Utility::Scenario.checksum("503")).to be == "1.2-348c99fa31d57b7ef17192905ff95e63"
      expect(Utility::Scenario.checksum("504")).to be == "0.4a-f400932175de1a2abb462005e37c8161"
      expect(Utility::Scenario.checksum("505")).to be == "0.3a-737e8d62f87b3bdcf7aa2fe348ea6f22"
      expect(Utility::Scenario.checksum("506")).to be == "0.2a-241e81042f63f39ece2569de01340019"
      expect(Utility::Scenario.checksum("507")).to be == "0.2a-a890e6b26006b3f7fe329d027d67b716"
      expect(Utility::Scenario.checksum("508")).to be == "1.1-264619b0a5c84c4c17d2d33224a67afb"
      expect(Utility::Scenario.checksum("509")).to be == "0.3a-acaa88948198dc9ccf97977dcd072cc3"
      expect(Utility::Scenario.checksum("510")).to be == "1.2-df4bfb88275dc03a9c860162f8eb0a03"
      expect(Utility::Scenario.checksum("511")).to be == "0.2a-6da06bd1d161af85b3bf5d2d531035a6"
      expect(Utility::Scenario.checksum("512")).to be == "1.2-e8f90a9ec439d34cdd2f5b7d944cdf6c"
      expect(Utility::Scenario.checksum("513")).to be == "0.1p-1ff62133a23b351dd5345204837324c3"
      expect(Utility::Scenario.checksum("514")).to be == "0.1p-97debd33550e9ea44128717d812941fc"

      expect(Utility::Scenario.checksum("601")).to be == "1.2-ae6409b2023188831b01b7962a6aa8e3"
      expect(Utility::Scenario.checksum("602")).to be == "1.0-d2f0279769377fef100d5d85ad57af84"
      expect(Utility::Scenario.checksum("603")).to be == "1.3-4bd641ce3c711d689bde9c287d0ad60e"
      expect(Utility::Scenario.checksum("604")).to be == "1.1-8f0cb923f542e6dacc64060793c54e6a"
      expect(Utility::Scenario.checksum("605")).to be == "0.2a-6983e517b47a9faf935da96355b7124b"
      expect(Utility::Scenario.checksum("606")).to be == "0.2a-367966a97ccca0ba67738138cd055e64"
      expect(Utility::Scenario.checksum("607")).to be == "0.3a-d7b6026b6b6c5c17f0dce97cbd0e71f0"
      expect(Utility::Scenario.checksum("608")).to be == "0.1p-48ad6d4fdf678252d02785abd6a59103"
      expect(Utility::Scenario.checksum("609")).to be == "0.1p-4be4ea31ad5e5b52854f6c1021ba57a5"
      expect(Utility::Scenario.checksum("610")).to be == "0.1p-79b7db08b990eac2aa0e212d20ce082a"
      expect(Utility::Scenario.checksum("611")).to be == "0.1p-741ffd25b8195eefcd96024c9a721fb0"
      expect(Utility::Scenario.checksum("612")).to be == "0.1p-30b58c28587a3044dccd59f2fd531911"
      expect(Utility::Scenario.checksum("613")).to be == "0.1p-aa4d8e092ee367a1010f30842b0ddd42"
      expect(Utility::Scenario.checksum("614")).to be == "0.1p-763100d2d59d2dc6470a978bdb283fc0"
      expect(Utility::Scenario.checksum("615")).to be == "0.1p-2e08e5a62166594721b209134d3b93d0"
      expect(Utility::Scenario.checksum("616")).to be == "0.1p-1caf1f4d4a03df03c755d506eff1d6f5"
    end
  end
end
