# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::ScenariosController do
  let(:scenario_name) { "xxx Spec Test xxx" }
  let(:real_scenario_name) { "A Straightforward Proposition" }

  before :all do
    unless defined?(Scenarios::Scenario000)
      class Scenarios::Scenario000 < Scenarios::Base # rubocop:disable Style/ClassAndModuleChildren
        ID = "000"
        NAME = "xxx Spec Test xxx"
        ALLIES = %w[uk usa].freeze
        AXIS = %w[ger ita].freeze
        STATUS = "p"
        DATE = [1941, 6, 15].freeze
        LAYOUT = [15, 23, "x"].freeze
        ALLIED_UNITS = {}.freeze
        AXIS_UNITS = {}.freeze

        class << self
          def generate
            {
              allied_units: { "0" => { list: [] } },
              axis_units: { "0" => { list: [] } },
              map_data: { layout: [15, 11, "x"] },
            }
          end
        end
      end
    end
  end

  describe "index" do
    it "gets first page of scenarios with no filters and default sorting" do
      get :index, params: { status: "p*" }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body)["data"].length).to be == 10
    end

    it "gets correct winner data" do
      game1 = create(:game, scenario: "001", player_two: create(:user))
      game1.winner = game1.player_one
      game1.save!

      game2 = create(:game, scenario: "001", player_two: create(:user))
      game2.winner = game2.player_two
      game2.save!

      get :index, params: { status: "p*", sort: "n", sort_dir: "asc" }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body)["data"].length).to be == 10
      expect(JSON.parse(response.body)["data"][1]["id"]).to be == "001"
      expect(JSON.parse(response.body)["data"][1]["wins"]["one"]).to be == 2
      expect(JSON.parse(response.body)["data"][1]["wins"]["two"]).to be == 2
      expect(JSON.parse(response.body)["data"][2]["id"]).to be == "002"
      expect(JSON.parse(response.body)["data"][2]["wins"]["one"]).to be == 1
      expect(JSON.parse(response.body)["data"][2]["wins"]["two"]).to be == 1
    end

    it "gets correct rating data" do
      create(:rating, scenario: "001", rating: 1)
      create(:rating, scenario: "002", rating: 5)

      get :index, params: { status: "p*", sort: "n", sort_dir: "asc" }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body)["data"].length).to be == 10
      expect(JSON.parse(response.body)["data"][1]["id"]).to be == "001"
      expect(JSON.parse(response.body)["data"][1]["rating"]["count"]).to be == 2
      expect(JSON.parse(response.body)["data"][1]["rating"]["average"]).to be_within(0.01).of(2.5)
      expect(JSON.parse(response.body)["data"][2]["id"]).to be == "002"
      expect(JSON.parse(response.body)["data"][2]["rating"]["count"]).to be == 2
      expect(JSON.parse(response.body)["data"][2]["rating"]["average"]).to be_within(0.01).of(4.5)
      expect(JSON.parse(response.body)["data"][3]["id"]).to be == "003"
      expect(JSON.parse(response.body)["data"][3]["rating"]["count"]).to be == 1
      expect(JSON.parse(response.body)["data"][3]["rating"]["average"]).to be == 4
    end
  end

  describe "sorting" do
    it "gets data in correct order with default sorting" do
      get :index, params: { status: "p*", sort: "n", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = ""
      data.each do |d|
        expect(d["id"]).to be > last
        last = d["id"]
      end
    end

    it "gets data in correct order with reverse sorting" do
      get :index, params: { status: "p*", sort: "n", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = "999"
      data.each do |d|
        expect(d["id"]).to be < last
        last = d["id"]
      end
    end

    it "gets data in correct order with date sorting" do
      get :index, params: { status: "p*", sort: "d", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = [1, 1, 1]
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        expect(scenario[:metadata][:date] <=> last).to be >= 0
        last = scenario[:metadata][:date]
      end
    end

    it "gets data in correct order with reverse date sorting" do
      get :index, params: { status: "p*", sort: "d", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = [9999, 1, 1]
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        expect(scenario[:metadata][:date] <=> last).to be <= 0
        last = scenario[:metadata][:date]
      end
    end

    it "gets data in correct order with map size sorting" do
      get :index, params: { status: "p*", sort: "m", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 0
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        x, y = scenario[:metadata][:map_data][:layout]
        size = x + y
        expect(size <=> last).to be >= 0
        last = size
      end
    end

    it "gets data in correct order with reverse map size sorting" do
      get :index, params: { status: "p*", sort: "m", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 99
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        x, y = scenario[:metadata][:map_data][:layout]
        size = x + y
        expect(last <=> size).to be >= 0
        last = size
      end
    end

    it "gets data in correct order with unit count sorting" do
      get :index, params: { status: "p*", sort: "u", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 0
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        units = scenario[:metadata][:allied_units].map { |t| t[1] }.flatten(1) +
                scenario[:metadata][:axis_units].map { |t| t[1] }.flatten(1)
        units = units.map { |u| u[:list] }.flatten(1)
        unit_count = units.reduce(0) { |cnt, u| cnt + (u[:x] || 1) }
        expect(unit_count <=> last).to be >= 0
        last = unit_count
      end
    end

    it "gets data in correct order with reverse unit count sorting" do
      get :index, params: { status: "p*", sort: "u", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 999
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        units = scenario[:metadata][:allied_units].map { |t| t[1] }.flatten(1) +
                scenario[:metadata][:axis_units].map { |t| t[1] }.flatten(1)
        units = units.map { |u| u[:list] }.flatten(1)
        unit_count = units.reduce(0) { |cnt, u| cnt + (u[:x] || 1) }
        expect(unit_count <=> last).to be <= 0
        last = unit_count
      end
    end

    context "balance sorting" do
      before :each do
        game1 = create(:game, scenario: "005")
        game1.winner = game1.player_one
        game1.save!

        game2 = create(:game, scenario: "007", player_two: create(:user))
        game2.winner = game2.player_two
        game2.save!
      end

      it "gets data in correct order with default sorting" do
        get :index, params: { status: "p*", sort: "b", sort_dir: "asc" }

        expect(response.status).to be == 200
        data = JSON.parse(response.body)["data"]

        last = 0.0
        data.each do |d|
          one = d["wins"]["one"] + 1
          two = d["wins"]["two"] + 1
          pct = ((one.to_f / (one + two)) - 0.5).abs
          expect(pct).to be >= last
          last = pct
        end
      end

      it "gets data in correct order with reverse sorting" do
        get :index, params: { status: "p*", sort: "b", sort_dir: "desc" }

        expect(response.status).to be == 200
        data = JSON.parse(response.body)["data"]

        last = 0.5
        data.each do |d|
          one = d["wins"]["one"] + 1
          two = d["wins"]["two"] + 1
          pct = ((one.to_f / (one + two)) - 0.5).abs
          expect(pct).to be <= last
          last = pct
        end
      end
    end

    context "rating sorting" do
      before :each do
        create(:rating, scenario: "005", rating: 1)
        create(:rating, scenario: "007", rating: 5)
      end

      it "gets data in correct order with default sorting" do
        get :index, params: { status: "p*", sort: "r", sort_dir: "asc" }

        expect(response.status).to be == 200
        data = JSON.parse(response.body)["data"]

        expect(data[0]["id"]).to be == "007"

        last = 5
        data.each do |d|
          expect(d["rating"]["average"]).to be <= last
          last = d["rating"]["average"]
        end
      end

      it "gets data in correct order with reverse sorting" do
        get :index, params: { status: "p*", sort: "r", sort_dir: "desc" }

        expect(response.status).to be == 200
        data = JSON.parse(response.body)["data"]

        expect(data[0]["id"]).to be == "005"

        last = 0
        data.each do |d|
          expect(d["rating"]["average"]).to be >= last
          last = d["rating"]["average"]
        end
      end
    end
  end

  describe "filters" do
    it "gets spec scenario when filtering by string" do
      get :index, params: { string: scenario_name, status: "p*" }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body)["data"].length).to be == 1
      expect(JSON.parse(response.body)["data"].first["id"]).to be == "000"
    end

    it "gets correct scenarios with allies filter" do
      get :index, params: { allies: "usa", status: "p*", sort_dir: "asc" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      scenarios.each do |s|
        expect(s["allies"].include?("usa") || s["allies"].include?("bra")).to be true
      end
      scenarios.select! { |s| s["id"] == "000" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first["id"]).to be == "000"
    end

    it "gets correct scenarios with axis filter" do
      get :index, params: { axis: "ger", status: "p*" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      scenarios.each do |s|
        expect(s["axis"].include?("ger")).to be true
      end
    end

    it "gets correct scenarios with status filter" do
      get :index, params: { status: "p" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      scenarios.each do |s|
        expect(s["status"]).to be == "p"
      end
    end

    it "status filter defaults to no prototype scenarios" do
      get :index

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      scenarios.each do |s|
        expect(s["status"]).not_to be == "p"
      end
    end

    it "gets correct scenarios with theater filter" do
      get :index, params: { status: "p*", theater: "1" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      scenarios.each do |s|
        expect(s["id"][0]).to be == "1"
      end
    end

    it "gets correct scenarios with size filter" do
      get :index, params: { status: "p*", size: "2x1" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with infantry filter" do
      get :index, params: { status: "p*", type: "inf" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with artillery filter" do
      get :index, params: { status: "p*", type: "art" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with tank filter" do
      get :index, params: { status: "p*", type: "tank" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with no_feat filter" do
      get :index, params: { status: "p*", type: "no_feat" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end
  end

  describe "show" do
    it "gets correct scenario from get_scenario" do
      get :show, params: { id: "000" }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body)["name"]).to be == scenario_name
    end

    it "gets versioned scenario" do
      get :show, params: { id: "001", version: "0.1" }

      expect(response.status).to be == 200
      json = JSON.parse(response.body)
      expect(json["name"]).to be == real_scenario_name
      expect(json["version"]).to be == "1.0"
    end

    it "gets cached scenario" do
      test_data = Utility::Scenario.scenario_by_id("001")
      test_data[:name] = "new name"
      test_data[:version] = "0.01"
      ScenarioVersion.create(
        scenario: "001", version: "0.01", data: test_data.to_json
      )

      get :show, params: { id: "001", version: "0.01" }

      expect(response.status).to be == 200
      json = JSON.parse(response.body)
      expect(json["name"]).to be == "new name"
      expect(json["version"]).to be == "0.01"
    end
  end

  describe "allied_factions" do
    it "returns codes and names" do
      get :allied_factions

      expect(response.status).to be == 200
      body = JSON.parse(response.body)
      usa = body.select { |a| a["code"] == "usa" }
      expect(usa.length).to be == 1
      expect(usa[0]["name"]).to be == "American"

      ussr = body.select { |a| a["code"] == "ussr" }
      expect(ussr.length).to be == 1
      expect(ussr[0]["name"]).to be == "Soviet"
    end
  end

  describe "axis_factions" do
    it "returns codes and names" do
      get :axis_factions

      expect(response.status).to be == 200
      body = JSON.parse(response.body)
      ger = body.select { |a| a["code"] == "ger" }
      expect(ger.length).to be == 1
      expect(ger[0]["name"]).to be == "German"

      ita = body.select { |a| a["code"] == "ita" }
      expect(ita.length).to be == 1
      expect(ita[0]["name"]).to be == "Italian"
    end
  end

  describe "all_units" do
    it "returns units" do
      get :all_units

      expect(response.status).to be == 200
      body = JSON.parse(response.body)
      expect(body["ussr_rifle_s"]["n"]).to be == "Rifle"
      expect(body["ger_rifle_s"]["n"]).to be == "Rifle"
    end
  end

  describe "stats" do
    it "handles no data" do
      get :stats, params: { id: "000" }

      expect(response.status).to be == 200
      body = JSON.parse(response.body)
      expect(body["one"]).to be == 1
      expect(body["two"]).to be == 1
    end

    it "handles data" do
      game1 = create(:game, scenario: "001", player_two: create(:user))
      game1.winner = game1.player_one
      game1.save!

      game2 = create(:game, scenario: "001", player_two: create(:user))
      game2.winner = game2.player_two
      game2.save!

      get :stats, params: { id: "001" }

      expect(response.status).to be == 200
      body = JSON.parse(response.body)
      expect(body["one"]).to be == 2
      expect(body["two"]).to be == 2
    end
  end
end
