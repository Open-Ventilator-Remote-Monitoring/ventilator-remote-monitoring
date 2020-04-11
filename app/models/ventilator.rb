class Ventilator < ApplicationRecord
  belongs_to :cluster

  validates :name, length: { minimum: 5 }
  validates :hostname, uniqueness: true, if: -> {hostname.present?}
end
