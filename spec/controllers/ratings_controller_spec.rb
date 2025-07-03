# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::RatingsController do
  let(:user) { create(:user) }
  let(:user2) { create(:user) }
  let(:rating) { create(:rating, user:, scenario: "001", rating: 4) }

  before do
    expect(rating.user_id).to be == user.id
  end

  describe "average" do
    it "can get average for scenario" do
      get :average, params: { scenario: "001" }

      expect(response.status).to be == 200
      json = JSON.parse(response.body)
      expect(json["num"]).to be == 1
      expect(json["avg"]).to be == 4
    end

    it "can get average with more records" do
      Rating.create_or_update({ user_id: user2.id, scenario: "001", rating: 3 })

      get :average, params: { scenario: "001" }

      expect(response.status).to be == 200
      json = JSON.parse(response.body)
      expect(json["num"]).to be == 2
      expect(json["avg"]).to be_within(0.01).of(3.5)
    end

    it "can get average of nothing" do
      get :average, params: { scenario: "002" }

      expect(response.status).to be == 200
      json = JSON.parse(response.body)
      expect(json["num"]).to be == 0
      expect(json["avg"]).to be == 0
    end
  end

  describe "single" do
    it "can get rating" do
      login(user)

      get :single, params: { scenario: "001" }

      expect(response.status).to be == 200
      json = JSON.parse(response.body)
      expect(json["scenario"]).to be == "001"
      expect(json["rating"]).to be == 4
    end

    it "can not get non-existent rating" do
      login(user)

      get :single, params: { scenario: "002" }

      expect(response.status).to be == 404
    end
  end

  describe "create" do
    it "can create rating" do
      login(user)

      expect do
        post :create, params: { scenario: "002", rating: 3 }
      end.to change { Rating.count }.by(1)

      expect(response.status).to be == 201
      json = JSON.parse(response.body)
      expect(json["scenario"]).to be == "002"
      expect(json["rating"]).to be == 3

      expect(Rating.average_rating("002")).to be == { num: 1, avg: 3 }
    end

    it "can create additional rating" do
      login(user2)

      expect do
        post :create, params: { scenario: "001", rating: 3 }
      end.to change { Rating.count }.by(1)

      expect(response.status).to be == 201
      json = JSON.parse(response.body)
      expect(json["scenario"]).to be == "001"
      expect(json["rating"]).to be == 3

      expect(Rating.average_rating("001")).to be == { num: 2, avg: 3.5 }
    end

    it "can update rating" do
      login(user)

      expect do
        post :create, params: { scenario: "001", rating: 3 }
      end.not_to change { Rating.count }

      expect(response.status).to be == 201
      json = JSON.parse(response.body)
      expect(json["scenario"]).to be == "001"
      expect(json["rating"]).to be == 3

      expect(Rating.average_rating("001")).to be == { num: 1, avg: 3 }
    end
  end
end
