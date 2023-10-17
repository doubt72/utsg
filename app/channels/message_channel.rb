# frozen_string_literal: true

class MessageChannel < ApplicationCable::Channel
  def subscribed
    stream_from "messages-#{params[:game_id]}"
  end
end
