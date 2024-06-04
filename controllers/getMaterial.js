// create a controller which when we enter a city then all the categories are listed and then all the items in that cetegory 
// are listed with the price in that city

const City = require('../models/City');
const Category = require('../models/Category');
const Item = require('../models/Items');



module.exports.getMaterial = async (req, res) => {
    try {
        const { city } = req.params;
        const cityId = await City.findOne({ name: city
        });
        if (!cityId) {
            return res.status(404).json({ error: 'City not found' });
        }
        const categories=cityId.categories;
   
        
        const data = [];
        for (let i = 0; i < categories.length; i++) {
            

            const category = categories[i];
            const categoryId=await Category.findById(category);
            //in item only add  price of that city find price of that city from the prices array
            const items = await Item.find({ categoryName: categoryId });
            
            // console.log(items);
            
            
            for (let j = 0; j < items.length; j++) {
            if(items[j].prices.find(price => price.cityId.toString() === cityId._id.toString())){
                const itemInThatCity=
                {
                    name:items[j].name,
                    description:items[j].description,
                    price:items[j].prices.find(price => price.cityId.toString() === cityId._id.toString()).price,
                    pricePerPiece:items[j].prices.find(price => price.cityId.toString() === cityId._id.toString()).pricePerPiece
                }
                if(data.find(item=>item.category===categoryId.name)===undefined){
                    data.push({category:categoryId.name,itemInThatCity:[]});
                }
                else
                {
                    

                }
            
                data.find(item=>item.category===categoryId.name).itemInThatCity.push(itemInThatCity);
           
            }}
            
        }
        return res.status(200).json({ data, success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.getPerPeicePrice = async (req, res) => {
    const { category, brand, city } = req.body;

  try {
    // Find the category by name
    const categoryObj = await Category.findOne({ name: category });
    if (!categoryObj) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the city by name
    const cityObj = await City.findOne({ name: city });
    if (!cityObj) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Find the item by name and category
    const item = await Item.findOne({ name: brand, categoryName: categoryObj._id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Find the price for the specified city
    const cityPrice = item.prices.find((price) => price.cityId.equals(cityObj._id));
    if (!cityPrice) {
      return res.status(404).json({ message: 'Price for specified city not found' });
    }

    // Return the price per piece
    res.json({ pricePerPiece: cityPrice.pricePerPiece });
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ message: 'Server error' });
  }
}