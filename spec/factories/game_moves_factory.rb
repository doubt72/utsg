# frozen_string_literal: true

FactoryBot.define do
  factory :game_move do
    game
    user
    undone { false }
    data { { action: "action" } }
  end
end
