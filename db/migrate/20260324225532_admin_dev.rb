# frozen_string_literal: true

class AdminDev < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :admin, :developer

    add_column :users, :admin, :boolean, null: false, default: false
  end
end
