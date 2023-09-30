# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::MessagesController do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:game) do
    create(
      :game, owner: user1, player_one: user1, player_two: user2,
             current_player: user2, name: "game", state: :in_progress
    )
  end
  let!(:game_message1) { create(:message, user: user1, game:) }
  let!(:game_message2) { create(:message, user: user2, game:) }
  let!(:old_game_message1) { create(:message, user: user1, game:, created_at: 2.days.ago) }
  let!(:old_game_message2) { create(:message, user: user2, game:, created_at: 2.days.ago) }
  let!(:global_message1) { create(:message, user: user1, game: nil) }
  let!(:global_message2) { create(:message, user: user2, game: nil) }
  let!(:old_global_message1) { create(:message, user: user1, game: nil, created_at: 2.days.ago) }
  let!(:old_global_message2) { create(:message, user: user2, game: nil, created_at: 2.days.ago) }

  describe "index" do
    it "shows all game messages" do
      get :index, params: { game_id: game.id }

      expect(response.body).to be == [
        old_game_message1.body, old_game_message2.body, game_message1.body, game_message2.body,
      ].to_json
    end

    it "shows only recent global messages" do
      get :index, params: { game_id: 0 }

      expect(response.body).to be == [global_message1.body, global_message2.body].to_json
    end
  end

  describe "create" do
    it "successfully handles logged in user" do
      login(user1)

      expect { post :create, params: { message: { value: "hello", game_id: game.id } } }
        .to change(Message, :count).by(1)

      expect(Message.last.value).to be == "hello"
      expect(Message.last.user).to be == user1
      expect(Message.last.game).to be == game
    end

    it "sucessfully handles logged out user" do
      expect { post :create, params: { message: { value: "hello", game_id: game.id } } }
        .not_to change(Message, :count)

      expect(response.status).to be == 401
    end

    it "handles zero game" do
      login(user1)

      expect { post :create, params: { message: { value: "hello", game_id: 0 } } }
        .to change(Message, :count).by(1)

      expect(Message.last.value).to be == "hello"
      expect(Message.last.user).to be == user1
      expect(Message.last.game).to be_nil
    end
  end
end
