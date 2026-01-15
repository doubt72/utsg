# frozen_string_literal: true

module Scenarios
  class Base
    ID = ""
    STATUS = ""
    VERSION = "0.1"

    class << self
      def index_record
        {
          id: self::ID,
          name: self::NAME,
          status: self::STATUS,
          version: self::VERSION,
          string: self::NAME.downcase,
          allies: self::ALLIES,
          axis: self::AXIS,
          date: self::DATE,
          layout: self::LAYOUT,
          allied_units: self::ALLIED_UNITS,
          axis_units: self::AXIS_UNITS,
        }
      rescue NameError
        { id: name, name: "", string: "", allies: [], axis: [] }
      end

      def full_record
        record = index_record
        record.delete(:string)
        record.delete(:date)
        record.delete(:layout)
        record.delete(:allied_units)
        record.delete(:axis_units)
        record.merge({ metadata: generate })
      end

      def date
        self::DATE
      end

      def layout
        self::LAYOUT
      end

      def allied_units
        units = {}
        self::ALLIED_UNITS.each_pair do |k, v|
          units[k] = { list: convert_units(v[:list]) }
        end
        units
      end

      def axis_units
        units = {}
        self::AXIS_UNITS.each_pair do |k, v|
          units[k] = { list: convert_units(v[:list]) }
        end
        units
      end

      def convert_units(units)
        f = Utility::Scenario::Units.method(:unit_definition)
        units.map { |u| f.call(u) }
      end
    end
  end
end
