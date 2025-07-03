# frozen_string_literal: true

class Rating < ApplicationRecord
  belongs_to :user

  validates :user, presence: true
  validates :scenario, presence: true
  validates :rating, numericality: { only_integer: true, in: 1..5 }
  validates_uniqueness_of :scenario, scope: :user_id

  def self.average_rating(scenario)
    avg = where(scenario:).average(:rating).to_f
    num = where(scenario:).count
    { num:, avg: }
  end

  def self.create_or_update(params)
    rec = find_by(user_id: params[:user_id], scenario: params[:scenario])
    if rec
      rec.rating = params[:rating]
      rec.save!
      rec
    else
      create(params)
    end
  end

  def show_body
    { scenario:, rating: }
  end
end
