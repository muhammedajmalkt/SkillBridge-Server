const Favourite = require("../Models/favouriteModel");

exports.addToFavourite = async (req,res)=>{
    const {userId}= req.user
    const {  skillId } = req.body;
    let favourite  = await Favourite.findOne({ userId });
    
    if (!favourite) {
        favourite = new Favourite({ userId, favouriteSkills: [skillId] });
    } else {
        if (!favourite.favouriteSkills.includes(skillId)) {
            favourite.favouriteSkills.push(skillId);
        }
    }
    await favourite.save();
    res.status(200).json({success:true,message:"SuccessFully addedd to Favourite "});
}

exports.getFavourite = async (req, res) => {
        const { userId } = req.user;
        const wishlist = await Favourite.findOne({ userId , assessedUser :null}).populate('favouriteSkills');
        if (!wishlist) return res.status(404).json({ message: 'Favourite not found' });
        res.status(200).json({success:true,data:wishlist});
  
};

exports.removeFromFavourite= async (req, res) => {
       const {userId}=req.user
        const {  skillId } = req.body;
        const favourite = await Favourite.findOne({ userId });
        if (!favourite) return res.status(404).json({ message: 'Favourite not found' });

        favourite.favouriteSkills = favourite.favouriteSkills.filter(id => id.toString() !== skillId);
        await favourite.save();
        
        res.status(200).json({ success:true, message: 'Removed from Favourite',data: favourite });

};