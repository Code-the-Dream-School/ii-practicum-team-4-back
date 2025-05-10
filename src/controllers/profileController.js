const UserProfile = require('../models/UserProfile');
const { StatusCodes } = require('http-status-codes');

// @desc Get user profile( creates if not exists)
// @route GET /api/v1/profile
// @access Private
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

  // @desc    Add new delivery address  
  // @route   POST /api/v1/profile/address  
  // @access  Private 
 const addAddress = async (req, res) => {
  const user_id = req.user.userId;
  const address = req.body;

    if(!address || !address.first_name || !address.address){
        return res.status(400).json({msg: 'Wrong address'})
    }

    if(!address.phone || !address.email){
      return res.status(400).json({ msg: 'Missed required fields' });
    }

    let profile = await UserProfile.findOne({ user_id });

    if(!profile){
      profile = await UserProfile.create({ user_id, addresses: [address]});
      return res.status(StatusCodes.CREATED).json({ profile});
    }

    if(!profile.addresses.length === 0){
      profile.addresses.push(address);
    } else if (profile.addresses.length === 1) {
      profile.addresses.push(address);
    } else {
      profile.addresses[1] = address;
    }

    await profile.save();
    res.status(StatusCodes.OK).json({ profile });
  }; 

  // @desc    Update address by index  
  // @route   PATCH /api/v1/profile/address  
  // @access  Private 
  const updateAddress = async (req, res) => {
    const user_id = req.user.userId;
    const { index, address } = req.body;
  
    if (typeof index !== 'number' || !address || !address.address || !address.first_name) {
      return res.status(400).json({ msg: 'Cannot update address' });
    }
    const profile = await UserProfile.findOne({ user_id });
    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User profile not found' });
    }
    if (index<0 || index>= profile.addresses.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid address index' });
    }

    profile.addresses[index] = address;
    await profile.save();
    res.status(StatusCodes.OK).json({ profile });
  };

  // @desc    Delete address by index  
  // @route   DELETE /api/v1/profile/address  
  // @access  Private 
  const deleteAddress = async (req, res) => {
    const user_id = req.user.userId;
    const { index} = req.body;
  
    const profile = await UserProfile.findOne({user_id });
    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User profile not found' });
    }
  
    if (index < 0 || index >= profile.addresses.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Invalid address index' });
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