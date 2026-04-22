# frozen_string_literal: true

class ClearGamesFive < ActiveRecord::Migration[7.0]
  def change
    ids = [39, 40, 42, 47]
    Game.where(id: ids).delete_all

    ScenarioVersion.all.each do |sv|
      sv.delete if Game.where(scenario: sv.scenario, scenario_version: sv.version).count < 1
    end
  end
end
