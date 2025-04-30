# frozen_string_literal: true

class GameMoveSequence < ActiveRecord::Migration[7.0]
  def change
    add_column :game_moves, :undone, :boolean, null: false, default: false

    add_column :game_moves, :sequence, :integer

    # Not sure if there's a cleaner way to do this
    sequence = {}
    GameMove.all.each do |m|
      game_id = m.game_id
      sequence[game_id] = 1 unless sequence[game_id]
      m.update(sequence: sequence[game_id])
      sequence[game_id] += 1
    end

    change_column_null :game_moves, :sequence, false

    add_index :game_moves, %i[sequence game_id], unique: true
  end
end
