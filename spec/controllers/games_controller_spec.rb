# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::GamesController do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let!(:game1) do
    create(
      :game, owner: user1, player_one: user1, player_two: user2,
             current_player: user2, name: "game 1", state: :in_progress
    )
  end
  let!(:game2) do
    create(
      :game, owner: user1, player_one: user1, player_two: nil,
             current_player: nil, name: "game 2", state: :needs_player
    )
  end

  describe "index" do
    let!(:game3) do
      create(
        :game, owner: user1, player_one: user1, player_two: user2,
               current_player: user2, name: "game 3", state: :ready
      )
    end
    let!(:game4) do
      create(
        :game, owner: user1, player_one: user1, player_two: user2,
               current_player: user2, name: "game 4", state: :complete
      )
    end

    it "can find user's games" do
      get :index, params: { user: user2.username }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 3
      expect(json[0]["id"]).to be == game4.id
      expect(json[1]["id"]).to be == game3.id
      expect(json[2]["id"]).to be == game1.id
      expect(json[2]["state"]).to be == "in_progress"
    end

    it "can find all games" do
      get :index, params: { user: "" }

      expect(response.status).to be == 200
      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 4

      get :index

      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 4
      expect(json[0]["id"]).to be == game4.id
      expect(json[1]["id"]).to be == game3.id
      expect(json[2]["id"]).to be == game2.id
      expect(json[3]["id"]).to be == game1.id
    end

    it "can find new games" do
      get :index, params: { scope: "not_started" }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 2
      expect(json[0]["id"]).to be == game3.id
      expect(json[1]["id"]).to be == game2.id
      expect(json[0]["state"]).to be == "ready"
      expect(json[1]["state"]).to be == "needs_player"
    end

    it "can find active games" do
      get :index, params: { scope: "active" }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 1
      expect(json[0]["id"]).to be == game1.id
      expect(json[0]["state"]).to be == "in_progress"
    end

    it "can find complete games" do
      get :index, params: { scope: "complete" }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 1
      expect(json[0]["id"]).to be == game4.id
      expect(json[0]["state"]).to be == "complete"
    end

    it "can find need_action games" do
      login(user1)

      get :index, params: { user: user2.username, scope: "needs_action" }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 1
      expect(json[0]["id"]).to be == game3.id
      expect(json[0]["state"]).to be == "ready"
    end

    it "can find need_move games" do
      login(user2)

      get :index, params: { user: user2.username, scope: "needs_move" }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)["data"]
      expect(json.length).to be == 1
      expect(json[0]["id"]).to be == game1.id
      expect(json[0]["state"]).to be == "in_progress"
    end

    context "with pagination" do
      before do
        10.times do
          create(
            :game, owner: user1, player_one: user1, player_two: nil,
                   current_player: nil, name: "game 2", state: :needs_player
          )
        end

        it "paginates properly" do
          get :index, params: { scope: "not_started" }

          expect(response.status).to be == 200

          json = JSON.parse(response.body)
          expect(json["more"]).to be == true
          expect(json["page"]).to be == 0
          expect(json["data"].length).to be == 8

          get :index, params: { user: user1.username, scope: "not_started", page: 1 }

          expect(response.status).to be == 200

          json = JSON.parse(response.body)
          expect(json["more"]).to be == false
          expect(json["page"]).to be == 1
          expect(json["data"].length).to be == 2
        end
      end
    end
  end

  describe "show" do
    it "returns current game" do
      get :show, params: { id: game1.id }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)
      expect(json["id"]).to be == game1.id
      expect(json["state"]).to be == "in_progress"
      expect(JSON.parse(json["metadata"])["turn"]).to be == 1
    end

    it "handles missing game" do
      get :show, params: { id: 0 }

      expect(response.status).to be == 404
    end
  end

  describe "create" do
    it "can create game" do
      login(user1)

      expect do
        post :create, params: {
          game: {
            name: "new game", scenario: "E01", player_one: user1.username,
            metadata: '{ "turn": 2 }',
          },
        }
      end.to change { Game.count }.by(1)

      expect(Game.last.name).to be == "new game"
    end

    it "creates initial moves" do
      login(user1)

      expect do
        post :create, params: {
          game: {
            name: "new game", scenario: "E01", player_one: user1.username,
            metadata: '{ "turn": 2 }',
          },
        }
      end.to change { GameMove.count }.by(2)

      expect(GameMove.first.data["action"]).to be == "create"
      expect(GameMove.last.data["action"]).to be == "join"
    end

    it "can't create bogus game" do
      login(user1)

      expect do
        post :create, params: { game: { name: "new game", metadata: '{ "turn": 2 }' } }
      end.to_not change { Game.count }

      expect(response.status).to be == 422

      expect do
        post :create, params: { game: {
          name: "new game", player_one: user1.username, player_two: user1.username,
          metadata: '{ "turn": 2 }',
        } }
      end.to_not change { Game.count }

      expect(response.status).to be == 422

      expect do
        post :create, params: { game: {
          name: "new game", player_one: user2.username, metadata: '{ "turn": 2 }',
        } }
      end.to_not change { Game.count }

      expect(response.status).to be == 422
    end
  end

  describe "update" do
    it "can update a game" do
      login(user1)

      expect(game1.current_player).to be == user2

      expect do
        put :update, params: { id: game1.id, game: { current_player: user1.username } }
      end.to change { game1.reload.current_player }

      expect(game1.current_player).to be == user1
    end

    it "can't update a game if not player" do
      user3 = create(:user)

      login(user3)

      expect do
        put :update, params: { id: game1.id, game: { current_player: user1.username } }
      end.not_to change { game1.reload.current_player }

      expect(response.status).to be == 403
    end
  end

  describe "join_game" do
    it "allows player to join open game" do
      login(user2)

      expect do
        post :join, params: { id: game2.id }
      end.to change { game2.reload.player_two }

      expect(response.status).to be == 200
      expect(game2.state).to be == "ready"
      expect(game2.player_two).to be == user2
    end

    it "creates join move" do
      login(user2)

      expect do
        post :join, params: { id: game2.id }
      end.to change { GameMove.count }.by(1)

      expect(GameMove.last.data["action"]).to be == "join"
    end

    it "doesn't allow player to join full game" do
      login(user2)

      expect do
        post :join, params: { id: game1.id }
      end.not_to change { game1.reload.player_two }

      expect(response.status).to be == 403
    end

    it "doesn't allow player to join game they're already in" do
      login(user1)

      expect do
        post :join, params: { id: game2.id }
      end.not_to change { game2.reload.player_two }

      expect(response.status).to be == 403
    end
  end

  describe "start_game" do
    let!(:game3) do
      create(
        :game, owner: user1, player_one: user1, player_two: user2,
               current_player: nil, name: "game 3", state: :ready
      )
    end

    it "allows owner to start game" do
      login(user1)

      expect do
        post :start, params: { id: game3.id }
      end.to change { game3.reload.state }

      expect(response.status).to be == 200
      expect(game3.state).to be == "in_progress"
    end

    it "doesn't allow owner to start in progress game" do
      login(user1)

      expect do
        post :start, params: { id: game1.id }
      end.not_to change { game1.reload.state }

      expect(response.status).to be == 403
    end

    it "doesn't allow owner to start game that needs a player" do
      login(user1)

      expect do
        post :start, params: { id: game2.id }
      end.not_to change { game2.reload.state }

      expect(response.status).to be == 403
    end

    it "doesn't allow non-owner to start a game" do
      login(user2)

      expect do
        post :start, params: { id: game3.id }
      end.not_to change { game3.reload.state }

      expect(response.status).to be == 403
    end
  end

  describe "end_game" do
    it "allows player to end game" do
      login(user2)

      expect do
        post :complete, params: { id: game1.id }
      end.to change { game1.reload.state }

      expect(response.status).to be == 200
      expect(game1.reload.state).to be == "complete"
    end

    it "allows player to end game even if not in progress" do
      login(user1)

      expect do
        post :complete, params: { id: game2.id }
      end.to change { game2.reload.state }

      expect(response.status).to be == 200
      expect(game2.reload.state).to be == "complete"
    end

    it "doesn't allow non-player to end game" do
      user3 = create(:user)

      login(user3)

      expect do
        post :complete, params: { id: game1.id }
      end.not_to change { game1.reload.state }

      expect(response.status).to be == 403
    end
  end
end
