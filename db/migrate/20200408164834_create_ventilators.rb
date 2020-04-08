class CreateVentilators < ActiveRecord::Migration[6.0]
  def change
    create_table :ventilators do |t|
      t.string :name
      t.string :serial_number
      t.string :hostname
      t.string :api_key
      t.text :notes
      t.string :ventilator_user
      t.string :ventilator_password
      t.references :cluster, null: false, foreign_key: true

      t.timestamps
    end

  end
end
