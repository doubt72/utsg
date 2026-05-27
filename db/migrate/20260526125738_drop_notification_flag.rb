# frozen_string_literal: true

class DropNotificationFlag < ActiveRecord::Migration[7.0]
  def change
    # ...Don't think these flags are used, but just in case they catch on rollbacks
    remove_column :users, :notified, :boolean, null: false, default: false
  end
end
