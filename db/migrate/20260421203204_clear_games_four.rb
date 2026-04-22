# frozen_string_literal: true

class ClearGamesFour < ActiveRecord::Migration[7.0]
  def change
    ids = [23, 24, 25, 26, 27, 30, 31, 32, 33, 35, 36, 37]
    Game.where(id: ids).delete_all

    ScenarioVersion.all.each do |sv|
      sv.delete if Game.where(scenario: sv.scenario, scenario_version: sv.version).count < 1
    end
  end
end
