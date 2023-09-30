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
    create(:game_move, user: user1, game:)
    create(:game_move, user: user2, game:)
    create(:message, user: user1, game:)
    create(:message, user: user2, game:)
    game.update!(last_move_id: GameMove.last)
  end

  it "cleans up after itself" do
    game.destroy

    expect(Message.count).to be_zero
    expect(GameMove.count).to be_zero
  end

  it "handles player one state changes" do
    game.update!(player_one: nil)
    expect(game.reload).to be_needs_player

    game.update!(player_one: user1)
    expect(game.reload).to be_ready
  end

  it "handles player two state changes" do
    game.update!(player_two: nil)
    expect(game.reload).to be_needs_player

    game.update!(player_two: user2)
    expect(game.reload).to be_ready
  end

  context "when state is ready" do
    let(:state) { :ready }

    it "handles player one state changes" do
      game.update!(player_one: nil)
      expect(game.reload).to be_needs_player

      game.update!(player_one: user1)
      expect(game.reload).to be_ready
    end

    it "handles player two state changes" do
      game.update!(player_two: nil)
      expect(game.reload).to be_needs_player

      game.update!(player_two: user2)
      expect(game.reload).to be_ready
    end
  end
end
