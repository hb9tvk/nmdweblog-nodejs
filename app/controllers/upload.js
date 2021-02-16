const fs = require('fs')
const db = require("../models");
const csv = require('csv-parser');
const { stn } = require('../models');
const Nmdlog = db.nmdlog;
const Stn = db.stn;

exports.uploadCSV = (filePath, localcall) => { 

    let results=[];

    // delete all QSOs first
    console.log('before destroy');
    Nmdlog.destroy({
      where: {localcall: localcall},
      truncate: false
    })
    .then(nums => {
      console.log({ message: `${nums} QSOs were deleted successfully!` });
    })
    .catch(err => {
      console.log({ message: `${err} while deleting QSOs` });
    });
    console.log('after destroy');
    // Read and parse csv file
    var numerr=0;

    fs.createReadStream(filePath)
      .pipe(csv({separator: ';',
         headers: ['utc','dxcall','rsts','txts','rstr','txtr'],
         skipComments: true
      }))
      .on('data', (data) => results.push(data))
      .on('end', () =>  {
        results.forEach(function (item, index) {
          if (Object.keys(item).length != 6) {
            numerr+=1
            console.log("Invalid CSV:", numerr)
            return
          }
          var pattern=/([0-9]{4})/
          match=pattern.exec(item.utc)
          item.utc=match[0]
          item.localcall=localcall
          if (item.rsts.length == 2) {
            item.mode='SSB'
          } else {
            item.mode='CW'
          }
          Nmdlog.create(item)
          .then(data => {
            //console.log(item);
          })
          .catch(err => {
            console.log({ message: `${err} while storing QSOs` });
            return false
          });
        })
      })
      console.log('after readstream')
      console.log("number of errors", numerr)
      
      Stn.destroy({
        where: { qra: localcall }
      })
        .then(num => {
            console.log(`${num} STN data was deleted successfully!`)
        })
        .catch(err => {
            console.log("Deletion of STN data failed", err)
        });

      let mystn={}
      
      fs.createReadStream(filePath)
      .pipe(csv({separator: ';',
         headers: ['comment','key','value'],
         skipComments: false
      }))
      .on('data', (data) => {
          if (data.comment == '#') {
              // { comment: '#', key: 'STA01BEZ=', value: 'MeinTransceiver' }
            key=data.key.slice(0,-1).toLowerCase()
            mystn[key]=data.value
          }
      })
      .on('end', () => {
        // don't believe callsign in upload
        mystn.qra=localcall;
        //console.log(mystn)
        Stn.create(mystn)
        .then(data => {
          //console.log('stored stn:',data);
        })
        .catch(err => {
          console.log({ message: `${err} while storing STN` });
          return false
        });
        // console.log('done')
      })
      return true
    };