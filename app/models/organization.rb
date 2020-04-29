class Organization < ApplicationRecord
  after_initialize :set_defaults

  has_many :users
  has_many :clusters
  has_many :ventilators, through: :clusters

  validates :name, length: { minimum: 5 }
  validates :cluster_term_singular, length: { minimum: 3 }
  validates :cluster_term_plural, length: { minimum: 3 }
  validates :ventilator_location_term_singular, length: { minimum: 3 }
  validates :ventilator_location_term_plural, length: { minimum: 3 }

  def set_defaults
    self.cluster_term_singular ||= "Floor"
    self.cluster_term_plural ||= "Floors"
    self.ventilator_location_term_singular ||= "Room"
    self.ventilator_location_term_plural ||= "Rooms"
  end
end
