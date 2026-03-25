# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::ContactController do
  let(:user) { create(:user) }

  describe "create" do
    it "need to be logged in to access" do
      post :create, params: { email: { subject: "foo", body: "test body" } }

      expect(response.status).to be == 401
      expect(JSON.parse(response.body)).to be == { "message" => "not authorized" }
    end

    it "errors out in test" do
      login(user)

      post :create, params: { email: { subject: "foo", body: "test body" } }

      expect(response.status).to be == 500
      expect(JSON.parse(response.body)).to be == { "error" => "not production" }
    end
  end
end
