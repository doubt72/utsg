# frozen_string_literal: true

module Utility
  class NotificationEmails
    def self.email_template(user, content)
      <<~BODY
        <div>
          <p>#{user.username},</p>
          #{content}
          <p>Thank you!</p>
          <p>&mdash; the Management at AHTF</p>
        </div>
      BODY
    end

    def self.confirmation_content
      <<~CONFIRMATION
        <p>
          You can use this link to navigate to the confirmation page
          page: <a href="https://ahextoofar.games/verify">https://ahextoofar.games/verify</a>. If
          you&apos;ve been logged out or are using a different browser, you may need to log in
          again first and will be redirected to the login page at that link.
        </p>
      CONFIRMATION
    end

    def self.confirmation_code(user, code)
      ::Utility::ElasticEmail::Email.send(
        user, "Confirmation code for the A Hex Too Far server",
        email_template(
          user, <<~CONTENT
            <p>Welcome to the A Hex Too Far Community!</p>
            <p>Your confirmation code for the server is: <strong>#{code}</strong></p>
            #{confirmation_content}
          CONTENT
        )
      )
    end

    def self.confirmation_code_resend(user, code)
      ::Utility::ElasticEmail::Email.send(
        user, "Confirmation code for the A Hex Too Far server",
        email_template(
          user, <<~CONTENT
            <p>Your confirmation code for the server is: <strong>#{code}</strong></p>
            #{confirmation_content}
          CONTENT
        )
      )
    end

    def self.recovery_code(user, code)
      ::Utility::ElasticEmail::Email.send(
        user, "Password recovery code for the A Hex Too Far server",
        email_template(
          user, <<~CONTENT
            <p>Your password recovery code for the A Hex Too Far Server is: <strong>#{code}</strong></p>
            <p>
              You can use this link to navigate to the password reset
              page: <a href="https://ahextoofar.games/reset_password">https://ahextoofar.games/reset_password</a>
            </p>
          CONTENT
        )
      )
    end
  end
end
