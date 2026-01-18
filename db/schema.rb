# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2026_01_16_082452) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "game_actions", force: :cascade do |t|
    t.bigint "game_id", null: false
    t.bigint "user_id"
    t.jsonb "data", null: false
    t.integer "player", default: 1, null: false
    t.datetime "updated_at", null: false
    t.datetime "created_at", null: false
    t.boolean "undone", default: false, null: false
    t.integer "sequence", null: false
    t.index ["created_at"], name: "index_game_actions_on_created_at"
    t.index ["game_id"], name: "index_game_actions_on_game_id"
    t.index ["id"], name: "index_game_actions_on_id"
    t.index ["sequence", "game_id"], name: "index_game_actions_on_sequence_and_game_id", unique: true
    t.index ["user_id"], name: "index_game_actions_on_user_id"
  end

  create_table "games", force: :cascade do |t|
    t.bigint "owner_id", null: false
    t.bigint "player_one_id"
    t.bigint "player_two_id"
    t.bigint "current_player_id"
    t.bigint "winner_id"
    t.bigint "last_action_id"
    t.string "name", null: false
    t.string "scenario", null: false
    t.integer "state", default: 0, null: false
    t.jsonb "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "scenario_version", null: false
    t.index ["created_at"], name: "index_games_on_created_at"
    t.index ["current_player_id"], name: "index_games_on_current_player_id"
    t.index ["id"], name: "index_games_on_id"
    t.index ["last_action_id"], name: "index_games_on_last_action_id"
    t.index ["owner_id"], name: "index_games_on_owner_id"
    t.index ["player_one_id"], name: "index_games_on_player_one_id"
    t.index ["player_two_id"], name: "index_games_on_player_two_id"
    t.index ["scenario"], name: "index_games_on_scenario"
    t.index ["updated_at"], name: "index_games_on_updated_at"
    t.index ["winner_id"], name: "index_games_on_winner_id"
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "game_id"
    t.string "value", null: false
    t.datetime "created_at", null: false
    t.index ["created_at"], name: "index_messages_on_created_at"
    t.index ["game_id"], name: "index_messages_on_game_id"
    t.index ["id"], name: "index_messages_on_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "ratings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "scenario", null: false
    t.integer "rating", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["scenario"], name: "index_ratings_on_scenario"
    t.index ["user_id", "scenario"], name: "index_ratings_on_user_id_and_scenario", unique: true
    t.index ["user_id"], name: "index_ratings_on_user_id"
  end

  create_table "scenario_versions", force: :cascade do |t|
    t.string "scenario", null: false
    t.string "version", null: false
    t.string "data", null: false
    t.index ["scenario", "version"], name: "index_scenario_versions_on_scenario_and_version", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "confirmation_code"
    t.boolean "verified", default: false, null: false
    t.string "recovery_code"
    t.datetime "recovery_code_expires"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email"
    t.index ["id"], name: "index_users_on_id"
    t.index ["username"], name: "index_users_on_username"
  end

  add_foreign_key "game_actions", "games", on_delete: :cascade
  add_foreign_key "game_actions", "users"
  add_foreign_key "games", "game_actions", column: "last_action_id"
  add_foreign_key "games", "users", column: "current_player_id"
  add_foreign_key "games", "users", column: "owner_id"
  add_foreign_key "games", "users", column: "player_one_id"
  add_foreign_key "games", "users", column: "player_two_id"
  add_foreign_key "games", "users", column: "winner_id"
  add_foreign_key "messages", "games", on_delete: :cascade
  add_foreign_key "messages", "users"
  add_foreign_key "ratings", "users"
end
