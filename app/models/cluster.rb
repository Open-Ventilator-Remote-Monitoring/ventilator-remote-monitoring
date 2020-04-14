class Cluster < ApplicationRecord
  belongs_to :organization
  has_many :ventilators

  validates :name, length: { minimum: 5 }
end
