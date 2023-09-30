# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  private

  def current_user
    return nil unless session[:current_user]

    user = User.find_by(id: session[:current_user])
    session[:current_user] = nil unless user
    user
  end

  def authenticate_user!
    render json: { message: "not authorized" }, status: :unauthorized unless current_user
  end
end
