// Custom Rally App that displays Stories in a grid.
//
// Note: various console debugging messages intentionally kept in the code for learning purposes
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    // The parent class manages the app 'lifecycle' and calls launch() when ready
    componentCls: 'app',
    // CSS styles found in app.css
    // Entry Point to App
    launch: function () {
        console.log('second app');
        // see console api: https://developers.google.com/chrome-developer-tools/docs/console-api
        //this._loadData();                 // we need to prefix with 'this.' so we call a method found at the app level.
        this._loadIterations();
    },
    _loadIterations: function () {
        this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            listeners: {
                ready: function (combobox) {
                    this._loadData();
                },
                 scope: this
            }
        });
        this.add(this.iterComboBox);
    },
    // Get data from Rally
    _loadData: function () {
        var selectedIterationRef = this.iterComboBox.getRecord().get('_ref');
        console.log('selected iter', selectedIterationRef);
        var myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'Defect',
            autoLoad: true,  // <----- Don't forget to set this to true! heh
             filters: [
                 {
                  property: 'Iteration',
                  operation: '=',
                   value: selectedIterationRef
                 }
             ],
            listeners: {
                load: function (myStore, myData, success) {
                    console.log('got data!', myStore, myData);
                    this._loadGrid(myStore);
                    // if we did NOT pass scope:this below, this line would be incorrectly trying to call _createGrid() on the store which does not exist.
                },
                scope: this
                // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
            },
            fetch: [
                'FormattedID',
                'Name',
                'Severity',
                'Iteration'
            ]
            // Look in the WSAPI docs online to see all fields available!
        });
    },
    // Create and Show a Grid of given stories
    _loadGrid: function (myStoryStore) {
        var myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStoryStore,
            columnCfgs: [
                // Columns to display; must be the same names specified in the fetch: above in the wsapi data store
                'FormattedID',
                'Name',
                'Severity',
                'Iteration'
            ]
        });
        this.add(myGrid);
        // add the grid Component to the app-level Container (by doing this.add, it uses the app container)
        console.log('what is this?', this);
    }
});
