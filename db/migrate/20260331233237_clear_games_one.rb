# frozen_string_literal: true

class ClearGamesOne < ActiveRecord::Migration[7.0]
  def change
    Game.delete_all
  end
end
