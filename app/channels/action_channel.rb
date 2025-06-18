# frozen_string_literal: true

class ActionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "actions-#{params[:game_id]}"
  end
end
