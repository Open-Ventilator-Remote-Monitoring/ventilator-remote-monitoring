class VentilatorSerializer
  include FastJsonapi::ObjectSerializer

  set_id :id
  attributes :id, :name, :hostname
end
