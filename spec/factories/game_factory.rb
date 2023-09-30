# frozen_string_literal: true

FactoryBot.define do
  factory :game do
    association :owner, factory: :user
    name { Faker::Books::CultureSeries.culture_ship }
  end
end
