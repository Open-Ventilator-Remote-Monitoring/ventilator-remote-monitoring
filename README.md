# Open Source Ventilator Remote Monitor Project

Our goal is to quickly develop a remote monitoring interface for low-cost rapidly-manufactured ventilators currently being developed to provide emergency relief in the Covid-19 Pandemic.  We strive for a lightweight, interoperable, and reliable interface.

This software is currently only a concept - it is neither approved nor intended to be used in any medical setting.

## Live Demo
Check out the [live demo/concept](http://www.ventilatormonitor.com).

## Architecture
- Cloud Server - Ruby on Rails
- Web Application - React / Javascript / Jquery
- Interface Btwn Ventilator & Web Application - Raspberry Pi / Flask / Python
- Ventilator control system - Assumed to be arduino (can interface with others' via USB Serial, SPI, I2C, UART)

## Pro's & Cons of this Project
#### Benefits
- Rapidly deployable & scalable to hundreds of thousands of units in 1-2 weeks
- Lightweight - uses minimum compute resources (data is not sent to cloud)
- Cloud 
- Minimum hardware requirements for desktop computer and cloud server
- Hardware (Raspberry Pi) is low cost ($5-60), locally sourceable, and available in high volumes

#### Drawbacks
- Does not use medical grade hardware / software
- Security - only offers consumer-grade security
- Reliability - only offers consumer-grade reliability
- Requires network connection - if hospital does not have wifi it may require running an ethernet cable

## To Do's
- Improve API
- Document
- Integrate with myriad of ventialtors - try to establish standard protocol
- Improved reliability / Security
- Obtain/Build actual ventilator protoypes & test rigorously

## Needs
- Software Development - Ruby on Rails, Javascript, Pyton, Raspbian OS, Arduino
- Introductions to ventilator makers for integration needs
- Assistance building ventilator prototypes for testing
- Assistance testing on different types of ventilators



