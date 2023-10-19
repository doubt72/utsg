# frozen_string_literal: true

FactoryBot.define do
  factory :game do
    association :owner, factory: :user
    player_one { owner }
    name { Faker::Books::CultureSeries.culture_ship }
    scenario { "E01" }
    metadata { '{ "turn": 1 }' }
  end
end
