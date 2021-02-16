const db = require("../models");
const Stn = db.stn;
const Op = db.Sequelize.Op;
const csv = require('csv-parser')

function getLocalcall(req) {
  var localcall=req.user.id.toUpperCase()
  if (localcall.match(/\/P$/) == null) {
    localcall=localcall.concat('/P')
  }
  return(localcall)
}

// Create and Save a new QSO
exports.save = (req, res) => {


    if (!req.isAuthenticated()) {
      console.log('not authenticated')
      res.status(401).send({
        message: "Not logged in"
      })
    }

    // Validate request
    if (!req.body.ort) {
        console.log('incomplete')
        console.log(req.body)
        res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    var localcall=getLocalcall(req)
    //Delete first
    Stn.destroy({
      where: { qra: localcall }
    })

    var today = new Date();
    var logdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // Create a stn entry
    const stn = {
      qra: localcall,
      ort: req.body.ort,
      kanton: req.body.kanton,
      koord_x: req.body.koord_x,
      koord_y: req.body.koord_y,
      qah: req.body.qah,
      watt: req.body.watt,
      sta01bez: req.body.sta01bez,
      sta01gramm: req.body.sta01gramm,
      sta02bez: req.body.sta02bez,
      sta02gramm: req.body.sta02gramm,
      sta03bez: req.body.sta03bez,
      sta03gramm: req.body.sta03gramm,
      sta04bez: req.body.sta04bez,
      sta04gramm: req.body.sta04gramm,
      sta05bez: req.body.sta05bez,
      sta05gramm: req.body.sta05gramm,
      sta06bez: req.body.sta06bez,
      sta06gramm: req.body.sta06gramm,
      sta07bez: req.body.sta07bez,
      sta07gramm: req.body.sta07gramm,
      sta08bez: req.body.sta08bez,
      sta08gramm: req.body.sta08gramm,
      sta09bez: req.body.sta09bez,
      sta09gramm: req.body.sta09gramm,
      sta10bez: req.body.sta10bez,
      sta10gramm: req.body.sta10gramm,
      sta11bez: req.body.sta11bez,
      sta11gramm: req.body.sta11gramm,
      opname: req.body.opname,
      email: req.body.email,
      logdate: logdate
    };
  
    // Save stn entry in the database
    Stn.create(stn)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log('fail')
        console.log(err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the STN Entry."
        });
      });
};

// Get stn data for user
exports.find = (req, res) => {
    const localcall = getLocalcall(req);
    Stn.findAll({ where: { qra: localcall } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: "Error retrieving STN data"
        });
      });
  };

// Delete stn data
exports.delete = (req, res) => {
    const localcall = getLocalcall(req);  
    Stn.destroy({
      where: { qra: localcall }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "STN was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete STN for ${localcall}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete STN for ${localcall}"
        });
      });
  };

