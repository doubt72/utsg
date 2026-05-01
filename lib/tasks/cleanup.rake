# frozen_string_literal: true

namespace :db do
  desc "clean up old game data"
  task cleanup: :environment do
    puts "removing tagged games"
    ids = [58, 59]
    Game.where(id: ids).delete_all

    puts "cleaning up old scenario version"
    ScenarioVersion.all.each do |sv|
      if Game.where(scenario: sv.scenario, scenario_version: sv.version).count < 1
        puts "removing version: #{sv.scenario} #{sv.version}"
        sv.delete
      end
    end
  end
end
