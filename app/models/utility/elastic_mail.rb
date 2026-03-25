# frozen_string_literal: true

require "json"
require "net/http"
require "uri"

module Utility
  module ElasticMail
    class Contact
      include ActionView::Helpers::SanitizeHelper

      def contact_us(params, from)
        user = ContactUser.new

        from_p = "<p><strong>From:</strong> #{from.username} [#{from.email}]</p>"
        subject_p = "<p><strong>Subject:</strong> #{sanitize(params[:subject], tags: [])}</p>"
        body_p = "<p><strong>Message:</strong> #{sanitize(params[:body], tags: [])}</p>"
        body = "<div style=\"margin: 1em;\">#{from_p}#{subject_p}#{body_p}</div>"

        Mail.send(user, "AHTF Server Feedback [#{from.email}]", body)
      end
    end

    class ContactUser
      def email
        ENV.fetch("FEEDBACK_EMAIL")
      end
    end

    class Mail
      API_PATH = "https://api.elasticemail.com/v2/email/send"

      def self.send(user, subject, body) # rubocop:disable Metrics/MethodLength
        return '{ "success":false, "error":"not production" }' unless Rails.env.production?

        uri = URI.parse(API_PATH)
        req = Net::HTTP::Post.new(uri)
        req.body = URI.encode_www_form(
          "apikey" => ENV.fetch("ELASTIC_KEY"),
          "to" => user.email,
          "from" => "donotreply@ahextoofar.games",
          "subject" => subject,
          "bodyHtml" => body,
          "isTransactional" => true
        )

        Net::HTTP.start(uri.hostname, uri.port, open_timeout: 5, use_ssl: true) do |http|
          http.request(req).body
        end
      end
    end
  end
end
