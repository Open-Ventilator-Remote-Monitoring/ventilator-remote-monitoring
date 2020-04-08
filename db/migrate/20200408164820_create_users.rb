class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :email
      t.string :encrypted_password
      t.string :reset_password_token
      t.string :name
      t.text :bio
      t.integer :sign_in_count
      t.string :current_sign_in_ip
      t.string :last_sign_in_ip
      t.integer :role
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.references :organization, null: false, foreign_key: true

      t.timestamps
    end
  end
end
