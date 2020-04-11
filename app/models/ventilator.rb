class Ventilator < ApplicationRecord
  belongs_to :cluster

  # there is a unique index on [cluster_id, hostname], so if the hostname is blank, convert it to null
  nilify_blanks :only => [:hostname]

  validates :name, length: { minimum: 5 }
  validates_uniqueness_of :hostname, allow_nil: true, scope: [:cluster_id], message: 'has already been taken within this cluster'
end
