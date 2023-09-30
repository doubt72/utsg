# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :game_id

    def connect
      self.game_id = @request.params[:game_id]
    end
  end
end
