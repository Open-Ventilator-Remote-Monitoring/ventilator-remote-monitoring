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
