class UpdateGame < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :metadata, :jsonb, null: false
    add_column :games, :last_move_id, :bigint, foreign_key: { to_table: :game_moves }
  end
end
