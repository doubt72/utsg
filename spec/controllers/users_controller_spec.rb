# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::UsersController do
  let!(:user) { create(:user) }

  it "returns conflict for existing username" do
    get :check_conflict, params: { check: user.username }

    expect(response.body).to be == { conflict: true }.to_json
  end

  it "returns conflict for existing email" do
    get :check_conflict, params: { check: user.email }

    expect(response.body).to be == { conflict: true }.to_json
  end

  it "returns conflict for unknown user" do
    get :check_conflict, params: { check: User::UNKNOWN_USERNAME }

    expect(response.body).to be == { conflict: true }.to_json
  end

  it "doesn't return conflict for other string" do
    get :check_conflict, params: { check: "" }

    expect(response.body).to be == { conflict: false }.to_json
  end
end
