# frozen_string_literal: true

require "rails_helper"

RSpec.describe GameMove do
  let(:user) { create(:user) }
  let(:game) { create(:game, owner: user) }
  let(:game_move) { create(:game_move, sequence: 1) }

  it "has correct attributes" do
    expect(game_move.game).not_to be nil?
    expect(game_move.user).not_to be nil?
    expect(game_move.body).to be == {
      id: game_move.id,
      sequence: 1,
      user: game_move.user.username,
      player: 1,
      undone: false,
      data: game_move.data,
      created_at: game_move.created_at.iso8601,
    }
  end

  it "populates game last move when created" do
    expect(game.moves.length).to be == 0
    expect(game.last_move).to be_nil

    move = GameMove.create!({ sequence: 1, game:, user:, data: "{}" })

    expect(game.reload.moves.length).to be == 1
    expect(game.last_move).to be == move
  end

  it "handles various json" do
    expect(game.moves.length).to be == 0
    expect(game.last_move).to be_nil

    move = GameMove.create!({ game:, sequence: 1, user:, data: { action: "action" } })

    expect(game.reload.moves.length).to be == 1
    expect(game.last_move).to be == move

    GameMove.create!({ game:, sequence: 2, user:, data: { action: "go", turn: [], player: 1 } })

    expect(game.reload.moves.length).to be == 2
    # Load directly to defeat AR cacheing
    expect(GameMove.find(game.last_move_id).data["action"]).to be == "go"
  end

  it "can undo action" do
    move = GameMove.create!({ game:, sequence: 1, user:, data: { action: "action" } })

    expect(move.undone).to be == false
    move.undo(user)
    expect(move.reload.undone).to be == true
  end

  it "can't undo certain actions" do
    move = GameMove.create!({ game:, sequence: 1, user:, data: { action: "initiative" } })

    expect(move.undone).to be == false
    move.undo(user)
    expect(move.reload.undone).to be == false
  end
end
