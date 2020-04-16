class ClusterSerializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :camel_lower

  set_id :id
  attributes :name
  has_many :ventilators
end
