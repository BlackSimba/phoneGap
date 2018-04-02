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
    databaseHandler.createDatabase();
    propertyHandler.loadProperty(displayProperty);
    propertyHandler.loadDelProperty(displayProperty3);
});


function propLog() {
    var userN = $("#userName").val();
    var passW = $("#password").val();

    if (!userN) {
        alert("Please Provide Username");
    } else if (!passW) {
        alert("Please Provide Password");
    } else {
        //some other action
        propertyHandler.loginUser(userN, passW);
    }
}

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (value * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function loginPageLoad() {
    var res = localStorage.userID;
    if (!res) {
        window.location.assign("#homePage");
    }
    console.log("Value is " + res + " for res");
}

function logOut() {
    localStorage.removeItem("userID");
    window.location.assign("#homePage");
}

function logOut2() {
    localStorage.removeItem("userID");
}

function logCheck(results) {
    var length = results.rows.length;
    var LstProp3 = $("#lstProp3");
    LstProp3.empty();
    if(length != 1) {
    window.location.assign("#homePage");
    } else {
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
    if (length == 1) {  
        var item = results.rows.item(0);
        var userID = item.staffID;
        window.location.assign("#optionsPage");
        var res = userID;
        localStorage.userID = userID;
        propertyHandler.loadUser(res);
        console.log(res + " is set for res");
        //setCookie("userIDLogged", userID);
        //console.log(getCookie("userIDLogged"));
    } else {
        alert("Your username or password is incorrect");
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

    if (!pType) {
        alert("Please Select a Property Type");
    } else if (!pBed) {
        alert("Please Provide Bedroom Type");
    } else if (!date) {
        alert("Please Provide Entry Date");
    } else if (!time) {
        alert("Please Provide Entry Time");
    } else if (!rent) {
        alert("Please Provide Property Monthly Rent");
    } else if (!pFurn) {
        alert("Please Provide Furniture Option");
    } else if (!name) {
        alert("Please Provide Reporter Name");
    } else if (!pName) {
        alert("Please Provide Reporter Name");
    }else {
        var res = localStorage.userID;
        if (!res) {
            alert("You are not logged in");
            window.location.assign("#homePage");
        } else {
            var option = confirm("Are You Sure You Wish to Add this New Entry to Database");
            if (option == true) {
                var bool = propertyHandler.addProperty(pBed, date, time, rent, name, pNote, pType, pFurn, pName);
                if (bool = true) {
                    alert("Successfully added")
                    $("#timeAdd").val("");
                    $("#noteArea").val("");
                    $("#monthRent").val("£");
                    $("#propName").val("");
                } else {
                    alert("There was a problem, check that property name is unique");
                }
            } else {

            }
        }
    }
}

function displayProperty(results){
    var length = results.rows.length;
    var LstProp = $("#lstProp");
    LstProp.empty();
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
        var li = $("<li style='font-size: 23px;' data-id='" + pID + "'></li>");
        li.attr("data-filtertext", item.propName);
        li.append(a);
        LstProp.append(li);
        
    }
    //$('#homePage').trigger('pagecreate');
    //location.reload();
    //LstProp.listview("refresh");
    //find solution for refresh later
    /*LstProp.on("tap", "li", function(){
        $("#popupPropView").popup("open");
    });*/
    LstProp.on("click", "li", function(){
        var x = $(this).attr("data-id");
        propertyHandler.loadSelectProperty(x);
        window.location.assign("#propertyPage");
    });

}


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
    //find solution for refresh later
    /*LstProp.on("tap", "li", function(){
        $("#popupPropView").popup("open");
    });*/

}

$(document).on("pageinit", "#homePage", function(){
    propertyHandler.loadProperty(displayProperty);
});

$(document).on("pageinit", "#propDelPage", function(){
    propertyHandler.loadDelProperty(displayProperty3);
    //find solution for this later as well
});

$(document).on("pageshow", "#propDelPage", function(){
    propertyHandler.loadDelProperty(displayProperty3);
    //find solution for this later as well
});

$(document).on("pageshow", "#homePage", function(){
    propertyHandler.loadProperty(displayProperty);
});

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
    //find solution for refresh later
    /*LstProp.on("tap", "li", function(){
        $("#popupPropView").popup("open");
    });*/
    LstProp4.on("click", "li", function(){
        var x = $(this).attr("data-id");
        propertyHandler.deleteSelectProperty(x);
        window.location.reload();
    });

}
