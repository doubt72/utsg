# frozen_string_literal: true

require "rails_helper"

RSpec.describe Game do
  let(:user1) { create(:user) }
  let(:user2) { create(:user) }
  let(:state) { :in_progress }
  let(:game) do
    create(
      :game, owner: user1, player_one: user1, player_two: user2,
             current_player: user2, name: "game", state:
    )
  end

  before do
    create(:game_action, sequence: 1, user: user1, game:)
    create(:game_action, sequence: 2, user: user2, game:)
    create(:message, user: user1, game:)
    create(:message, user: user2, game:)
    game.update!(last_action_id: GameAction.last)
  end

  it "has body" do
    expect(game.show_body).to be == {
      id: game.id,
      name: game.name,
      scenario: game.scenario,
      state: game.state,
      owner: user1.username,
      player_one: user1.username,
      player_two: user2.username,
      current_player: user2.username,
      winner: nil,
      metadata: game.metadata,
      created_at: game.created_at.iso8601,
      updated_at: game.actions.last.created_at.iso8601,
    }
  end

  it "cleans up after itself" do
    game.destroy

    expect(Message.count).to be_zero
    expect(GameAction.count).to be_zero
  end

  context "handles player deletions and additions" do
    let(:user3) { create(:user) }

    it "handles player one state changes" do
      user1.destroy

      expect(game.reload).to be_needs_player

      game.update!(player_one: user3)
      expect(game.reload).to be_ready
    end

    it "handles player two state changes" do
      user2.destroy

      expect(game.reload).to be_needs_player

      game.update!(player_two: user3)
      expect(game.reload).to be_ready
    end

    context "when state is ready" do
      let(:state) { :ready }

      it "handles player one state changes" do
        user1.destroy

        expect(game.reload).to be_needs_player

        game.update!(player_one: user3)
        expect(game.reload).to be_ready
      end

      it "handles player two state changes" do
        user2.destroy

        expect(game.reload).to be_needs_player

        game.update!(player_two: user3)
        expect(game.reload).to be_ready
      end
    end

    it "handles resignation" do
      game.resign(user1)
      expect(game.reload).to be_complete

      expect(game.winner.id).to be == user2.id
    end

    it "can't re-resign" do
      game.resign(user1)
      expect(game.reload).to be_complete

      expect(game.winner.id).to be == user2.id

      game2 = Game.find(game.id)
      game2.resign(user2)
      expect(game2.reload.winner.id).to be == user2.id
    end
  end
end
