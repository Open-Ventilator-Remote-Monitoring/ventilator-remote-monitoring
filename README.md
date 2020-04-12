## Open Source Ventilator Remote Monitor Project - Rails App

This git repo is for the code on the **Heroku Cloud Server & Web Browser**

### Architecture Overview
| Heroku Cloud Server & Web Browser Repo | [Raspberry Pi (Network Adapter) Repo](https://github.com/Open-Ventilator-Remote-Monitoring/remote-ventilator-monitor-pi) | [Ventilator (Arduino) Repo](https://github.com/Open-Ventilator-Remote-Monitoring/ventilator-monitor-arduino) |
| ----------- | ----------- | ----------- |
| Ruby on Rails | Flask | Arduino Board |
| Javascript | Python | C++ |

### Goal
Our goal is to quickly develop a remote monitoring interface for low-cost rapidly-manufactured ventilators currently being developed to provide emergency relief in the Covid-19 Pandemic.  We strive for a lightweight, interoperable, and reliable interface. Currently the interface provides ventilator remote monitoring only (no control).

This software is currently only a concept - it is neither approved nor intended to be used in any medical setting.

### Live Demo
Check out the [live demo/concept](http://www.ventilatormonitor.com).

## How do I set up my computer for development?
1. Set up your computer to run a Ruby on Rails develpment environment. This is quite an involved process - thankfully you only need to do it once in a while. My preferred method is to use the [thoughtbot laptop script](https://github.com/thoughtbot/laptop) for mac. Gorails also has a nice [setup guide for multiple operating systems](https://gorails.com/setup). Be sure to install Rails 6.0.2.1.
2. Install yarn: `brew install yarn`
3. Install webpacker: `rails webpacker:install`
4. Install postgres: `brew install postgres`
5. Clone this repo: `git clone https://github.com/Open-Ventilator-Remote-Monitoring/ventilator-remote-monitoring.git`
6. `cd ventilator-remote-monitoring`
7. Create the rails database: `rails db:create`
8. Run bundler: `bundle install`
9. Migrate the database: `rails db:migrate`
10. Start a rails development server: `rails s`
11. You should now be able to navigate to `http://localhost:3000` and view the live rails site

Note: the javascript app that runs in the web browser is currently located in `app/javascript/custom/demo.js`

**Having problems?** Post on the Slack Channel and we'll help you out

## API

A call to `/api/v1/ventalators` returns a single organization, all of the clusters in that organization and all of the ventilators in those clusters.
The organization used is the organization assigned to the person who is logged in.
If the call is made from a browser which is not logged in, or there is no organization associated with the current user, then the following is returned:

```json
{
  "error": "User is not logged in or is not associated with an Organization."
}
```

Note: This could change to a default 'demo' data to be used by a demo web page. But it may be better for the demo page just to provide some demo data locally.

The serialization library used serializes the data as a graph using the [json:qpi spec](https://jsonapi.org/).

> Note: Beware when matching nodes, in that it is not enough to match on id, as the same id numbers are used in organization, clusters and ventilators. Match on both `type` and `id`.

Here is an example of the JSON returned:

```json
{
  "data": {
    "id": "3",
    "type": "organization",
    "attributes": {
      "name": "Honnah Lee Medical Center"
    },
    "relationships": {
      "clusters": {
        "data": [
          {
            "id": "6",
            "type": "cluster"
          },
          {
            "id": "7",
            "type": "cluster"
          }
        ]
      }
    }
  },
  "included": [
    {
      "id": "6",
      "type": "cluster",
      "attributes": {
        "name": "East Wing"
      },
      "relationships": {
        "ventilators": {
          "data": [
            {
              "id": "15",
              "type": "ventilator"
            },
            {
              "id": "16",
              "type": "ventilator"
            },
            {
              "id": "17",
              "type": "ventilator"
            }
          ]
        }
      }
    },
    {
      "id": "7",
      "type": "cluster",
      "attributes": {
        "name": "West Wing"
      },
      "relationships": {
        "ventilators": {
          "data": [
            {
              "id": "18",
              "type": "ventilator"
            },
            {
              "id": "19",
              "type": "ventilator"
            }
          ]
        }
      }
    },
    {
      "id": "15",
      "type": "ventilator",
      "attributes": {
        "id": 15,
        "name": "Room E-1 Bed 1",
        "hostname": null
      }
    },
    {
      "id": "16",
      "type": "ventilator",
      "attributes": {
        "id": 16,
        "name": "Room E-2 Bed 1",
        "hostname": null
      }
    },
    {
      "id": "17",
      "type": "ventilator",
      "attributes": {
        "id": 17,
        "name": "Room E-3 Bed 1",
        "hostname": null
      }
    },
    {
      "id": "18",
      "type": "ventilator",
      "attributes": {
        "id": 18,
        "name": "Room W-1 Bed 1",
        "hostname": null
      }
    },
    {
      "id": "19",
      "type": "ventilator",
      "attributes": {
        "id": 19,
        "name": "Room W-1 Bed 1",
        "hostname": null
      }
    }
  ]
}
```

## fast_jsonapi

This project uses fast_jsonapi from Netflix for JSON serialization in Ruby. Netflix is no longer
maintaining the libray and the commuinity has taken over. That project is
(here)[https://github.com/fast-jsonapi/fast_jsonapi]. If you encounter any issue,
it may be best to move to that project.

## Deserialization

On the clint, these few lines of code will deserialize the data above:

```javascript
  import Jsona from 'jsona'

  const dataFormatter = new Jsona()
  const organization = dataFormatter.deserialize(response.parsedBody)
```

This results in something we can more easily work with (`relationshipNames` keys have been removed):

```json
{
  "type": "organization",
  "id": "3",
  "name": "Honnah Lee Medical Center",
  "clusters": [
    {
      "type": "cluster",
      "id": "6",
      "name": "East Wing",
      "ventilators": [
        {
          "type": "ventilator",
          "id": 15,
          "name": "Room E-1 Bed 1",
          "hostname": null
        },
        {
          "type": "ventilator",
          "id": 16,
          "name": "Room E-2 Bed 1",
          "hostname": null
        },
        {
          "type": "ventilator",
          "id": 17,
          "name": "Room E-3 Bed 1",
          "hostname": null
        }
      ]
    },
    {
      "type": "cluster",
      "id": "7",
      "name": "West Wing",
      "ventilators": [
        {
          "type": "ventilator",
          "id": 18,
          "name": "Room W-1 Bed 1",
          "hostname": null
        },
        {
          "type": "ventilator",
          "id": 19,
          "name": "Room W-1 Bed 2",
          "hostname": null
        }
      ]
    }
  ]
}
```

