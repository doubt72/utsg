# frozen_string_literal: true

class AddAdmin < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :admin, :boolean, null: false, default: false
  end
end
