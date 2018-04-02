var databaseHandler = {
	db: null,
	createDatabase: function() {
		this.db = window.openDatabase(
			//calls to open database
			"RentalAppZ.db",
			"1.0",
			"RentalAppZ Database",
			1000000);

		this.db.transaction(
			function(tx) {
				//run SQL here using tx
				tx.executeSql(
					"create table if not exists staff(staffID integer primary key autoincrement, username text UNIQUE NOT NULL, password text NOT NULL)",
					[],
					function(tx, results){},
					function(tx, error){
						console.log("Error while creating table staff " + error.message);
					}
				),
				tx.executeSql(
					"create table if not exists property(pID integer primary key autoincrement, bed text NOT NULL, propDate text NOT NULL, propTime text NOT NULL, rent text NOT NULL, reportName text NOT NULL, propNote text, type text NOT NULL, furn text NOT NULL, propName text UNIQUE NOT NULL)",
					[],
					function(tx, results){},
					function(tx, error){
						console.log("Error while creating table property " + error.message);
					}
				),
				tx.executeSql(
					"insert or ignore into property(bed, propDate, propTime, rent, reportName, propNote, type, furn, propName) values('Two', '02/03/2018', '18:30', '£170', 'Admin', 'Amazing view of the sea', 'Flat', 'Unfurnished', 'Flat 8 on Baker Street')",
					[],
					function(tx, results){},
					function(tx, error){
						console.log("Error while inserting into property " + error.message);
					}
				),
				tx.executeSql(
					"insert or ignore into staff(username, password) values('admin1', 'admin1')",
					[],
					function(tx, results){},
					function(tx, error){
						console.log("Error while inserting into staff " + error.message);
					}
				);
				//might have to add two functions
				//first function to check if DB propType, furn, and staff tables are populated
				//second fnction if not populated has to insert needed population data
			},
			function(error) {
				console.log("Transaction error: " + error.message);
				//gets errors and displays to console
			},
			function() {
				console.log("Create DB Transaction completed successfully");
				//if no error present it will continue and provide success message
			}
		);
	}
}
//above code is attempted from: https://www.youtube.com/watch?v=39kDLPyix-k