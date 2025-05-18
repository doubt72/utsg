# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::ScenariosController do
  let(:scenario_name) { "xxx Spec Test xxx" }

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
      get :index, params: { status: "*" }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body)["data"].length).to be == 10
    end
  end

  describe "sorting" do
    it "gets data in correct order with default sorting" do
      get :index, params: { status: "*", sort: "n", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = ""
      data.each do |d|
        expect(d["id"]).to be > last
        last = d["id"]
      end
    end

    it "gets data in correct order with reverse sorting" do
      get :index, params: { status: "*", sort: "n", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = "999"
      data.each do |d|
        expect(d["id"]).to be < last
        last = d["id"]
      end
    end

    it "gets data in correct order with date sorting" do
      get :index, params: { status: "*", sort: "d", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = [1, 1, 1]
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        expect(scenario[:date] <=> last).to be >= 0
        last = scenario[:date]
      end
    end

    it "gets data in correct order with reverse date sorting" do
      get :index, params: { status: "*", sort: "d", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = [9999, 1, 1]
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        expect(scenario[:date] <=> last).to be <= 0
        last = scenario[:date]
      end
    end

    it "gets data in correct order with map size sorting" do
      get :index, params: { status: "*", sort: "m", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 0
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        unit_count = Utility::Scenario.map_size(scenario)
        expect(unit_count <=> last).to be >= 0
        last = unit_count
      end
    end

    it "gets data in correct order with reverse map size sorting" do
      get :index, params: { status: "*", sort: "m", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 99
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        unit_count = Utility::Scenario.map_size(scenario)
        expect(unit_count <=> last).to be <= 0
        last = unit_count
      end
    end

    it "gets data in correct order with unit count sorting" do
      get :index, params: { status: "*", sort: "u", sort_dir: "asc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 0
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        unit_count = Utility::Scenario.all_units(scenario).length
        expect(unit_count <=> last).to be >= 0
        last = unit_count
      end
    end

    it "gets data in correct order with reverse unit count sorting" do
      get :index, params: { status: "*", sort: "u", sort_dir: "desc" }

      expect(response.status).to be == 200
      data = JSON.parse(response.body)["data"]

      last = 99
      data.each do |d|
        scenario = Utility::Scenario.scenario_by_id(d["id"])
        unit_count = Utility::Scenario.all_units(scenario).length
        expect(unit_count <=> last).to be <= 0
        last = unit_count
      end
    end
  end

  describe "filters" do
    it "gets spec scenario when filtering by string" do
      get :index, params: { string: scenario_name, status: "*" }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body)["data"].length).to be == 1
      expect(JSON.parse(response.body)["data"].first["id"]).to be == "000"
    end

    it "gets correct scenarios with allies filter" do
      get :index, params: { allies: "usa", status: "*" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      scenarios.each do |s|
        expect(s["allies"].include?("usa")).to be true
      end
      scenarios.select! { |s| s["id"] == "000" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first["id"]).to be == "000"
    end

    it "gets correct scenarios with axis filter" do
      get :index, params: { axis: "ger", status: "*" }

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
      get :index, params: { status: "*", theater: "1" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      scenarios.each do |s|
        expect(s["id"][0]).to be == "1"
      end
    end

    it "gets correct scenarios with size filter" do
      get :index, params: { status: "*", size: "2x1" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with infantry filter" do
      get :index, params: { status: "*", type: "inf" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with artillery filter" do
      get :index, params: { status: "*", type: "art" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with tank filter" do
      get :index, params: { status: "*", type: "tank" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)["data"]
      expect(scenarios.length).to be > 0
    end

    it "gets correct scenarios with no_feat filter" do
      get :index, params: { status: "*", type: "no_feat" }

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
end
