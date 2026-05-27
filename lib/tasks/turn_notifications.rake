# frozen_string_literal: true

namespace :turn do
  desc "check for turn notifications"
  task notifications: :environment do
    puts "check for turn notifications"
    Game.where(state: :in_progress, needs_turn_notification: true)
        .each(&:check_for_turn_notification)
  end
end
