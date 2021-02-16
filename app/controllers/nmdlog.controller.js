const db = require("../models");
const Nmdlog = db.nmdlog;
const Op = db.Sequelize.Op;

const fs = require('fs')
const Upload = require('./upload.js')


function getLocalcall(req) {
  var localcall=req.user.id.toUpperCase()
  if (localcall.match(/\/P$/) == null) {
    localcall=localcall.concat('/P')
  }
  return(localcall)
}

// Create and Save a new QSO
exports.create = (req, res) => {

    if (!req.isAuthenticated()) {
      res.status(401).send({
        message: "Not logged in"
      })
    }

    // Validate request
    if (!req.body.utc) {
        res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a nmd log entry (qso)
    localcall=getLocalcall(req)
    var mode='CW'
    if (req.body.rsts.length == 2) {
      mode='SSB'
    }
    console.log("localcall: " + localcall)
    const nmdlog = {
      mode: mode,
      utc: req.body.utc,
      localcall: localcall,
      dxcall: req.body.dxcall,
      rsts: req.body.rsts,
      rstr: req.body.rstr,
      txts: req.body.txts,
      txtr: req.body.txtr
    };
  
    // Save nmd log entry in the database
    Nmdlog.create(nmdlog)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the NMD Log Entry."
        });
      });
};

exports.upload = (req, res) => {
  // ="0643";HB9CBR/P;579;sonnenbatterien;599;bergungsversuch
  var r;

  if (req.isAuthenticated()) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    localcall=getLocalcall(req)
    r=Upload.uploadCSV(req.files.file.tempFilePath,localcall)
    console.log('upload returned',r)
    fs.unlinkSync(req.files.file.tempFilePath)
    console.log('before returning');
    res.send('File uploaded!');
    console.log('after returning');
  } else {
    res.status(401);
    return res.send('not authenticated');    
  }
};

// Retrieve all NMD Log Entries from the database.
exports.findAll = (req, res) => {
    const localcall = req.query.localcall;
    var condition = localcall ? { localcall: { [Op.like]: `%${localcall}%` } } : null;
  
    console.log(req.sessionID)
    
    Nmdlog.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving NMD Log Entries."
        });
      });
};

// Find a single QSO with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Nmdlog.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving QSO with id=" + id
        });
      });
  };

// Update a QSO by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Nmdlog.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "QSO was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update QSO with id=${id}. Maybe QSO was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating QSO with id=" + id
        });
      });
  };

// Delete a QSO with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Nmdlog.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "QSO was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete QSO with id=${id}. Maybe QSO was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete QSO with id=" + id
        });
      });
  };

// Delete all QSOs from the database.
exports.deleteAll = (req, res) => {
    const localcall = getLocalcall(req);

    Nmdlog.destroy({
      where: {localcall: localcall},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} QSOs were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all QSOs."
        });
      });
  };
