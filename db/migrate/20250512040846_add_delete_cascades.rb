# frozen_string_literal: true

class AddDeleteCascades < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :messages, :games
    remove_foreign_key :game_actions, :games

    add_foreign_key :messages, :games, on_delete: :cascade
    add_foreign_key :game_actions, :games, on_delete: :cascade
  end
end
