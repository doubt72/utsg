# frozen_string_literal: true

require "rails_helper"

RSpec.describe Message do
  let(:message) { create(:message) }

  it "has correct attributes" do
    expect(message.game).not_to be nil?
    expect(message.user).not_to be nil?
    expect(message.body).to be == {
      created_at: message.created_at.iso8601,
      username: message.user.username,
      value: message.value,
    }
  end
end
