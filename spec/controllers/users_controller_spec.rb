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

  context "toggle_dev" do
    let!(:admin) { create(:user, admin: true) }

    it "needs to be an admin" do
      login(user)

      put :toggle_dev, params: { id: user.username }
      expect(response.status).to be == 403
    end

    it "toggles user" do
      login(admin)

      put :toggle_dev, params: { id: user.username }
      expect(response.status).to be == 200
      expect(user.reload.developer).to be == true
    end
  end

  context "toggle_banned" do
    let!(:admin) { create(:user, admin: true) }

    it "needs to be an admin" do
      login(user)

      put :toggle_banned, params: { id: user.username }
      expect(response.status).to be == 403
    end

    it "toggles user" do
      login(admin)

      put :toggle_banned, params: { id: user.username }
      expect(response.status).to be == 200
      expect(user.reload.banned).to be == true
    end
  end

  context "toggle_notification" do
    it "toggles self" do
      login(user)
      expect(user.notifications).to be == true

      put :toggle_notifications
      expect(response.status).to be == 200
      expect(user.reload.notifications).to be == false
    end
  end

  context "notify" do
    let(:user2) { create(:user, notifications: false) }
    let(:other) { create(:user, notifications: false) }
    let!(:game) do
      create(:game, owner: user, player_one: user, player_two: user2,
                    current_player: user2, name: "game", state: :in_progress)
    end

    before :each do
      create(:game_action, user: user2, created_at: 25.minutes.ago, sequence: 1, game:)
      create(:game_action, user:, created_at: 20.minutes.ago, sequence: 2, game:)
    end

    it "can notify self" do
      login(user)

      expect(user.reload.notified).to be == false
      post :notify, params: { id: user.username, game_id: game.id }
      expect(response.status).to be == 200
      expect(user.reload.notified).to be == true
    end

    it "can handle being already notified" do
      login(user)

      user.update!(notified: true)
      post :notify, params: { id: user.username, game_id: game.id }
      expect(response.status).to be == 200
      expect(user.reload.notified).to be == true
    end

    it "can notify other" do
      login(user)

      post :notify, params: { id: user2.username, game_id: game.id }
      expect(response.status).to be == 200
      expect(user2.reload.notified).to be == false
    end

    it "other player can notify self" do
      login(user2)

      post :notify, params: { id: user2.username, game_id: game.id }
      expect(response.status).to be == 200
      expect(user2.reload.notified).to be == false
    end

    it "other player can notify other" do
      login(user2)

      post :notify, params: { id: user.username, game_id: game.id }
      expect(response.status).to be == 200
      expect(user.reload.notified).to be == true
    end

    it "outside player can't trigger notify" do
      login(other)

      post :notify, params: { id: user.username, game_id: game.id }
      expect(response.status).to be == 403
      expect(user.reload.notified).to be == false
    end
  end

  context "get all" do
    let!(:admin) { create(:user, admin: true) }

    it "needs to be an admin" do
      login(user)

      get :all
      expect(response.status).to be == 403
    end

    it "returns records" do
      login(admin)

      get :all
      expect(response.status).to be == 200
      body = JSON.parse(response.body)
      expect(body.length).to be == 1
      expect(body["data"][0]["username"]).to be == admin.username
    end
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
      get :stats, params: { id: user.username }

      expect(response.status).to be == 200

      body = JSON.parse(response.body)
      expect(body.keys.length).to be == 2
      expect(body["stats"]["all"]).to be == {
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 1, "abandoned" => 1, "name" => "total",
      }
      expect(body["stats"]["001"]).to be == {
        "name" => "A Straightforward Proposition",
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 1, "abandoned" => 1,
      }
      expect(body["user"]).to be == {
        "username" => user.username, "email" => user.email, "notifications" => true,
      }
    end

    it "produces no stats for no user" do
      get :stats, params: { id: "no body" }

      expect(response.status).to be == 404
    end

    it "can read other user" do
      get :stats, params: { id: user2.username }

      expect(response.status).to be == 200

      body = JSON.parse(response.body)
      expect(body.keys.length).to be == 2
      expect(body["stats"]["all"]).to be == {
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 1, "abandoned" => 0, "name" => "total",
      }
      expect(body["stats"]["001"]).to be == {
        "name" => "A Straightforward Proposition",
        "count" => 5, "win" => 1, "loss" => 1, "wait" => 1, "abandoned" => 0,
      }
    end
  end
end
