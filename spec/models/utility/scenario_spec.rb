# frozen_string_literal: true

require "rails_helper"

RSpec.describe Utility::Scenario do
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

  it "gets correct scenario from get_scenario" do
    expect(described_class.scenario_by_id("SPEC")[:name]).to be == scenario_name
  end

  describe "all_scenarios" do
    it "gets all scenarios with no filters" do
      scenarios = described_class.all_scenarios
      expect(scenarios.length).to be == Scenarios.constants.length - 1
    end

    it "gets spec scenario when filtering by string" do
      scenarios = described_class.all_scenarios({ string: scenario_name })
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "SPEC"
    end

    it "gets correct scenarios with allies filter" do
      scenarios = described_class.all_scenarios({ allies: "usa" })
      scenarios.each do |s|
        expect(s[:allies].include?("usa")).to be true
      end
      scenarios.select! { |s| s[:id] == "SPEC" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "SPEC"
    end

    it "gets correct scenarios with axis filter" do
      scenarios = described_class.all_scenarios({ axis: "ger" })
      scenarios.each do |s|
        expect(s[:axis].include?("ger")).to be true
      end
      scenarios.select! { |s| s[:id] == "SPEC" }
      expect(scenarios.length).to be == 1
      expect(scenarios.first[:id]).to be == "SPEC"
    end
  end

  context "validate all records" do
    it "there are no duplicate IDs" do
      scenarios = described_class.all_scenarios
      all_ids = scenarios.map { |s| s[:id] }

      expect(all_ids.length).to be == all_ids.sort.uniq.length
    end

    described_class.all_scenarios.each do |scenario|
      describe "scenario #{scenario[:id]}" do
        it "has valid attributes" do
          expect(scenario[:id]).not_to be_empty
          expect(scenario[:name]).not_to be_empty
          expect(scenario[:string]).to be_nil
        end

        it "has valid allied forces" do
          expect(scenario[:allies].length).to be > 0
          scenario[:allies].each do |force|
            allies = described_class::AVAILABLE_ALLIED_FACTIONS.map { |f| f[:code] }
            expect(allies.include?(force)).to be true
          end
        end

        it "has valid axis forces" do
          expect(scenario[:axis].length).to be > 0
          scenario[:axis].each do |force|
            axis = described_class::AVAILABLE_AXIS_FACTIONS.map { |f| f[:code] }
            expect(axis.include?(force)).to be true
          end
        end

        it "has metadata" do
          scenario = described_class.scenario_by_id(scenario[:id])
          expect(scenario).not_to be_nil
          expect(scenario[:metadata]).not_to be_nil

          metadata = scenario[:metadata]
          expect(metadata[:turns]).not_to be_nil
          expect(metadata[:first_setup]).not_to be_nil
          expect(metadata[:first_move]).not_to be_nil
          expect(metadata[:description]).not_to be_nil
          expect(metadata[:map_data]).not_to be_nil
          expect(metadata[:allied_units]).not_to be_nil
          expect(metadata[:axis_units]).not_to be_nil
        end
      end
    end
  end
end
