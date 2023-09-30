# frozen_string_literal: true

class CreateGameMoves < ActiveRecord::Migration[7.0]
  def change
    create_table :game_moves do |t|
      t.references :game, foreign_key: true, null: false
      t.references :user, foreign_key: true
      t.jsonb :data, null: false

      # Moves are effectively write-only, undos are new moves
      t.datetime :created_at, null: false
    end

    add_index :game_moves, :id

    add_index :game_moves, :created_at

    add_foreign_key :games, :game_moves, column: :last_move_id, foreign_key: { to_table: :game_moves }
  end
end
