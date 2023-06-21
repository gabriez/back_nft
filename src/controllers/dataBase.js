const { Nft } = require("../db");
const database = require("../assets/data/Nfts.json");

const loadNfts = async function () {
  try {
    const allNfts = database.data;
    for (let i = 0; i < allNfts.length; i++) {
      const nft = await Nft.create({
        img: allNfts[i].img,
        name: allNfts[i].name,
        creator: allNfts[i].creator,
        ethPrice: allNfts[i].ethPrice,
        usdPrice: allNfts[i].usdPrice,
        tokenId: allNfts[i].tokenId,
        contactAddress: allNfts[i].contactAddress,
        description: allNfts[i].description,
        wallet: allNfts[i].wallet,
        category: allNfts[i].category,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const isDbLoaded = async function () {
  try {
    let nfts = await Nft.findAll();
    if (!nfts.length) {
      await loadNfts();
      console.log("Nft´s loaded");
    }
    console.log("DB is loaded");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  isDbLoaded,
};
