# frozen_string_literal: true

FactoryBot.define do
  factory :game do
    association :owner, factory: :user
    name { Faker::String.random(length: 2..10) }
  end
end
