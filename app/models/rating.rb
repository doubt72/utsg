# frozen_string_literal: true

class Rating < ApplicationRecord
  belongs_to :user

  validates :user, presence: true
  validates :scenario, presence: true
  validates :rating, numericality: { only_integer: true, in: 1..5 }
  validates_uniqueness_of :scenario, scope: :user_id

  class << self
    def average_rating(scenario)
      count = where(scenario:).count + 1
      average = (where(scenario:).average(:rating).to_f * (count - 1) / count) + (4 / count)
      { count:, average: }
    end

    def all_averages(data) # rubocop:disable Metrics/AbcSize
      ids = data[:data].map { |s| s[:id] }
      counts = where(scenario: ids).group(:scenario).count
      averages = where(scenario: ids).group(:scenario).average(:rating)
      {
        page: data[:page], more: data[:more], data: data[:data].map do |s|
          count = counts[s[:id]].to_i + 1
          s.merge(
            rating: { count:, average: (averages[s[:id]].to_f * (count - 1) / count) + (4 / count) }
          )
        end,
      }
    end

    def create_or_update(params)
      rec = find_by(user_id: params[:user_id], scenario: params[:scenario])
      if rec
        rec.rating = params[:rating]
        rec.save!
        rec
      else
        create(params)
      end
    end
  end

  def show_body
    { scenario:, rating: }
  end
end
