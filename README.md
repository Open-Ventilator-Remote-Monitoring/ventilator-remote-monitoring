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
7. Run bundler: `bundle install`
8. Run yarn: `yarn`
9. Create the rails database: `rails db:create`
10. Migrate the database: `rails db:migrate`
11. If the database has no data, then seed the database: `rails db:seed`
13. Start a rails development server: `rails s`
14. If you will be changing any javascript, open a second tab/window, go to the same
directory and run the webpack development server. This will automatically re-pack the changes:
`./bin/webpack-dev-server`
14. You should now be able to navigate to `http://localhost:3000` and view the live rails site

Note: the javascript app that runs in the web browser is currently located in `app/javascript/custom/demo.js`

**Having problems?** Post on the Slack Channel and we'll help you out
