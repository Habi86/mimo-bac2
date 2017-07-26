//
//  friedensflotteUITests.swift
//  friedensflotteUITests
//
//  Created by Stefanie Habersatter on 11.07.17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import XCTest

class friedensflotteUITests: XCTestCase {
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        XCUIApplication().launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
      
      //Fastlane Snapshot
      let app = XCUIApplication()
      setupSnapshot(app)
      app.launch()
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
    
    func testExample() {
        // Use recording to get started writing UI tests.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
      
      let app = XCUIApplication()
      
      //If not logged in
      if (app.otherElements["Button-Anmelden"].exists) {
        XCUIApplication().tap()
        snapshot("01LoginView")
        
        app.textFields["E-Mail-Adresse"].tap()
        app.keys["t"].tap()
        app.keys["e"].tap()
        app.keys["s"].tap()
        app.keys["t"].tap()
        app.keys["e"].tap()
        app.keys["r"].tap()
        app.keys["@"].tap()
        app.keys["g"].tap()
        app.keys["m"].tap()
        app.keys["x"].tap()
        app.keys["."].tap()
        app.keys["a"].tap()
        app.keys["t"].tap()
        app.buttons["Return"].tap()
        app.otherElements["Passwort Passwort   "].tap()
        app.keys["p"].tap()
        app.keys["a"].tap()
        app.keys["s"].tap()
        app.keys["s"].tap()
        app.keys["w"].tap()
        app.keys["o"].tap()
        app.keys["r"].tap()
        app.keys["t"].tap()
        app.buttons["Return"].tap()
        
        app.otherElements["Button-Anmelden"].tap()
        sleep(10)
      }
      
      sleep(10)
      XCUIApplication().tap()
      snapshot("02MyTripsView")

      app.otherElements["ListOfTrips"].tap()
      sleep(10)
      snapshot("03TripDetailView")
      
      app.otherElements["NewBooking"].tap()
      sleep(10)
      snapshot("04NewBooking")
      
//      app.otherElements["MainNavi"].tap()
//      sleep(10)
//      snapshot("05NewSailingTrip")
      

    }
}





