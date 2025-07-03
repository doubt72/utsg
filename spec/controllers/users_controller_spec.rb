# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::UsersController do
  let!(:user) { create(:user) }

  it "returns conflict for existing username" do
    get :check_conflict, params: { check: user.username }

    expect(response.body).to be == { conflict: true }.to_json
  end

  it "returns conflict for existing email" do
    get :check_conflict, params: { check: user.email }

    expect(response.body).to be == { conflict: true }.to_json
  end

  it "returns conflict for unknown user" do
    get :check_conflict, params: { check: User::UNKNOWN_USERNAME }

    expect(response.body).to be == { conflict: true }.to_json
  end

  it "doesn't return conflict for other string" do
    get :check_conflict, params: { check: "" }

    expect(response.body).to be == { conflict: false }.to_json
  end

  context "game stats" do
    let!(:user2) { create(:user) }

    before :each do
      create(:game, owner: user, player_one: user, player_two: user2,
                    current_player: user2, name: "game", state: :in_progress)
      create(:game, owner: user, player_one: user, player_two: user2,
                    current_player: user, name: "game", state: :in_progress)
      create(:game, owner: user, player_one: user, player_two: user2,
                    current_player: user, name: "game", state: :in_progress, updated_at: 8.days.ago)
      create(:game, owner: user, player_one: user, player_two: user2, winner: user,
                    current_player: user2, name: "game", state: :complete)
      create(:game, owner: user, player_one: user, player_two: user2, winner: user2,
                    current_player: user, name: "game", state: :complete)
      create(:game, owner: user, player_one: user, player_two: user, winner: user,
                    current_player: user, name: "game", state: :complete)

      login(user)
    end

    it "returns stats for user" do
      get :stats, params: { username: user.username }

      expect(response.status).to be == 200

      body = JSON.parse(response.body)
      expect(body.keys.length).to be == 2
      expect(body["all"]).to be == {
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 1, "abandoned" => 1,
      }
      expect(body["001"]).to be == {
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 1, "abandoned" => 1,
      }
    end

    it "produces no stats for no user" do
      get :stats, params: { username: "no body" }

      expect(response.status).to be == 404
    end

    it "can read other user" do
      get :stats, params: { username: user2.username }

      expect(response.status).to be == 200

      body = JSON.parse(response.body)
      expect(body.keys.length).to be == 2
      expect(body["all"]).to be == {
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 0, "abandoned" => 1,
      }
      expect(body["001"]).to be == {
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 0, "abandoned" => 1,
      }
    end
  end
end
