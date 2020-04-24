class OrganizationSerializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :camel_lower

  set_id :id
  attributes :name, :cluster_term_singular, :cluster_term_plural, :ventilator_location_term_singular, :ventilator_location_term_plural
  has_many :clusters
end
