# frozen_string_literal: true

class AddBans < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :banned, :boolean, null: false, default: false
  end
end
