class UpdateMessages < ActiveRecord::Migration[7.0]
  def change
    # Messages are effectively write-only
    remove_column :messages, :updated_at
  end
end
