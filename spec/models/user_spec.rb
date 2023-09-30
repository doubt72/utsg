# frozen_string_literal: true

require "rails_helper"

RSpec.describe Game do
  let(:user) { create(:user) }
  let(:user2) { create(:user) }
  let(:game) do
    create(
      :game, owner: user, player_one: user, player_two: user2,
             current_player: user2, name: "game", state: :in_progress
    )
  end
  let!(:move1) { create(:game_move, user:, game:) }
  let!(:move2) { create(:game_move, user: user2, game:) }
  let!(:message1) { create(:message, user:, game:) }
  let!(:message2) { create(:message, user: user2, game:) }

  before do
    game.update!(last_move_id: GameMove.last)
  end

  it "lookup finds usernames or emails regardless of case" do
    expect(User.lookup(user.username.downcase)).to_not be_nil
    expect(User.lookup(user.username.upcase)).to_not be_nil
    expect(User.lookup(user.email.downcase)).to_not be_nil
    expect(User.lookup(user.email.upcase)).to_not be_nil
    expect(User.lookup("")).to be_nil
  end

  it "cleans up after itself on deletion" do
    user.destroy

    expect(game.reload.owner).to be == user2
    expect(game.player_one).to be_nil
    expect(game.player_two).to be == user2
    expect(GameMove.count).to be == 2
    expect(move1.reload.user).to be_nil
    expect(Message.count).to be == 1
    expect(Message.find_by(id: message1.id)).to be_nil
  end

  context "when owner is player two" do
    let(:game) do
      create(
        :game, owner: user, player_one: user2, player_two: user,
               current_player: user2, name: "game", state: :in_progress
      )
    end

    it "cleans up after itself on deletion" do
      user.destroy

      expect(game.reload.owner).to be == user2
      expect(game.player_one).to be == user2
      expect(game.player_two).to be_nil
    end
  end

  context "where there is only one player" do
    let(:game) do
      create(
        :game, owner: user, player_one: user, player_two: nil,
               current_player: user, name: "game", state: :needs_player
      )
    end

    it "cleans up after itself on deletion" do
      user.destroy

      expect(Game.find_by(id: game.id)).to be_nil
      expect(GameMove.count).to be == 0
    end
  end
end
