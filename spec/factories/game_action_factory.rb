# frozen_string_literal: true

FactoryBot.define do
  factory :game_action do
    game
    user
    undone { false }
    data { { action: "action" } }
  end
end
