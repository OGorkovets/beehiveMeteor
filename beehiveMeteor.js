HiveDB = new Mongo.Collection("hiveData");

Router.route('/', function(){
	this.render('form'); 
	this.layout('layout'); 	
});

Router.route('/admin', function(){
	this.render('dataTable'); 
	this.layout('layout'); 	
});

Router.route('/hive/:hiveID', function(){
	this.render('hiveByName', {
		data: function(){
			return HiveDB.findOne({hiveID: this.params.hiveID});
		}
	});
	this.layout('layout');	    

	},
	{
		name: 'hive.show'
	}
);
Router.route('/about', function(){
	this.render('about'); 
	this.layout('layout'); 	
});

Router.route('/export', function () {
     var data = HiveDB.find().fetch();
     var fields = [
         {
             key: 'hiveID',
             title: 'hiveID'
         },
         {
             key: 'collectionDate',
             title: 'collectionDate'
         },
         {
             key: 'samplePeriod',
             title: 'samplePeriod'
         },
         {
             key: 'miteCount',
             title: 'miteCount'
         },
         {
             key: 'createdOn',
             title: 'createdOn'
         }
     ];
 
     //generating a date for a unique file name
     var d = new Date();
     var title = 'BeehiveData ' + d.toDateString();
 
     //downloading the file
     var file = Excel.export(title, fields, data);
     var headers = {
         'Content-type': 'application/vnd.openxmlformats',
         'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
     };
 
     this.response.writeHead(200, headers);
     this.response.end(file, 'binary');
 }, {where: 'server'});

if (Meteor.isClient) {

    Meteor.subscribe("hiveData");
   
    Template.dataTable.helpers({
            "hiveData": function () {
                return HiveDB.find({}, {sort: {createdOn: -1}}) || {};
            }
        }
    );
	Template.hiveByName.helpers({
            "hiveData": function () {
                return HiveDB.find({hiveID: this.hiveID}, {sort: {createdOn: -1}}) || {};
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