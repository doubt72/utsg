class CreateGameMoves < ActiveRecord::Migration[7.0]
  def change
    create_table :game_moves do |t|
      t.references :game, foreign_key: true, null: false
      # No null: user might delete their account, only owned games go away:
      t.references :user, foreign_key: true
      t.jsonb :data, null: false

      # Moves are effectively write-only, undos are new moves
      t.datetime :created_at, null: false
    end

    add_index :game_moves, :id

    add_index :game_moves, :created_at
  end
end
