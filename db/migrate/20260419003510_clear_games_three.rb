# frozen_string_literal: true

class ClearGamesThree < ActiveRecord::Migration[7.0]
  def change
    Game.where(scenario: %w[001 101]).delete_all
    ScenarioVersion.where(scenario: %w[001 101]).delete_all
  end
end
