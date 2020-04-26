# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

#Ventilator.delete_all
#Cluster.delete_all
#User.delete_all
#Organization.delete_all

#org1 = Organization.create!( name: "Honnah Lee Medical Center",
#                            description: "Honnah Lee Medical Center Description",
#                           )

#c1 = org1.clusters.create!( name: "1st Floor", description: "1st Floor Description")
#org1.clusters.create!( name: "2nd Floor", description: "2nd Floor Description")
#org1.clusters.create!( name: "3rd Floor", description: "3rd Floor Description")

Ventilator.delete_all

c1 = Cluster.find(4)

i = 1
24.times do |r|
  2.times do |b|
    c1.ventilators.create!(
      {
        name: "Room #{r + 1} / Bed #{b + 1}",
        serial_number: "J42#{i + 1}",
        hostname: "localhost:#{4000 + i}",
        api_key: "api_key",
        notes: "note",
      }
    )
    i += 1
  end
end


