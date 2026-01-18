# frozen_string_literal: true

class AddScenarioVersion < ActiveRecord::Migration[7.0]
  def change
    Game.delete_all

    add_column :games, :scenario_version, :string, null: false

    create_table :scenario_versions do |t|
      t.string :scenario, null: false
      t.string :version, null: false
      # Not bothering to support jsonb, this is just being passed through to FE
      t.string :data, null: false
    end

    add_index :scenario_versions, %i[scenario version], unique: true
  end
end
