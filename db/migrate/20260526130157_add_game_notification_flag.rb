# frozen_string_literal: true

class AddGameNotificationFlag < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :needs_turn_notification, :boolean, null: false, default: false

    add_index :games, %i[state needs_turn_notification]
  end
end
