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
  let!(:action1) { create(:game_action, sequence: 1, user:, game:) }
  let!(:action2) { create(:game_action, sequence: 2, user: user2, game:) }
  let!(:game_message1) { create(:message, user:, game:) }
  let!(:game_message2) { create(:message, user: user2, game:) }
  let!(:global_message1) { create(:message, user:, game: nil) }
  let!(:global_message2) { create(:message, user: user2, game: nil) }

  before do
    game.update!(last_action_id: GameAction.last)
  end

  it "lookup finds usernames or emails regardless of case" do
    expect(User.lookup(user.username.downcase)).to be == user
    expect(User.lookup(user.username.upcase)).to be == user
    expect(User.lookup(user.email.downcase)).to be == user
    expect(User.lookup(user.email.upcase)).to be == user
    expect(User.lookup("")).to be_nil
  end

  it "cleans up after itself on deletion" do
    user.destroy

    # Cleans up game
    expect(game.reload.owner).to be == user2
    expect(game.player_one).to be_nil
    expect(game.player_two).to be == user2

    # Unlinks actions
    expect(GameAction.count).to be == 2
    expect(action1.reload.user).to be_nil

    # Cleans up global messages/unlinks game messages
    expect(Message.count).to be == 3
    expect(game_message1.reload.user).to be_nil
    expect(Message.find_by(id: global_message1.id)).to be_nil
  end

  context "when owner is player two" do
    let(:game) do
      create(
        :game, owner: user, player_one: user2, player_two: user,
               current_player: user, name: "game", state: :in_progress
      )
    end

    it "cleans up after itself on deletion" do
      user.destroy

      # Cleans up game
      expect(game.reload.owner).to be == user2
      expect(game.player_one).to be == user2
      expect(game.player_two).to be_nil
      expect(game.current_player).to be_nil
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

      # Removes game completely
      expect(Game.find_by(id: game.id)).to be_nil
      expect(GameAction.count).to be == 0
      expect(Message.count).to be == 1
    end
  end
end
