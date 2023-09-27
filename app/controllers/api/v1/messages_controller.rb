class Api::V1::MessagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def index
    if params[:game_id] == "0"
      render json: recent_public_messages, status: :ok
    elsif game_id = params[:game_id]
      render json: game_messages(game_id), status: :ok
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  def create
    if message = Message.create(create_params)
      render json: message.body, status: :ok
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  private

  def messages_to_json(messages)
    messages.map { |m| m.body }
  end

  def recent_public_messages
    messages_to_json(
      Message.includes(:user).where(game_id: nil, created_at: (Time.zone.now - 1.day)..).
        order(:created_at)
    )
  end

  def game_messages(game_id)
    messages_to_json(
      Message.where(game_id: game_id).order(:created_at)
    )
  end

  def create_params
    user = User.find_by(id: current_user)
    params[:message] = params[:message].merge(user_id: user.id)
    if params[:message][:game_id] == 0
      params[:message].delete(:game_id)
    end
    params.require(:message).permit(:value, :game_id, :user_id)
  end
end
