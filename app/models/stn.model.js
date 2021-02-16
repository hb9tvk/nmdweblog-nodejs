module.exports = (sequelize, Sequelize) => {
    const Stn = sequelize.define("stn", {
      qra: {
        type: Sequelize.STRING
      },
      ort: {
        type: Sequelize.STRING
      },
      kanton: {
        type: Sequelize.STRING(2)
      },
      koord_x: {
        type: Sequelize.STRING
      },
      koord_y: {
        type: Sequelize.STRING
      },
      qah: {
        type: Sequelize.STRING
      },
      watt: {
        type: Sequelize.STRING
      },
      sta01bez: {
        type: Sequelize.STRING
      },
      sta01gramm: {
          type: Sequelize.STRING
      },
      sta02bez: {
        type: Sequelize.STRING
      },
      sta02gramm: {
          type: Sequelize.STRING
      },
      sta03bez: {
        type: Sequelize.STRING
      },
      sta03gramm: {
          type: Sequelize.STRING
      },
      sta04bez: {
        type: Sequelize.STRING
      },
      sta04gramm: {
          type: Sequelize.STRING
      },
      sta05bez: {
        type: Sequelize.STRING
      },
      sta05gramm: {
          type: Sequelize.STRING
      },
      sta06bez: {
        type: Sequelize.STRING
      },
      sta06gramm: {
          type: Sequelize.STRING
      },
      sta07bez: {
        type: Sequelize.STRING
      },
      sta07gramm: {
          type: Sequelize.STRING
      },
      sta08bez: {
        type: Sequelize.STRING
      },
      sta08gramm: {
          type: Sequelize.STRING
      },
      sta09bez: {
        type: Sequelize.STRING
      },
      sta09gramm: {
          type: Sequelize.STRING
      },
      sta10bez: {
        type: Sequelize.STRING
      },
      sta10gramm: {
          type: Sequelize.STRING
      },
      sta11bez: {
        type: Sequelize.STRING
      },
      sta11gramm: {
          type: Sequelize.STRING
      },
      opname: {
        type: Sequelize.STRING
      },
      email: {
          type: Sequelize.STRING
      },
      logdatum: {
        type: Sequelize.STRING
      },
      gesamtgewicht: {
        type: Sequelize.STRING
      },
    });
    return Stn;
  };