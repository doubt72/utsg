# frozen_string_literal: true

require "rails_helper"

RSpec.describe GameAction do
  let(:user) { create(:user) }
  let(:game) { create(:game, owner: user) }
  let(:game_action) { create(:game_action, sequence: 1) }

  it "has correct attributes" do
    expect(game_action.game).not_to be nil?
    expect(game_action.user).not_to be nil?
    expect(game_action.body).to be == {
      id: game_action.id,
      sequence: 1,
      user: game_action.user.username,
      player: 1,
      undone: false,
      data: game_action.data,
      created_at: game_action.created_at.iso8601,
    }
  end

  it "populates game last action when created" do
    expect(game.actions.length).to be == 0
    expect(game.last_action).to be_nil

    action = GameAction.create!({ sequence: 1, game:, user:, data: "{}" })

    expect(game.reload.actions.length).to be == 1
    expect(game.last_action).to be == action
  end

  it "handles various json" do
    expect(game.actions.length).to be == 0
    expect(game.last_action).to be_nil

    action = GameAction.create!({ game:, sequence: 1, user:, data: { action: "action" } })

    expect(game.reload.actions.length).to be == 1
    expect(game.last_action).to be == action

    GameAction.create!({ game:, sequence: 2, user:, data: { action: "go", turn: [], player: 1 } })

    expect(game.reload.actions.length).to be == 2
    # Load directly to defeat AR cacheing
    expect(GameAction.find(game.last_action_id).data["action"]).to be == "go"
  end

  it "can undo action" do
    action = GameAction.create!({ game:, sequence: 1, user:, data: { action: "action" } })

    game.player_one = user
    game.player_two = user

    expect(action.undone).to be == false
    action.undo(user)
    expect(action.reload.undone).to be == true
  end

  it "undoes set when action earlier" do
    action1 = GameAction.create!({ game:, sequence: 1, user:, data: { action: "action" } })
    action2 = GameAction.create!({ game:, sequence: 2, user:, data: { action: "action" } })

    game.player_one = user
    game.player_two = user

    expect(action1.undone).to be == false
    action1.undo(user)
    expect(action1.reload.undone).to be == true
    expect(action2.reload.undone).to be == true
  end

  it "can't undo actions with dice" do
    action = GameAction.create!(
      {
        game:, sequence: 1, user:, data: {
          action: "initiative",
          dice_result: [{ result: "11", type: "2d10" }],
        },
      }
    )

    game.player_one = user
    game.player_two = user

    expect(action.undone).to be == false
    action.undo(user)
    expect(action.reload.undone).to be == false
  end

  it "can't undo future dice" do
    action1 = GameAction.create!(
      {
        game:, sequence: 1, user:, data: {
          action: "initiative",
          dice_result: [{ result: "11", type: "2d10" }],
        },
      }
    )
    action2 = GameAction.create!(
      {
        game:, sequence: 2, user:, data: {
          action: "initiative",
          dice_result: [{ result: "11", type: "2d10" }],
        },
      }
    )

    game.player_one = user
    game.player_two = user

    expect(action1.undone).to be == false
    action1.undo(user)
    expect(action1.reload.undone).to be == false
    expect(action2.reload.undone).to be == false
  end
end
