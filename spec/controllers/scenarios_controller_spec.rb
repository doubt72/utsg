# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::ScenariosController do
  let(:scenario_name) { "xxx Spec Test xxx" }

  before :all do
    unless defined?(Scenarios::Spec)
      class Scenarios::Spec < Scenarios::Base # rubocop:disable Style/ClassAndModuleChildren
        ID = "SPEC"
        NAME = "xxx Spec Test xxx"
        ALLIES = %w[uk usa].freeze
        AXIS = %w[ger ita].freeze

        class << self
          def generate
            {}
          end
        end
      end
    end
  end

  describe "index" do
    it "gets all scenarios with no filters" do
      get :index

      expect(response.status).to be == 200
      expect(JSON.parse(response.body).length).to be == Scenarios.constants.length - 1
    end

    it "gets spec scenario when filtering by string" do
      get :index, params: { string: scenario_name }

      expect(response.status).to be == 200
      expect(JSON.parse(response.body).length).to be == 1
      expect(JSON.parse(response.body).first["id"]).to be == "SPEC"
    end

    it "gets correct scenarios with allies filter" do
      get :index, params: { allies: "usa" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)
      scenarios.each do |s|
        expect(s["allies"].include?("usa")).to be true
      end
      scenarios.select! { |s| s["id"] == "SPEC" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first["id"]).to be == "SPEC"
    end

    it "gets correct scenarios with axis filter" do
      get :index, params: { axis: "ger" }

      expect(response.status).to be == 200
      scenarios = JSON.parse(response.body)
      scenarios.each do |s|
        expect(s["axis"].include?("ger")).to be true
      end
      scenarios.select! { |s| s["id"] == "SPEC" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first["id"]).to be == "SPEC"
    end
  end

  describe "show" do
    it "gets correct scenario from get_scenario" do
      get :show, params: { id: "SPEC" }

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
