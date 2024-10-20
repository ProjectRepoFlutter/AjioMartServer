const Category = require('../models/category');

// Create a new category
exports.createCategory = async (req, res) => {
    const { categoryId,name, description,imageUrl } = req.body;

    try {
        const category = new Category({ categoryId:categoryId,name:name, description:description,imageUrl:imageUrl });
        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (err) {
        res.status(400).json({ message: 'Error creating category', error: err.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({categoryId:id});
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedCategory = await Category.updateOne({categoryId:id},{$set: req.body}, { new: true });
        if (updatedCategory.matchedCount==0) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    } catch (err) {
        res.status(400).json({ message: 'Error updating category', error: err.message });
    }

};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.deleteOne({categoryId:id});
        if (deletedCategory.deletedCount==0) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }

};
