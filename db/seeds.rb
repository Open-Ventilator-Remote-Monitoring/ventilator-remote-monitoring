# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Ventilator.delete_all
Cluster.delete_all
User.delete_all
Organization.delete_all

org1 = Organization.create( name: "Org #1", description: "Org #1 Description" )

c1 = org1.clusters.create( name: "Org #1 Cluster #1", description: "Org #1 Cluster #1 Description")
org1.clusters.create( name: "Org #1 Cluster #2", description: "Org #1 Cluster #2 Description")
org1.clusters.create( name: "Org #1 Cluster #3", description: "Org #1 Cluster #2 Description")

6.times do |i|
  c1.ventilators.create(
    {
      name: "Ventilator ##{i + 1}",
      serial_number: "J42#{i + 1}",
      hostname: "ventilator-#{i + 1}.local",
      api_key: "api_key",
      notes: "note",
    }
  )
end

org1.users.create({
  email: "user1@gmail.com",
  name: "User 1",
  encrypted_password: "thisisnotanencryptedpassword",
  role: 1
})
