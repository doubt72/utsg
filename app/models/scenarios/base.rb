# frozen_string_literal: true

module Scenarios
  class Base
    ID = ""

    class << self
      def index_record
        {
          id: self::ID,
          name: self::NAME,
          string: self::NAME.downcase,
          allies: self::ALLIES,
          axis: self::AXIS,
        }
      rescue NameError
        { id: name, name: "", string: "", allies: [], axis: [] }
      end

      def full_record
        record = index_record
        record.delete(:string)
        record.merge({ metadata: generate })
      end
    end
  end
end
