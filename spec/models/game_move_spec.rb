# frozen_string_literal: true

require "rails_helper"

RSpec.describe GameMove do
  let(:user) { create(:user) }
  let(:game) { create(:game, owner: user) }
  let(:game_move) { create(:game_move) }

  it "has correct attributes" do
    expect(game_move.game).not_to be nil?
    expect(game_move.user).not_to be nil?
    expect(game_move.body).to be == {
      user: game_move.user.username,
      player: 1,
      data: game_move.data,
      created_at: game_move.created_at.iso8601,
    }
  end

  it "populates game last move when created" do
    expect(game.moves.length).to be == 0
    expect(game.last_move).to be_nil

    move = GameMove.create!({ game:, user:, data: "{}" })

    expect(game.reload.moves.length).to be == 1
    expect(game.last_move).to be == move
  end
end
