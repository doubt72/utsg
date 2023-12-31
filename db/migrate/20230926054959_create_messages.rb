# frozen_string_literal: true

class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.references :user, foreign_key: true
      t.references :game, foreign_key: true

      t.string :value, null: false

      # Messages are effectively write-only, not user-modifiable
      t.datetime :created_at, null: false
    end

    add_index :messages, :id
    add_index :messages, :created_at
  end
end
