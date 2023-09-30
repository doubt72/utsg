# frozen_string_literal: true

FactoryBot.define do
  factory :message do
    user
    game
    value { Faker::Books::CultureSeries.culture_ship }
  end
end
