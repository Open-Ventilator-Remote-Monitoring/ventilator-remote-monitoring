class Cluster < ApplicationRecord
  belongs_to :organization
  has_many :ventilators
end
