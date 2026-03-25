# frozen_string_literal: true

module Api
  module V1
    class ContactController < ApplicationController
      def create
        contact = Utility::ElasticEmail::Contact.new
        response = JSON.parse(contact.contact_us(create_params, current_user))
        if response["success"]
          render json: {}, status: :ok
        else
          render json: { error: response["error"] }, status: :internal_server_error
        end
      end

      private

      def create_params
        params.require(:email).permit(:subject, :body)
      end
    end
  end
end
