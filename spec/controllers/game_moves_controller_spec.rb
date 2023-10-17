# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::GameMovesController do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:game) do
    create(
      :game, owner: user1, player_one: user1, player_two: user2,
             current_player: user2, name: "game", state: :in_progress
    )
  end
  let!(:move1) { create(:game_move, user: user1, game:) }
  let!(:move2) { create(:game_move, user: user2, game:) }

  describe "index" do
    it "returns all moves for game with id" do
      get :index, params: { game_id: game.id }

      expect(response.status).to be == 200

      json = JSON.parse(response.body)
      expect(json.length).to be == 2
    end

    it "returns no moves for bogus game id" do
      get :index, params: { game_id: 0 }

      json = JSON.parse(response.body)
      expect(json.length).to be == 0
    end

    it "returns no moves for missing game id" do
      get :index

      json = JSON.parse(response.body)
      expect(json.length).to be == 0
    end
  end

  describe "create" do
    it "can create move" do
      login(user1)

      expect do
        post :create, params: { game_move: { game_id: game.id, data: '{ "2d6": 7 }', player: 1 } }
      end.to change { GameMove.count }.by(1)

      expect(GameMove.last.user).to be == user1
    end

    it "can't create bogus move" do
      login(user1)

      expect do
        post :create, params: { game_move: { game_id: game.id, data: '{ "2d6": 7 }', player: 2 } }
      end.not_to change { GameMove.count }

      expect do
        post :create, params: { game_move: { game_id: 0, data: '{ "2d6": 7 }', player: 1 } }
      end.not_to change { GameMove.count }

      expect(GameMove.last.user).to be == user2

      user2.destroy

      expect do
        post :create, params: { game_move: { game_id: game.id, data: '{ "2d6": 7 }', player: 1 } }
      end.not_to change { GameMove.count }

      expect(GameMove.last.user).to be_nil
    end
  end
end
