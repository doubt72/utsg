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
      scenario_version: "1.4",
      state: game.state,
      owner: user1.username,
      player_one: user1.username,
      player_two: user2.username,
      current_player: user2.username,
      winner: nil,
      server_version: Utility::Server::VERSION,
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
  end

  context "turn notifications" do
    let(:user) { create(:user) }
    let(:user2) { create(:user) }
    let!(:game) do
      create(:game, owner: user, player_one: user, player_two: user2,
                    current_player: user2, name: "game", state: :in_progress,
                    needs_turn_notification: true)
    end

    before :each do
      create(:game_action, user: user2, created_at: 25.minutes.ago, sequence: 3, game:)
      create(:game_action, user:, created_at: 20.minutes.ago, sequence: 4, game:)
    end

    it "handles notificaton" do
      expect(game.needs_turn_notification).to be == true
      expect(Utility::NotificationEmails).to receive(:turn_notification)

      game.check_for_turn_notification

      expect(game.needs_turn_notification).to be == false
    end

    it "no solo notifications" do
      game.update(owner: user2, player_one: user2)

      expect(Utility::NotificationEmails).not_to receive(:turn_notification)

      game.check_for_turn_notification

      expect(game.needs_turn_notification).to be == true
    end

    it "doesn't notify if already notified" do
      game.update(needs_turn_notification: false)

      expect(Utility::NotificationEmails).not_to receive(:turn_notification)

      game.check_for_turn_notification

      expect(game.needs_turn_notification).to be == false
    end

    it "doesn't notify unless in progress" do
      game.update(state: :complete)

      expect(Utility::NotificationEmails).not_to receive(:turn_notification)

      game.check_for_turn_notification

      expect(game.needs_turn_notification).to be == true
    end

    it "doesn't notify if notifications disabled" do
      user2.update(notifications: false)

      expect(Utility::NotificationEmails).not_to receive(:turn_notification)

      game.check_for_turn_notification

      expect(game.needs_turn_notification).to be == true
    end
  end
end
