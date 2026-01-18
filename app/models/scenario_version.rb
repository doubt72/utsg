# frozen_string_literal: true

class ScenarioVersion < ApplicationRecord
  validates :scenario, presence: true
  validates :version, presence: true
  validates :data, presence: true
end
