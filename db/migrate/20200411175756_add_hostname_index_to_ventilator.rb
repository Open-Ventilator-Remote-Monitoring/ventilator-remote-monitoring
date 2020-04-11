class AddHostnameIndexToVentilator < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:ventilators, :hostname, nil)
    execute "UPDATE ventilators set hostname = null WHERE hostname = ''"
    add_index(:ventilators, [:cluster_id, :hostname], unique: true, name: 'by_cluster_hostname')
  end
end
