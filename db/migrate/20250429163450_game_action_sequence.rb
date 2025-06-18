# frozen_string_literal: true

class GameActionSequence < ActiveRecord::Migration[7.0]
  def change
    add_column :game_actions, :undone, :boolean, null: false, default: false

    add_column :game_actions, :sequence, :integer

    # Not sure if there's a cleaner way to do this
    sequence = {}
    GameAction.all.each do |m|
      game_id = m.game_id
      sequence[game_id] = 1 unless sequence[game_id]
      m.update(sequence: sequence[game_id])
      sequence[game_id] += 1
    end

    change_column_null :game_actions, :sequence, false

    add_index :game_actions, %i[sequence game_id], unique: true
  end
end
