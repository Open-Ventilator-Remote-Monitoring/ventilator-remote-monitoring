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

org1 = Organization.create!( name: "Honnah Lee Medical Center",
                            description: "Honnah Lee Medical Center Description",
                          )

c1 = org1.clusters.create!( name: "1st Floor", description: "1st Floor Description")
org1.clusters.create!( name: "2nd Floor", description: "2nd Floor Description")
org1.clusters.create!( name: "3rd Floor", description: "3rd Floor Description")

6.times do |i|
  c1.ventilators.create!(
    {
      name: "Room #{i + 1}",
      serial_number: "J42#{i + 1}",
      hostname: "ventilator-#{i + 1}.local",
      api_key: "api_key",
      notes: "note",
    }
  )
end

