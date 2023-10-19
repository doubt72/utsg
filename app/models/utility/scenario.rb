# frozen_string_literal: true

module Utility
  class Scenario
    include Utility::Scenarios::Definitions

    class << self
      def all_scenarios(options = {})
        scenarios = ::Scenarios.constants.reject { |k| k == :Base }
                               .map { |k| ::Scenarios.const_get(k).index_record }
        filter(scenarios, :string, options)
        filter(scenarios, :allies, options)
        filter(scenarios, :axis, options)
        scenarios.each { |s| s.delete(:string) }
      end

      def filter(scenarios, key, options)
        scenarios.filter! { |s| s[key].include?(options[key].downcase) } if options[key]
      end

      def scenario_by_id(id)
        return if id&.empty?

        ::Scenarios.constants.map { |k| ::Scenarios.const_get(k) }
                   .select { |k| id == k::ID }.last&.full_record
      end
    end
  end
end
