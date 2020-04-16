class VentilatorSerializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :camel_lower

  set_id :id
  attributes :id, :name, :hostname, :api_key
end
