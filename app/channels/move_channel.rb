# frozen_string_literal: true

class MoveChannel < ApplicationCable::Channel
  def subscribed
    stream_from "moves-#{params[:game_id]}"
  end
end
