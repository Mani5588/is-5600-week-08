const { mockModel } = require('./db.mock');
const { create, get, list, edit, destroy } = require('../products');

jest.mock('../db', () => ({
  model: jest.fn().mockReturnValue(mockModel),
}));

describe('Products Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 
    it('should list all products', async () => {
      const products = await list();
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].description).toBe('Product 1');
      expect(products[1].description).toBe('Product 2');
    });
  

 
    it('should get a product by id', async () => {
      mockModel.findById = jest.fn().mockResolvedValue({ description: 'Product 1' });

      const product = await get('product-id');
      expect(product.description).toBe('Product 1');
      expect(mockModel.findById).toHaveBeenCalledWith('product-id');
    });
 
 
    it('should edit a product', async () => {
      // Define the changes (e.g., updating the product description)
      const changes = { description: 'Updated Product 1' };

      // Mock the findById method to return a mock product
      const mockProduct = { description: 'Product 1', save: jest.fn().mockResolvedValue({ description: 'Updated Product 1' }) };
      mockModel.findById = jest.fn().mockResolvedValue(mockProduct);

      const updatedProduct = await edit('product-id', changes);

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.description).toBe('Updated Product 1');
      expect(mockProduct.save).toHaveBeenCalled();
    });




    it('should delete a product by id', async () => {
      mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const result = await destroy('product-id');
      expect(result.deletedCount).toBe(1);
      expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: 'product-id' });
    });
  });

