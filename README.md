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

### Architecture
- Cloud Server - Ruby on Rails
- Web Application (User Interface) - React / Javascript / Jquery
- Interface Between Ventilator & Web Application - Raspberry Pi / Flask / Python
- Ventilator control system - Assumed to be arduino but could also be Programmable Logic Controller (PLC). Capability to interface with other systems via USB Serial, SPI, I2C, UART

![](https://docs.google.com/drawings/d/e/2PACX-1vSXvw0ErpGFBsKOZSkZQ8YRrTOmLgkKpX_AU-EcN_fl161Hc9JzWbpKGDImnNINgBIpgF3xGhZXLFLT/pub?w=960&h=720)

### Pro's & Cons of this Project
#### Benefits
- Rapidly deployable & scalable to thousands of units in 1-2 weeks
- Lightweight - uses minimum compute resources (data is not sent to cloud)
- Minimum hardware requirements for desktop computer and cloud server
- Cloud based architecture means updates can continuously rolled out
- Required hardware (Raspberry Pi) is low cost ($5-60), locally sourceable, and available in high volumes

#### Drawbacks
- Does not use medical grade hardware / software
- Security - offers only consumer-grade security
- Reliability - offers only consumer-grade reliability
- Requires network connection - if hospital does not have wifi it may require running an ethernet cable

### To Do's
- Validation / Testing
- Improve API
- Document
- Integrate with myriad of ventialtors - try to establish standard protocol
- Improved reliability / Security
- Obtain/Build actual ventilator protoypes & test rigorously

### Needs
- Medical / Clinical feedback
- Software Development - Ruby on Rails, Javascript, Pyton, Raspbian OS, Arduino
- Introductions to ventilator makers for integration needs
- Assistance building ventilator prototypes for testing
- Assistance testing on different types of ventilators

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
