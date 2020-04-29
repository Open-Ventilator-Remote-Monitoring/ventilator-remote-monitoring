class AddVentilatorLocationTermsToOrganization < ActiveRecord::Migration[6.0]
  def change
    add_column :organizations, :ventilator_location_term_singular, :string
    add_column :organizations, :ventilator_location_term_plural, :string
  end
end
