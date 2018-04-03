//add a staff registration page, do DB username check
//load info into list view
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).on("ready", function(){
    //loads information for users to view data from database
    databaseHandler.createDatabase();
    propertyHandler.loadProperty(displayProperty);
    propertyHandler.loadDelProperty(displayProperty3);
});


function propLog() {
    //gets values entered by user
    var userN = $("#userName").val();
    var passW = $("#password").val();

    //validation checks
    if (userN.length < 4) {
        alert("Please Provide Username");
    } else if (passW < 4) {
        alert("Please Provide Password");
    } else {
        //execution to query in database
        propertyHandler.loginUser(userN, passW);
    }
}
/*
failed attempt at making cookies, server needed
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (value * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}
*/

function loginPageLoad() {
    //checks local storage value
    var res = localStorage.userID;
    if (!res) {
        //sends user back to home page if value is false or empty
        window.location.assign("#homePage");
    }
    console.log("Value is " + res + " for res");
}

function logOut() {
    //removes the userID from local storage
    localStorage.removeItem("userID");
    window.location.assign("#homePage");
}

function logOut2() {
    //used to logout user on any pages not related to admin status
    localStorage.removeItem("userID");
}

function logCheck(results) {
    //get length of results from query
    var length = results.rows.length;
    var LstProp3 = $("#lstProp3");
    LstProp3.empty();
    //if not equal to one will return user to home page
    if(length != 1) {
    window.location.assign("#homePage");
    } else {
        //loads values of user into fields for displaying
        for(var i = 0; i < length; i++){
            var item = results.rows.item(i);
            var p = $("<p />").text("Username: ");
            var spanU = $("<span />").text(item.username);
            spanU.attr("name", "uname");
            p.append(spanU);
            var li = $("<li/>");
            li.append(p);
            LstProp3.append(li);
        }
    }
}

//this is for login and above

function loginRes(results) {
    var length = results.rows.length;
    //if equal completely to one, will get userID and store it in the local storage
    if (length == 1) {  
        var item = results.rows.item(0);
        var userID = item.staffID;
        //sends user to another page
        window.location.assign("#optionsPage");
        var res = userID;
        localStorage.userID = userID;
        propertyHandler.loadUser(res);
        console.log(res + " is set for res");
        //setCookie("userIDLogged", userID);
        //console.log(getCookie("userIDLogged"));
    } else {
        alert("Your username or password is incorrect");
        //alert if login is wrong
    }
}
//above is for login

function addProp() {
    var date = $("#dateAdd").val();
    var time = $("#timeAdd").val();
    var rent = $("#monthRent").val();
    var name = $("#reporterName").val();
    var pType = $("#propSelect").val();
    var pBed = $("#bedSelect").val();
    var pFurn = $("#furSelect").val();
    var pNote = $("#noteArea").val();
    var pName = $("#propName").val();
    //above gets value for property

    //validation checks to make sure necessary fields are complete
    if (!pType) {
        alert("Please Select a Property Type");
    } else if (!pBed) {
        alert("Please Provide Bedroom Type");
    } else if (date.length < 9 && date.length > 11) {
        alert("Please Provide Entry Date");
    } else if (time.length < 4 && time.length > 6) {
        alert("Please Provide Entry Time");
    } else if (rent.length < 5) {
        alert("Please Provide Property Monthly Rent in £000.00 format");
    } else if (!pFurn) {
        alert("Please Provide Furniture Option");
    } else if (name.length < 3) {
        alert("Please Provide Reporter Name");
    } else if (pName.length < 5) {
        alert("Please Provide Reporter Name");
    }else {
        var res = localStorage.userID;
        //final check to see if user is logged in
        if (!res) {
            alert("You are not logged in");
            window.location.assign("#homePage");
        } else {
            //final confirmation from user for determining if to proceed
            var option = confirm("Are You Sure You Wish to Add this New Entry to Database");
            if (option == true) {
                //adds results to database and clears fields that need to be cleared
                var bool = propertyHandler.addProperty(pBed, date, time, rent, name, pNote, pType, pFurn, pName);
                if (bool = true) {
                    alert("Successfully added")
                    $("#timeAdd").val("");
                    $("#noteArea").val("");
                    $("#monthRent").val("£");
                    $("#propName").val("");
                    window.location.reload();
                } else {
                    alert("There was a problem, check that property name is unique");
                    //alert if addition to database is not unique
                }
            } else {

            }
        }
    }
}

function displayProperty(results){
    //checks record length and empty UL LstProp before insert new reords
    var length = results.rows.length;
    var LstProp = $("#lstProp");
    LstProp.empty();
    //loop for loading all found entries into listview
    for(var i = 0; i < length; i++){
        var item = results.rows.item(i);
        //creates HTML variables for loading information
        var a = $("<a />");
        var h3 = $("<h3 />").text("Property Name: ");
        var h4 = $("<h4 />").text("Property Rent: ");
        var p = $("<p />").text("Bedroom: ");
        var spanName = $("<span />").text(item.propName);
        spanName.attr("name", "pName");
        var spanRent = $("<span />").text(item.rent);
        spanRent.attr("name", "pRent");
        var spanBed = $("<span />").text(item.bed);
        spanBed.attr("name", "pBed");
        //appending variables in order to keep everything in HTML structure
        h3.append(spanName);
        h4.append(spanRent);
        p.append(spanBed);
        a.append(h3);
        a.append(h4);
        a.append(p);
        //gets the ID of selected property for when users select a property
        var pID = (item.pID);
        //link for opening property view page with necessary ID to return all related information
        var li = $("<li style='font-size: 23px;' data-id='" + pID + "'></li>");
        //sets filtertext to read from property name, allowing users to search for the right property
        li.attr("data-filtertext", item.propName);
        li.append(a);
        LstProp.append(li);
//above code for loading list view is adapted from: https://www.youtube.com/watch?v=vL2mFknpHnE and https://forum.jquery.com/topic/problem-in-fetching-data-from-sqlite-database-and-displaying-it-as-list
//search filter adapted from: https://www.youtube.com/watch?v=VOKS6GwEGPc
    }
    //$('#homePage').trigger('pagecreate');
    //location.reload();
    //LstProp.listview("refresh");
    //LstProp.refresh();
    //find solution for refresh later
    /*LstProp.on("tap", "li", function(){
        $("#popupPropView").popup("open");
    });*/
    LstProp.on("click", "li", function(){
        //sets ID to attribute for once property page is loaded
        var x = $(this).attr("data-id");
        propertyHandler.loadSelectProperty(x);
        window.location.assign("#propertyPage");
    });

}

