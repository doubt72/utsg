class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.references :owner, null: false, foreign_key: { to_table: :users }
      t.references :player_one, foreign_key: { to_table: :users }
      t.references :player_two, foreign_key: { to_table: :users }

      t.string :name, null: false

      t.timestamps
    end

    add_index :games, :id

    add_index :games, :created_at
    add_index :games, :updated_at
  end
end
