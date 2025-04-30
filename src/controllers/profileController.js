const UserProfile = require('../models/UserProfile');
const { StatusCodes } = require('http-status-codes');

//getProfile for deploy
const getProfile = async (req, res) => {
    const user_id = req.user.userId;
    const profile = await UserProfile.findOne({ user_id });
    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User Profile not found'});
    }
    res.status(StatusCodes.OK).json({ profile });
  };


/*/getProfile for testing
const getProfile = async (req, res) => {
    const user_id = req.user.userId; 
    let profile = await UserProfile.findOne({ user_id });
    if (!profile) {
      profile = await UserProfile.create({ user_id, addresses: [] });
    } 
    res.status(StatusCodes.OK).json({ profile });
  };
/*/

  const addAddress = async (req, res) => {
    const user_id = req.user.userId;
    const address = req.body;

    if(!address || !address.first_name || !address.address){
        return res.status(400).json({msg: 'Wrong address'})
    }

    let profile = await UserProfile.findOne({ user_id });

    if(!profile){
        profile = await UserProfile.create({ user_id, addresses: [address]});
        return res.status(StatusCodes.CREATED).json({ profile});
    }
    if(!profile.addresses.lenght === 0){
        profile.addresses.push(address);
    } else if (profile.addresses.length === 1) {
      profile.addresses.push(address);
    } else {
      profile.addresses[1] = address;
    }

    await profile.save();
    res.status(StatusCodes.OK).json({ profile });
  }; 


  const updateAddress = async (req, res) => {
    const user_id = req.user.userId;
    const { index, address } = req.body;
  
    if (typeof index !== 'number' || !address || !address.address || !address.first_name) {
      return res.status(400).json({ msg: 'Cannot update address' });
    }
    const profile = await UserProfile.findOne({ user_id });
    if (!profile || !profile.addresses[index]) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Address not found' });
    }
    profile.addresses[index] = address;
    await profile.save();
    res.status(StatusCodes.OK).json({ profile });
  };


  const deleteAddress = async (req, res) => {
    const user_id = req.user.userId;
    const { index} = req.body;
  
    const profile = await UserProfile.findOne({user_id });
    if (!profile ||!profile.addresses[index]) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Address not found' });
    }
    profile.addresses.splice(index, 1);
    await profile.save();
    res.status(StatusCodes.OK).json({ profile });
  };

  module.exports = {
    getProfile,
    addAddress,
    updateAddress,
    deleteAddress
  }
