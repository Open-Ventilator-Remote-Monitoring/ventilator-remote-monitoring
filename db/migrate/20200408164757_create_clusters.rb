class CreateClusters < ActiveRecord::Migration[6.0]
  def change
    create_table :clusters do |t|
      t.string :name
      t.text :description
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end
  end
end
