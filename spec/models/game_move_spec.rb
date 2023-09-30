# frozen_string_literal: true

require "rails_helper"

RSpec.describe GameMove do
  let(:game_move) { create(:game_move) }

  # TODO: remove this later when we have something to actually test
  it "factory works" do
    expect(game_move.game).not_to be nil?
    expect(game_move.user).not_to be nil?
  end
end
