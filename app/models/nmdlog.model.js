module.exports = (sequelize, Sequelize) => {
    const Nmdlog = sequelize.define("nmdlog", {
      mode: {
        type: Sequelize.STRING
      },
      utc: {
        type: Sequelize.STRING
      },
      localcall: {
        type: Sequelize.STRING
      },
      dxcall: {
        type: Sequelize.STRING
      },
      rsts: {
        type: Sequelize.STRING
      },
      rstr: {
        type: Sequelize.STRING
      },
      txts: {
        type: Sequelize.STRING
      },
      txtr: {
        type: Sequelize.STRING
      }
    });
  
    return Nmdlog;
  };