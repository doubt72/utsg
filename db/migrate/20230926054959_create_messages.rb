class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.references :user, foreign_key: true, null: false
      t.references :game, foreign_key: true

      t.string :value, null: false

      t.timestamps
    end

    add_index :messages, :id
    add_index :messages, :created_at
  end
end
