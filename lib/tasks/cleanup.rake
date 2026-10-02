# frozen_string_literal: true

namespace :db do
  desc "clean up old game data"
  task cleanup: :environment do
    puts "removing tagged games"
    ids = [166] # , 167, 168, 169, 170, 171, 172, 173, 174, 175
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
