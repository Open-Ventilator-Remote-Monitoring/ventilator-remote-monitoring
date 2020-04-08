class Organization < ApplicationRecord
  has_many :users
  has_many :clusters
  has_many :ventilators, through: :clusters
end