//below code does same as above however, has additional lines to load all information related to the property selected
function displayProperty2(results){
    var length = results.rows.length;
    var LstProp2 = $("#lstProp2");
    LstProp2.empty();
    for(var i = 0; i < length; i++){
        var item = results.rows.item(i);
        var a = $("<p />");
        var h3 = $("<h3 />").text("Property Name: ");
        var h4 = $("<h4 />").text("Property Rent: ");
        var p = $("<p />").text("Bedrooms: ");
        var p2 = $("<p />").text("Date: ");
        var p3 = $("<p />").text("Time: ");
        var p4 = $("<p />").text("Name of Reporter: ");
        var p5 = $("<p />").text("Property Note: ");
        var p6 = $("<p />").text("Furniture: ");
        //propDate propTime reportName propNote furn
        var spanName = $("<span />").text(item.propName);
        spanName.attr("name", "pName");
        var spanRent = $("<span />").text(item.rent);
        spanRent.attr("name", "pRent");
        var spanBed = $("<span />").text(item.bed);
        spanBed.attr("name", "pBed");
        var spanDate = $("<span />").text(item.propDate);
        spanDate.attr("name", "pDate");
        var spanTime = $("<span />").text(item.propTime);
        spanTime.attr("name", "pTime");
        var spanRName = $("<span />").text(item.reportName);
        spanRName.attr("name", "rName");
        var spanNote = $("<span />").text(item.propNote);
        spanNote.attr("name", "pNote");
        var spanFurn = $("<span />").text(item.furn);
        spanFurn.attr("name", "furn");
        h3.append(spanName);
        h4.append(spanRent);
        p.append(spanBed);
        p2.append(spanDate);
        p3.append(spanTime);
        p4.append(spanRName);
        p5.append(spanNote);
        p6.append(spanFurn);
        a.append(h3);
        a.append(h4);
        a.append(p);
        a.append(p2);
        a.append(p3);
        a.append(p4);
        a.append(p5);
        a.append(p6);
        var pID = (item.pID);
        var li = $("<li style='font-size: 33px;' data-id='" + pID + "'></li>");
        li.append(a);
        LstProp2.append(li);
        
    }
    //$('#homePage').trigger('pagecreate');
    //location.reload();
    //LstProp2.listview("refresh");
    //LstProp2.refresh();
    //find solution for refresh later
    /*LstProp.on("tap", "li", function(){
        $("#popupPropView").popup("open");
    });*/

}
//lines 317 - 336 are supposed to load and refresh lists however, have not been engaging
$(document).on("pageinit", "#homePage", function(){
    propertyHandler.loadProperty(displayProperty);
    propertyHandler.loadDelProperty(displayProperty3);
});

$(document).on("pageinit", "#propDelPage", function(){
    propertyHandler.loadDelProperty(displayProperty3);
    //find solution for this later as well
});

$(document).on("pagebeforeshow", "#propDelPage", function(){
    //propertyHandler.loadDelProperty(displayProperty3);
    $("#lstProp").listview("refresh");
    //find solution for this later as well
});

$(document).on("pagebeforeshow", "#homePage", function(){
    //propertyHandler.loadProperty(displayProperty);
    $("#lstProp4").listview("refresh");
});

//loads list with all relevant DB information
function displayProperty3(results){
    var length = results.rows.length;
    var LstProp4 = $("#lstProp4");
    LstProp4.empty();
    for(var i = 0; i < length; i++){
        var item = results.rows.item(i);
        var a = $("<a />");
        var h3 = $("<h3 />").text("Property Name: ");
        var h4 = $("<h4 />").text("Property Rent: ");
        var p = $("<p />").text("Bedroom: ");
        var spanName = $("<span />").text(item.propName);
        spanName.attr("name", "pName");
        var spanRent = $("<span />").text(item.rent);
        spanRent.attr("name", "pRent");
        var spanBed = $("<span />").text(item.bed);
        spanBed.attr("name", "pBed");
        h3.append(spanName);
        h4.append(spanRent);
        p.append(spanBed);
        a.append(h3);
        a.append(h4);
        a.append(p);
        var pID = (item.pID);
        var li = $("<li data-id='" + pID + "'></li>");
        li.attr("data-filtertext", item.propName);
        li.append(a);
        LstProp4.append(li);
        
    }
    //$('#homePage').trigger('pagecreate');
    //location.reload();
    //LstProp4.listview("refresh");
    //LstProp4.refresh();
    //find solution for refresh later
    /*LstProp.on("tap", "li", function(){
        $("#popupPropView").popup("open");
    });*/

    //loads ID for the purpose of deleting from DB
    LstProp4.on("click", "li", function(){
        var x = $(this).attr("data-id");
        propertyHandler.deleteSelectProperty(x);
        window.location.reload();
    });

}
