# frozen_string_literal: true

require "rails_helper"

RSpec.describe Rating do
  let(:user) { create(:user) }
  let(:user2) { create(:user) }
  let!(:rating) { create(:rating, user:, scenario: "001", rating: 4) }

  it "has body" do
    expect(rating.show_body).to be == {
      scenario: "001",
      rating: 4,
    }
  end

  it "can create new record" do
    expect do
      Rating.create_or_update({ user_id: user2.id, scenario: "001", rating: 3 })
    end.to change { Rating.count }.by(1)

    expect(rating.reload.rating).to be == 4
  end

  it "can update record" do
    expect do
      Rating.create_or_update({ user_id: user.id, scenario: "001", rating: 3 })
    end.not_to change { Rating.count }

    expect(rating.reload.rating).to be == 3
  end

  it "can get average" do
    expect(Rating.average_rating("001")).to be == { count: 2, average: 4.0 }
  end

  it "can update average" do
    expect do
      Rating.create_or_update({ user_id: user2.id, scenario: "001", rating: 3 })
    end.to change { Rating.count }.by(1)

    expect(Rating.average_rating("001")[:count]).to be == 3
    expect(Rating.average_rating("001")[:average]).to be_within(0.01).of(3.333)
  end

  it "handles average of no records" do
    expect(Rating.average_rating("002")).to be == { count: 1, average: 4.0 }
  end
end
