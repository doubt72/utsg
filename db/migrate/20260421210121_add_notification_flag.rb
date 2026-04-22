# frozen_string_literal: true

class AddNotificationFlag < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :notifications, :boolean, null: false, default: true
    add_column :users, :notified, :boolean, null: false, default: false
  end
end
