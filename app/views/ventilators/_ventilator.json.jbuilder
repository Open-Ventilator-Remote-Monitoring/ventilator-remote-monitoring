json.extract! ventilator, :id, :name, :serial_number, :hostname, :api_key, :notes, :ventilator_user, :ventilator_password, :cluster_id, :created_at, :updated_at
json.url ventilator_url(ventilator, format: :json)
