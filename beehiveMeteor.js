HiveDB = new Mongo.Collection("hiveData");

if (Meteor.isClient) {

    Meteor.subscribe("hiveData");
   
    Template.dataTable.helpers({
            "hiveData": function () {
                return HiveDB.find({}, {sort: {createdOn: -1}}) || {};
            }
        }
    );

    //prevents form from redirecting and inserts data into BeeData database
    Template.form.events({
        "submit form": function (event) {
            event.preventDefault();

            var hiveID = ($(event.target).find('input[name=hiveID]')).val();
	
            var collectionDate = ($(event.target).find('input[name=collectionDate]')).val();

            var samplePeriod = ($(event.target).find('input[name=samplePeriod]')).val();

            var miteCount = ($(event.target).find('input[name=miteCount]')).val();
            
			HiveDB.insert({
                        hiveID: hiveID,
                        collectionDate: collectionDate,
                        samplePeriod: samplePeriod,
                        miteCount: miteCount,
                        createdOn: Date.now()
			});            
        }

    });


}

if (Meteor.isServer) {

    Meteor.publish("hiveData", function () {
        return HiveDB.find();
    });
}