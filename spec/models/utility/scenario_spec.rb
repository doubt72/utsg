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
      expect(constants.length).to be == 109

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
      expect(Utility::Scenario.checksum("008")).to be == "1.0-641eed30a8f90585011fd6777d8e55d0"
      expect(Utility::Scenario.checksum("009")).to be == "0.2a-e98dbcdcb08990c5775f185223ad3705"
      expect(Utility::Scenario.checksum("010")).to be == "0.2a-79d11f2b2e5a02e1c26294153bb35caf"
      expect(Utility::Scenario.checksum("011")).to be == "1.3-046a9425dd78065e43f17ae2c607e810"
      expect(Utility::Scenario.checksum("012")).to be == "0.2a-8decc3e0d1a7fdee7f9ba8bcbd519390"
      expect(Utility::Scenario.checksum("013")).to be == "0.2a-2a3875bd8d67e6f05e578aa50beaa94b"
      expect(Utility::Scenario.checksum("014")).to be == "0.2a-dcdb0ea00dd45ddd2959f9deb0b3f317"
      expect(Utility::Scenario.checksum("015")).to be == "0.2a-fcd1f4ef3da5dec035c462787161e6de"
      expect(Utility::Scenario.checksum("016")).to be == "0.5p-07c3bc1e9a4db54c30e59931a8ffd334"
      expect(Utility::Scenario.checksum("017")).to be == "0.1p-8ef30eb5fd5705cb27051d30ceca131c"
      expect(Utility::Scenario.checksum("018")).to be == "0.1p-44d5e58c77bdd8b0ff557f1d8da0e3fd"
      expect(Utility::Scenario.checksum("019")).to be == "0.1p-abfb44f9641a164080d15ac44d1ef243"
      expect(Utility::Scenario.checksum("020")).to be == "0.1p-24976d706d7184ccdfd80ed1227b6529"

      expect(Utility::Scenario.checksum("022")).to be == "0.1p-4311cf28257c5de10059fc5cc0368293"
      expect(Utility::Scenario.checksum("023")).to be == "0.4p-1fc10bcf7525532ab00def208e257f49"

      expect(Utility::Scenario.checksum("026")).to be == "0.1a-148090f808bccfd170132db29cde4d0f"

      expect(Utility::Scenario.checksum("030")).to be == "0.1p-883319d51d97997a86d6200aaad65eb5"

      expect(Utility::Scenario.checksum("101")).to be == "1.0-1b1ce29864f60efccc2ae32e1a613d42"
      expect(Utility::Scenario.checksum("102")).to be == "1.0-fa4245898aed293bc1440cd9bfc5b997"
      expect(Utility::Scenario.checksum("103")).to be == "1.1-249a7dd7852cc4cd06fa8e033e5e7199"
      expect(Utility::Scenario.checksum("104")).to be == "0.3b-a3a3c67b5f76ad0aee8b52273dff4b9b"
      expect(Utility::Scenario.checksum("105")).to be == "0.3a-a68295cbcdf3cc7b5222dd71bd2b3395"
      expect(Utility::Scenario.checksum("106")).to be == "1.0-505c657a6911817f490323772110c1f9"
      expect(Utility::Scenario.checksum("107")).to be == "0.2a-cf0848927824082675d3d96668451a96"
      expect(Utility::Scenario.checksum("108")).to be == "0.2a-f7f799c007b0d7ccb712f6af81b3b875"
      expect(Utility::Scenario.checksum("109")).to be == "0.2a-c47935e2c21b7f3487be7314779fc0a5"
      expect(Utility::Scenario.checksum("110")).to be == "0.2a-92ba90fd5bba620026d081bfbefeb2e4"
      expect(Utility::Scenario.checksum("111")).to be == "0.1p-425270480e44c4582e56d289e5d0e2ca"
      expect(Utility::Scenario.checksum("112")).to be == "0.1p-30916c7061b370a31649ba4810d94ce6"
      expect(Utility::Scenario.checksum("113")).to be == "0.1p-253b516779119f105de2683e610e0bfc"
      expect(Utility::Scenario.checksum("114")).to be == "0.1p-7e04075baad5bb830f6d3b17c8b622b1"

      expect(Utility::Scenario.checksum("201")).to be == "1.0-0afaca25f42d5264ae7eae9a7edb7421"
      expect(Utility::Scenario.checksum("202")).to be == "0.3b-1f5feb9b08a447f3fa332a4abe62a14c"
      expect(Utility::Scenario.checksum("203")).to be == "1.0-dfa1cf28dc5e7728caf769a3dba4ea7f"
      expect(Utility::Scenario.checksum("204")).to be == "0.2a-1918458c161066b368c5680cd92a7290"
      expect(Utility::Scenario.checksum("205")).to be == "0.2a-e41e3de5841a153646d7f7047a82a8d0"
      expect(Utility::Scenario.checksum("206")).to be == "0.2a-9076c9e0e778a17a4d91ca665224e913"
      expect(Utility::Scenario.checksum("207")).to be == "0.1p-46a5c4577b2894c098c123b37d9ef820"
      expect(Utility::Scenario.checksum("208")).to be == "0.1p-2c6c054ef45fa8d0d2bc952d2fb78467"
      expect(Utility::Scenario.checksum("209")).to be == "0.1p-93a78f5337249cc0fb343e5d495ed019"
      expect(Utility::Scenario.checksum("210")).to be == "0.1p-2f15b7da7ce12b28741a1093f6688d97"

      expect(Utility::Scenario.checksum("301")).to be == "1.4-9ff0ddcaa49996b9fc8816db5c0083d2"
      expect(Utility::Scenario.checksum("302")).to be == "1.0-3a9b07affe3d8a6762a02ad2bddde9a0"
      expect(Utility::Scenario.checksum("303")).to be == "1.1-f240f339c500660b9002416b239f6c79"
      expect(Utility::Scenario.checksum("304")).to be == "1.0-49537261abe56c2ac4663796a9084453"
      expect(Utility::Scenario.checksum("305")).to be == "0.5b-2f6c444a98a2fa8ddfe09b190d6eb963"
      expect(Utility::Scenario.checksum("306")).to be == "0.2a-147cf450c03caf5d7eb2eff454abc8be"
      expect(Utility::Scenario.checksum("307")).to be == "0.2a-b75d6479a6f6a9f40bcf78645275009d"
      expect(Utility::Scenario.checksum("308")).to be == "1.4-87966dc8adf28db7046b4508b42b9550"
      expect(Utility::Scenario.checksum("309")).to be == "0.2a-d4a88cdb2f08faec22bd0d656ddd37aa"
      expect(Utility::Scenario.checksum("310")).to be == "0.2a-ec9c8cced006ce66288500ea6427e552"
      expect(Utility::Scenario.checksum("311")).to be == "0.2a-199b16d24bbc721a19316ce4675d0c11"
      expect(Utility::Scenario.checksum("312")).to be == "0.2a-eff5f7ab46fc57dc21d9e8ad7c94bff7"
      expect(Utility::Scenario.checksum("313")).to be == "0.1p-c81df80e983f1000be93ab4ac03cbf1f"
      expect(Utility::Scenario.checksum("314")).to be == "0.1p-de2ba5c8da744d625361fa1cf976033b"

      expect(Utility::Scenario.checksum("401")).to be == "1.3-a2dd8ae2212031278e1756e60195badc"
      expect(Utility::Scenario.checksum("402")).to be == "1.1-489aefc2132dd283d8ba5e9b101b4135"
      expect(Utility::Scenario.checksum("403")).to be == "1.0-00d2bf9267cbf807a32784eace78b482"
      expect(Utility::Scenario.checksum("404")).to be == "1.0-6b15b4c468ca8c1ec699be23c7430e4b"
      expect(Utility::Scenario.checksum("405")).to be == "0.2a-5d7007fde1dc2956a0efae8e71e7ed72"
      expect(Utility::Scenario.checksum("406")).to be == "1.1-975b9fb98ada066f2c7d15c77dc20693"
      expect(Utility::Scenario.checksum("407")).to be == "0.2a-07a6e572da08d23fa58937a10346a5cf"
      expect(Utility::Scenario.checksum("408")).to be == "0.3a-ab3da773c85881069be7edd84c2629c4"
      expect(Utility::Scenario.checksum("409")).to be == "0.2a-1e075adbb131f90dba6289567ee95afb"
      expect(Utility::Scenario.checksum("410")).to be == "0.2a-490799aa399c0cb27306d5c7b30afe8f"
      expect(Utility::Scenario.checksum("411")).to be == "0.3a-8dbe09afc72215058917570bb3b3dcbb"
      expect(Utility::Scenario.checksum("412")).to be == "0.1p-43a579f5508aec47aeac40c500d2da44"
      expect(Utility::Scenario.checksum("413")).to be == "0.1p-8f826fad85dc9a2b2c356f5205f075d1"
      expect(Utility::Scenario.checksum("414")).to be == "0.1p-94490d71d85f2c84b8b78a75fe6d2c1b"
      expect(Utility::Scenario.checksum("415")).to be == "0.1p-5f42682f83d25a4a78a445729a14244e"
      expect(Utility::Scenario.checksum("416")).to be == "0.1p-896a2ea2778eb6f96e7ce9c9e7be85f3"

      expect(Utility::Scenario.checksum("501")).to be == "1.2-27ecf7b2dab18b930268c7c5c6869fa1"
      expect(Utility::Scenario.checksum("502")).to be == "0.4b-512f71266e30242ef4602a26e53ad8b5"
      expect(Utility::Scenario.checksum("503")).to be == "1.2-348c99fa31d57b7ef17192905ff95e63"
      expect(Utility::Scenario.checksum("504")).to be == "0.3a-175531dc101b93f7ce75622724b9c0b5"
      expect(Utility::Scenario.checksum("505")).to be == "0.2a-2dbcbbfb77d99df5d7c4a28f60eb4884"
      expect(Utility::Scenario.checksum("506")).to be == "0.2a-241e81042f63f39ece2569de01340019"
      expect(Utility::Scenario.checksum("507")).to be == "0.2a-a890e6b26006b3f7fe329d027d67b716"
      expect(Utility::Scenario.checksum("508")).to be == "1.1-264619b0a5c84c4c17d2d33224a67afb"
      expect(Utility::Scenario.checksum("509")).to be == "0.3a-acaa88948198dc9ccf97977dcd072cc3"
      expect(Utility::Scenario.checksum("510")).to be == "1.2-df4bfb88275dc03a9c860162f8eb0a03"
      expect(Utility::Scenario.checksum("511")).to be == "0.2a-6da06bd1d161af85b3bf5d2d531035a6"
      expect(Utility::Scenario.checksum("512")).to be == "1.1-db59184c4fc5ff8c0a7398f5418af1f0"
      expect(Utility::Scenario.checksum("513")).to be == "0.1p-b09324e1f436bcfc6b7884fb74bf81a6"
      expect(Utility::Scenario.checksum("514")).to be == "0.1p-97debd33550e9ea44128717d812941fc"

      expect(Utility::Scenario.checksum("601")).to be == "1.2-ae6409b2023188831b01b7962a6aa8e3"
      expect(Utility::Scenario.checksum("602")).to be == "1.0-d2f0279769377fef100d5d85ad57af84"
      expect(Utility::Scenario.checksum("603")).to be == "1.3-4bd641ce3c711d689bde9c287d0ad60e"
      expect(Utility::Scenario.checksum("604")).to be == "1.0-bfae2f4d8f3e10bf8ba992617b147093"
      expect(Utility::Scenario.checksum("605")).to be == "0.2a-6983e517b47a9faf935da96355b7124b"
      expect(Utility::Scenario.checksum("606")).to be == "0.2a-367966a97ccca0ba67738138cd055e64"
      expect(Utility::Scenario.checksum("607")).to be == "0.2a-e0cef79c48daa71a7e568bb1be796e3b"
      expect(Utility::Scenario.checksum("608")).to be == "0.1p-48ad6d4fdf678252d02785abd6a59103"
      expect(Utility::Scenario.checksum("609")).to be == "0.1p-b8dbee0c748673ef7e048d8c5f5534cb"
      expect(Utility::Scenario.checksum("610")).to be == "0.1p-79b7db08b990eac2aa0e212d20ce082a"
      expect(Utility::Scenario.checksum("611")).to be == "0.1p-99edc890366a8f15cc88f2229d57d209"
      expect(Utility::Scenario.checksum("612")).to be == "0.1p-30b58c28587a3044dccd59f2fd531911"
      expect(Utility::Scenario.checksum("613")).to be == "0.1p-aa4d8e092ee367a1010f30842b0ddd42"
      expect(Utility::Scenario.checksum("614")).to be == "0.1p-60e8641f0104434759eb136ce5f19a68"
      expect(Utility::Scenario.checksum("615")).to be == "0.1p-3b42e55efe73e04d287099ce236185fc"
      expect(Utility::Scenario.checksum("616")).to be == "0.1p-c178bc29c9c3958cd10022f1ef053ad7"
    end
  end
end
