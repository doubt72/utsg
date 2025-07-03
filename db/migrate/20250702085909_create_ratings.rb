# frozen_string_literal: true

class CreateRatings < ActiveRecord::Migration[7.0]
  def change
    create_table :ratings do |t|
      t.references :user, foreign_key: true, null: false
      t.string :scenario, null: false
      t.integer :rating, null: false

      t.timestamps
    end

    add_index :ratings, :scenario
    add_index :ratings, %i[user_id scenario], unique: true
  end
end
