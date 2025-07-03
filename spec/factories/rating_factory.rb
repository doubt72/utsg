# frozen_string_literal: true

FactoryBot.define do
  factory :rating do
    user
    scenario { "001" }
    rating { 4 }
  end
end
