# frozen_string_literal: true

require "rails_helper"

RSpec.describe Api::V1::SessionsController do
  describe "auth" do
    let(:verified) { true }
    let!(:user) { create(:user, verified:) }

    it "handles logged in user" do
      login(user)

      get :auth

      expect(response.status).to be == 200
    end

    it "handles logged in user" do
      get :auth

      expect(response.status).to be == 401
    end

    context "unverified user" do
      let(:verified) { false }

      it "handles logged in user" do
        login(user)

        get :auth

        expect(response.status).to be == 403
      end
    end
  end
end
