-- Initialize menu items with Unsplash images (25 items)
-- First delete existing items to avoid duplicates
DELETE FROM menu_items;

INSERT INTO restaurant_db.menu_items 
(item_name, item_code, description, price, category, available, deleted, deleted_at, image_url)
VALUES
('Grilled Salmon', 'SAL001', 'Fresh salmon grilled with herbs', 450.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800'),
('Truffle Risotto', 'RIS002', 'Creamy risotto with truffle oil', 350.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800'),
('Wagyu Burger', 'BUR003', 'Juicy wagyu beef burger with cheese', 500.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'),
('Caesar Salad', 'SAL004', 'Classic Caesar salad with parmesan', 250.00, 'Starter', 1, 0, 0, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800'),
('Chicken Wings', 'WIN005', 'Spicy chicken wings with dip', 300.00, 'Starter', 1, 0, 0, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800'),
('Chocolate Lava Cake', 'DES006', 'Warm chocolate cake with molten center', 200.00, 'Dessert', 1, 0, 0, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800'),
('Tomato Soup', 'SOUP007', 'Rich tomato soup with basil', 180.00, 'Starter', 1, 0, 0, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'),
('Pasta Alfredo', 'PAS008', 'Creamy Alfredo pasta with mushrooms', 320.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800'),
('Tandoori Paneer', 'TAN009', 'Paneer marinated in spices and grilled', 280.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800'),
('Ice Cream Sundae', 'DES010', 'Vanilla ice cream with toppings', 150.00, 'Dessert', 1, 0, 0, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800'),
('Margherita Pizza', 'PIZ011', 'Classic pizza with tomato, mozzarella, and basil', 380.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800'),
('Chicken Tikka Masala', 'CTK012', 'Creamy tomato-based curry with tender chicken', 340.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800'),
('Garlic Bread', 'GBR013', 'Toasted bread with garlic butter and herbs', 120.00, 'Starter', 1, 0, 0, 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=800'),
('French Fries', 'FFR014', 'Crispy golden french fries with seasoning', 150.00, 'Starter', 1, 0, 0, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800'),
('Greek Salad', 'GRK015', 'Fresh salad with feta cheese, olives, and vegetables', 220.00, 'Starter', 1, 0, 0, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800'),
('Beef Steak', 'BST016', 'Grilled beef steak with herbs', 550.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800'),
('Fish and Chips', 'FNC017', 'Battered fish with crispy fries', 380.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1579208090855-6313e7a0e6c8?w=800'),
('Vegetable Stir Fry', 'VSF018', 'Mixed vegetables stir-fried in sauce', 260.00, 'Main Course', 1, 0, 0, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800'),
('Mushroom Soup', 'MSO019', 'Creamy mushroom soup with herbs', 170.00, 'Starter', 1, 0, 0, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'),
('Chocolate Brownie', 'BRW020', 'Rich chocolate brownie with walnuts', 180.00, 'Dessert', 1, 0, 0, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800'),
('Cheesecake', 'CHS021', 'Creamy cheesecake with berry topping', 220.00, 'Dessert', 1, 0, 0, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800'),
('Fruit Salad', 'FRS022', 'Fresh mixed fruits with honey dressing', 160.00, 'Dessert', 1, 0, 0, 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800'),
('Lemonade', 'LMD023', 'Fresh lemonade with mint', 80.00, 'Beverage', 1, 0, 0, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800'),
('Iced Tea', 'ICT024', 'Refreshing iced tea with lemon', 70.00, 'Beverage', 1, 0, 0, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'),
('Coffee', 'COF025', 'Freshly brewed coffee', 90.00, 'Beverage', 1, 0, 0, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800');
