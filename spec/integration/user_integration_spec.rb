# frozen_string_literal: true

require "rails_helper"

class UserIntegrationSpec < ActionDispatch::IntegrationTest
  describe "happy paths" do
    let(:password) { "password" }
    let(:new_password) { "new_password" }

    def expect_authorized
      get "/api/v1/session/auth"
      expect(response.status).to be == 200
    end

    def expect_unauthorized
      get "/api/v1/session/auth"
      expect(response.status).to be == 401
    end

    def expect_forbidden
      get "/api/v1/session/auth"
      expect(response.status).to be == 403
    end

    context "new user" do
      it "handles signup" do
        expect do
          post "/api/v1/user", params: { user: {
            name: "user", email: "user@example.com", password:,
          } }
        end.not_to change { User.count }

        expect(response.body).to be == { username: ["can't be blank"] }.to_json

        expect do
          post "/api/v1/user", params: { user: {
            username: "user", email: "user@example.com", password:,
          } }
        end.to change { User.count }.by(1)

        user = User.last
        expect(user.verified).to be == false
        expect_forbidden

        expect { post "/api/v1/user/new_code" }
          .to change { user.reload.confirmation_code }

        expect { post "/api/v1/user/validate_code", params: { code: "" } }
          .not_to change { user.reload.verified }

        expect { post "/api/v1/user/validate_code", params: { code: user.confirmation_code } }
          .to change { user.reload.verified }

        expect_authorized
      end

      it "handles signup abort" do
        expect do
          post "/api/v1/user", params: { user: {
            username: "user", email: "user@example.com", password:,
          } }
        end.to change { User.count }.by(1)

        expect { delete "/api/v1/user" }.to change { User.count }.by(-1)
        expect_unauthorized
      end
    end

    context "existing user" do
      let!(:user) { create(:user, password:) }

      it "handles login for username" do
        post "/api/v1/session", params: { user: { username: "" } }
        expect(response.status).to be == 401

        expect_unauthorized

        post "/api/v1/session", params: { user: { username: user.username, password: } }
        expect_authorized

        delete "/api/v1/session"
        expect_unauthorized
      end

      it "handles login for email" do
        post "/api/v1/session", params: { user: { username: user.email, password: } }

        expect_authorized
      end

      it "handles updating profile" do
        post "/api/v1/session", params: { user: { username: user.username, password: } }

        expect { put "/api/v1/user", params: { user: { username: "user", email: user.email } } }
          .to change { user.reload.username }
        expect { put "/api/v1/user", params: { user: { username: "user", email: "user@example.com" } } }
          .to change { user.reload.email }

        expect(user.username).to be == "user"
        expect(user.email).to be == "user@example.com"
      end

      it "handles updating password" do
        post "/api/v1/session", params: { user: { username: user.username, password: } }

        expect do
          put "/api/v1/user", params: { user: {
            old_password: "wrong", password: new_password, confirm_password: new_password,
          } }
        end.not_to change { user.reload.password_digest }

        expect(response.status).to be == 401

        expect do
          put "/api/v1/user", params: { user: {
            old_password: password, password: new_password, confirm_password: new_password,
          } }
        end.to change { user.reload.password_digest }

        delete "/api/v1/session"
        expect_unauthorized

        post "/api/v1/session", params: { user: { username: user.username, password: new_password } }
        expect_authorized
      end

      it "handles account deletion" do
        expect { delete "/api/v1/user" }.not_to change { User.count }

        post "/api/v1/session", params: { user: { username: user.username, password: } }

        expect { delete "/api/v1/user" }.to change { User.count }.by(-1)
        expect_unauthorized
      end

      it "handles recovering user" do
        expect { post "/api/v1/user/set_recovery", params: { check: "" } }
          .not_to change { user.reload.recovery_code }

        expect { post "/api/v1/user/set_recovery", params: { check: user.email } }
          .to change { user.reload.recovery_code }

        expect do
          post "/api/v1/user/password_reset", params: {
            check: user.email, code: "", password: new_password,
          }
        end.not_to change { user.reload.password_digest }

        user.update!(recovery_code_expires: 2.days.ago)

        expect do
          post "/api/v1/user/password_reset", params: {
            check: user.email, code: user.recovery_code, password: new_password,
          }
        end.not_to change { user.reload.password_digest }

        expect { post "/api/v1/user/set_recovery", params: { check: user.email } }
          .to change { user.reload.recovery_code }

        expect do
          post "/api/v1/user/password_reset", params: {
            check: user.email, code: user.recovery_code, password: new_password,
          }
        end.to change { user.reload.password_digest }

        post "/api/v1/session", params: { user: { username: user.username, password: new_password } }
        expect_authorized
      end
    end
  end
end
