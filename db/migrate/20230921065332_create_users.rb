class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :confirmation_code
      t.boolean :verified, default: false, null: false
      t.boolean :password_reset_required, default: false, null: false

      t.timestamps
    end

    add_index :users, :username
    add_index :users, :email
  end
end
