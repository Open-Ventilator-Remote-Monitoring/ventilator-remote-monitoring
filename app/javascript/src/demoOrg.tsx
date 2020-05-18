import { IOrganization } from "./types"

/** For demo purposes, an Organization with two clusters
 *  each with four ventilator monitors
 * */
export const DemoOrg: IOrganization = {
  id: 0x7FFFFFFF,
  name: 'DEMO Hospital',
  clusterTermSingular: 'Wing',
  clusterTermPlural: 'Wings',
  ventilatorLocationTermSingular: 'Room',
  ventilatorLocationTermPlural: 'Rooms',
  clusters: [
    {
      id: 1,
      name: 'DEMO East Wing',
      ventilators: [
      ]
    },
    {
      id: 2,
      name: 'DEMO West Wing',
      ventilators: [
      ]
    }
  ]
}

// fix-up backpointers from cluster to org
DemoOrg.clusters[0].organization = DemoOrg
DemoOrg.clusters[1].organization = DemoOrg

// Populate the clusters with ventilator monitors
for (let i = 1; i < 5; i ++) {
  DemoOrg.clusters[0].ventilators.push({id: i, name: `Room E-${i}`, hostname: 'n/a', apiKey: 'n/a'})
  DemoOrg.clusters[1].ventilators.push({id: i, name: `Room W-${i}`, hostname: 'n/a', apiKey: 'n/a'})
}