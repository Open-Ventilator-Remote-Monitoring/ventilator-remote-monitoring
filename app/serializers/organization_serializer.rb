class OrganizationSerializer
  include FastJsonapi::ObjectSerializer

  set_id :id
  attributes :name
  has_many :clusters
end
