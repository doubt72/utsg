# frozen_string_literal: true

class CreateGameActions < ActiveRecord::Migration[7.0]
  def change
    create_table :game_actions do |t|
      t.references :game, foreign_key: true, null: false
      t.references :user, foreign_key: true
      t.jsonb :data, null: false
      t.integer :player, null: false, default: 1

      t.datetime :updated_at, null: false
      t.datetime :created_at, null: false
    end

    add_index :game_actions, :id

    add_index :game_actions, :created_at

    add_foreign_key :games, :game_actions, column: :last_action_id,
                                           foreign_key: { to_table: :game_actions }
  end
end
