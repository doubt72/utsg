# frozen_string_literal: true

class CreateGames < ActiveRecord::Migration[7.0]
  def change # rubocop:disable Metrics/MethodLength
    create_table :games do |t|
      t.references :owner, null: false, foreign_key: { to_table: :users }
      t.references :player_one, foreign_key: { to_table: :users }
      t.references :player_two, foreign_key: { to_table: :users }
      t.references :current_player, foreign_key: { to_table: :users }
      t.references :winner, foreign_key: { to_table: :users }
      t.bigint :last_action_id

      t.string :name, null: false
      t.string :scenario, null: false
      t.integer :state, null: false, default: 0
      t.jsonb :metadata

      t.timestamps
    end

    add_index :games, :id
    add_index :games, :scenario

    add_index :games, :last_action_id
    add_index :games, :created_at
    add_index :games, :updated_at
  end
end
