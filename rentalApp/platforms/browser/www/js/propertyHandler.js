var propertyHandler = {
addProperty: function(pBed, pDate, pTime, pRent, pRName, pNote, pType, pFurn, pName){
	databaseHandler.db.transaction(
		function(tx){
			tx.executeSql(
				"INSERT INTO property(bed, propDate, propTime, rent, reportName, propNote, type, furn, propName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
				[pBed, pDate, pTime, pRent, pRName, pNote, pType, pFurn, pName],
				function(tx, results){
					return true;
				},
				function(tx, error){
					console.log("Add property error " + error.message);
					return false;
				}
			);
		},
		function(error){},
		function(){}
	);
},

loadProperty: function(displayProperty){
	databaseHandler.db.readTransaction(
		function(tx){
			tx.executeSql(
				"select * from property",
				[],
				function(tx, results){
					displayProperty(results);
				},
				function(tx, error){
					console.log("Error loading property data: " + error.message);
				}
			);
		}
	);
},

loadDelProperty: function(displayProperty){
	databaseHandler.db.readTransaction(
		function(tx){
			tx.executeSql(
				"select * from property",
				[],
				function(tx, results){
					displayProperty3(results);
				},
				function(tx, error){
					console.log("Error loading property data: " + error.message);
				}
			);
		}
	);
},

loadSelectProperty: function(propID){
	databaseHandler.db.readTransaction(
		function(tx){
			tx.executeSql(
				"select * from property where pID = ?",
				[propID],
				function(tx, results){
					displayProperty2(results);
				},
				function(tx, error){
					console.log("Error loading property data: " + error.message);
				}
			);
		}
	);
},

loginUser: function(username, password) {
	databaseHandler.db.readTransaction(
		function(tx){
			tx.executeSql(
				"select * from staff where username = ? and password = ?",
				[username, password],
				function(tx, results){
					loginRes(results);
				},
				function(tx, error){
					console.log("Login Error " + error.message);
				}
			);
		}
	);
},

loadUser: function(userID) {
	databaseHandler.db.readTransaction(
		function(tx){
			tx.executeSql(
				"select * from staff where staffID = ?",
				[userID],
				function(tx, results){
					logCheck(results);
				},
				function(tx, error){
					console.log("Login Error " + error.message);
				}
			);
		}
	);
},

deleteSelectProperty: function(pID) {
	databaseHandler.db.transaction(
		function(tx){
			tx.executeSql(
				"delete from property where pID = ?",
				[pID],
				function(tx, results){
					console.log("Property " + pID + " has been deleted");
				},
				function(tx, error){
					console.log("Delete Error " + error.message);
				}
			);
		}
	);
}

};