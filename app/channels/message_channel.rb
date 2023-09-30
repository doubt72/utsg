# frozen_string_literal: true

class MessageChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game-#{params[:game_id]}"
  end
end
