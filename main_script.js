class Database {
  static db;
  static databaseName = 'bikers-db';
  static initialise() {

      const op = indexedDB.open(this.databaseName, 1);
      op.onerror = ((e) => {
        console.error(e.target.error)
      });

      op.onsuccess =((ev) => {
        this.db = ev.target.result;
        this.db.transaction('bikers', 'readwrite');
      });

      op.onupgradeneeded = ((ev) => {
        this.db = ev.target.result;
        if (!this.db.objectStoreNames.contains('bikers')) {
          this.db.createObjectStore('bikers', {
            autoIncrement: true,
          });
          //this.db.createIndex('tier_idx', 'tier');
        }
      });
    }


  static getBikerStore() {
    const tx = this.db.transaction('bikers', 'readwrite');
    return tx.objectStore('bikers');
  }

  static addItem(name, tier) {
    this.getBikerStore().add({ name, tier });
  }

  /**
   * read database with condition
   * @param condition {{tier: string}}
   */
  static read(condition) {
    const readRequest = this.getBikerStore().getAll();
    return new Promise((resolve, reject) => {
      readRequest.onsuccess = ((ev) => {
        const bikers = ev.target.result;
          resolve(condition?.tier? bikers.filter((item) => item.tier === condition.tier) : bikers);
      });
      readRequest.onerror = ((ev) => reject(ev.target.error));
    });
  }
}

Database.initialise()

async function saveAccount() {
  const bikerData = {
    name: document.getElementById('name').value,
    tier: document.getElementById('tier').value,
  };

  document.cookie = `tier=${bikerData.tier}`
  Database.addItem(bikerData.name, bikerData.tier);
  window.location.href = 'welcome.html';
}

// async function showRiders() {
//   const part1 = document.cookie.split('tier=')[1];
//   const tier = part1 ? part1.split(';')[0] : undefined
//   console.log(tier);
//   var sth = await Database.read({ tier: tier });
//   document.getElementById('pals').value = sth.valueOf();
//   console.log(sth);
// }

async function showRiders() {
  console.log(await Database.read({ tier: '10k' || '20k' || '30k' }));
}

async function readAll() {
  var objectStore = Database.db.transaction("bikers").objectStore("bikers");
  $("#todos").empty();
  objectStore.openCursor().onsuccess = function(event) {
   var cursor = event.target.result;
   if (cursor) {
    $("#todos").append("<tr><td>" + cursor.key + "</td><td>" + cursor.value.name + "</td><td>" + cursor.value.tier + "</td></tr>");
    cursor.continue();
  }
 };
// Database.db.transaction.oncomplete = function(event) {
//   $(".clickme").click(function(){
//   readAll();
// });     
// };

};
//now I am calling the function on the click I am just calling the readAll Function

