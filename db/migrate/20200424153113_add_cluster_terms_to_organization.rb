class AddClusterTermsToOrganization < ActiveRecord::Migration[6.0]
  def change
    add_column :organizations, :cluster_term_singular, :string
    add_column :organizations, :cluster_term_plural, :string
  end
end
